/*
  # Fix messaging system foreign key relationships and functions

  1. Database Schema Updates
    - Add proper foreign key constraints to messages table
    - Create get_conversation_summaries function
    - Ensure proper relationships for Supabase queries

  2. Security
    - Grant proper permissions to functions
    - Maintain existing RLS policies
*/

-- First, drop existing constraints if they exist to avoid conflicts
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS fk_sender;
ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS fk_receiver;

-- Add proper foreign key constraints to auth.users table
ALTER TABLE public.messages 
ADD CONSTRAINT fk_sender 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT fk_receiver 
FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the function if it exists to recreate it
DROP FUNCTION IF EXISTS public.get_conversation_summaries(uuid);

-- Create the get_conversation_summaries function
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
    WITH user_messages AS (
        SELECT
            m.id,
            m.sender_id,
            m.receiver_id,
            m.content,
            m.created_at,
            m.is_read,
            m.sender_id = admin_user_id as is_admin_sender,
            CASE
                WHEN m.sender_id = admin_user_id THEN m.receiver_id
                ELSE m.sender_id
            END AS participant_id
        FROM
            public.messages m
        WHERE
            m.sender_id = admin_user_id OR m.receiver_id = admin_user_id
    ),
    latest_messages AS (
        SELECT
            participant_id,
            MAX(created_at) AS last_message_time
        FROM
            user_messages
        GROUP BY
            participant_id
    ),
    unread_counts AS (
        SELECT
            sender_id AS participant_id,
            COUNT(id) AS count
        FROM
            public.messages
        WHERE
            receiver_id = admin_user_id AND is_read = FALSE
        GROUP BY
            sender_id
    )
    SELECT
        lm.participant_id,
        COALESCE(
            cp.full_name,
            au.raw_user_meta_data->>'full_name', 
            au.email
        ) AS participant_name,
        au.email AS participant_email,
        um.content AS last_message_content,
        lm.last_message_time,
        COALESCE(uc.count, 0) AS unread_count,
        um.is_admin_sender
    FROM
        latest_messages lm
    JOIN
        user_messages um ON um.participant_id = lm.participant_id AND um.created_at = lm.last_message_time
    JOIN
        auth.users au ON au.id = lm.participant_id
    LEFT JOIN
        public.client_profiles cp ON cp.id = lm.participant_id
    LEFT JOIN
        unread_counts uc ON uc.participant_id = lm.participant_id
    ORDER BY
        lm.last_message_time DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_conversation_summaries(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_conversation_summaries(uuid) TO service_role;