-- ===============================================
-- NAKURU AGRI SENTI WEBAPP - COMPLETE DATABASE MIGRATION
-- ===============================================
-- This migration file sets up the complete database schema for the
-- Nakuru Agricultural Sentiment Analysis Web Application
-- Created: July 4, 2025
-- ===============================================

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ===============================================
-- UTILITY FUNCTIONS
-- ===============================================

-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- ENUM TYPES
-- ===============================================

-- Core application enums
CREATE TYPE crop_status AS ENUM ('growing', 'harvested', 'failed');
CREATE TYPE soil_type AS ENUM ('clay', 'sandy', 'loamy', 'silt', 'peat');
CREATE TYPE disease_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE weather_type AS ENUM ('sunny', 'rainy', 'cloudy', 'partly_cloudy');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE subscription_tier AS ENUM ('basic', 'premium', 'enterprise');

-- User management enums
CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE account_type AS ENUM ('farmer', 'buyer', 'admin');

-- ===============================================
-- AUTHENTICATION & USER MANAGEMENT TABLES
-- ===============================================

-- Custom users table (alternative to auth.users)
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
    phone_verified BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User sessions for authentication
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

-- Email verification tokens
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- Extended user profiles
CREATE TABLE extended_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
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

-- User verifications
CREATE TABLE user_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    document_url TEXT,
    verification_status VARCHAR(50) DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verification_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device tokens for push notifications
CREATE TABLE user_device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_token TEXT NOT NULL,
    device_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, device_token)
);

-- Login history
CREATE TABLE login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    login_timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    device_info TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT
);

-- Security audit log
CREATE TABLE security_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- CORE APPLICATION TABLES
-- ===============================================

-- Farms table
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    size_acres DECIMAL(10,2) NOT NULL,
    soil_type soil_type,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crops table
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

-- Soil data table
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

-- Weather data table
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

-- Disease detections table
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

-- Market prices table
CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(255) NOT NULL,
    market_location VARCHAR(255) NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    quantity_available_kg DECIMAL(10,2),
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buyers table
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    location VARCHAR(255),
    verification_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id),
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

-- User subscriptions table
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50),
    payment_status VARCHAR(50),
    amount_paid DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advisory logs table
CREATE TABLE advisory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    advice_type VARCHAR(100) NOT NULL,
    advice_content TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- User management indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_email_verification_token ON email_verification_tokens(token);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_extended_profiles_role ON extended_profiles(role);
CREATE INDEX idx_user_verifications_status ON user_verifications(verification_status);
CREATE INDEX idx_user_device_tokens_user ON user_device_tokens(user_id) WHERE is_active = true;
CREATE INDEX idx_login_history_user_timestamp ON login_history(user_id, login_timestamp DESC);
CREATE INDEX idx_security_audit_user_time ON security_audit_log(user_id, created_at DESC);

-- Core application indexes
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

-- ===============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ===============================================

-- User management triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

-- Core application triggers
CREATE TRIGGER update_farms_updated_at
    BEFORE UPDATE ON farms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crops_updated_at
    BEFORE UPDATE ON crops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disease_detections_updated_at
    BEFORE UPDATE ON disease_detections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyers_updated_at
    BEFORE UPDATE ON buyers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- AUTHENTICATION UTILITY FUNCTIONS
-- ===============================================

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

-- Function to update session last activity
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set phone number
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user's last login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE extended_profiles
    SET last_login = NEW.login_timestamp
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last login
CREATE TRIGGER on_login_update_last_login
    AFTER INSERT ON login_history
    FOR EACH ROW
    WHEN (NEW.success = true)
    EXECUTE FUNCTION update_last_login();

-- Create trigger for session activity
CREATE TRIGGER update_session_activity
    BEFORE UPDATE ON user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_last_activity();

-- ===============================================
-- ROW LEVEL SECURITY (RLS)
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE extended_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
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

-- ===============================================
-- RLS POLICIES
-- ===============================================

-- Users policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- User sessions policies
CREATE POLICY "Users can view their own sessions"
    ON user_sessions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own sessions"
    ON user_sessions FOR ALL
    USING (user_id = auth.uid());

-- Extended profiles policies
CREATE POLICY "Users can view their own profile"
    ON extended_profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON extended_profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
    ON extended_profiles FOR INSERT
    WITH CHECK (id = auth.uid());

-- User verifications policies
CREATE POLICY "Users can view their own verifications"
    ON user_verifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can submit their own verifications"
    ON user_verifications FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Device tokens policies
CREATE POLICY "Users can manage their own device tokens"
    ON user_device_tokens FOR ALL
    USING (user_id = auth.uid());

-- Login history policies
CREATE POLICY "Users can view their own login history"
    ON login_history FOR SELECT
    USING (user_id = auth.uid());

-- Farms policies
CREATE POLICY "Users can view their own farms"
    ON farms FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own farms"
    ON farms FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own farms"
    ON farms FOR UPDATE
    USING (user_id = auth.uid());

-- Crops policies
CREATE POLICY "Users can view crops from their farms"
    ON crops FOR SELECT
    USING (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert crops to their farms"
    ON crops FOR INSERT
    WITH CHECK (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can update crops from their farms"
    ON crops FOR UPDATE
    USING (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));

-- Soil data policies
CREATE POLICY "Users can view soil data from their farms"
    ON soil_data FOR SELECT
    USING (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert soil data to their farms"
    ON soil_data FOR INSERT
    WITH CHECK (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));

-- Weather data policies
CREATE POLICY "Users can view weather data from their farms"
    ON weather_data FOR SELECT
    USING (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert weather data to their farms"
    ON weather_data FOR INSERT
    WITH CHECK (farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid()));

-- Disease detections policies
CREATE POLICY "Users can view disease detections from their crops"
    ON disease_detections FOR SELECT
    USING (crop_id IN (SELECT id FROM crops WHERE farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid())));

CREATE POLICY "Users can insert disease detections to their crops"
    ON disease_detections FOR INSERT
    WITH CHECK (crop_id IN (SELECT id FROM crops WHERE farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid())));

CREATE POLICY "Users can update disease detections from their crops"
    ON disease_detections FOR UPDATE
    USING (crop_id IN (SELECT id FROM crops WHERE farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid())));

-- Market prices policies (public read access)
CREATE POLICY "Anyone can view market prices"
    ON market_prices FOR SELECT
    TO public
    USING (true);

-- Buyers policies
CREATE POLICY "Users can view their own buyer profile"
    ON buyers FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own buyer profile"
    ON buyers FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own buyer profile"
    ON buyers FOR UPDATE
    USING (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (seller_id = auth.uid() OR buyer_id IN (SELECT id FROM buyers WHERE user_id = auth.uid()));

-- User subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
    ON user_subscriptions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscriptions"
    ON user_subscriptions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscriptions"
    ON user_subscriptions FOR UPDATE
    USING (user_id = auth.uid());

-- Advisory logs policies
CREATE POLICY "Users can view their own advisory logs"
    ON advisory_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own advisory logs"
    ON advisory_logs FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ===============================================
-- MIGRATION COMPLETION
-- ===============================================

-- Update any existing users to have active status if email is verified
UPDATE users
SET status = 'active'::user_status
WHERE email_verified = true;

-- Create a function to get current user ID (for RLS policies)
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log completion
INSERT INTO security_audit_log (user_id, event_type, details)
VALUES (NULL, 'DATABASE_MIGRATION', jsonb_build_object(
    'message', 'Complete database migration executed successfully',
    'timestamp', NOW()
));

-- ===============================================
-- END OF MIGRATION
-- ===============================================
