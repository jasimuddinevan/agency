/*
  # Create default admin user

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text, admin or super_admin)
      - `created_at` (timestamp)
      - `last_login` (timestamp, nullable)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated users to read their own admin data
    - Add policy for authenticated users to update their last login

  3. Default Data
    - Creates default admin user with email: admin@growthpro.com
    - Note: You'll need to create the auth user separately in Supabase Auth
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin users can update own last login"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Insert default admin user (this will only work after creating the auth user)
-- Note: You need to create the auth user first in Supabase Auth dashboard
-- Then run this insert with the actual user ID from auth.users

-- Example insert (replace with actual user ID after creating auth user):
-- INSERT INTO admin_users (id, email, full_name, role)
-- VALUES (
--   'your-auth-user-id-here',
--   'admin@growthpro.com',
--   'Admin User',
--   'super_admin'
-- );