export { serve } from "https://deno.land/std@0.168.0/http/server.ts";
export { createClient } from "https://esm.sh/@supabase/supabase-js@2";
export type { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2";

// Re-export types that might be needed
export type { Session, User, AuthError } from "https://esm.sh/@supabase/supabase-js@2";
