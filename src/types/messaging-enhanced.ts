export type MessagePriority = 'low' | 'normal' | 'high';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface EnhancedMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  message_body: string;
  priority: MessagePriority;
  created_at: string;
  read_status: MessageStatus;
  thread_id: string;
  sender?: {
    id: string;
    full_name: string;
    email: string;
  };
  recipient?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface MessageThread {
  id: string;
  subject: string;
  messages: EnhancedMessage[];
  participants: {
    id: string;
    full_name: string;
    email: string;
  }[];
  lastMessage: EnhancedMessage;
  unreadCount: number;
}

export interface MessageStats {
  total: number;
  unread: number;
  sent: number;
  threads: number;
}

export interface SendMessageRequest {
  recipient_id: string;
  subject: string;
  message_body: string;
  priority: MessagePriority;
  thread_id?: string;
}

export interface RateLimitInfo {
  message_count: number;
  reset_at: string;
  remaining: number;
}