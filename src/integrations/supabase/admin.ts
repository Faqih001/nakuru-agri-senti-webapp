import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// This client is for use in profile creation during signup
// It should be used carefully as it bypasses RLS policies
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string;

// Use a more specific type definition that matches the return type of createClient with Database
let serviceRoleClient: ReturnType<typeof createClient<Database>> | null = null;

// Only initialize service role client if the key is available
// Never expose this client to the user
if (SUPABASE_SERVICE_KEY) {
  serviceRoleClient = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      // Use a different storage key to avoid conflicts with the main client
      storageKey: 'supabase_service_role_auth'
    },
    global: {
      // Add a custom header to identify service role requests (optional)
      headers: { 'x-service-role': 'true' }
    }
  });
} else {
  console.warn(
    "Missing Supabase service role key. User profile creation may fail due to RLS policies."
  );
}

export { serviceRoleClient };
