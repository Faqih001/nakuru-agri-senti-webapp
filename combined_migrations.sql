-- Create enum types for various statuses and categories
CREATE TYPE crop_status AS ENUM ('growing', 'harvested', 'failed');
CREATE TYPE soil_type AS ENUM ('clay', 'sandy', 'loamy', 'silt', 'peat');
CREATE TYPE disease_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE weather_type AS ENUM ('sunny', 'rainy', 'cloudy', 'partly_cloudy');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE subscription_tier AS ENUM ('basic', 'premium', 'enterprise');

-- Add explicit foreign key between user_profiles and auth.users
DO $$
BEGIN
  -- Check if the foreign key exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_id_fkey' 
    AND table_name = 'user_profiles'
  ) THEN
    -- Add the foreign key constraint to auth.users
    BEGIN
      ALTER TABLE user_profiles
        ADD CONSTRAINT user_profiles_id_fkey
        FOREIGN KEY (id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
      
      RAISE NOTICE 'Added foreign key constraint from user_profiles.id to auth.users.id';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error adding foreign key constraint: %', SQLERRM;
    END;
  ELSE
    RAISE NOTICE 'Foreign key constraint user_profiles_id_fkey already exists';
  END IF;
END $$;

-- Create farms table
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    size_acres DECIMAL(10,2) NOT NULL,
    soil_type soil_type,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crops table
CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    variety VARCHAR(255),
    planting_date DATE NOT NULL,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    status crop_status DEFAULT 'growing',
    area_planted DECIMAL(10,2),
    expected_yield DECIMAL(10,2),
    actual_yield DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create soil_data table
CREATE TABLE soil_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    ph_level DECIMAL(4,2),
    nitrogen_level DECIMAL(5,2),
    phosphorus_level DECIMAL(5,2),
    potassium_level DECIMAL(5,2),
    organic_matter_percentage DECIMAL(5,2),
    moisture_percentage DECIMAL(5,2),
    testing_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create weather_data table
CREATE TABLE weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weather_type weather_type NOT NULL,
    temperature_celsius DECIMAL(4,1),
    humidity_percentage INTEGER,
    rainfall_mm DECIMAL(5,1),
    wind_speed_kmh DECIMAL(4,1),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create disease_detections table
CREATE TABLE disease_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    disease_name VARCHAR(255) NOT NULL,
    detection_date DATE NOT NULL,
    severity disease_severity NOT NULL,
    symptoms TEXT,
    treatment_recommendations TEXT,
    image_url TEXT,
    ai_confidence_score DECIMAL(5,2),
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create market_prices table
CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(255) NOT NULL,
    market_location VARCHAR(255) NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    quantity_available_kg DECIMAL(10,2),
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create buyers table
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    location VARCHAR(255),
    verification_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES auth.users(id),
    buyer_id UUID REFERENCES buyers(id),
    crop_id UUID REFERENCES crops(id),
    quantity_kg DECIMAL(10,2) NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status transaction_status DEFAULT 'pending',
    payment_status VARCHAR(50),
    delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50),
    payment_status VARCHAR(50),
    amount_paid DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create advisory_logs table
CREATE TABLE advisory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    advice_type VARCHAR(100) NOT NULL,
    advice_content TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisory_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Farms policies
CREATE POLICY "Users can view their own farms"
    ON farms FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farms"
    ON farms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms"
    ON farms FOR UPDATE
    USING (auth.uid() = user_id);

-- Similar policies for other tables...
-- Add more specific policies as needed for each table

-- Create indexes for better performance
CREATE INDEX idx_farms_user_id ON farms(user_id);
CREATE INDEX idx_crops_farm_id ON crops(farm_id);
CREATE INDEX idx_soil_data_farm_id ON soil_data(farm_id);
CREATE INDEX idx_weather_data_farm_id ON weather_data(farm_id);
CREATE INDEX idx_disease_detections_crop_id ON disease_detections(crop_id);
CREATE INDEX idx_market_prices_crop_name ON market_prices(crop_name);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_advisory_logs_user_id ON advisory_logs(user_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_farms_updated_at
    BEFORE UPDATE ON farms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables that have updated_at column
-- Create user role enum
CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');

-- Create extended user profiles table
CREATE TABLE extended_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(50),
    role user_role NOT NULL DEFAULT 'farmer',
    preferred_language VARCHAR(50) DEFAULT 'en',
    profile_image_url TEXT,
    bio TEXT,
    verified BOOLEAN DEFAULT false,
    email_notifications_enabled BOOLEAN DEFAULT true,
    sms_notifications_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user verification table
CREATE TABLE user_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    document_url TEXT,
    verification_status VARCHAR(50) DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verification_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user device tokens table for push notifications
CREATE TABLE user_device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_token TEXT NOT NULL,
    device_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, device_token)
);

-- Create password reset tracking table
CREATE TABLE password_reset_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reset_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(reset_token)
);

-- Create login history table
CREATE TABLE login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    login_timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    device_info TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE extended_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Extended profiles policies
CREATE POLICY "Users can view their own profile"
    ON extended_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON extended_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON extended_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- User verifications policies
CREATE POLICY "Users can view their own verifications"
    ON user_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can submit their own verifications"
    ON user_verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Device tokens policies
CREATE POLICY "Users can manage their own device tokens"
    ON user_device_tokens FOR ALL
    USING (auth.uid() = user_id);

-- Password reset policies
CREATE POLICY "Users can view their own reset requests"
    ON password_reset_requests FOR SELECT
    USING (auth.uid() = user_id);

-- Login history policies
CREATE POLICY "Users can view their own login history"
    ON login_history FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_extended_profiles_role ON extended_profiles(role);
CREATE INDEX idx_user_verifications_status ON user_verifications(verification_status);
CREATE INDEX idx_user_device_tokens_user ON user_device_tokens(user_id) WHERE is_active = true;
CREATE INDEX idx_password_reset_token ON password_reset_requests(reset_token) WHERE used = false;
CREATE INDEX idx_login_history_user_timestamp ON login_history(user_id, login_timestamp DESC);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_extended_profiles_updated_at
    BEFORE UPDATE ON extended_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_verifications_updated_at
    BEFORE UPDATE ON user_verifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_device_tokens_updated_at
    BEFORE UPDATE ON user_device_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update user's last login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE extended_profiles
    SET last_login = NEW.login_timestamp
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update last login
CREATE TRIGGER on_login_update_last_login
    AFTER INSERT ON login_history
    FOR EACH ROW
    WHEN (NEW.success = true)
    EXECUTE FUNCTION update_last_login();

-- Create extension for IP address handling (if not exists)
CREATE EXTENSION IF NOT EXISTS "citext";
-- Create extensions if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create user status enum
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- Create account type enum
CREATE TYPE account_type AS ENUM ('farmer', 'buyer', 'admin');

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
    phone_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create user sessions table
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

-- Create email verification tokens table
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- Create phone verification tokens table
CREATE TABLE phone_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(50) NOT NULL,
    token VARCHAR(6) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- Create password reset tokens table
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- User settings table is already created in previous migration
-- Skipping creation to avoid conflicts

-- Create user security audit log
CREATE TABLE security_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
-- RLS for user_settings already enabled in previous migration
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_email_verification_token ON email_verification_tokens(token);
CREATE INDEX idx_phone_verification_user ON phone_verification_tokens(user_id, phone_number);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_security_audit_user_time ON security_audit_log(user_id, created_at DESC);

-- Create or replace function to hash password
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to verify password
CREATE OR REPLACE FUNCTION verify_password(password TEXT, password_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN password_hash = crypt(password, password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to update last activity
CREATE OR REPLACE FUNCTION update_session_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session activity
CREATE TRIGGER update_session_activity
    BEFORE UPDATE ON user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_last_activity();

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_settings already created in previous migration

-- Create function to log security events
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

-- Create policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (id = current_user_id());

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (id = current_user_id());

CREATE POLICY "Users can view their own sessions"
    ON user_sessions FOR SELECT
    USING (user_id = current_user_id());

CREATE POLICY "Users can manage their own sessions"
    ON user_sessions FOR ALL
    USING (user_id = current_user_id());

-- Policies for user_settings already created in previous migration
-- Create function to verify email
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

-- Create function to verify phone
CREATE OR REPLACE FUNCTION verify_phone(p_token TEXT, p_phone_number VARCHAR, p_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Begin transaction
    BEGIN
        -- Update phone verification token
        UPDATE phone_verification_tokens
        SET used_at = NOW()
        WHERE token = p_token
        AND phone_number = p_phone_number
        AND user_id = p_user_id
        AND used_at IS NULL;

        -- Update user's phone verification status
        UPDATE users
        SET phone_verified = true,
            phone_number = p_phone_number,
            status = CASE 
                WHEN email_verified = true THEN 'active'::user_status 
                ELSE status 
            END
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

-- Create function to reset password
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
-- Remove phone verification but keep phone number field
-- For simplicity we'll keep the phone_verified column but set it to TRUE by default

-- Update existing user status to active if email is verified
UPDATE users
SET status = 'active'::user_status
WHERE email_verified = true;

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
