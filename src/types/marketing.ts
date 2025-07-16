export interface EmailTemplate {
  id: string;
  name: string;
  category: 'welcome' | 'approval' | 'rejection' | 'promotional' | 'newsletter' | 'general';
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  sender_name: string;
  sender_email: string;
  template_id?: string;
  html_content: string;
  text_content?: string;
  recipient_filter: RecipientFilter;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipientFilter {
  type: 'all' | 'specific' | 'approved' | 'non_approved' | 'rejected' | 'custom';
  specific_emails?: string[];
  application_status?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  industry?: string[];
  revenue_range?: string[];
}

export interface CampaignRecipient {
  id: string;
  campaign_id: string;
  recipient_email: string;
  recipient_name: string;
  recipient_type: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
  bounced_at?: string;
  error_message?: string;
  tracking_id: string;
}

export interface EmailAutomationWorkflow {
  id: string;
  name: string;
  trigger_type: 'application_submitted' | 'application_approved' | 'application_rejected' | 'user_signup' | 'custom';
  trigger_conditions: Record<string, any>;
  template_id?: string;
  delay_minutes: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface MarketingStats {
  total_campaigns: number;
  active_campaigns: number;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  average_open_rate: number;
  average_click_rate: number;
  recent_campaigns: EmailCampaign[];
}

export interface CampaignAnalytics {
  campaign_id: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  failed_count: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  delivery_rate: number;
  engagement_over_time: {
    date: string;
    opens: number;
    clicks: number;
  }[];
}

export interface RecipientListItem {
  email: string;
  name: string;
  type: string;
  status?: string;
  industry?: string;
  revenue?: string;
  created_at: string;
}