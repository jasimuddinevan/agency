import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Email Settings
    smtpServer: 'smtp.resend.com',
    smtpPort: 465,
    smtpUsername: 'resend',
    smtpPassword: '••••••••••••••••',
    senderEmail: 'noreply@growthpro.com',
    senderName: 'GrowthPro Team',
    
    // Notification Events
    notifyOnNewApplication: true,
    notifyOnApplicationStatusChange: true,
    notifyOnNewMessage: true,
    notifyOnPaymentReceived: true,
    notifyOnServiceStatusChange: true,
    notifyOnSystemErrors: true,
    
    // Notification Channels
    emailNotifications: true,
    inAppNotifications: true,
    slackWebhook: '',
    enableSlack: false,
    
    // Email Templates
    useCustomTemplates: true,
    includeCompanyLogo: true,
    includeFooterLinks: true,
    
    // Notification Limits
    maxDailyEmails: 1000,
    batchNotifications: true,
    notificationDelay: 5 // minutes
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseInt(value) 
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification settings saved successfully');
    } catch (error) {
      toast.error('Failed to save notification settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Test email sent successfully');
    } catch (error) {
      toast.error('Failed to send test email');
      console.error('Error sending test email:', error);
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
        <p className="text-gray-600 mt-1">Configure email and notification preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Server Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Server Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Server
              </label>
              <input
                type="text"
                id="smtpServer"
                name="smtpServer"
                value={settings.smtpServer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                id="smtpPort"
                name="smtpPort"
                value={settings.smtpPort}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Username
              </label>
              <input
                type="text"
                id="smtpUsername"
                name="smtpUsername"
                value={settings.smtpUsername}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Password
              </label>
              <input
                type="password"
                id="smtpPassword"
                name="smtpPassword"
                value={settings.smtpPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                id="senderEmail"
                name="senderEmail"
                value={settings.senderEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                Sender Name
              </label>
              <input
                type="text"
                id="senderName"
                name="senderName"
                value={settings.senderName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={isTestingEmail}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isTestingEmail ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Sending Test Email...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notification Events */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Events</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnNewApplication"
                name="notifyOnNewApplication"
                checked={settings.notifyOnNewApplication}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyOnNewApplication" className="ml-2 block text-sm text-gray-700">
                New Application Submitted
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnApplicationStatusChange"
                name="notifyOnApplicationStatusChange"
                checked={settings.notifyOnApplicationStatusChange}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyOnApplicationStatusChange" className="ml-2 block text-sm text-gray-700">
                Application Status Change
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnNewMessage"
                name="notifyOnNewMessage"
                checked={settings.notifyOnNewMessage}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyOnNewMessage" className="ml-2 block text-sm text-gray-700">
                New Message Received
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnPaymentReceived"
                name="notifyOnPaymentReceived"
                checked={settings.notifyOnPaymentReceived}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyOnPaymentReceived" className="ml-2 block text-sm text-gray-700">
                Payment Received
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnServiceStatusChange"
                name="notifyOnServiceStatusChange"
                checked={settings.notifyOnServiceStatusChange}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyOnServiceStatusChange" className="ml-2 block text-sm text-gray-700">
                Service Status Change
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnSystemErrors"
                name="notifyOnSystemErrors"
                checked={settings.notifyOnSystemErrors}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyOnSystemErrors" className="ml-2 block text-sm text-gray-700">
                System Errors
              </label>
            </div>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inAppNotifications"
                name="inAppNotifications"
                checked={settings.inAppNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="inAppNotifications" className="ml-2 block text-sm text-gray-700">
                In-App Notifications
              </label>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="enableSlack"
                  name="enableSlack"
                  checked={settings.enableSlack}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableSlack" className="ml-2 block text-sm font-medium text-gray-700">
                  Enable Slack Notifications
                </label>
              </div>
              
              <div className={settings.enableSlack ? '' : 'opacity-50'}>
                <label htmlFor="slackWebhook" className="block text-sm text-gray-700 mb-1">
                  Slack Webhook URL
                </label>
                <input
                  type="text"
                  id="slackWebhook"
                  name="slackWebhook"
                  value={settings.slackWebhook}
                  onChange={handleChange}
                  disabled={!settings.enableSlack}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Limits */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Limits & Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="maxDailyEmails" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Daily Emails
              </label>
              <input
                type="number"
                id="maxDailyEmails"
                name="maxDailyEmails"
                value={settings.maxDailyEmails}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Limit the number of emails sent per day to avoid rate limiting
              </p>
            </div>

            <div>
              <label htmlFor="notificationDelay" className="block text-sm font-medium text-gray-700 mb-1">
                Notification Delay (minutes)
              </label>
              <input
                type="number"
                id="notificationDelay"
                name="notificationDelay"
                value={settings.notificationDelay}
                onChange={handleChange}
                min={0}
                max={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Delay between notifications to avoid overwhelming users
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="batchNotifications"
                  name="batchNotifications"
                  checked={settings.batchNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="batchNotifications" className="ml-2 block text-sm text-gray-700">
                  Batch Notifications
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                Combine multiple notifications into a single email when possible
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset to Defaults
          </button>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;