import nodemailer from 'nodemailer';
import { supabase } from './supabase';

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
    pass: import.meta.env.VITE_RESEND_API_KEY || 're_Fmg22KYr_PVWG3xkNdMdBGfpPB3iy1gN6'
  }
};

// Create reusable transporter object using SMTP transport
let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter with error handling
 */
const initializeTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    try {
      transporter = nodemailer.createTransporter(emailConfig);
      
      // Verify SMTP connection configuration
      transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP connection error:', error);
        } else {
          console.log('SMTP server is ready to take our messages');
        }
      });
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      throw new Error('Email service initialization failed');
    }
  }
  return transporter;
};

/**
 * Validate email address format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
 * Send welcome email with login credentials
 */
export const sendWelcomeEmail = async (
  email: string, 
  fullName: string, 
  password: string,
  additionalData: Partial<EmailTemplateData> = {}
): Promise<EmailResult> => {
  try {
    // Validate email address
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email address format'
      };
    }

    // Initialize transporter
    const emailTransporter = initializeTransporter();

    // Prepare template data
    const templateData: EmailTemplateData = {
      fullName,
      email,
      password,
      loginUrl: `${window.location.origin}/client_area`,
      supportEmail: 'support@growthpro.com',
      companyName: 'GrowthPro',
      ...additionalData
    };

    // Email options
    const mailOptions = {
      from: {
        name: 'GrowthPro Team',
        address: 'noreply@growthpro.com' // Replace with your verified domain
      },
      to: email,
      subject: `Welcome to ${templateData.companyName} - Your Account is Ready! 🚀`,
      text: generateWelcomeEmailText(templateData),
      html: generateWelcomeEmailHTML(templateData),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    // Send email
    const info = await emailTransporter.sendMail(mailOptions);

    // Log successful delivery
    console.log('Welcome email sent successfully:', {
      messageId: info.messageId,
      recipient: email,
      timestamp: new Date().toISOString()
    });

    // Log email activity to database
    await logEmailActivity(email, 'welcome_email', 'sent', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Failed to send welcome email:', error);
    
    // Log failed email attempt
    await logEmailActivity(email, 'welcome_email', 'failed', null, error instanceof Error ? error.message : 'Unknown error');

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  fullName?: string
): Promise<EmailResult> => {
  try {
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email address format'
      };
    }

    const emailTransporter = initializeTransporter();
    const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: {
        name: 'GrowthPro Security',
        address: 'security@growthpro.com'
      },
      to: email,
      subject: 'Reset Your GrowthPro Password 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${fullName || 'there'},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">GrowthPro Security Team</p>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    await logEmailActivity(email, 'password_reset', 'sent', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Failed to send password reset email:', error);
    await logEmailActivity(email, 'password_reset', 'failed', null, error instanceof Error ? error.message : 'Unknown error');

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Log email activity to database for tracking
 */
const logEmailActivity = async (
  email: string,
  emailType: string,
  status: 'sent' | 'failed',
  messageId: string | null,
  errorMessage?: string
): Promise<void> => {
  try {
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
 * Test email configuration
 */
export const testEmailConfiguration = async (): Promise<EmailResult> => {
  try {
    const emailTransporter = initializeTransporter();
    
    // Verify connection
    await emailTransporter.verify();
    
    return {
      success: true,
      messageId: 'configuration_test_passed'
    };
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Configuration test failed'
    };
  }
};

/**
 * Send general notification email
 */
export const sendNotificationEmail = async (
  email: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<EmailResult> => {
  try {
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email address format'
      };
    }

    const emailTransporter = initializeTransporter();

    const mailOptions = {
      from: {
        name: 'GrowthPro Notifications',
        address: 'notifications@growthpro.com'
      },
      to: email,
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await emailTransporter.sendMail(mailOptions);
    await logEmailActivity(email, 'notification', 'sent', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Failed to send notification email:', error);
    await logEmailActivity(email, 'notification', 'failed', null, error instanceof Error ? error.message : 'Unknown error');

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};