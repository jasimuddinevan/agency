import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { useClientData } from '../hooks/useClientData';
import toast from 'react-hot-toast';

// Import client components
import ClientSidebar from '../components/client/layout/ClientSidebar';
import ClientHeader from '../components/client/layout/ClientHeader';
import OverviewStats from '../components/client/overview/OverviewStats';
import ActivityTimeline from '../components/client/overview/ActivityTimeline';
import ServicesList from '../components/client/services/ServicesList';
import MessagesList from '../components/client/messages/MessagesList';
import ProfileSettings from '../components/client/profile/ProfileSettings';

// Import types
import {
  ClientProfile,
  ClientNotificationSettings
} from '../types/client';

const ClientDashboardPage: React.FC = () => {
  const { user, clientProfile, loading: authLoading } = useClientAuth();
  const { 
    services, 
    messages, 
    activities, 
    stats, 
    loading: dataLoading,
    updateService,
    sendMessage,
    markMessageAsRead,
    logActivity
  } = useClientData();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [notificationSettings] = useState<ClientNotificationSettings>({
    email_notifications: true,
    sms_notifications: false,
    service_updates: true,
    billing_reminders: true,
    marketing_emails: false
  });

  // Event handlers
  const handleServiceAction = async (serviceId: string, action: 'pause' | 'resume' | 'cancel' | 'renew') => {
    try {
      // In a real app, this would make an API call
      toast.success(`Service ${action} request submitted successfully!`);
    } catch (error) {
      toast.error(`Failed to ${action} service. Please try again.`);
    }
  };

  const handleMessageClick = async (message: any) => {
    // In a real app, this would open a message detail view or mark as read
    if (!message.is_read) {
      await markMessageAsRead(message.id);
    }
  };

  const handleNewMessage = () => {
    // In a real app, this would open a compose message modal
    toast.success('Compose message feature coming soon!');
  };

  const handleUpdateProfile = async (updatedProfile: any) => {
    try {
      // In a real app, this would make an API call
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleUpdateNotifications = async (settings: ClientNotificationSettings) => {
    try {
      // In a real app, this would make an API call
      toast.success('Notification settings updated!');
    } catch (error) {
      toast.error('Failed to update notification settings.');
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // In a real app, this would make an API call
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    }
  };

  const handleSignOut = () => {
    // This will be handled by the auth context
  };

  // Get page info based on active tab
  const getPageInfo = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Dashboard Overview',
          subtitle: 'Welcome back! Here\'s what\'s happening with your services.'
        };
      case 'messages':
        return {
          title: 'Messages',
          subtitle: 'Communicate with our support team'
        };
      case 'services':
        return {
          title: 'My Services',
          subtitle: 'Manage your active services and subscriptions'
        };
      case 'profile':
        return {
          title: 'Profile',
          subtitle: 'Manage your account information'
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Configure your account preferences'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to your client portal'
        };
    }
  };

  const pageInfo = getPageInfo();
  const unreadMessages = messages.filter(m => !m.is_read).length;

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated or no profile
  if (!user || !clientProfile) {
    return <Navigate to="/client_area/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ClientSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={handleSignOut}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        unreadMessages={unreadMessages}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ClientHeader
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          isCollapsed={isCollapsed}
          user={clientProfile}
          notifications={3}
        />

        {/* Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Stats */}
                <OverviewStats stats={stats} isLoading={dataLoading} />

                {/* Activity Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ActivityTimeline activities={activities} isLoading={dataLoading} />
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setActiveTab('messages')}
                          className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">View Messages</span>
                            {unreadMessages > 0 && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                {unreadMessages}
                              </span>
                            )}
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab('services')}
                          className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200"
                        >
                          <span className="font-medium">Manage Services</span>
                        </button>
                        <button
                          onClick={handleNewMessage}
                          className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                        >
                          <span className="font-medium">Contact Support</span>
                        </button>
                      </div>
                    </motion.div>

                    {/* Upcoming Payments */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">Website Management</div>
                            <div className="text-sm text-gray-600">Due Feb 1, 2024</div>
                          </div>
                          <div className="text-lg font-bold text-gray-900">$99</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MessagesList
                  messages={messages}
                  onMessageClick={handleMessageClick}
                  onNewMessage={handleNewMessage}
                  isLoading={dataLoading}
                />
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ServicesList
                  services={services}
                  onServiceAction={handleServiceAction}
                  isLoading={dataLoading}
                />
              </motion.div>
            )}

            {(activeTab === 'profile' || activeTab === 'settings') && (
              <motion.div
                key="profile-settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileSettings
                  profile={clientProfile}
                  notificationSettings={notificationSettings}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateNotifications={handleUpdateNotifications}
                  onChangePassword={handleChangePassword}
                  isLoading={dataLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboardPage;