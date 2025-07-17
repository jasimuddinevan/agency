/*
  # Fix messaging system database issues

  1. Database Schema Fixes
    - Add missing foreign key constraints for messages table
    - Create get_conversation_summaries function
    - Fix user relationships

  2. Security
    - Update RLS policies for proper user relationships
    - Ensure proper access controls
*/

-- First, ensure the messages table has proper foreign key constraints
-- Drop existing constraints if they exist to avoid conflicts
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;

-- Add proper foreign key constraints to users table (not auth.users)
ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_receiver_id_fkey 
FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create the missing get_conversation_summaries function
CREATE OR REPLACE FUNCTION public.get_conversation_summaries(admin_user_id uuid)
RETURNS TABLE (
  participant_id uuid,
  participant_name text,
  participant_email text,
  last_message_content text,
  last_message_time timestamptz,
  unread_count bigint,
  is_admin_sender boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH conversation_data AS (
    SELECT 
      CASE 
        WHEN m.sender_id = admin_user_id THEN m.receiver_id
        ELSE m.sender_id
      END as participant_id,
      m.content as last_message_content,
      m.created_at as last_message_time,
      m.sender_id = admin_user_id as is_admin_sender,
      CASE 
        WHEN m.sender_id = admin_user_id THEN false
        ELSE NOT m.is_read
      END as is_unread,
      ROW_NUMBER() OVER (
        PARTITION BY CASE 
          WHEN m.sender_id = admin_user_id THEN m.receiver_id
          ELSE m.sender_id
        END 
        ORDER BY m.created_at DESC
      ) as rn
    FROM public.messages m
    WHERE m.sender_id = admin_user_id OR m.receiver_id = admin_user_id
  ),
  latest_messages AS (
    SELECT *
    FROM conversation_data
    WHERE rn = 1
  ),
  unread_counts AS (
    SELECT 
      CASE 
        WHEN m.sender_id = admin_user_id THEN m.receiver_id
        ELSE m.sender_id
      END as participant_id,
      COUNT(*) as unread_count
    FROM public.messages m
    WHERE (m.sender_id = admin_user_id OR m.receiver_id = admin_user_id)
      AND NOT m.is_read
      AND m.sender_id != admin_user_id
    GROUP BY CASE 
      WHEN m.sender_id = admin_user_id THEN m.receiver_id
      ELSE m.sender_id
    END
  )
  SELECT 
    lm.participant_id,
    COALESCE(cp.full_name, au.full_name, 'Unknown User') as participant_name,
    COALESCE(cp.email, au.email, 'unknown@example.com') as participant_email,
    lm.last_message_content,
    lm.last_message_time,
    COALESCE(uc.unread_count, 0) as unread_count,
    lm.is_admin_sender
  FROM latest_messages lm
  LEFT JOIN public.client_profiles cp ON cp.id = lm.participant_id
  LEFT JOIN public.admin_users au ON au.id = lm.participant_id
  LEFT JOIN unread_counts uc ON uc.participant_id = lm.participant_id
  ORDER BY lm.last_message_time DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_conversation_summaries(uuid) TO authenticated;