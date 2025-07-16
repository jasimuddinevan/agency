# Email System Setup Guide - Resend.com Integration

## 🚀 Overview

This guide covers the complete setup of the email system using Resend.com's SMTP service for sending welcome emails, password resets, and notifications.

## 📋 Prerequisites

1. **Resend.com Account**: Sign up at [resend.com](https://resend.com)
2. **Domain Verification**: Verify your sending domain
3. **Environment Variables**: Configure email credentials

## 🔧 Configuration Steps

### 1. Resend.com Dashboard Setup

#### A. Create Account & API Key
1. Sign up at [resend.com](https://resend.com)
2. Navigate to **API Keys** section
3. Create a new API key with **Send** permissions
4. Copy the API key (starts with `re_`)

#### B. Domain Verification (REQUIRED)
1. Go to **Domains** section in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the required DNS records to your domain:

```dns
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Record
Type: TXT  
Name: resend._domainkey
Value: [Provided by Resend - unique per domain]

# DMARC Record (Recommended)
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
```

5. Wait for DNS propagation (up to 48 hours)
6. Verify domain status in Resend dashboard

### 2. Environment Variables Setup

Create/update your `.env` file:

```env
# Email Configuration (Resend.com)
VITE_RESEND_API_KEY=re_Fmg22KYr_PVWG3xkNdMdBGfpPB3iy1gN6

# Email Settings (Replace with your verified domain)
VITE_FROM_EMAIL=noreply@yourdomain.com
VITE_SUPPORT_EMAIL=support@yourdomain.com
VITE_COMPANY_NAME=GrowthPro

# Application URLs
VITE_APP_URL=https://yourdomain.com
VITE_CLIENT_LOGIN_URL=https://yourdomain.com/client_area
```

### 3. Database Migration

Run the email logs migration:

```bash
# Apply the email logs table migration
supabase db push
```

This creates the `email_logs` table for tracking email delivery status.

## 📧 Email Templates

### Welcome Email Features
- **Professional HTML Design**: Responsive email template
- **Login Credentials**: Secure password delivery
- **Security Recommendations**: Password change prompts
- **Company Branding**: Customizable company information
- **Support Information**: Contact details and help resources

### Available Email Types
1. **Welcome Email**: Sent during account creation
2. **Password Reset**: For password recovery
3. **Notifications**: General system notifications

## 🔒 Security Best Practices

### 1. Environment Security
- Never commit API keys to version control
- Use different API keys for development/production
- Rotate API keys regularly

### 2. Email Security
- Always use verified domains
- Implement SPF, DKIM, and DMARC records
- Monitor email delivery rates
- Log all email activities

### 3. Password Delivery
- Generate secure random passwords
- Encourage password changes after first login
- Use secure password generation algorithms

## 🧪 Testing Email Functionality

### Test Email Configuration
```typescript
import { testEmailConfiguration } from './src/lib/email';

// Test SMTP connection
const result = await testEmailConfiguration();
console.log('Email test result:', result);
```

### Send Test Welcome Email
```typescript
import { sendWelcomeEmail } from './src/lib/email';

const result = await sendWelcomeEmail(
  'test@example.com',
  'Test User',
  'tempPassword123',
  {
    companyName: 'Test Company'
  }
);
```

## 📊 Monitoring & Logging

### Email Delivery Tracking
- All emails are logged in the `email_logs` table
- Track delivery status (sent/failed)
- Monitor error messages for failed deliveries
- Store SMTP message IDs for reference

### Dashboard Monitoring
1. **Resend Dashboard**: Monitor delivery rates, bounces, complaints
2. **Application Logs**: Check console logs for email errors
3. **Database Logs**: Query `email_logs` table for delivery history

## 🚨 Troubleshooting

### Common Issues

#### 1. Domain Not Verified
**Error**: `Domain not verified`
**Solution**: Complete domain verification in Resend dashboard

#### 2. DNS Records Not Propagated
**Error**: Email delivery failures
**Solution**: Wait for DNS propagation (up to 48 hours)

#### 3. Invalid API Key
**Error**: `Authentication failed`
**Solution**: Verify API key in environment variables

#### 4. Rate Limiting
**Error**: `Rate limit exceeded`
**Solution**: Implement email queuing or upgrade Resend plan

### Debug Steps
1. Check environment variables are loaded correctly
2. Verify domain verification status
3. Test SMTP connection using `testEmailConfiguration()`
4. Check email logs in database
5. Monitor Resend dashboard for delivery status

## 📈 Production Deployment

### 1. Domain Setup
- Use your production domain for email sending
- Complete full domain verification
- Set up proper DNS records

### 2. Environment Configuration
- Use production API keys
- Set correct application URLs
- Configure proper from/support email addresses

### 3. Monitoring Setup
- Set up email delivery monitoring
- Configure alerts for failed deliveries
- Regular review of email logs

## 🔄 Maintenance

### Regular Tasks
1. **Monitor Delivery Rates**: Check Resend dashboard weekly
2. **Review Email Logs**: Analyze failed deliveries
3. **Update Templates**: Keep email content current
4. **Security Audits**: Regular API key rotation

### Scaling Considerations
- **Volume Limits**: Monitor sending limits on Resend plan
- **Queue Management**: Implement email queuing for high volume
- **Template Management**: Consider template versioning
- **A/B Testing**: Test email content effectiveness

## 📞 Support

### Resend Support
- Documentation: [resend.com/docs](https://resend.com/docs)
- Support: [resend.com/support](https://resend.com/support)

### Application Support
- Check application logs for email errors
- Review database email_logs table
- Test email configuration regularly

---

## ✅ Setup Checklist

- [ ] Resend.com account created
- [ ] API key generated and configured
- [ ] Domain added to Resend
- [ ] DNS records configured
- [ ] Domain verification completed
- [ ] Environment variables set
- [ ] Database migration applied
- [ ] Email templates tested
- [ ] Production deployment configured
- [ ] Monitoring setup completed

**Note**: Domain verification is REQUIRED for production email sending. Emails will not be delivered without proper domain verification.