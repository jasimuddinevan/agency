import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ArrowPathIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Password Policy
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiryDays: 90,
    preventPasswordReuse: true,
    
    // Session Settings
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    rememberMeDuration: 14, // days
    
    // Two-Factor Authentication
    requireTwoFactor: false,
    twoFactorMethod: 'app', // 'app', 'email', 'sms'
    
    // IP Restrictions
    enableIpRestriction: false,
    allowedIpAddresses: '',
    
    // Security Headers
    enableCSP: true,
    enableHSTS: true,
    enableXFrameOptions: true,
    
    // Audit Logging
    logLogins: true,
    logFailedLogins: true,
    logAdminActions: true,
    logDataChanges: true,
    retentionPeriod: 90 // days
  });
  
  const [isLoading, setIsLoading] = useState(false);

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
      toast.success('Security settings saved successfully');
    } catch (error) {
      toast.error('Failed to save security settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePasswordStrength = () => {
    let strength = 0;
    if (settings.minPasswordLength >= 12) strength += 2;
    else if (settings.minPasswordLength >= 8) strength += 1;
    
    if (settings.requireUppercase) strength += 1;
    if (settings.requireLowercase) strength += 1;
    if (settings.requireNumbers) strength += 1;
    if (settings.requireSpecialChars) strength += 1;
    
    if (strength <= 2) return { level: 'Weak', color: 'bg-red-500' };
    if (strength <= 4) return { level: 'Moderate', color: 'bg-yellow-500' };
    return { level: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = calculatePasswordStrength();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        <p className="text-gray-600 mt-1">Configure security and authentication settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Policy */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Password Strength:</span>
              <span className="text-sm font-medium">{passwordStrength.level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`h-2.5 rounded-full ${passwordStrength.color}`} style={{ width: `${(calculatePasswordStrength().level === 'Weak' ? 33 : calculatePasswordStrength().level === 'Moderate' ? 66 : 100)}%` }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minPasswordLength" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Password Length
              </label>
              <input
                type="number"
                id="minPasswordLength"
                name="minPasswordLength"
                value={settings.minPasswordLength}
                onChange={handleChange}
                min={6}
                max={32}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="passwordExpiryDays" className="block text-sm font-medium text-gray-700 mb-1">
                Password Expiry (days)
              </label>
              <input
                type="number"
                id="passwordExpiryDays"
                name="passwordExpiryDays"
                value={settings.passwordExpiryDays}
                onChange={handleChange}
                min={0}
                max={365}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Set to 0 for no expiration
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireUppercase"
                name="requireUppercase"
                checked={settings.requireUppercase}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requireUppercase" className="ml-2 block text-sm text-gray-700">
                Require uppercase letters
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireLowercase"
                name="requireLowercase"
                checked={settings.requireLowercase}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requireLowercase" className="ml-2 block text-sm text-gray-700">
                Require lowercase letters
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireNumbers"
                name="requireNumbers"
                checked={settings.requireNumbers}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-700">
                Require numbers
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireSpecialChars"
                name="requireSpecialChars"
                checked={settings.requireSpecialChars}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-700">
                Require special characters
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preventPasswordReuse"
                name="preventPasswordReuse"
                checked={settings.preventPasswordReuse}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="preventPasswordReuse" className="ml-2 block text-sm text-gray-700">
                Prevent password reuse
              </label>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Session Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleChange}
                min={5}
                max={1440}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Time of inactivity before automatic logout
              </p>
            </div>

            <div>
              <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                Max Login Attempts
              </label>
              <input
                type="number"
                id="maxLoginAttempts"
                name="maxLoginAttempts"
                value={settings.maxLoginAttempts}
                onChange={handleChange}
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lockoutDuration" className="block text-sm font-medium text-gray-700 mb-1">
                Account Lockout Duration (minutes)
              </label>
              <input
                type="number"
                id="lockoutDuration"
                name="lockoutDuration"
                value={settings.lockoutDuration}
                onChange={handleChange}
                min={1}
                max={1440}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="rememberMeDuration" className="block text-sm font-medium text-gray-700 mb-1">
                "Remember Me" Duration (days)
              </label>
              <input
                type="number"
                id="rememberMeDuration"
                name="rememberMeDuration"
                value={settings.rememberMeDuration}
                onChange={handleChange}
                min={1}
                max={365}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireTwoFactor"
                name="requireTwoFactor"
                checked={settings.requireTwoFactor}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requireTwoFactor" className="ml-2 block text-sm font-medium text-gray-700">
                Require for all admin users
              </label>
            </div>
          </div>
          
          <div className={settings.requireTwoFactor ? '' : 'opacity-50'}>
            <div className="mb-4">
              <label htmlFor="twoFactorMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Default 2FA Method
              </label>
              <select
                id="twoFactorMethod"
                name="twoFactorMethod"
                value={settings.twoFactorMethod}
                onChange={handleChange}
                disabled={!settings.requireTwoFactor}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="app">Authenticator App</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Two-factor authentication enhances security</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Two-factor authentication adds an extra layer of security by requiring a second verification step during login.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IP Restrictions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">IP Restrictions</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableIpRestriction"
                name="enableIpRestriction"
                checked={settings.enableIpRestriction}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableIpRestriction" className="ml-2 block text-sm font-medium text-gray-700">
                Enable IP Restrictions
              </label>
            </div>
          </div>
          
          <div className={settings.enableIpRestriction ? '' : 'opacity-50'}>
            <div className="mb-2">
              <label htmlFor="allowedIpAddresses" className="block text-sm font-medium text-gray-700 mb-1">
                Allowed IP Addresses
              </label>
              <textarea
                id="allowedIpAddresses"
                name="allowedIpAddresses"
                value={settings.allowedIpAddresses}
                onChange={handleChange}
                disabled={!settings.enableIpRestriction}
                placeholder="Enter IP addresses, one per line (e.g., 192.168.1.1, 10.0.0.0/24)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter IP addresses or CIDR ranges, one per line
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning: IP Restriction</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Be careful when configuring IP restrictions. If you restrict access to specific IPs and your IP changes, you may lock yourself out of the admin panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logging */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Logging</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="logLogins"
                name="logLogins"
                checked={settings.logLogins}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="logLogins" className="ml-2 block text-sm text-gray-700">
                Log successful logins
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="logFailedLogins"
                name="logFailedLogins"
                checked={settings.logFailedLogins}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="logFailedLogins" className="ml-2 block text-sm text-gray-700">
                Log failed login attempts
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="logAdminActions"
                name="logAdminActions"
                checked={settings.logAdminActions}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="logAdminActions" className="ml-2 block text-sm text-gray-700">
                Log admin actions
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="logDataChanges"
                name="logDataChanges"
                checked={settings.logDataChanges}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="logDataChanges" className="ml-2 block text-sm text-gray-700">
                Log data changes
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="retentionPeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Log Retention Period (days)
            </label>
            <input
              type="number"
              id="retentionPeriod"
              name="retentionPeriod"
              value={settings.retentionPeriod}
              onChange={handleChange}
              min={1}
              max={3650}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              How long to keep audit logs before automatic deletion
            </p>
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

export default SecuritySettings;