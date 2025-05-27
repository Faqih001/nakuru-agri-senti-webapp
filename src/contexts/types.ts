import { User, Session, AuthError } from '@supabase/supabase-js';

export interface UserMetadata {
  full_name?: string;
  location?: string;
  farm_size?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  account_type: 'farmer' | 'admin' | 'expert';
  email_verified: boolean;
  status: 'pending' | 'active' | 'suspended';
  created_at?: string;
  updated_at?: string;
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
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<SignUpResponse>;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
}
