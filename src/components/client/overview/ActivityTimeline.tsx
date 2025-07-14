import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { ClientActivity } from '../../../types/client';

interface ActivityTimelineProps {
  activities: ClientActivity[];
  isLoading?: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, isLoading = false }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'service_update':
        return CheckCircleIcon;
      case 'message_received':
        return ChatBubbleLeftRightIcon;
      case 'payment_processed':
        return CreditCardIcon;
      case 'report_generated':
        return DocumentTextIcon;
      default:
        return ClockIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'service_update':
        return 'text-green-600 bg-green-100';
      case 'message_received':
        return 'text-blue-600 bg-blue-100';
      case 'payment_processed':
        return 'text-purple-600 bg-purple-100';
      case 'report_generated':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type);
            const colorClasses = getActivityColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-start space-x-4"
              >
                <div className={`p-2 rounded-full ${colorClasses}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(activity.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  
                  {/* Additional metadata */}
                  {activity.metadata && (
                    <div className="mt-2 text-xs text-gray-500">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <span key={key} className="mr-4">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
            View all activity
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityTimeline;