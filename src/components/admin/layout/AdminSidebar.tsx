import React from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  UserGroupIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { NavigationItem } from '../../../types/admin';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onSignOut,
  isCollapsed,
  onToggleCollapse
}) => {
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'applications', name: 'Applications', icon: DocumentTextIcon },
    { id: 'marketing', name: 'Marketing', icon: MegaphoneIcon },
    { id: 'users', name: 'Users', icon: UserGroupIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white shadow-lg h-screen fixed left-0 top-0 z-40 border-r border-gray-200"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-gray-900"
            >
              GrowthPro Admin
            </motion.h1>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center px-3 py-3 text-left transition-all duration-200 rounded-lg group ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon 
                className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                  activeTab === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                }`} 
              />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 font-medium"
                >
                  {item.name}
                </motion.span>
              )}
              
              {/* Active indicator */}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 w-full p-3 border-t border-gray-200">
        <motion.button
          onClick={onSignOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg group"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-medium"
            >
              Sign Out
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg">
            Navigation
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminSidebar;