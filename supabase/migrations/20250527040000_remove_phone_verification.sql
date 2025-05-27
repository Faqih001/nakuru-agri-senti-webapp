-- Remove phone verification but keep phone number field
-- For simplicity we'll keep the phone_verified column but set it to TRUE by default

DO $$ 
BEGIN
    -- Check if the users table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        -- Update existing user status to active if email is verified
        UPDATE users
        SET status = 'active'::user_status
        WHERE email_verified = true;
    END IF;
END $$;

-- Modify the users table
ALTER TABLE users ALTER COLUMN phone_verified SET DEFAULT true;

-- Drop phone verification tokens table
DROP TABLE IF EXISTS phone_verification_tokens;

-- Drop the verify_phone function
DROP FUNCTION IF EXISTS verify_phone;

-- Create or update function to set phone number
CREATE OR REPLACE FUNCTION set_phone_number(p_user_id UUID, p_phone_number VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE users
    SET phone_number = p_phone_number
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
