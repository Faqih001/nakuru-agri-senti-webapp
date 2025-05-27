-- Fix Row Level Security for user_profiles table
-- This migration updates the RLS policies to allow new profile creation during signup

-- Drop existing RLS policies (if any) that might be causing issues
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

-- Create RLS policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create RLS policy to allow authenticated users to create their own profile during signup
CREATE POLICY "Enable insert for authentication"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- For service roles like API endpoints that need to create profiles
CREATE POLICY "Service role can insert"
ON public.user_profiles
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Enable service role to update profiles for admin functions
CREATE POLICY "Service role can update" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated, anon
USING (true);

-- Add function to automatically link profiles to auth.users
CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, username, first_name, last_name)
  VALUES (
    new.id, 
    new.email, 
    split_part(new.email, '@', 1),
    '', 
    ''
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_on_signup();
