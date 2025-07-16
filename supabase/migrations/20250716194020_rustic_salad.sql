/*
  # Comprehensive Messaging System

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references users)
      - `receiver_id` (uuid, references users, nullable for broadcasts)
      - `content` (text)
      - `subject` (text)
      - `message_type` (enum: direct, broadcast)
      - `is_read` (boolean)
      - `read_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `message_recipients` (for broadcast messages)
      - `id` (uuid, primary key)
      - `message_id` (uuid, references messages)
      - `recipient_id` (uuid, references users)
      - `is_read` (boolean)
      - `read_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Admin can send/read all messages
    - Clients can only send to admin and read their own messages
    - Proper policies for broadcast messages
*/

-- Create enum for message types
CREATE TYPE message_type AS ENUM ('direct', 'broadcast');

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message_type message_type DEFAULT 'direct',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Message recipients table (for broadcast messages)
CREATE TABLE IF NOT EXISTS message_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, recipient_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_message_recipients_message_id ON message_recipients(message_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_recipient_id ON message_recipients(recipient_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_is_read ON message_recipients(is_read);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages table

-- Admin can read all messages
CREATE POLICY "Admins can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Clients can read messages sent to them or sent by them
CREATE POLICY "Clients can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR 
    receiver_id = auth.uid() OR
    (message_type = 'broadcast' AND EXISTS (
      SELECT 1 FROM message_recipients 
      WHERE message_recipients.message_id = messages.id 
      AND message_recipients.recipient_id = auth.uid()
    ))
  );

-- Admin can send messages to anyone
CREATE POLICY "Admins can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    ) AND sender_id = auth.uid()
  );

-- Clients can send messages to admin only
CREATE POLICY "Clients can send messages to admin"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    (
      EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = receiver_id
      ) OR
      receiver_id IS NULL -- Allow for potential broadcast replies
    )
  );

-- Admin can update message read status
CREATE POLICY "Admins can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Users can update read status of their own messages
CREATE POLICY "Users can update own message read status"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- RLS Policies for message_recipients table

-- Admin can read all message recipients
CREATE POLICY "Admins can read all message recipients"
  ON message_recipients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Users can read their own recipient records
CREATE POLICY "Users can read own recipient records"
  ON message_recipients
  FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid());

-- Admin can insert message recipients
CREATE POLICY "Admins can insert message recipients"
  ON message_recipients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admin can update message recipient read status
CREATE POLICY "Admins can update message recipients"
  ON message_recipients
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Users can update their own recipient read status
CREATE POLICY "Users can update own recipient read status"
  ON message_recipients
  FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON messages 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically mark message as read when read_at is set
CREATE OR REPLACE FUNCTION mark_message_read()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.read_at IS NOT NULL AND OLD.read_at IS NULL THEN
        NEW.is_read = true;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic read status updates
CREATE TRIGGER mark_message_read_trigger
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION mark_message_read();

CREATE TRIGGER mark_recipient_read_trigger
  BEFORE UPDATE ON message_recipients
  FOR EACH ROW
  EXECUTE FUNCTION mark_message_read();