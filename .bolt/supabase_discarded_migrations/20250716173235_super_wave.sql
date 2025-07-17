/*
  # Fix RLS Policy for Applications Table

  1. Security Updates
    - Add policy for anonymous users to insert applications
    - Ensure public can submit applications through onboarding form
    - Maintain existing authenticated user policies

  2. Changes
    - Create policy to allow anonymous INSERT operations on applications table
    - This enables the onboarding form to work for unauthenticated users
*/

-- Allow anonymous users to insert applications (for onboarding form)
CREATE POLICY "Enable anonymous application submissions"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);