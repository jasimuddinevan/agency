/*
  # Enhanced Messaging System Tables

  1. New Tables
    - `client_messages_enhanced`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references auth.users)
      - `recipient_id` (uuid, references auth.users)
      - `subject` (text, max 100 chars)
      - `message_body` (text, max 1000 chars)
      - `priority` (enum: low, normal, high)
      - `created_at` (timestamp)
      - `read_status` (enum: sent, delivered, read)
      - `thread_id` (uuid, for grouping related messages)

    - `message_rate_limits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `message_count` (integer)
      - `reset_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for clients to access their own messages
    - Add policies for rate limit management

  3. Functions and Triggers
    - Rate limiting function and trigger
    - Thread ID generation function
*/

-- Create enum types
CREATE TYPE message_priority AS ENUM ('low', 'normal', 'high');
CREATE TYPE message_read_status AS ENUM ('sent', 'delivered', 'read');

-- Create client_messages_enhanced table
CREATE TABLE IF NOT EXISTS client_messages_enhanced (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL CHECK (length(subject) <= 100),
  message_body text NOT NULL CHECK (length(message_body) <= 1000),
  priority message_priority DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  read_status message_read_status DEFAULT 'sent',
  thread_id uuid DEFAULT gen_random_uuid()
);

-- Create message_rate_limits table
CREATE TABLE IF NOT EXISTS message_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_count integer DEFAULT 0,
  reset_at timestamptz DEFAULT (now() + interval '1 hour'),
  UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_messages_enhanced_sender ON client_messages_enhanced(sender_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_enhanced_recipient ON client_messages_enhanced(recipient_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_enhanced_thread ON client_messages_enhanced(thread_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_enhanced_created_at ON client_messages_enhanced(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_rate_limits_user ON message_rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_message_rate_limits_reset_at ON message_rate_limits(reset_at);

-- Enable Row Level Security
ALTER TABLE client_messages_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_messages_enhanced
CREATE POLICY "Users can read own messages" ON client_messages_enhanced
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

CREATE POLICY "Users can insert own messages" ON client_messages_enhanced
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

CREATE POLICY "Users can update own received messages" ON client_messages_enhanced
  FOR UPDATE USING (
    auth.uid() = recipient_id
  ) WITH CHECK (
    auth.uid() = recipient_id
  );

-- RLS Policies for message_rate_limits
CREATE POLICY "Users can read own rate limits" ON message_rate_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rate limits" ON message_rate_limits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rate limits" ON message_rate_limits
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION check_message_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count integer;
  reset_time timestamptz;
BEGIN
  -- Get current rate limit info
  SELECT message_count, reset_at INTO current_count, reset_time
  FROM message_rate_limits
  WHERE user_id = NEW.sender_id;

  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO message_rate_limits (user_id, message_count, reset_at)
    VALUES (NEW.sender_id, 1, now() + interval '1 hour');
    RETURN NEW;
  END IF;

  -- If reset time has passed, reset the counter
  IF now() > reset_time THEN
    UPDATE message_rate_limits
    SET message_count = 1, reset_at = now() + interval '1 hour'
    WHERE user_id = NEW.sender_id;
    RETURN NEW;
  END IF;

  -- Check if user has exceeded the limit (10 messages per hour)
  IF current_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded. You can send more messages after %', reset_time;
  END IF;

  -- Increment the counter
  UPDATE message_rate_limits
  SET message_count = message_count + 1
  WHERE user_id = NEW.sender_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for rate limiting
CREATE TRIGGER message_rate_limit_trigger
  BEFORE INSERT ON client_messages_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION check_message_rate_limit();

-- Function to generate thread IDs for replies
CREATE OR REPLACE FUNCTION generate_thread_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a reply (thread_id is provided), keep it
  -- Otherwise, use the message ID as the thread ID
  IF NEW.thread_id IS NULL THEN
    NEW.thread_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for thread ID generation
CREATE TRIGGER generate_thread_id_trigger
  BEFORE INSERT ON client_messages_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION generate_thread_id();

-- Function to update read status
CREATE OR REPLACE FUNCTION update_message_read_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow updating read_status
  IF OLD.read_status != NEW.read_status AND auth.uid() = NEW.recipient_id THEN
    RETURN NEW;
  END IF;
  
  -- Prevent other updates
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for read status updates
CREATE TRIGGER update_read_status_trigger
  BEFORE UPDATE ON client_messages_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION update_message_read_status();