import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email template data interface
interface EmailTemplateData {
  fullName: string;
  email: string;
  password?: string;
  loginUrl?: string;
  supportEmail?: string;
  companyName?: string;
  [key: string]: any;
}

// Email sending result interface
interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// SMTP Configuration using Resend.com
const emailConfig: EmailConfig = {
  host: 'smtp.resend.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: 'resend',
    pass: Deno.env.get('RESEND_API_KEY') || 're_Fmg22KYr_PVWG3xkNdMdBGfpPB3iy1gN6'
  }
};

/**
 * Generate welcome email HTML template
 */
const generateWelcomeEmailHTML = (data: EmailTemplateData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${data.companyName || 'GrowthPro'}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .title {
                color: #1e293b;
                font-size: 28px;
                font-weight: bold;
                margin: 0;
            }
            .subtitle {
                color: #64748b;
                font-size: 16px;
                margin: 10px 0 0 0;
            }
            .credentials-box {
                background: #f1f5f9;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
            }
            .credentials-title {
                color: #1e293b;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
            }
            .credential-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                padding: 8px 0;
                border-bottom: 1px solid #e2e8f0;
            }
            .credential-item:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            .credential-label {
                font-weight: 500;
                color: #475569;
            }
            .credential-value {
                font-family: 'Courier New', monospace;
                background: #e2e8f0;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 14px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                text-decoration: none;
                padding: 14px 28px;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            .cta-button:hover {
                transform: translateY(-1px);
            }
            .security-notice {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
            .security-notice-title {
                color: #92400e;
                font-weight: 600;
                margin-bottom: 5px;
            }
            .security-notice-text {
                color: #a16207;
                font-size: 14px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-size: 14px;
            }
            .support-info {
                background: #f0f9ff;
                border: 1px solid #0ea5e9;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">GP</div>
                <h1 class="title">Welcome to ${data.companyName || 'GrowthPro'}!</h1>
                <p class="subtitle">Your account has been created successfully</p>
            </div>

            <p>Hi ${data.fullName},</p>
            
            <p>Congratulations! Your client account has been created and you're ready to start your growth journey with us. We're excited to help you transform your business.</p>

            <div class="credentials-box">
                <div class="credentials-title">🔐 Your Login Credentials</div>
                <div class="credential-item">
                    <span class="credential-label">Email:</span>
                    <span class="credential-value">${data.email}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">${data.password}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Login URL:</span>
                    <span class="credential-value">${data.loginUrl}</span>
                </div>
            </div>

            <div class="security-notice">
                <div class="security-notice-title">🛡️ Security Recommendation</div>
                <div class="security-notice-text">
                    For your security, we recommend changing your password after your first login. You can do this in your account settings.
                </div>
            </div>

            <div style="text-align: center;">
                <a href="${data.loginUrl}" class="cta-button">Access Your Dashboard</a>
            </div>

            <h3>What's Next?</h3>
            <ul>
                <li><strong>Complete Your Profile:</strong> Add additional business information to help us serve you better</li>
                <li><strong>Choose Your Services:</strong> Select from our comprehensive growth packages</li>
                <li><strong>Connect with Our Team:</strong> Schedule a strategy consultation to maximize your results</li>
                <li><strong>Track Your Progress:</strong> Monitor your business growth through our detailed analytics</li>
            </ul>

            <div class="support-info">
                <strong>Need Help?</strong><br>
                Our support team is available 24/7 to assist you.<br>
                📧 Email: <a href="mailto:${data.supportEmail}">${data.supportEmail}</a><br>
                📞 Phone: +1 (555) 123-4567
            </div>

            <div class="footer">
                <p>Thank you for choosing ${data.companyName || 'GrowthPro'}!</p>
                <p>This email was sent to ${data.email}. If you didn't create this account, please contact our support team immediately.</p>
                <p>&copy; 2024 ${data.companyName || 'GrowthPro'}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

/**
 * Generate welcome email plain text template
 */
const generateWelcomeEmailText = (data: EmailTemplateData): string => {
  return `
Welcome to ${data.companyName || 'GrowthPro'}!

Hi ${data.fullName},

Congratulations! Your client account has been created successfully and you're ready to start your growth journey with us.

Your Login Credentials:
- Email: ${data.email}
- Password: ${data.password}
- Login URL: ${data.loginUrl}

SECURITY RECOMMENDATION: For your security, we recommend changing your password after your first login.

What's Next?
1. Complete Your Profile: Add additional business information
2. Choose Your Services: Select from our comprehensive growth packages  
3. Connect with Our Team: Schedule a strategy consultation
4. Track Your Progress: Monitor your growth through our analytics

Need Help?
Our support team is available 24/7:
- Email: ${data.supportEmail}
- Phone: +1 (555) 123-4567

Access your dashboard: ${data.loginUrl}

Thank you for choosing ${data.companyName || 'GrowthPro'}!

---
This email was sent to ${data.email}. If you didn't create this account, please contact support immediately.
© 2024 ${data.companyName || 'GrowthPro'}. All rights reserved.
  `.trim();
};

/**
 * Send email using fetch API (compatible with Deno)
 */
const sendEmailWithResend = async (
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<EmailResult> => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailConfig.auth.pass}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'GrowthPro Team <noreply@growthpro.com>',
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Resend API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.id
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Log email activity to database
 */
const logEmailActivity = async (
  email: string,
  emailType: string,
  status: 'sent' | 'failed',
  messageId: string | null,
  errorMessage?: string
): Promise<void> => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    await supabase
      .from('email_logs')
      .insert({
        email,
        email_type: emailType,
        status,
        message_id: messageId,
        error_message: errorMessage,
        sent_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log email activity:', error);
    // Don't throw error here to avoid breaking email flow
  }
};

/**
 * Main Edge Function handler
 */
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    // Parse request body
    const { email, fullName, password, additionalData = {} } = await req.json();

    // Validate required fields
    if (!email || !fullName || !password) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: email, fullName, password' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email address format' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Prepare template data
    const templateData: EmailTemplateData = {
      fullName,
      email,
      password,
      loginUrl: `${new URL(req.url).origin.replace('functions/v1/send-welcome-email', '')}client_area`,
      supportEmail: 'support@growthpro.com',
      companyName: 'GrowthPro',
      ...additionalData
    };

    // Generate email content
    const htmlContent = generateWelcomeEmailHTML(templateData);
    const textContent = generateWelcomeEmailText(templateData);

    // Send email
    const emailResult = await sendEmailWithResend(
      email,
      `Welcome to ${templateData.companyName} - Your Account is Ready! 🚀`,
      htmlContent,
      textContent
    );

    // Log email activity
    await logEmailActivity(
      email, 
      'welcome_email', 
      emailResult.success ? 'sent' : 'failed',
      emailResult.messageId || null,
      emailResult.error
    );

    // Return response
    return new Response(
      JSON.stringify(emailResult),
      {
        status: emailResult.success ? 200 : 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});