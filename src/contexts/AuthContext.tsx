import React, { useEffect, useState, useContext, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, SupabaseError } from '@/integrations/supabase/client';
// Import the serviceRoleClient for bypassing RLS policies
import { serviceRoleClient } from '@/integrations/supabase/admin';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, UserMetadata, SignUpResponse, SignInResponse, UserProfile } from './types';
import { AuthContext, AuthEvents } from './auth';
import { Database } from '@/integrations/supabase/types';

// Define basic type that matches Supabase structure
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];

// Define extended type for dynamic fields (matches our migration)
interface ExtendedUserProfile extends UserProfileInsert {
  email?: string;
  username?: string;
  phone_number?: string;
  account_type?: string;
  email_verified?: boolean;
  status?: string;
}

// Add interface for tracking profile creation status
interface ProfileCreationLog {
  userId: string;
  email: string;
  timestamp: string;
  success: boolean;
  errorDetails?: unknown;
  retryCount: number;
}

// The React.FC type enforces that the component returns JSX
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profileCreationRetries, setProfileCreationRetries] = useState<Record<string, number>>({});
  const { toast } = useToast();
  
  // Utility function to check if service role client is properly configured
  const validateServiceRoleClient = useCallback(async (): Promise<boolean> => {
    // Check if the client exists
    if (!serviceRoleClient) {
      return false;
    }
    
    try {
      // Try a simple query that should succeed with service role permissions
      const { error } = await serviceRoleClient.from('user_profiles').select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Service role client validation failed:', error.message);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error validating service role client:', err);
      return false;
    }
  }, []);
  
  // Check environment setup on component mount
  useEffect(() => {
    // Validate service role key configuration
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey || serviceRoleKey === 'your_service_role_key_here') {
      console.warn('Supabase service role key is not configured. User profile creation may fail.');
      
      // Only show in development mode
      if (import.meta.env.DEV) {
        toast({
          title: "Configuration Warning",
          description: "Missing Supabase service role key. Add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env file for proper functionality.",
          variant: "destructive"
        });
      }
    } else {
      // If key exists, validate that the service role client works correctly
      validateServiceRoleClient().then(isValid => {
        if (!isValid && import.meta.env.DEV) {
          toast({
            title: "API Key Validation Failed", 
            description: "Your Supabase service role key may be invalid. Check the key in your .env file.",
            variant: "destructive"
          });
        }
      });
    }
  }, [toast, validateServiceRoleClient]);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle different auth events
        if (event === AuthEvents.SIGNED_UP) {
          toast({
            title: "Account created successfully!",
            description: "Welcome to AgriSenti. You can now start using our smart farming tools.",
          });
          
          // Flag to show profile completion dialog for new users
          if (session?.user) {
            setShowProfileCompletion(true);
          }
        } else if (event === AuthEvents.SIGNED_IN) {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in to AgriSenti.",
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  // Function to log profile creation events for monitoring
  const logProfileCreation = (log: ProfileCreationLog): void => {
    // Store logs for monitoring - in production this could send to a monitoring service
    console.log('[PROFILE_CREATION_LOG]', log);
    
    // In a real app, you might want to persist these logs
    // or send them to an analytics/monitoring service
    try {
      // For now, just log to console and to localStorage for basic persistence
      const logs = JSON.parse(localStorage.getItem('profile_creation_logs') || '[]');
      logs.push(log);
      localStorage.setItem('profile_creation_logs', JSON.stringify(logs.slice(-20))); // Keep last 20 logs
    } catch (err) {
      console.error('Error storing profile creation logs:', err);
    }
  };
  
  // Function to validate user metadata
  const validateUserMetadata = (metadata: UserMetadata): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check for email format if provided in metadata
    if (metadata.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(metadata.email)) {
      errors.push('Invalid email format');
    }
    
    // Validate full name if provided
    if (metadata.full_name) {
      if (metadata.full_name.length < 2) {
        errors.push('Full name is too short');
      }
      if (metadata.full_name.length > 100) {
        errors.push('Full name is too long');
      }
      if (/[^a-zA-Z\s\-']/.test(metadata.full_name)) {
        errors.push('Full name contains invalid characters');
      }
    }
    
    // Add more validations as needed
    
    return {
      valid: errors.length === 0,
      errors
    };
  };

  // Function to create user profile with retry mechanism
  const createUserProfile = async (userId: string, userEmail: string, metadata: UserMetadata): Promise<boolean> => {
    const maxRetries = 3;
    const retryCount = profileCreationRetries[userId] || 0;
    
    if (retryCount >= maxRetries) {
      logProfileCreation({
        userId,
        email: userEmail,
        timestamp: new Date().toISOString(),
        success: false,
        errorDetails: { message: 'Max retries exceeded' },
        retryCount
      });
      return false;
    }
    
    try {
      // Extract user details from metadata
      const { full_name, location, farm_size } = metadata;
      const firstName = full_name ? full_name.split(' ')[0] : '';
      const lastName = full_name ? full_name.split(' ').slice(1).join(' ') : '';
      
      // Create user profile in the database
      // First check if service role client is properly authenticated
      const isServiceRoleValid = await validateServiceRoleClient();
      
      // Build profile object with required fields only
      const profileData = {
        id: userId,
        first_name: firstName,
        last_name: lastName
      };
      
      console.log('Creating user profile with data:', profileData);
      
      // Check if the user profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (existingProfile) {
        console.log('User profile already exists, skipping creation');
        return true;
      }
      
      // Wait a bit for auth to complete its internal processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isServiceRoleValid && serviceRoleClient) {
        try {
          // Create profile with service role client to bypass RLS
          const { error: profileError } = await serviceRoleClient
            .from('user_profiles')
            .insert(profileData);
            
          if (profileError) {
            // Check if the error is because the profile already exists
            if (profileError.code === '23505') { // Unique violation
              console.log('Profile already exists, skipping creation');
              return true;
            }
            
            // Check if this is a foreign key constraint violation
            if (profileError.code === '23503' && 
                profileError.message.includes('user_profiles_id_fkey')) {
              
              console.log('Foreign key constraint violation. User may not be fully created in auth system yet. Will retry.');
              throw profileError;
            }
            
            console.error('Error creating user profile with service role client:', profileError);
            throw profileError;
          }
        } catch (error) {
          console.error('Exception during profile creation with service role client:', error);
          throw error;
        }
      } else {
        // Fallback to regular client if service role is not available
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert(profileData);
          
          if (profileError) {
            console.error('Error creating user profile with regular client:', profileError);
            throw profileError;
          }
        } catch (error) {
          console.error('Exception during profile creation with regular client:', error);
          throw error;
        }
      }

      // Log successful profile creation
      logProfileCreation({
        userId,
        email: userEmail,
        timestamp: new Date().toISOString(),
        success: true,
        retryCount
      });
      
      return true;
    } catch (error) {
      console.error('Exception during profile creation:', error);
      
      // Log exception for monitoring
      logProfileCreation({
        userId,
        email: userEmail,
        timestamp: new Date().toISOString(),
        success: false,
        errorDetails: error,
        retryCount: retryCount + 1
      });
      
      // Increment retry count
      setProfileCreationRetries({
        ...profileCreationRetries,
        [userId]: retryCount + 1
      });
      
      // If this is the first try, attempt with a delay
      if (retryCount === 0) {
        console.log('Scheduling retry for profile creation');
        setTimeout(async () => {
          await createUserProfile(userId, userEmail, metadata);
        }, 3000);
      }
      
      return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      const authError = error as AuthError;
      let errorMessage = authError.message;
      
      if (errorMessage === 'Invalid login credentials') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Sign out failed",
        description: authError.message,
        variant: "destructive"
      });
    }
  };

  // Update auth context type with needed functions
  const completeUserProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating user profile:', error);
        toast({
          title: "Profile update failed",
          description: "Could not update your profile. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Hide the profile completion dialog after successful update
      setShowProfileCompletion(false);
      
      return true;
    } catch (error) {
      console.error('Exception during profile update:', error);
      toast({
        title: "Profile update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const hideProfileCompletion = () => {
    setShowProfileCompletion(false);
  };
  
  // Improved signup function with error handling and retry mechanism
  const signUp = async (email: string, password: string, metadata: UserMetadata = {}): Promise<SignUpResponse> => {
    try {
      setLoading(true);
      
      // Validate metadata first
      const validation = validateUserMetadata(metadata);
      if (!validation.valid) {
        const errorMessage = `Invalid user data: ${validation.errors.join(', ')}`;
        toast({
          title: "Invalid user data",
          description: errorMessage,
          variant: "destructive"
        });
        return { 
          data: null, 
          error: new AuthError(errorMessage)
        };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      });

      if (error) throw error;

      // Create a user profile record if the user was created successfully
      if (data.user) {
        // Wait a bit to allow the auth system to fully create the user
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to create user profile with retry mechanism
        const profileCreated = await createUserProfile(data.user.id, email, metadata);
        
        if (!profileCreated) {
          // Schedule further retries with increasing delays
          console.log('Initial profile creation failed, scheduling retries');
          
          setTimeout(async () => {
            const retryResult = await createUserProfile(data.user?.id || '', email, metadata);
            
            if (!retryResult) {
              setTimeout(async () => {
                await createUserProfile(data.user?.id || '', email, metadata);
              }, 5000);
            }
          }, 3000);
          
          // Check if the service role key is missing
          if (!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
              import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY === 'your_service_role_key_here') {
            console.error('Missing or invalid Supabase service role key. Profile creation requires proper configuration.');
            toast({
              title: "Configuration Error",
              description: "Server is missing required authentication keys. Please contact support for assistance.",
              variant: "destructive"
            });
          } else {
            // General in-progress message
            toast({
              title: "Profile setup in progress",
              description: "Your account was created but profile setup is still processing. Some features may be limited until complete.",
              variant: "default"
            });
          }
        }
        
        // Flag to show profile completion dialog
        setShowProfileCompletion(true);
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please click it to activate your account.",
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      const authError = error as AuthError;
      toast({
        title: "Sign up failed",
        description: authError.message,
        variant: "destructive"
      });
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    showProfileCompletion,
    signUp,
    signIn,
    signOut,
    completeUserProfile,
    hideProfileCompletion
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
