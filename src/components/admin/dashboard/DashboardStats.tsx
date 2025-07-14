import React from 'react';
import { motion } from 'framer-motion';
import {
  DocumentDuplicateIcon,
  DocumentTextIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { DashboardStats as StatsType } from '../../../types/admin';

interface DashboardStatsProps {
  stats: StatsType;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading = false }) => {
  const statItems = [
    {
      name: 'Total Applications',
      value: stats.total,
      icon: DocumentDuplicateIcon,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600'
    },
    {
      name: 'New',
      value: stats.new,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'In Progress',
      value: stats.in_progress,
      icon: ClockIcon,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Contacted',
      value: stats.contacted,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      name: 'Approved',
      value: stats.approved,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Rejected',
      value: stats.rejected,
      icon: XCircleIcon,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -2, scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{item.name}</p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5, type: "spring" }}
                className="text-3xl font-bold text-gray-900"
              >
                {item.value}
              </motion.p>
            </div>
            <div className={`${item.bgColor} p-3 rounded-lg`}>
              <item.icon className={`h-6 w-6 ${item.textColor}`} />
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.total > 0 ? (item.value / stats.total) * 100 : 0}%` }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                className={`bg-gradient-to-r ${item.color} h-1 rounded-full`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}% of total
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;