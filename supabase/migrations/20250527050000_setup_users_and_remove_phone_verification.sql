-- Check if the database exists and create it if it doesn't
DO $$
BEGIN
    -- Create user_status type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
    END IF;
END $$;

-- Create base users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) UNIQUE,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(50),
    account_type account_type NOT NULL DEFAULT 'farmer',
    status user_status DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT true, -- Set default to true as we don't verify phones
    last_login TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Update any existing users to have active status if email is verified
UPDATE users
SET status = 'active'::user_status
WHERE email_verified = true;

-- Drop phone verification related objects
DROP TABLE IF EXISTS phone_verification_tokens;
DROP FUNCTION IF EXISTS verify_phone(text, varchar, uuid);

-- Create or replace function to set phone number
CREATE OR REPLACE FUNCTION set_phone_number(p_user_id UUID, p_phone_number VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE users
    SET phone_number = p_phone_number
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
