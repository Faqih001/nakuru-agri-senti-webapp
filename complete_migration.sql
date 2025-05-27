-- Combined migration file that handles dependencies correctly
-- Created on May 27, 2025

-- Create extensions that will be needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the update_updated_at_column function first
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Create enum types if they don't exist
DO $$ 
BEGIN
  -- From create_core_tables migration
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crop_status') THEN
    CREATE TYPE crop_status AS ENUM ('growing', 'harvested', 'failed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'soil_type') THEN
    CREATE TYPE soil_type AS ENUM ('clay', 'sandy', 'loamy', 'silt', 'peat');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'disease_severity') THEN
    CREATE TYPE disease_severity AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'weather_type') THEN
    CREATE TYPE weather_type AS ENUM ('sunny', 'rainy', 'cloudy', 'partly_cloudy');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
    CREATE TYPE subscription_tier AS ENUM ('basic', 'premium', 'enterprise');
  END IF;

  -- From create_auth_tables migration
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
  END IF;

  -- From create_custom_auth_tables migration
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
    CREATE TYPE account_type AS ENUM ('farmer', 'buyer', 'admin');
  END IF;
END $$;

-- Create users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    -- Create base users table
    CREATE TABLE users (
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
        phone_verified BOOLEAN DEFAULT true,  -- Changed default to true
        last_login TIMESTAMPTZ,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
    );

    -- Create indexes for users table
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_users_status ON users(status);

    -- Create trigger for updated_at timestamps
    CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    -- Enable Row Level Security for users table
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    -- Create policies for users table
    CREATE POLICY "Users can view their own data"
        ON users FOR SELECT
        USING (id = auth.uid());

    CREATE POLICY "Users can update their own data"
        ON users FOR UPDATE
        USING (id = auth.uid());
    
  ELSE
    -- Modify existing users table to set phone_verified default to true
    ALTER TABLE users ALTER COLUMN phone_verified SET DEFAULT true;
  END IF;
END $$;

-- Create supporting auth tables if they don't exist
DO $$
BEGIN
  -- Create user sessions table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sessions') THEN
    CREATE TABLE user_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_token TEXT NOT NULL UNIQUE,
        refresh_token TEXT UNIQUE,
        ip_address TEXT,
        user_agent TEXT,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_activity TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
    CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
    ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own sessions"
        ON user_sessions FOR SELECT
        USING (user_id = auth.uid());

    CREATE POLICY "Users can manage their own sessions"
        ON user_sessions FOR ALL
        USING (user_id = auth.uid());

    -- Create session activity trigger
    CREATE TRIGGER update_session_activity
        BEFORE UPDATE ON user_sessions
        FOR EACH ROW
        EXECUTE FUNCTION update_session_last_activity();
  END IF;

  -- Create email verification tokens table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_verification_tokens') THEN
    CREATE TABLE email_verification_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        used_at TIMESTAMPTZ
    );
    
    CREATE INDEX idx_email_verification_token ON email_verification_tokens(token);
    ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create password reset tokens table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'password_reset_tokens') THEN
    CREATE TABLE password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        used_at TIMESTAMPTZ
    );
    
    CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
    ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create security audit log table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'security_audit_log') THEN
    CREATE TABLE security_audit_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        event_type VARCHAR(50) NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        details JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    CREATE INDEX idx_security_audit_user_time ON security_audit_log(user_id, created_at DESC);
    ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop phone verification tokens table if it exists
DROP TABLE IF EXISTS phone_verification_tokens;

-- Create or replace authentication utility functions
-- Function to hash password
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify password
CREATE OR REPLACE FUNCTION verify_password(password TEXT, password_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN password_hash = crypt(password, password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last activity
CREATE OR REPLACE FUNCTION update_session_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_event_type VARCHAR(50),
    p_ip_address TEXT,
    p_user_agent TEXT,
    p_details JSONB
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO security_audit_log (
        user_id, event_type, ip_address, user_agent, details
    ) VALUES (
        p_user_id, p_event_type, p_ip_address, p_user_agent, p_details
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify email
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

-- Drop verify_phone function if it exists
DROP FUNCTION IF EXISTS verify_phone(text, varchar, uuid);

-- Create function to set phone number
CREATE OR REPLACE FUNCTION set_phone_number(p_user_id UUID, p_phone_number VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE users
    SET phone_number = p_phone_number
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset password
CREATE OR REPLACE FUNCTION reset_password(p_token TEXT, p_new_password TEXT, p_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Begin transaction
    BEGIN
        -- Update password reset token
        UPDATE password_reset_tokens
        SET used_at = NOW()
        WHERE token = p_token
        AND user_id = p_user_id
        AND used_at IS NULL;

        -- Update user's password
        UPDATE users
        SET password_hash = crypt(p_new_password, gen_salt('bf')),
            failed_login_attempts = 0,
            locked_until = NULL
        WHERE id = p_user_id;

        -- Delete all sessions for the user
        DELETE FROM user_sessions
        WHERE user_id = p_user_id;

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

-- Update any existing users to have active status if email is verified
UPDATE users
SET status = 'active'::user_status
WHERE email_verified = true;
