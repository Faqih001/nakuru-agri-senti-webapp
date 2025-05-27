-- First check if table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_profiles') THEN
        CREATE TABLE user_profiles (
            id UUID PRIMARY KEY,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            job_title VARCHAR(255),
            email VARCHAR(255),
            username VARCHAR(255),
            phone_number VARCHAR(50),
            account_type VARCHAR(50) DEFAULT 'farmer',
            email_verified BOOLEAN DEFAULT false,
            status VARCHAR(50) DEFAULT 'pending'
        );
        
        -- Log the creation of the table
        RAISE NOTICE 'Created user_profiles table';
    ELSE
        -- Extend the user_profiles table with additional fields (if table exists)
        BEGIN
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
            RAISE NOTICE 'Added email column';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding email column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username VARCHAR(255);
            RAISE NOTICE 'Added username column';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding username column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
            RAISE NOTICE 'Added phone_number column';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding phone_number column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS account_type VARCHAR(50) DEFAULT 'farmer';
            RAISE NOTICE 'Added account_type column';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding account_type column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
            RAISE NOTICE 'Added email_verified column';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding email_verified column: %', SQLERRM;
        END;
        
        BEGIN
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
            RAISE NOTICE 'Added status column';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding status column: %', SQLERRM;
        END;
    END IF;
END $$;

-- Create indexes for the fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Make sure RLS is enabled
ALTER TABLE IF EXISTS user_profiles ENABLE ROW LEVEL SECURITY;

-- Add policy so users can read/write their own profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' AND policyname = 'Users can read their own profiles'
    ) THEN
        CREATE POLICY "Users can read their own profiles" 
        ON user_profiles FOR SELECT 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' AND policyname = 'Users can update their own profiles'
    ) THEN
        CREATE POLICY "Users can update their own profiles" 
        ON user_profiles FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' AND policyname = 'Users can insert their own profiles'
    ) THEN
        CREATE POLICY "Users can insert their own profiles" 
        ON user_profiles FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;
