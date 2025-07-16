/*
  # Create email logs table for tracking email delivery

  1. New Tables
    - `email_logs`
      - `id` (uuid, primary key)
      - `email` (text, recipient email)
      - `email_type` (text, type of email sent)
      - `status` (text, sent/failed status)
      - `message_id` (text, SMTP message ID)
      - `error_message` (text, error details if failed)
      - `sent_at` (timestamp, when email was sent/attempted)

  2. Security
    - Enable RLS on `email_logs` table
    - Add policy for authenticated users to read logs (admin only)
*/

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed')),
  message_id text,
  error_message text,
  sent_at timestamptz DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can read email logs"
  ON email_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- System can insert email logs
CREATE POLICY "System can insert email logs"
  ON email_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);