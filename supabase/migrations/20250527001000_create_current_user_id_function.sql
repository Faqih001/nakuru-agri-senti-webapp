-- Create the current_user_id function before any policies
-- This ensures the function exists before being referenced

CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql STABLE;

-- Note: This function needs to exist before any policies reference it
-- This migration has an early timestamp to ensure it runs first
