import { User, Session, AuthError } from '@supabase/supabase-js';

export interface UserMetadata {
  full_name?: string;
  location?: string;
  farm_size?: string;
  email?: string; // Added for validation purposes
}

export interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  first_name: string | null;
  last_name: string | null;
  phone_number?: string;
  account_type?: string;
  email_verified?: boolean;
  status?: string;
  job_title?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SignUpResponse {
  data: {
    user: User | null;
    session: Session | null;
  } | null;
  error: AuthError | null;
}

export interface SignInResponse {
  data: {
    user: User | null;
    session: Session | null;
  } | null;
  error: AuthError | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  showProfileCompletion: boolean;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<SignUpResponse>;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
  completeUserProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  hideProfileCompletion: () => void;
}
