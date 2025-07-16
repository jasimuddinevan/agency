/*
  # Client Profiles System Setup

  1. New Tables
    - `client_profiles` - Store client profile information
    - `client_services` - Track client services and subscriptions
    - `client_messages` - Handle client-admin communication
    - `client_activities` - Log client activities and interactions

  2. Security
    - Enable RLS on all client tables
    - Add policies for authenticated client access
    - Ensure clients can only access their own data

  3. Functions
    - Auto-create client profile on user registration
    - Update last login timestamp
*/

-- Create client_profiles table
CREATE TABLE IF NOT EXISTS client_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  company text,
  website text,
  address text,
  avatar_url text,
  timezone text DEFAULT 'UTC',
  language text DEFAULT 'en',
  account_status text DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending')),
  total_spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create client_services table
CREATE TABLE IF NOT EXISTS client_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES client_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('web-management', 'facebook-ads', 'shopify-growth')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'pending')),
  plan text DEFAULT 'basic' CHECK (plan IN ('basic', 'premium')),
  price numeric NOT NULL,
  billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  start_date timestamptz DEFAULT now(),
  next_billing_date timestamptz,
  features jsonb DEFAULT '[]',
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create client_messages table
CREATE TABLE IF NOT EXISTS client_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES client_profiles(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id),
  sender_name text NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('client', 'admin')),
  subject text NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create client_activities table
CREATE TABLE IF NOT EXISTS client_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES client_profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('service_update', 'message_received', 'payment_processed', 'report_generated', 'login', 'profile_updated')),
  title text NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_profiles
CREATE POLICY "Clients can read own profile"
  ON client_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Clients can update own profile"
  ON client_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for client_services
CREATE POLICY "Clients can read own services"
  ON client_services
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Admins can manage all services"
  ON client_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid()
    )
  );

-- RLS Policies for client_messages
CREATE POLICY "Clients can read own messages"
  ON client_messages
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid() OR sender_id = auth.uid());

CREATE POLICY "Clients can send messages"
  ON client_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid() AND sender_id = auth.uid());

CREATE POLICY "Admins can manage all messages"
  ON client_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid()
    )
  );

-- RLS Policies for client_activities
CREATE POLICY "Clients can read own activities"
  ON client_activities
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "System can create activities"
  ON client_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to create client profile on user registration
CREATE OR REPLACE FUNCTION create_client_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO client_profiles (
    id,
    email,
    full_name,
    phone,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NOW()
  );
  
  -- Log registration activity
  INSERT INTO client_activities (
    client_id,
    type,
    title,
    description
  ) VALUES (
    NEW.id,
    'profile_updated',
    'Account Created',
    'Client profile has been created successfully'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE client_profiles 
  SET last_login = NOW()
  WHERE id = NEW.id;
  
  -- Log login activity
  INSERT INTO client_activities (
    client_id,
    type,
    title,
    description
  ) VALUES (
    NEW.id,
    'login',
    'User Login',
    'Client logged into the dashboard'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_client_profile();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_profiles_email ON client_profiles(email);
CREATE INDEX IF NOT EXISTS idx_client_services_client_id ON client_services(client_id);
CREATE INDEX IF NOT EXISTS idx_client_services_status ON client_services(status);
CREATE INDEX IF NOT EXISTS idx_client_messages_client_id ON client_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_is_read ON client_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_client_activities_client_id ON client_activities(client_id);
CREATE INDEX IF NOT EXISTS idx_client_activities_created_at ON client_activities(created_at DESC);