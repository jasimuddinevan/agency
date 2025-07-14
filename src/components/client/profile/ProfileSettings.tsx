import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  UserCircleIcon,
  CameraIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { ClientProfile, ClientNotificationSettings } from '../../../types/client';

interface ProfileSettingsProps {
  profile: ClientProfile;
  notificationSettings: ClientNotificationSettings;
  onUpdateProfile: (profile: Partial<ClientProfile>) => Promise<void>;
  onUpdateNotifications: (settings: ClientNotificationSettings) => Promise<void>;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading?: boolean;
}

const profileSchema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  company: yup.string().required('Company name is required'),
  website: yup.string().url('Please enter a valid URL'),
  address: yup.string().required('Address is required'),
  timezone: yup.string().required('Please select a timezone'),
  language: yup.string().required('Please select a language')
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password')
});

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  notificationSettings,
  onUpdateProfile,
  onUpdateNotifications,
  onChangePassword,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: profile
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema)
  });

  const [localNotificationSettings, setLocalNotificationSettings] = useState(notificationSettings);

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'password', label: 'Password & Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'preferences', label: 'Preferences' }
  ];

  const timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00',
    'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00',
    'UTC-02:00', 'UTC-01:00', 'UTC+00:00', 'UTC+01:00', 'UTC+02:00',
    'UTC+03:00', 'UTC+04:00', 'UTC+05:00', 'UTC+06:00', 'UTC+07:00',
    'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ];

  const onProfileSubmit = async (data: ClientProfile) => {
    await onUpdateProfile(data);
  };

  const onPasswordSubmit = async (data: { currentPassword: string; newPassword: string }) => {
    await onChangePassword(data.currentPassword, data.newPassword);
    passwordForm.reset();
  };

  const handleNotificationChange = (key: keyof ClientNotificationSettings, value: boolean) => {
    const updated = { ...localNotificationSettings, [key]: value };
    setLocalNotificationSettings(updated);
    onUpdateNotifications(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-12 w-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CameraIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-600">Update your profile picture</p>
              </div>
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...profileForm.register('full_name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {profileForm.formState.errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...profileForm.register('email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...profileForm.register('phone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {profileForm.formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    {...profileForm.register('company')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {profileForm.formState.errors.company && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.company.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    {...profileForm.register('website')}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {profileForm.formState.errors.website && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.website.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone *
                  </label>
                  <select
                    {...profileForm.register('timezone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                  {profileForm.formState.errors.timezone && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.timezone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language *
                  </label>
                  <select
                    {...profileForm.register('language')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                  {profileForm.formState.errors.language && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.language.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    {...profileForm.register('address')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  {profileForm.formState.errors.address && (
                    <p className="mt-1 text-sm text-red-600">{profileForm.formState.errors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
          </motion.div>
        )}

        {/* Password & Security Tab */}
        {activeTab === 'password' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    {...passwordForm.register('currentPassword')}
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    {...passwordForm.register('newPassword')}
                    type={showNewPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    {...passwordForm.register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose how you want to receive notifications about your services and account.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  key: 'email_notifications' as keyof ClientNotificationSettings,
                  title: 'Email Notifications',
                  description: 'Receive notifications via email'
                },
                {
                  key: 'sms_notifications' as keyof ClientNotificationSettings,
                  title: 'SMS Notifications',
                  description: 'Receive notifications via text message'
                },
                {
                  key: 'service_updates' as keyof ClientNotificationSettings,
                  title: 'Service Updates',
                  description: 'Get notified about service status changes and updates'
                },
                {
                  key: 'billing_reminders' as keyof ClientNotificationSettings,
                  title: 'Billing Reminders',
                  description: 'Receive reminders about upcoming payments and invoices'
                },
                {
                  key: 'marketing_emails' as keyof ClientNotificationSettings,
                  title: 'Marketing Emails',
                  description: 'Receive promotional emails and newsletters'
                }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{setting.title}</h4>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localNotificationSettings[setting.key]}
                      onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Preferences</h3>
              <p className="text-sm text-gray-600 mb-6">
                Customize your account settings and preferences.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-700 mb-4">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div className="space-y-3">
                  <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                    Deactivate Account
                  </button>
                  <button className="w-full sm:w-auto px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors duration-200 ml-0 sm:ml-3">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileSettings;