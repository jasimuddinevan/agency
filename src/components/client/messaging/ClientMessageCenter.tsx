import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useMessaging } from '../../../hooks/useMessaging';
import MessageDisplay from './MessageDisplay';
import ClientMessageComposer from './ClientMessageComposer';
import NotificationBadge from './NotificationBadge';

const ClientMessageCenter: React.FC = () => {
  const {
    messages,
    stats,
    loading,
    sendMessage,
    markAsRead,
    refreshData
  } = useMessaging();

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'compose'>('messages');

  const handleMessageClick = async (messageId: string) => {
    setSelectedMessage(messageId);
    const message = messages.find(m => m.id === messageId);
    if (message && !message.is_read) {
      await markAsRead(messageId);
    }
  };

  const handleNewMessage = () => {
    setActiveTab('compose');
    setShowComposer(true);
  };

  const handleMessageSent = () => {
    setShowComposer(false);
    setActiveTab('messages');
    refreshData();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-600">Communicate with our support team</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBadge count={stats.unread_messages} />
            <button
              onClick={handleNewMessage}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Message
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="text-lg font-bold text-blue-900">{stats.total_messages}</div>
                <div className="text-xs text-blue-600">Total Messages</div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <div className="text-lg font-bold text-red-900">{stats.unread_messages}</div>
                <div className="text-xs text-red-600">Unread</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Messages Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600 mb-4">Start a conversation with our support team</p>
                <button
                  onClick={handleNewMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Send First Message
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={() => handleMessageClick(message.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      selectedMessage === message.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                    } ${!message.is_read ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {message.sender_id !== message.receiver_id ? (
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <ShieldCheckIcon className="h-5 w-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${!message.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.sender?.full_name || 'Support Team'}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {!message.is_read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                        </div>

                        <h5 className={`text-sm mt-1 ${!message.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {message.subject}
                        </h5>

                        <p className="text-sm text-gray-600 mt-1">
                          {truncateContent(message.content)}
                        </p>

                        {message.message_type === 'broadcast' && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            Announcement
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'compose' || showComposer ? (
              <motion.div
                key="composer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ClientMessageComposer
                  onMessageSent={handleMessageSent}
                  onCancel={() => {
                    setShowComposer(false);
                    setActiveTab('messages');
                  }}
                />
              </motion.div>
            ) : selectedMessageData ? (
              <motion.div
                key="message"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <MessageDisplay
                  message={selectedMessageData}
                  onReply={() => setShowComposer(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center bg-gray-50"
              >
                <div className="text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
                  <p className="text-gray-600 mb-6">Choose a message from the sidebar to read it</p>
                  <button
                    onClick={handleNewMessage}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Start New Conversation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClientMessageCenter;