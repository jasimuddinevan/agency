import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { EmailTemplate, EmailCampaign, MarketingStats } from '../../../types/marketing';
import CampaignComposer from './CampaignComposer';
import TemplateManager from './TemplateManager';
import CampaignAnalytics from './CampaignAnalytics';
import AutomationWorkflows from './AutomationWorkflows';

interface MarketingDashboardProps {
  isLoading?: boolean;
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [stats, setStats] = useState<MarketingStats>({
    total_campaigns: 0,
    active_campaigns: 0,
    total_sent: 0,
    total_opened: 0,
    total_clicked: 0,
    average_open_rate: 0,
    average_click_rate: 0,
    recent_campaigns: []
  });
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'campaigns', label: 'Campaigns', icon: EnvelopeIcon },
    { id: 'templates', label: 'Templates', icon: DocumentTextIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'automation', label: 'Automation', icon: CogIcon }
  ];

  useEffect(() => {
    if (!isLoading) {
      fetchMarketingData();
    }
  }, [isLoading]);

  const fetchMarketingData = async () => {
    setDataLoading(true);
    try {
      await Promise.all([
        fetchCampaigns(),
        fetchTemplates(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching marketing data:', error);
      toast.error('Failed to load marketing data');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setCampaigns(data || []);
  };

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setTemplates(data || []);
  };

  const fetchStats = async () => {
    const { data: campaignStats, error } = await supabase
      .from('email_campaigns')
      .select('*');

    if (error) throw error;

    const totalCampaigns = campaignStats?.length || 0;
    const activeCampaigns = campaignStats?.filter(c => c.status === 'sending' || c.status === 'scheduled').length || 0;
    const totalSent = campaignStats?.reduce((sum, c) => sum + (c.sent_count || 0), 0) || 0;
    const totalOpened = campaignStats?.reduce((sum, c) => sum + (c.opened_count || 0), 0) || 0;
    const totalClicked = campaignStats?.reduce((sum, c) => sum + (c.clicked_count || 0), 0) || 0;

    setStats({
      total_campaigns: totalCampaigns,
      active_campaigns: activeCampaigns,
      total_sent: totalSent,
      total_opened: totalOpened,
      total_clicked: totalClicked,
      average_open_rate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
      average_click_rate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
      recent_campaigns: campaignStats?.slice(0, 5) || []
    });
  };

  const handleCampaignAction = async (campaignId: string, action: 'send' | 'pause' | 'resume' | 'delete') => {
    try {
      switch (action) {
        case 'send':
          await supabase
            .from('email_campaigns')
            .update({ status: 'sending', sent_at: new Date().toISOString() })
            .eq('id', campaignId);
          toast.success('Campaign sent successfully!');
          break;
        case 'pause':
          await supabase
            .from('email_campaigns')
            .update({ status: 'draft' })
            .eq('id', campaignId);
          toast.success('Campaign paused');
          break;
        case 'resume':
          await supabase
            .from('email_campaigns')
            .update({ status: 'scheduled' })
            .eq('id', campaignId);
          toast.success('Campaign resumed');
          break;
        case 'delete':
          await supabase
            .from('email_campaigns')
            .delete()
            .eq('id', campaignId);
          toast.success('Campaign deleted');
          break;
      }
      await fetchCampaigns();
      await fetchStats();
    } catch (error) {
      console.error('Campaign action error:', error);
      toast.error(`Failed to ${action} campaign`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || dataLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage email campaigns, templates, and automation</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplateManager(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Templates
          </button>
          <button
            onClick={() => setShowComposer(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_campaigns}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <PlayIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Active Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active_campaigns}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_sent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Avg. Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.average_open_rate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Campaigns */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recent_campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.subject}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {campaign.total_recipients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {campaign.sent_count > 0 ? ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(campaign.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedCampaign(campaign)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {campaign.status === 'draft' && (
                              <button
                                onClick={() => handleCampaignAction(campaign.id, 'send')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <PlayIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleCampaignAction(campaign.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'campaigns' && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">All Campaigns</h3>
                  <button
                    onClick={() => setShowComposer(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Campaign
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.subject}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {campaign.total_recipients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Opens: {campaign.opened_count} ({campaign.sent_count > 0 ? ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1) : 0}%)
                          </div>
                          <div className="text-sm text-gray-500">
                            Clicks: {campaign.clicked_count} ({campaign.sent_count > 0 ? ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1) : 0}%)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {campaign.scheduled_at ? formatDate(campaign.scheduled_at) : 'Not scheduled'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedCampaign(campaign)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowComposer(true)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            {campaign.status === 'draft' && (
                              <button
                                onClick={() => handleCampaignAction(campaign.id, 'send')}
                                className="text-green-600 hover:text-green-900"
                                title="Send Now"
                              >
                                <PlayIcon className="h-4 w-4" />
                              </button>
                            )}
                            {campaign.status === 'scheduled' && (
                              <button
                                onClick={() => handleCampaignAction(campaign.id, 'pause')}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Pause"
                              >
                                <PauseIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleCampaignAction(campaign.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TemplateManager
              templates={templates}
              onTemplateChange={fetchTemplates}
            />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CampaignAnalytics campaigns={campaigns} />
          </motion.div>
        )}

        {activeTab === 'automation' && (
          <motion.div
            key="automation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AutomationWorkflows templates={templates} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showComposer && (
        <CampaignComposer
          isOpen={showComposer}
          onClose={() => setShowComposer(false)}
          templates={templates}
          onCampaignCreated={() => {
            fetchCampaigns();
            fetchStats();
          }}
        />
      )}

      {showTemplateManager && (
        <TemplateManager
          templates={templates}
          onTemplateChange={fetchTemplates}
          isModal={true}
          onClose={() => setShowTemplateManager(false)}
        />
      )}

      {selectedCampaign && (
        <CampaignAnalytics
          campaigns={[selectedCampaign]}
          isModal={true}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
};

export default MarketingDashboard;