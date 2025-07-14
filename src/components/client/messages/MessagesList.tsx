import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  PaperClipIcon,
  CalendarIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { ClientMessage } from '../../../types/client';

interface MessagesListProps {
  messages: ClientMessage[];
  isLoading?: boolean;
  onMessageClick?: (message: ClientMessage) => void;
  onNewMessage?: () => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isLoading = false,
  onMessageClick,
  onNewMessage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !message.is_read) ||
                         (filter === 'read' && message.is_read);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewMessage}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Message
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-40">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <EnvelopeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filter !== 'all' ? 'No messages found' : 'No messages yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start a conversation with our support team'
                }
              </p>
              {(!searchTerm && filter === 'all') && (
                <button
                  onClick={onNewMessage}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Send Your First Message
                </button>
              )}
            </div>
          ) : (
            filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onClick={() => onMessageClick?.(message)}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  !message.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Sender Avatar */}
                  <div className="flex-shrink-0">
                    {message.sender_type === 'admin' ? (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <ShieldCheckIcon className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-sm font-medium ${!message.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.sender_name}
                        </h4>
                        {message.sender_type === 'admin' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Support Team
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {!message.is_read ? (
                          <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <EnvelopeOpenIcon className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                    </div>

                    <h5 className={`text-sm mt-1 ${!message.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {message.subject}
                    </h5>

                    <p className="text-sm text-gray-600 mt-1">
                      {truncateContent(message.content)}
                    </p>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex items-center mt-2">
                        <PaperClipIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {filteredMessages.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredMessages.length} of {messages.length} messages
            </span>
            <div className="flex items-center space-x-4">
              <span>
                {messages.filter(m => !m.is_read).length} unread
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MessagesList;