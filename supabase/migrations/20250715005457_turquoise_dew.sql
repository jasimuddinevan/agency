/*
  # Fix Applications Table INSERT Policy

  1. Security Changes
    - Drop existing INSERT policy that may be blocking anonymous users
    - Create new INSERT policy allowing anonymous users to submit applications
    - Ensure anonymous users can insert application data through the onboarding form
    - Maintain existing SELECT and UPDATE policies for authenticated users

  2. Policy Details
    - Target role: `anon` (anonymous users)
    - Operation: INSERT
    - Condition: Allow all anonymous inserts (true)
    - This enables the onboarding form to work for visitors who haven't logged in
*/

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "Allow anonymous users to submit applications" ON applications;

-- Create a new INSERT policy that explicitly allows anonymous users
CREATE POLICY "Enable anonymous application submissions"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure the table has RLS enabled
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;