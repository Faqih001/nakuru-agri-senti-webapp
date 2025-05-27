-- A test file to verify that authentication is working

-- First, check if current_user_id function exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'current_user_id'
    ) THEN
        RAISE NOTICE 'current_user_id function exists';
    ELSE
        RAISE NOTICE 'current_user_id function does NOT exist';
    END IF;
END $$;

-- Check if user_profiles table structure is correct
DO $$ 
DECLARE
    column_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
        AND column_name = 'email'
    ) INTO column_exists;
    
    IF column_exists THEN
        RAISE NOTICE 'user_profiles table has email column';
    ELSE
        RAISE NOTICE 'user_profiles table does NOT have email column';
    END IF;
END $$;

-- Check if row level security policies are working for user_profiles
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM 
    pg_policies 
WHERE 
    tablename = 'user_profiles'
ORDER BY
    policyname;
