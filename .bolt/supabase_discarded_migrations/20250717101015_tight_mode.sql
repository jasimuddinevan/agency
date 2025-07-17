/*
  # Client Messaging System

  1. New Tables
    - `client_messages_enhanced`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, foreign key to auth.users)
      - `recipient_id` (uuid, foreign key to auth.users)
      - `subject` (text)
      - `message_body` (text)
      - `priority` (text)
      - `created_at` (timestamp with time zone)
      - `read_status` (text)
      - `thread_id` (uuid)
    - `message_rate_limits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `message_count` (integer)
      - `reset_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own messages
    - Add policies for rate limiting
*/

-- Create message priority type
CREATE TYPE message_priority AS ENUM ('low', 'normal', 'high');

-- Create message status type
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- Create enhanced client messages table
CREATE TABLE IF NOT EXISTS client_messages_enhanced (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  recipient_id uuid NOT NULL REFERENCES auth.users(id),
  subject text NOT NULL,
  message_body text NOT NULL,
  priority message_priority DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  read_status message_status DEFAULT 'sent',
  thread_id uuid,
  CONSTRAINT subject_length CHECK (char_length(subject) <= 100),
  CONSTRAINT message_body_length CHECK (char_length(message_body) <= 1000)
);

-- Create message rate limits table
CREATE TABLE IF NOT EXISTS message_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  message_count integer DEFAULT 0,
  reset_at timestamptz NOT NULL,
  CONSTRAINT unique_user_rate_limit UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE client_messages_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for client_messages_enhanced
-- Users can insert their own messages
CREATE POLICY "Users can insert their own messages"
  ON client_messages_enhanced
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Users can read messages they sent or received
CREATE POLICY "Users can read their own messages"
  ON client_messages_enhanced
  FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Users can update read status of messages they received
CREATE POLICY "Users can update read status of received messages"
  ON client_messages_enhanced
  FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (
    recipient_id = auth.uid() AND
    (read_status IS DISTINCT FROM OLD.read_status)
  );

-- Create policies for message_rate_limits
-- Users can view their own rate limits
CREATE POLICY "Users can view their own rate limits"
  ON message_rate_limits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only the system can update rate limits
CREATE POLICY "System can update rate limits"
  ON message_rate_limits
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION check_message_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  rate_limit RECORD;
  hourly_limit INTEGER := 10; -- Max 10 messages per hour
BEGIN
  -- Get or create rate limit record for user
  SELECT * INTO rate_limit FROM message_rate_limits
  WHERE user_id = NEW.sender_id;
  
  IF NOT FOUND THEN
    -- Create new rate limit record
    INSERT INTO message_rate_limits (user_id, message_count, reset_at)
    VALUES (NEW.sender_id, 1, now() + interval '1 hour')
    RETURNING * INTO rate_limit;
    RETURN NEW;
  END IF;
  
  -- Check if reset time has passed
  IF now() > rate_limit.reset_at THEN
    -- Reset counter and update reset time
    UPDATE message_rate_limits
    SET message_count = 1, reset_at = now() + interval '1 hour'
    WHERE user_id = NEW.sender_id;
    RETURN NEW;
  END IF;
  
  -- Check if user has exceeded rate limit
  IF rate_limit.message_count >= hourly_limit THEN
    RAISE EXCEPTION 'Rate limit exceeded: You can only send % messages per hour', hourly_limit;
  END IF;
  
  -- Increment message count
  UPDATE message_rate_limits
  SET message_count = message_count + 1
  WHERE user_id = NEW.sender_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for rate limiting
CREATE TRIGGER check_message_rate_limit_trigger
BEFORE INSERT ON client_messages_enhanced
FOR EACH ROW
EXECUTE FUNCTION check_message_rate_limit();

-- Create function to update thread_id
CREATE OR REPLACE FUNCTION set_message_thread_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If thread_id is not set, use the message id as the thread_id
  IF NEW.thread_id IS NULL THEN
    NEW.thread_id := NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for setting thread_id
CREATE TRIGGER set_message_thread_id_trigger
BEFORE INSERT ON client_messages_enhanced
FOR EACH ROW
EXECUTE FUNCTION set_message_thread_id();

-- Create indexes for better performance
CREATE INDEX idx_client_messages_enhanced_sender_id ON client_messages_enhanced(sender_id);
CREATE INDEX idx_client_messages_enhanced_recipient_id ON client_messages_enhanced(recipient_id);
CREATE INDEX idx_client_messages_enhanced_thread_id ON client_messages_enhanced(thread_id);
CREATE INDEX idx_client_messages_enhanced_created_at ON client_messages_enhanced(created_at DESC);
CREATE INDEX idx_client_messages_enhanced_read_status ON client_messages_enhanced(read_status);