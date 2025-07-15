/*
  # Fix Applications Table RLS Policy

  1. Security Updates
    - Update RLS policy for applications table to allow anonymous users to insert
    - Ensure anonymous users can submit applications through the onboarding form
    - Maintain security for other operations (SELECT, UPDATE, DELETE remain restricted)

  2. Changes Made
    - Drop existing restrictive INSERT policy if it exists
    - Create new INSERT policy allowing anonymous users to submit applications
    - Keep existing policies for authenticated users intact
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Allow anonymous users to submit applications" ON applications;

-- Create new INSERT policy for anonymous users to submit applications
CREATE POLICY "Allow anonymous users to submit applications"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure the existing SELECT and UPDATE policies for authenticated users remain
-- (These should already exist based on the schema, but let's verify they're correct)

-- Policy for authenticated users to read applications
DROP POLICY IF EXISTS "Allow authenticated users to read applications" ON applications;
CREATE POLICY "Allow authenticated users to read applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update applications  
DROP POLICY IF EXISTS "Allow authenticated users to update applications" ON applications;
CREATE POLICY "Allow authenticated users to update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);