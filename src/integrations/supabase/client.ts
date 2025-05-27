import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Initialize Supabase client with debugging options
const supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Add debug logging for auth events
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log('[Supabase Auth Event]', event, session?.user?.id);
});

// Helper function to log Supabase errors in detail
export const logSupabaseError = (error: any, context: string) => {
  console.error(`[Supabase Error] ${context}:`, {
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    code: error?.code
  });
};

export const supabase = supabaseClient;
