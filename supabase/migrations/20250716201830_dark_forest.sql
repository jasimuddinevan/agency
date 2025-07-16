/*
  # Fix message foreign key constraints

  1. Changes
    - Drop existing foreign key constraints on messages table
    - Add new foreign key constraints that reference applications table instead of auth.users
    - Create a function to get conversation summaries
*/

-- First, drop existing constraints that might be causing issues
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS fk_sender;
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS fk_receiver;

-- Add new foreign key constraints that reference applications table
-- This allows sending messages to application entries which we know exist
ALTER TABLE public.messages 
ADD CONSTRAINT fk_sender 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For receiver_id, make it reference applications table
ALTER TABLE public.messages 
ADD CONSTRAINT fk_receiver 
FOREIGN KEY (receiver_id) REFERENCES applications(id) ON DELETE CASCADE;

-- Create or replace the conversation summaries function
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
      END as conv_participant_id,
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
      END as count_participant_id,
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
    lm.conv_participant_id as participant_id,
    COALESCE(a.full_name, 'Unknown User') as participant_name,
    COALESCE(a.email, 'unknown@example.com') as participant_email,
    lm.last_message_content,
    lm.last_message_time,
    COALESCE(uc.unread_count, 0) as unread_count,
    lm.is_admin_sender
  FROM latest_messages lm
  LEFT JOIN public.applications a ON a.id = lm.conv_participant_id
  LEFT JOIN unread_counts uc ON uc.count_participant_id = lm.conv_participant_id
  ORDER BY lm.last_message_time DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_conversation_summaries(uuid) TO authenticated;