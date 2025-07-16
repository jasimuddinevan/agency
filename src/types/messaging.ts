export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  content: string;
  subject: string;
  message_type: 'direct' | 'broadcast';
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    full_name: string;
    email: string;
    role?: string;
  };
  receiver?: {
    id: string;
    full_name: string;
    email: string;
    role?: string;
  };
}

export interface MessageRecipient {
  id: string;
  message_id: string;
  recipient_id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  recipient?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface MessageThread {
  participant: {
    id: string;
    full_name: string;
    email: string;
    role?: string;
  };
  messages: Message[];
  unread_count: number;
  last_message: Message;
}

export interface MessageStats {
  total_messages: number;
  unread_messages: number;
  total_conversations: number;
  recent_messages: Message[];
}

export interface SendMessageRequest {
  receiver_id?: string;
  content: string;
  subject: string;
  message_type: 'direct' | 'broadcast';
  recipient_ids?: string[]; // For broadcast messages
}

export interface MessageNotification {
  id: string;
  message: Message;
  type: 'new_message' | 'message_read';
}

export interface ConversationSummary {
  participant_id: string;
  participant_name: string;
  participant_email: string;
  participant_role?: string;
  last_message_content: string;
  last_message_time: string;
  unread_count: number;
  is_online?: boolean;
}