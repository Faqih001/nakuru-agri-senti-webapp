
// Tell TypeScript to expect errors for Deno-specific imports
// @ts-expect-error: Deno module imports
export { serve } from "https://deno.land/std@0.204.0/http/server.ts";
// @ts-expect-error: Supabase module imports
export { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
// @ts-expect-error: Type imports
export type { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Re-export types that might be needed
// @ts-expect-error: Type imports
export type { Session, User, AuthError } from "https://esm.sh/@supabase/supabase-js@2.39.3";
