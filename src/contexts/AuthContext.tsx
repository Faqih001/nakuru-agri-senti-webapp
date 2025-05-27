import React, { useEffect, useState, useContext } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, SupabaseError } from '@/integrations/supabase/client';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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

  const signUp = async (email: string, password: string, metadata: UserMetadata = {}): Promise<SignUpResponse> => {
    try {
      setLoading(true);
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
        try {
          // Extract user details from metadata
          const { full_name, location, farm_size } = metadata;
          const firstName = full_name ? full_name.split(' ')[0] : '';
          const lastName = full_name ? full_name.split(' ').slice(1).join(' ') : '';
          
          // Create user profile in the database
          // First check what columns exist in the table
          const { data: columns, error: columnsError } = await supabase
            .from('user_profiles')
            .select()
            .limit(1);
            
          if (columnsError) {
            console.error('Error checking user_profiles table:', columnsError);
          }
          
          // Build profile object based on available columns
          const profileData: ExtendedUserProfile = {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName
          };
          
          // Add optional fields if they exist in the schema
          if ('email' in (columns?.[0] || {})) {
            profileData.email = data.user.email;
          }
          
          if ('username' in (columns?.[0] || {})) {
            profileData.username = data.user.email?.split('@')[0] || '';
          }
          
          if ('phone_number' in (columns?.[0] || {})) {
            profileData.phone_number = '';
          }
          
          if ('account_type' in (columns?.[0] || {})) {
            profileData.account_type = 'farmer';
          }
          
          if ('email_verified' in (columns?.[0] || {})) {
            profileData.email_verified = false;
          }
          
          if ('status' in (columns?.[0] || {})) {
            profileData.status = 'pending';
          }
          
          console.log('Creating user profile with data:', profileData);
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert(profileData);

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            
            // Log detailed error for debugging
            console.log('Profile insertion failed. Details:', { 
              error: profileError as SupabaseError,
              errorMessage: (profileError as SupabaseError).message,
              details: (profileError as SupabaseError).details,
              hint: (profileError as SupabaseError).hint,
              code: (profileError as SupabaseError).code
            });
            
            toast({
              title: "Profile creation failed",
              description: "Account created but profile setup failed. Please contact support.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Exception during profile creation:', error);
        }
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

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
