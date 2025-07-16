export interface ClientUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  last_login?: string;
}

export interface ClientProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  company?: string;
  website?: string;
  address?: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  account_status: 'active' | 'suspended' | 'pending';
  total_spent: number;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface ClientApplication {
  id: string;
  business_name: string;
  website_url: string;
  business_description: string;
  industry: string;
  monthly_revenue: string;
  status: 'new' | 'in_progress' | 'contacted' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientService {
  id: string;
  name: string;
  type: 'web-management' | 'facebook-ads' | 'shopify-growth';
  status: 'active' | 'paused' | 'cancelled' | 'pending';
  plan: 'basic' | 'premium';
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  start_date: string;
  next_billing_date: string;
  features: string[];
  metrics?: {
    uptime?: string;
    performance_score?: number;
    conversions?: number;
    revenue_generated?: number;
  };
}

export interface ClientMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_type: 'client' | 'admin';
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  attachments?: string[];
}

export interface ClientActivity {
  id: string;
  type: 'service_update' | 'message_received' | 'payment_processed' | 'report_generated';
  title: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface ClientStats {
  total_services: number;
  active_services: number;
  unread_messages: number;
  upcoming_payments: number;
  total_spent: number;
  account_status: 'active' | 'suspended' | 'pending';
}

export interface ClientNotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  service_updates: boolean;
  billing_reminders: boolean;
  marketing_emails: boolean;
}

export interface ClientProfile {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  address: string;
  timezone: string;
  language: string;
}

export interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}