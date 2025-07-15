/*
  # Enable Anonymous Application Submissions

  1. Security Changes
    - Drop existing INSERT policy that blocks anonymous users
    - Create new INSERT policy allowing anonymous (anon) role to submit applications
    - Maintain existing SELECT/UPDATE policies for authenticated users
    - Ensure RLS remains enabled for security

  This fixes the "new row violates row-level security policy" error when
  unauthenticated users try to submit onboarding applications.
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Enable anonymous application submissions" ON applications;
DROP POLICY IF EXISTS "Allow anonymous application submissions" ON applications;
DROP POLICY IF EXISTS "Anonymous can insert applications" ON applications;

-- Create new INSERT policy for anonymous users
CREATE POLICY "Enable anonymous application submissions"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;