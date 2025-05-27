-- Add explicit foreign key between user_profiles and auth.users

-- First, check if the foreign key constraint exists
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

-- Ensure that the FK constraint user_profiles_id_fkey exists, and if so, describe how it is configured
DO $$
BEGIN
  RAISE NOTICE 'Checking foreign key configuration:';
  
  FOR r IN (
    SELECT
      tc.constraint_name,
      kcu.table_name,
      kcu.column_name,
      ccu.table_schema AS foreign_table_schema,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name,
      rc.delete_rule
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.constraint_schema
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
    WHERE tc.constraint_name = 'user_profiles_id_fkey'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'user_profiles'
  ) LOOP
    RAISE NOTICE 'Foreign key % from %.%.% references %.%.% with delete rule %',
      r.constraint_name, 
      'public', 
      r.table_name, 
      r.column_name, 
      r.foreign_table_schema, 
      r.foreign_table_name, 
      r.foreign_column_name,
      r.delete_rule;
  END LOOP;
END $$;
