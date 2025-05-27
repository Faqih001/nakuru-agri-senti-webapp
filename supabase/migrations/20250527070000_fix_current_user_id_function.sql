-- Create the current_user_id function that's missing
-- This will act as a wrapper around Supabase's auth.uid() function

CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql STABLE;

-- Update existing policies if they use the current_user_id function
-- We'll leave them as is since they'll now work with our wrapper function
