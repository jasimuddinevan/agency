import React from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { ClientStats } from '../../../types/client';

interface OverviewStatsProps {
  stats: ClientStats;
  isLoading?: boolean;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ stats, isLoading = false }) => {
  const statItems = [
    {
      name: 'Total Services',
      value: stats.total_services,
      icon: BriefcaseIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Active Services',
      value: stats.active_services,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Unread Messages',
      value: stats.unread_messages,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      name: 'Upcoming Payments',
      value: stats.upcoming_payments,
      icon: CreditCardIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      name: 'Total Spent',
      value: `$${stats.total_spent.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      name: 'Account Status',
      value: stats.account_status,
      icon: ShieldCheckIcon,
      color: stats.account_status === 'active' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600',
      bgColor: stats.account_status === 'active' ? 'bg-green-50' : 'bg-red-50',
      textColor: stats.account_status === 'active' ? 'text-green-600' : 'text-red-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="text-2xl font-bold text-gray-900 capitalize"
              >
                {item.value}
              </motion.p>
            </div>
            <div className={`${item.bgColor} p-3 rounded-lg`}>
              <item.icon className={`h-6 w-6 ${item.textColor}`} />
            </div>
          </div>
          
          {/* Status indicator for account status */}
          {item.name === 'Account Status' && (
            <div className="mt-4">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stats.account_status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : stats.account_status === 'suspended'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  stats.account_status === 'active' 
                    ? 'bg-green-500' 
                    : stats.account_status === 'suspended'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}></div>
                {stats.account_status === 'active' ? 'All systems operational' : 
                 stats.account_status === 'suspended' ? 'Account suspended' : 'Pending verification'}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewStats;