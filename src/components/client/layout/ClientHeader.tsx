import React from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { ClientUser } from '../../../types/client';

interface ClientHeaderProps {
  title: string;
  subtitle?: string;
  isCollapsed: boolean;
  user?: ClientUser;
  notifications?: number;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({
  title,
  subtitle,
  isCollapsed,
  user,
  notifications = 0
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white shadow-sm border-b border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-64'
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
              />
            </div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <BellIcon className="h-6 w-6" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {notifications > 9 ? '9+' : notifications}
                </motion.span>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </motion.button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.full_name || 'Client User'}
                </p>
                <p className="text-xs text-gray-600">
                  {user?.email || 'client@example.com'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-6 w-6 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ClientHeader;