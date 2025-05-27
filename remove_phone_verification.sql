-- Simplified migration to handle phone verification removal
-- This script focuses only on the changes we need to make

-- Start transaction
BEGIN;

-- Create function to update last activity if it doesn't exist
CREATE OR REPLACE FUNCTION update_session_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to verify email (without phone verification dependency)
CREATE OR REPLACE FUNCTION verify_email(p_token TEXT, p_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Begin transaction
    BEGIN
        -- Update email verification token
        UPDATE email_verification_tokens
        SET used_at = NOW()
        WHERE token = p_token
        AND user_id = p_user_id
        AND used_at IS NULL;

        -- Update user's email verification status and set to active
        -- Now sets status to active directly instead of checking phone verification
        UPDATE users
        SET email_verified = true,
            status = 'active'::user_status
        WHERE id = p_user_id;

        -- Commit transaction
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
        -- Rollback transaction on error
        ROLLBACK;
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop phone verification tokens table (if it exists)
DROP TABLE IF EXISTS phone_verification_tokens;

-- Drop the verify_phone function (if it exists)
DROP FUNCTION IF EXISTS verify_phone(text, varchar, uuid);

-- Set the default for phone_verified to TRUE on users table
-- This only runs if the users table and column exist
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone_verified'
    ) THEN
        EXECUTE 'ALTER TABLE users ALTER COLUMN phone_verified SET DEFAULT true';
    END IF;
END $$;

-- Create or replace function to set phone number (no verification)
CREATE OR REPLACE FUNCTION set_phone_number(p_user_id UUID, p_phone_number VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE users
    SET phone_number = p_phone_number
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update any existing users to have phone_verified=true
-- This only runs if the users table and column exist
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'phone_verified'
    ) THEN
        EXECUTE 'UPDATE users SET phone_verified = true';
    END IF;
END $$;

-- Update existing user status to active if email is verified
-- This only runs if the users table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'email_verified'
    ) THEN
        EXECUTE 'UPDATE users SET status = ''active''::user_status WHERE email_verified = true';
    END IF;
END $$;

-- Commit all changes
COMMIT;
