import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  ClientUser,
  ClientStats,
  ClientActivity,
  ClientService,
  ClientMessage,
  ClientProfile,
  ClientNotificationSettings
} from '../types/client';

const ClientDashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - In a real app, this would come from API calls
  const [clientUser] = useState<ClientUser>({
    id: '1',
    email: 'client@example.com',
    full_name: 'John Doe',
    phone: '+1 (555) 123-4567',
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2024-01-15T10:30:00Z'
  });

  const [stats] = useState<ClientStats>({
    total_services: 3,
    active_services: 2,
    unread_messages: 2,
    upcoming_payments: 1,
    total_spent: 2450,
    account_status: 'active'
  });

  const [activities] = useState<ClientActivity[]>([
    {
      id: '1',
      type: 'service_update',
      title: 'Website Security Update',
      description: 'Your website security has been updated with the latest patches.',
      created_at: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      type: 'message_received',
      title: 'New Message from Support',
      description: 'You have received a new message regarding your Facebook Ads campaign.',
      created_at: '2024-01-14T16:30:00Z'
    },
    {
      id: '3',
      type: 'payment_processed',
      title: 'Payment Processed',
      description: 'Your monthly payment of $299 has been successfully processed.',
      created_at: '2024-01-13T08:15:00Z'
    },
    {
      id: '4',
      type: 'report_generated',
      title: 'Monthly Report Available',
      description: 'Your December performance report is now available for download.',
      created_at: '2024-01-12T12:00:00Z'
    }
  ]);

  const [services] = useState<ClientService[]>([
    {
      id: '1',
      name: 'Website Management & Security',
      type: 'web-management',
      status: 'active',
      plan: 'premium',
      price: 99,
      billing_cycle: 'monthly',
      start_date: '2023-12-01T00:00:00Z',
      next_billing_date: '2024-02-01T00:00:00Z',
      features: [
        '24/7 website monitoring',
        'Daily backups',
        'Advanced security protection',
        'Performance optimization',
        'Priority support',
        'Monthly reports'
      ],
      metrics: {
        uptime: '99.9%',
        performance_score: 95,
        conversions: undefined,
        revenue_generated: undefined
      }
    },
    {
      id: '2',
      name: 'Facebook Ads Management',
      type: 'facebook-ads',
      status: 'active',
      plan: 'premium',
      price: 399,
      billing_cycle: 'monthly',
      start_date: '2023-11-15T00:00:00Z',
      next_billing_date: '2024-02-15T00:00:00Z',
      features: [
        'Advanced audience targeting',
        'Custom ad creatives',
        'A/B testing',
        '24/7 campaign monitoring',
        'Weekly optimization',
        'Detailed analytics'
      ],
      metrics: {
        uptime: undefined,
        performance_score: undefined,
        conversions: 156,
        revenue_generated: 12500
      }
    },
    {
      id: '3',
      name: 'Shopify Store Optimization',
      type: 'shopify-growth',
      status: 'paused',
      plan: 'basic',
      price: 149,
      billing_cycle: 'monthly',
      start_date: '2023-10-01T00:00:00Z',
      next_billing_date: '2024-03-01T00:00:00Z',
      features: [
        'Store setup & optimization',
        'Product listing optimization',
        'Basic inventory management',
        'Monthly performance review',
        'Email support'
      ]
    }
  ]);

  const [messages] = useState<ClientMessage[]>([
    {
      id: '1',
      sender_id: 'admin-1',
      sender_name: 'Sarah Johnson',
      sender_type: 'admin',
      subject: 'Facebook Ads Campaign Update',
      content: 'Hi John, I wanted to update you on your Facebook ads campaign performance. We\'ve seen a 25% increase in conversions this month...',
      is_read: false,
      created_at: '2024-01-14T16:30:00Z'
    },
    {
      id: '2',
      sender_id: 'admin-2',
      sender_name: 'Mike Chen',
      sender_type: 'admin',
      subject: 'Website Security Update Complete',
      content: 'Your website security update has been completed successfully. All systems are running smoothly...',
      is_read: false,
      created_at: '2024-01-13T10:15:00Z'
    },
    {
      id: '3',
      sender_id: 'client-1',
      sender_name: 'John Doe',
      sender_type: 'client',
      subject: 'Question about Shopify Integration',
      content: 'I have a question about integrating a new payment gateway with my Shopify store...',
      is_read: true,
      created_at: '2024-01-12T14:20:00Z'
    }
  ]);

  const [profile] = useState<ClientProfile>({
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Doe Enterprises',
    website: 'https://doeenterprises.com',
    address: '123 Business Ave, Suite 100\nNew York, NY 10001',
    timezone: 'UTC-05:00',
    language: 'en'
  });

  const [notificationSettings] = useState<ClientNotificationSettings>({
    email_notifications: true,
    sms_notifications: false,
    service_updates: true,
    billing_reminders: true,
    marketing_emails: false
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Event handlers
  const handleServiceAction = async (serviceId: string, action: 'pause' | 'resume' | 'cancel' | 'renew') => {
    try {
      // In a real app, this would make an API call
      toast.success(`Service ${action} request submitted successfully!`);
    } catch (error) {
      toast.error(`Failed to ${action} service. Please try again.`);
    }
  };

  const handleMessageClick = (message: ClientMessage) => {
    // In a real app, this would open a message detail view or mark as read
    console.log('Message clicked:', message);
  };

  const handleNewMessage = () => {
    // In a real app, this would open a compose message modal
    toast.success('Compose message feature coming soon!');
  };

  const handleUpdateProfile = async (updatedProfile: Partial<ClientProfile>) => {
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
    // In a real app, this would sign out the user
    toast.success('Signed out successfully!');
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // In a real app, you'd check if the user is authenticated and has client access
  if (!user) {
    return <Navigate to="/admin/login" replace />;
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
          user={clientUser}
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
                <OverviewStats stats={stats} isLoading={false} />

                {/* Activity Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ActivityTimeline activities={activities} isLoading={false} />
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
                  isLoading={false}
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
                  isLoading={false}
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
                  profile={profile}
                  notificationSettings={notificationSettings}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateNotifications={handleUpdateNotifications}
                  onChangePassword={handleChangePassword}
                  isLoading={false}
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