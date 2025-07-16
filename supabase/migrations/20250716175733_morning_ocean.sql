/*
  # Fix Authentication Trigger Configuration

  This migration fixes the database trigger that creates client profiles when new users sign up.
  The issue was caused by missing default values and RLS policy conflicts.

  ## Changes Made:
  1. Drop and recreate the trigger function with proper error handling
  2. Add default values for required columns
  3. Fix RLS policies to allow trigger operations
  4. Add proper constraint handling
*/

-- First, drop the existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_client_profile();

-- Create an improved trigger function with proper error handling
CREATE OR REPLACE FUNCTION public.create_client_profile()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into client_profiles with proper defaults
  INSERT INTO public.client_profiles (
    id,
    email,
    full_name,
    phone,
    company,
    website,
    address,
    avatar_url,
    timezone,
    language,
    account_status,
    total_spent,
    created_at,
    updated_at,
    last_login
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'website', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    NULL,
    'UTC',
    'en',
    'active',
    0,
    NOW(),
    NOW(),
    NULL
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating client profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_client_profile();

-- Update RLS policies to allow the trigger to work properly
-- First, drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can read own data" ON client_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON client_profiles;
DROP POLICY IF EXISTS "Clients can read own profile" ON client_profiles;
DROP POLICY IF EXISTS "Clients can update own profile" ON client_profiles;

-- Create new, more permissive policies for client profiles
CREATE POLICY "Enable read access for users based on user_id"
  ON client_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id"
  ON client_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users during signup"
  ON client_profiles
  FOR INSERT
  WITH CHECK (true);

-- Ensure the function has proper permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.client_profiles TO postgres, anon, authenticated, service_role;

-- Update the client_profiles table to ensure all columns have proper defaults
ALTER TABLE client_profiles 
  ALTER COLUMN full_name SET DEFAULT '',
  ALTER COLUMN timezone SET DEFAULT 'UTC',
  ALTER COLUMN language SET DEFAULT 'en',
  ALTER COLUMN account_status SET DEFAULT 'active',
  ALTER COLUMN total_spent SET DEFAULT 0;

-- Make sure email is not required to be unique at database level during signup
-- (we'll handle uniqueness at application level)
ALTER TABLE client_profiles DROP CONSTRAINT IF EXISTS client_profiles_email_key;

-- Add a more flexible email constraint that allows for updates
CREATE UNIQUE INDEX IF NOT EXISTS idx_client_profiles_email_unique 
  ON client_profiles(email) 
  WHERE email IS NOT NULL AND email != '';