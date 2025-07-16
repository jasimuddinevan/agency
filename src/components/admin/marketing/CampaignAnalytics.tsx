import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  ChartBarIcon,
  EnvelopeIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../../lib/supabase';
import { EmailCampaign, CampaignAnalytics as AnalyticsType, CampaignRecipient } from '../../../types/marketing';

interface CampaignAnalyticsProps {
  campaigns: EmailCampaign[];
  isModal?: boolean;
  onClose?: () => void;
}

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({
  campaigns,
  isModal = false,
  onClose
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsType[]>([]);
  const [recipients, setRecipients] = useState<CampaignRecipient[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (campaigns.length > 0) {
      setSelectedCampaign(campaigns[0].id);
      fetchAnalytics();
    }
  }, [campaigns]);

  useEffect(() => {
    if (selectedCampaign) {
      fetchRecipients(selectedCampaign);
    }
  }, [selectedCampaign]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const analyticsData: AnalyticsType[] = [];

      for (const campaign of campaigns) {
        const { data: recipientData, error } = await supabase
          .from('campaign_recipients')
          .select('*')
          .eq('campaign_id', campaign.id);

        if (error) throw error;

        const recipients = recipientData || [];
        const sentCount = recipients.filter(r => r.status === 'sent' || r.status === 'delivered' || r.status === 'opened' || r.status === 'clicked').length;
        const deliveredCount = recipients.filter(r => r.status === 'delivered' || r.status === 'opened' || r.status === 'clicked').length;
        const openedCount = recipients.filter(r => r.status === 'opened' || r.status === 'clicked').length;
        const clickedCount = recipients.filter(r => r.status === 'clicked').length;
        const bouncedCount = recipients.filter(r => r.status === 'bounced').length;
        const failedCount = recipients.filter(r => r.status === 'failed').length;

        analyticsData.push({
          campaign_id: campaign.id,
          total_recipients: recipients.length,
          sent_count: sentCount,
          delivered_count: deliveredCount,
          opened_count: openedCount,
          clicked_count: clickedCount,
          bounced_count: bouncedCount,
          failed_count: failedCount,
          open_rate: sentCount > 0 ? (openedCount / sentCount) * 100 : 0,
          click_rate: sentCount > 0 ? (clickedCount / sentCount) * 100 : 0,
          bounce_rate: sentCount > 0 ? (bouncedCount / sentCount) * 100 : 0,
          delivery_rate: recipients.length > 0 ? (deliveredCount / recipients.length) * 100 : 0,
          engagement_over_time: [] // This would require more complex time-based queries
        });
      }

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipients = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('campaign_recipients')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'opened':
        return <EyeIcon className="h-4 w-4 text-blue-500" />;
      case 'clicked':
        return <CursorArrowRaysIcon className="h-4 w-4 text-purple-500" />;
      case 'bounced':
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <EnvelopeIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'opened':
        return 'bg-blue-100 text-blue-800';
      case 'clicked':
        return 'bg-purple-100 text-purple-800';
      case 'bounced':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedAnalytics = analytics.find(a => a.campaign_id === selectedCampaign);
  const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);

  const AnalyticsContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Analytics</h2>
          <p className="text-gray-600 mt-1">Detailed performance metrics for your email campaigns</p>
        </div>
        {campaigns.length > 1 && (
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      ) : selectedAnalytics && selectedCampaignData ? (
        <>
          {/* Campaign Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCampaignData.name}</h3>
                <p className="text-gray-600">{selectedCampaignData.subject}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Status</div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedCampaignData.status === 'sent' ? 'bg-green-100 text-green-800' :
                  selectedCampaignData.status === 'sending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedCampaignData.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedCampaignData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedAnalytics.sent_count}</p>
                  <p className="text-xs text-gray-500">
                    {selectedAnalytics.delivery_rate.toFixed(1)}% delivery rate
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <EyeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Opened</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedAnalytics.opened_count}</p>
                  <p className="text-xs text-gray-500">
                    {selectedAnalytics.open_rate.toFixed(1)}% open rate
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <CursorArrowRaysIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Clicked</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedAnalytics.clicked_count}</p>
                  <p className="text-xs text-gray-500">
                    {selectedAnalytics.click_rate.toFixed(1)}% click rate
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Bounced</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedAnalytics.bounced_count}</p>
                  <p className="text-xs text-gray-500">
                    {selectedAnalytics.bounce_rate.toFixed(1)}% bounce rate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Engagement Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${selectedAnalytics.delivery_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedAnalytics.delivery_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Opened</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${selectedAnalytics.open_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedAnalytics.open_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Clicked</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${selectedAnalytics.click_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedAnalytics.click_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bounced</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${selectedAnalytics.bounce_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedAnalytics.bounce_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Campaign Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Recipients:</span>
                    <span className="font-medium">{selectedAnalytics.total_recipients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Successfully Sent:</span>
                    <span className="font-medium">{selectedAnalytics.sent_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failed/Bounced:</span>
                    <span className="font-medium">{selectedAnalytics.failed_count + selectedAnalytics.bounced_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engagement Rate:</span>
                    <span className="font-medium">
                      {selectedAnalytics.sent_count > 0 
                        ? (((selectedAnalytics.opened_count + selectedAnalytics.clicked_count) / selectedAnalytics.sent_count) * 100).toFixed(1)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipients Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recipients Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opened At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicked At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recipients.map((recipient) => (
                    <tr key={recipient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{recipient.recipient_name}</div>
                          <div className="text-sm text-gray-500">{recipient.recipient_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(recipient.status)}
                          <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(recipient.status)}`}>
                            {recipient.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(recipient.sent_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(recipient.opened_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(recipient.clicked_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-600">Send some campaigns to see analytics here</p>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Campaign Analytics</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <AnalyticsContent />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return <AnalyticsContent />;
};

export default CampaignAnalytics;