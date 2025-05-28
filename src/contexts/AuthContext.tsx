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
      console.error('Service role client is null - not initialized');
      return false;
    }
    
    // Validate the JWT token format
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string;
    if (serviceRoleKey) {
      try {
        // Simple JWT validation to catch common issues
        const parts = serviceRoleKey.split('.');
        if (parts.length !== 3) {
          console.error('Service role key is not a valid JWT (should have 3 parts separated by dots)');
          return false;
        }
        
        // Decode the payload (middle part) to check for correct claims
        const payloadBase64 = parts[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        
        // Check for the role claim which is critical
        if (!payload.role || payload.role !== 'service_role') {
          console.error('JWT payload does not contain the correct "role" claim:', payload);
          return false;
        }
        
        console.log('Service role JWT validation passed');
      } catch (jwtErr) {
        console.error('Error validating JWT format:', jwtErr);
        return false;
      }
    }
    
    try {
      // Try a simple query that should succeed with service role permissions
      const { error } = await serviceRoleClient.from('user_profiles').select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Service role client validation failed:', error.message);
        
        // Check for permission errors which indicate JWT issues
        if (error.message.includes('JWTClaimValidationFailed') || 
            error.message.includes('permission') ||
            error.message.includes('JWT')) {
          console.error('JWT validation error - likely invalid service role key');
        }
        
        return false;
      }
      
      console.log('Service role client successfully validated');
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
      // Basic JWT format validation
      try {
        const parts = serviceRoleKey.split('.');
        if (parts.length !== 3) {
          console.error('Service role key is not a valid JWT format');
          if (import.meta.env.DEV) {
            toast({
              title: "JWT Format Error",
              description: "Your service role key doesn't appear to be a valid JWT token (should have 3 parts separated by dots).",
              variant: "destructive"
            });
          }
        } else {
          // Decode the payload to check for correct claims
          try {
            const payloadBase64 = parts[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);
            
            // Check explicitly for common typos in the role claim
            if (payload.rose && !payload.role) {
              console.error('JWT contains "rose" claim instead of "role" - this is a typo in the JWT');
              toast({
                title: "JWT Claim Error",
                description: 'Your service role key has a typo: "rose" instead of "role". Please correct your JWT token.',
                variant: "destructive"
              });
            } else if (!payload.role) {
              console.error('JWT is missing the "role" claim');
              if (import.meta.env.DEV) {
                toast({
                  title: "JWT Claim Missing",
                  description: 'Your service role key is missing the "role" claim. This will prevent authentication.',
                  variant: "destructive"
                });
              }
            } else if (payload.role !== 'service_role') {
              console.error('JWT has incorrect role value:', payload.role);
              if (import.meta.env.DEV) {
                toast({
                  title: "JWT Role Invalid",
                  description: `Your service role key has role="${payload.role}" instead of "service_role". This will cause authentication issues.`,
                  variant: "destructive"
                });
              }
            }
          } catch (decodeErr) {
            console.error('Failed to decode JWT payload:', decodeErr);
          }
        }
      } catch (jwtErr) {
        console.error('Error checking JWT format:', jwtErr);
      }
      
      // If key exists, validate that the service role client works correctly
      validateServiceRoleClient().then(isValid => {
        if (!isValid) {
          const message = "Your Supabase service role key may be invalid. Check the key in your .env file.";
          console.error(message);
          
          if (import.meta.env.DEV) {
            toast({
              title: "API Key Validation Failed", 
              description: message,
              variant: "destructive"
            });
          }
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
      
      // First perform a comprehensive connection check to Supabase
      try {
        // First try to reach the domain with a HEAD request
        const response = await fetch(import.meta.env.VITE_SUPABASE_URL, { 
          method: 'HEAD',
          mode: 'no-cors',
          // Set a reasonable timeout to avoid long waits
          signal: AbortSignal.timeout(5000)
        });
        console.log('Supabase connection check:', response.type);
        
        // Additional connectivity test to the auth endpoint specifically
        const authEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/`;
        try {
          await fetch(authEndpoint, { 
            method: 'OPTIONS',
            signal: AbortSignal.timeout(3000)
          });
        } catch (authError) {
          console.warn('Auth endpoint check failed, but main URL accessible:', authError);
          // Continue since the main URL is reachable
        }
      } catch (connectionError) {
        console.error('Connection to Supabase failed:', connectionError);
        
        // Classify the error to give more helpful messages
        const errorString = String(connectionError);
        let errorMessage = "Could not connect to authentication service. Check your internet connection and try again.";
        
        if (errorString.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMessage = "DNS resolution failed. The Supabase domain could not be found. Check your internet connection or try using a different network.";
        } else if (errorString.includes('AbortError') || errorString.includes('timeout')) {
          errorMessage = "Connection timed out. The authentication service is taking too long to respond. Try again later or check if there are any service outages.";
        } else if (errorString.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = "Connection refused. The authentication service is not accepting connections. This could be a temporary issue.";
        }
        
        toast({
          title: "Connection failed",
          description: errorMessage,
          variant: "destructive"
        });
        return { data: null, error: new AuthError(`Connection failed: ${errorString.substring(0, 100)}`) };
      }
      
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
      let errorTitle = "Sign in failed";
      
      // Classify and provide more helpful error messages
      if (errorMessage === 'Invalid login credentials') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (errorMessage.includes('Email not confirmed')) {
        // Since we're disabling email verification, this shouldn't happen anymore
        // If it does, it's likely a backend configuration issue
        errorMessage = 'Your account needs verification. Please try signing up again or contact support.';
        errorTitle = "Verification needed";
      } else if (
        errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('network') ||
        errorMessage.includes('ERR_CONNECTION') ||
        errorMessage.includes('ERR_NAME_NOT_RESOLVED') ||
        errorMessage.includes('timed out') ||
        errorMessage.includes('ENOTFOUND')
      ) {
        errorMessage = 'Network error. Please check your internet connection and try again. If the problem persists, the authentication service may be temporarily unavailable.';
        errorTitle = "Connection error";
        
        // Record specific error for debugging
        console.error('Network-related auth error:', {
          message: errorMessage,
          originalError: error
        });
      } else if (errorMessage.includes('JWT')) {
        errorMessage = 'Authentication token error. This might be a configuration issue with the authentication service.';
        errorTitle = "Authentication error";
      }
      
      toast({
        title: errorTitle,
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
      // Validate the service role client first
      const isServiceRoleValid = await validateServiceRoleClient();
      
      // Use the serviceRoleClient if available and valid, otherwise fall back to regular client
      const client = (isServiceRoleValid && serviceRoleClient) ? serviceRoleClient : supabase;
      
      // Add retry mechanism with delay
      const maxAttempts = 3;
      let attempt = 0;
      let success = false;
      
      while (attempt < maxAttempts && !success) {
        attempt++;
        
        console.log(`Attempting profile update (attempt ${attempt}/${maxAttempts})...`);
        
        // Add a small delay between retries (except for first attempt)
        if (attempt > 1) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
        
        // First check if the profile exists
        const { data: existingProfile } = await client
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .single();
          
        let error;
          
        if (existingProfile) {
          // If the profile exists, update it
          const result = await client
            .from('user_profiles')
            .update(profileData)
            .eq('id', user.id);
            
          error = result.error;
        } else {
          // If the profile doesn't exist yet, insert it with the ID
          const result = await client
            .from('user_profiles')
            .insert({ 
              id: user.id,
              ...profileData 
            });
            
          error = result.error;
        }
          
        if (!error) {
          success = true;
        } else {
          console.error(`Error updating user profile (attempt ${attempt}/${maxAttempts}):`, error);
          
          // If we're on the last attempt or we're retrying,
        // try the upsert approach as a fallback
        if (attempt === maxAttempts - 1 || attempt > 1) {
          console.log('Trying upsert approach as fallback...');
          const { error: upsertError } = await client
            .from('user_profiles')
            .upsert({
              id: user.id,
              ...profileData
            }, {
              onConflict: 'id',
              ignoreDuplicates: false
            });
            
          if (!upsertError) {
            success = true;
            break;
          } else {
            console.error('Fallback upsert failed:', upsertError);
          }
        }
        
        // If this is the last attempt, show the error toast
        if (attempt === maxAttempts && !success) {
          toast({
            title: "Profile update failed",
            description: "Could not update your profile. Please try again.",
            variant: "destructive"
          });
          return false;
        }
        }
      }
      
      if (success) {
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Hide the profile completion dialog after successful update
      setShowProfileCompletion(false);
      
      return true;
      } else {
        // This handles the case where all attempts failed but didn't throw an error
        return false;
      }
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
      
      // First perform a comprehensive connection check to Supabase
      try {
        // First try to reach the domain with a HEAD request
        const response = await fetch(import.meta.env.VITE_SUPABASE_URL, { 
          method: 'HEAD',
          mode: 'no-cors',
          // Set a reasonable timeout to avoid long waits
          signal: AbortSignal.timeout(5000)
        });
        console.log('Supabase connection check during signup:', response.type);
        
        // Additional connectivity test to the auth endpoint specifically
        const authEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/`;
        try {
          await fetch(authEndpoint, { 
            method: 'OPTIONS',
            signal: AbortSignal.timeout(3000)
          });
        } catch (authError) {
          console.warn('Auth endpoint check failed during signup, but main URL accessible:', authError);
          // Continue since the main URL is reachable
        }
      } catch (connectionError) {
        console.error('Connection to Supabase failed during signup:', connectionError);
        
        // Classify the error to give more helpful messages
        const errorString = String(connectionError);
        let errorMessage = "Could not connect to authentication service. Check your internet connection and try again.";
        
        if (errorString.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMessage = "DNS resolution failed. The Supabase domain could not be found. Check your internet connection or try using a different network.";
        } else if (errorString.includes('AbortError') || errorString.includes('timeout')) {
          errorMessage = "Connection timed out. The authentication service is taking too long to respond. Try again later or check if there are any service outages.";
        } else if (errorString.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = "Connection refused. The authentication service is not accepting connections. This could be a temporary issue.";
        }
        
        toast({
          title: "Connection failed",
          description: errorMessage,
          variant: "destructive"
        });
        return { data: null, error: new AuthError(`Connection failed during signup: ${errorString.substring(0, 100)}`) };
      }
      
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
      
      // Configure sign up with email verification enabled
      // Determine the appropriate redirect URL
      const productionUrl = 'https://nakuru-agri-senti-webapp.vercel.app';
      const redirectUrl = import.meta.env.PROD 
        ? `${productionUrl}/verify-email` 
        : `${window.location.origin}/verify-email`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            // Store email confirmation preference in metadata
            email_verification_requested: true
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      // Create a user profile record if the user was created successfully
      if (data.user) {
        // Auto-confirm the user's email only in development mode
        // In production, we'll use proper email verification
        if (serviceRoleClient && import.meta.env.DEV) {
          console.log('Development mode detected - auto-confirming email');
          try {
            // First attempt: Update with app_metadata to confirm email
            const { error: directConfirmError } = await serviceRoleClient.auth.admin.updateUserById(
              data.user.id,
              { app_metadata: { email_confirmed: true } }
            );
            
            if (directConfirmError) {
              console.error('Failed to auto-confirm email (direct method):', directConfirmError);
              
              // Second attempt: Update user_metadata
              const { error: confirmError } = await serviceRoleClient.auth.admin.updateUserById(
                data.user.id,
                { user_metadata: { email_confirmed: true } }
              );
              
              if (confirmError) {
                console.error('Failed to update user metadata:', confirmError);
                
                // Third attempt: Try using raw API call if all else fails
                try {
                  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users/${data.user.id}`, {
                    method: 'PUT',
                    headers: {
                      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      email_confirmed_at: new Date().toISOString()
                    })
                  });
                  
                  if (!response.ok) {
                    console.error('Failed to confirm email via API call:', await response.text());
                  } else {
                    console.log('Email auto-confirmed via API call');
                  }
                } catch (apiErr) {
                  console.error('Error with API confirmation method:', apiErr);
                }
              } else {
                console.log('Email confirmed via user metadata update');
              }
            } else {
              console.log('Email auto-confirmed via direct method');
            }
          } catch (confirmErr) {
            console.error('Error during email confirmation bypass:', confirmErr);
          }
        } else if (!import.meta.env.DEV) {
          // In production, let the user verify their email normally
          console.log('Production mode - sending email verification');
        }
        
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

      // Provide appropriate message based on environment
      if (data.user) {
        if (import.meta.env.DEV) {
          toast({
            title: "Account created",
            description: "Your account has been created successfully. You can now log in.",
          });
        } else {
          toast({
            title: "Account created",
            description: "Please check your email to verify your account. A verification link has been sent to your inbox. Check your spam folder if you don't see it.",
            duration: 6000
          });
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      const authError = error as AuthError;
      let errorMessage = authError.message;
      let errorTitle = "Sign up failed";
      
      // Classify and provide more helpful error messages
      if (
        errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('ERR_CONNECTION_CLOSED') || 
        errorMessage.includes('ERR_NAME_NOT_RESOLVED') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('network') ||
        errorMessage.includes('ERR_CONNECTION') ||
        errorMessage.includes('timed out') ||
        errorMessage.includes('ENOTFOUND')
      ) {
        errorMessage = 'Network error. Please check your internet connection and try again. If the problem persists, the authentication service may be temporarily unavailable.';
        errorTitle = "Connection error";
        
        // Record detailed error for debugging
        console.error('Network-related signup error:', {
          message: errorMessage,
          originalError: error
        });
      } else if (errorMessage.includes('user already exists')) {
        errorMessage = 'A user with this email already exists. Please login instead or use a different email.';
        errorTitle = "Account exists";
      } else if (errorMessage.includes('JWT') || errorMessage.includes('token')) {
        errorMessage = 'Authentication token error. This might be a configuration issue with the authentication service.';
        errorTitle = "Authentication error";
        
        // This could indicate an issue with the service role key
        console.error('JWT/token error during signup:', error);
      } else if (errorMessage.includes('weak-password') || errorMessage.includes('password')) {
        errorMessage = 'Please use a stronger password (at least 6 characters with a mix of letters, numbers and symbols).';
        errorTitle = "Weak password";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
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
