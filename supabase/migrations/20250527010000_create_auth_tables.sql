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
