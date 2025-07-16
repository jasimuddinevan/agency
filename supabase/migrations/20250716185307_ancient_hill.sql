/*
  # Marketing System Database Schema

  1. New Tables
    - `email_templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `subject` (text)
      - `html_content` (text)
      - `text_content` (text)
      - `variables` (jsonb)
      - `is_active` (boolean)
      - `created_by` (uuid, foreign key to admin_users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `email_campaigns`
      - `id` (uuid, primary key)
      - `name` (text)
      - `subject` (text)
      - `sender_name` (text)
      - `sender_email` (text)
      - `template_id` (uuid, foreign key to email_templates)
      - `html_content` (text)
      - `text_content` (text)
      - `recipient_filter` (jsonb)
      - `status` (text)
      - `scheduled_at` (timestamp)
      - `sent_at` (timestamp)
      - `created_by` (uuid, foreign key to admin_users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `campaign_recipients`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, foreign key to email_campaigns)
      - `recipient_email` (text)
      - `recipient_name` (text)
      - `recipient_type` (text)
      - `status` (text)
      - `sent_at` (timestamp)
      - `opened_at` (timestamp)
      - `clicked_at` (timestamp)
      - `bounced_at` (timestamp)
      - `error_message` (text)

    - `email_automation_workflows`
      - `id` (uuid, primary key)
      - `name` (text)
      - `trigger_type` (text)
      - `trigger_conditions` (jsonb)
      - `template_id` (uuid, foreign key to email_templates)
      - `delay_minutes` (integer)
      - `is_active` (boolean)
      - `created_by` (uuid, foreign key to admin_users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access only
*/

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  variables jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  sender_name text NOT NULL DEFAULT 'GrowthPro Team',
  sender_email text NOT NULL DEFAULT 'noreply@growthpro.com',
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  html_content text NOT NULL,
  text_content text,
  recipient_filter jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  total_recipients integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  bounced_count integer DEFAULT 0,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email campaigns"
  ON email_campaigns
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

-- Campaign Recipients Table
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_name text NOT NULL,
  recipient_type text NOT NULL DEFAULT 'applicant',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  bounced_at timestamptz,
  error_message text,
  tracking_id uuid DEFAULT gen_random_uuid()
);

ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage campaign recipients"
  ON campaign_recipients
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

-- Email Automation Workflows Table
CREATE TABLE IF NOT EXISTS email_automation_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger_type text NOT NULL CHECK (trigger_type IN ('application_submitted', 'application_approved', 'application_rejected', 'user_signup', 'custom')),
  trigger_conditions jsonb DEFAULT '{}'::jsonb,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  delay_minutes integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_automation_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage automation workflows"
  ON email_automation_workflows
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid()
  ));

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign_id ON campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_tracking_id ON campaign_recipients(tracking_id);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_trigger_type ON email_automation_workflows(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_active ON email_automation_workflows(is_active);

-- Insert default email templates
INSERT INTO email_templates (name, category, subject, html_content, text_content, variables) VALUES
(
  'Welcome Email',
  'welcome',
  'Welcome to GrowthPro - Your Journey Begins!',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to GrowthPro</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to GrowthPro!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your growth journey starts here</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Hi {{name}},</p>
        <p>Thank you for joining GrowthPro! We''re excited to help you transform your business and achieve remarkable growth.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">What''s Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Complete your business profile</li>
                <li>Choose your growth package</li>
                <li>Schedule a strategy consultation</li>
                <li>Start tracking your progress</li>
            </ul>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboard_url}}" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Your Dashboard</a>
        </div>
        <p>If you have any questions, our support team is here to help at <a href="mailto:support@growthpro.com">support@growthpro.com</a></p>
        <p>Best regards,<br>The GrowthPro Team</p>
    </div>
</body>
</html>',
  'Hi {{name}},

Thank you for joining GrowthPro! We''re excited to help you transform your business and achieve remarkable growth.

What''s Next?
- Complete your business profile
- Choose your growth package  
- Schedule a strategy consultation
- Start tracking your progress

Access your dashboard: {{dashboard_url}}

If you have any questions, our support team is here to help at support@growthpro.com

Best regards,
The GrowthPro Team',
  '["name", "dashboard_url"]'::jsonb
),
(
  'Application Approved',
  'approval',
  'Congratulations! Your Application Has Been Approved',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Application Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your application has been approved</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Hi {{name}},</p>
        <p>Great news! Your application for <strong>{{business_name}}</strong> has been approved. We''re excited to welcome you to the GrowthPro family!</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #166534;">Next Steps:</h3>
            <ol style="margin: 0; padding-left: 20px; color: #166534;">
                <li>Choose your growth package</li>
                <li>Schedule your onboarding call</li>
                <li>Set up your payment method</li>
                <li>Begin your transformation journey</li>
            </ol>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboard_url}}" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Get Started Now</a>
        </div>
        <p>Our team will be in touch within 24 hours to guide you through the next steps.</p>
        <p>Welcome aboard!<br>The GrowthPro Team</p>
    </div>
</body>
</html>',
  'Hi {{name}},

Great news! Your application for {{business_name}} has been approved. We''re excited to welcome you to the GrowthPro family!

Next Steps:
1. Choose your growth package
2. Schedule your onboarding call
3. Set up your payment method
4. Begin your transformation journey

Get started: {{dashboard_url}}

Our team will be in touch within 24 hours to guide you through the next steps.

Welcome aboard!
The GrowthPro Team',
  '["name", "business_name", "dashboard_url"]'::jsonb
),
(
  'Application Rejected',
  'rejection',
  'Update on Your GrowthPro Application',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Application Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #64748b, #475569); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Application Update</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your interest in GrowthPro</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p>Hi {{name}},</p>
        <p>Thank you for your interest in GrowthPro and for taking the time to submit your application for <strong>{{business_name}}</strong>.</p>
        <p>After careful review, we''ve determined that our current services may not be the best fit for your business at this time. This decision is based on various factors including our current capacity and service alignment.</p>
        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #92400e;">We''d Love to Help in the Future</h3>
            <p style="margin: 0; color: #92400e;">Business needs evolve, and so do we. We encourage you to reapply in the future as your business grows or our services expand.</p>
        </div>
        <p>In the meantime, we wish you all the best in your business endeavors. If you have any questions about this decision, please don''t hesitate to reach out.</p>
        <p>Best regards,<br>The GrowthPro Team</p>
    </div>
</body>
</html>',
  'Hi {{name}},

Thank you for your interest in GrowthPro and for taking the time to submit your application for {{business_name}}.

After careful review, we''ve determined that our current services may not be the best fit for your business at this time. This decision is based on various factors including our current capacity and service alignment.

We''d Love to Help in the Future:
Business needs evolve, and so do we. We encourage you to reapply in the future as your business grows or our services expand.

In the meantime, we wish you all the best in your business endeavors. If you have any questions about this decision, please don''t hesitate to reach out.

Best regards,
The GrowthPro Team',
  '["name", "business_name"]'::jsonb
);