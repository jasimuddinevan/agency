/*
  # Create applications table for onboarding form

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `business_name` (text, required)
      - `website_url` (text, required)
      - `business_description` (text, required)
      - `industry` (text, required)
      - `monthly_revenue` (text, required)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `address` (text, required)
      - `preferred_contact` (text, required)
      - `status` (text, default 'new')
      - `notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `applications` table
    - Add policy to allow anonymous users to insert applications (for public onboarding form)
    - Add policy to allow authenticated users to read all applications (for admin dashboard)
    - Add policy to allow authenticated users to update applications (for admin management)
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  website_url text NOT NULL,
  business_description text NOT NULL,
  industry text NOT NULL,
  monthly_revenue text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  preferred_contact text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'contacted', 'approved', 'rejected')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous users to insert applications (for public onboarding form)
CREATE POLICY "Allow anonymous users to submit applications"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy to allow authenticated users to read all applications (for admin dashboard)
CREATE POLICY "Allow authenticated users to read applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow authenticated users to update applications (for admin management)
CREATE POLICY "Allow authenticated users to update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create an index on status for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Create an index on created_at for better sorting performance
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);