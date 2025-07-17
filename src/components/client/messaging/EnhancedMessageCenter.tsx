import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from 'lucide-react';
import { useEnhancedMessaging } from '../../../hooks/useEnhancedMessaging';
import EnhancedMessageComposer from './EnhancedMessageComposer';
import EnhancedMessageThread from './EnhancedMessageThread';
import { EnhancedMessage, MessageThread } from '../../../types/messaging-enhanced';

const EnhancedMessageCenter: React.FC = () => {
  const {
    messages,
    threads,
    currentThread,
    stats,
    rateLimit,
    loading,
    error,
    sendMessage,
    markAsRead,
    getThread,
    setCurrentThread,
    refreshData
  } = useEnhancedMessaging();

  const [searchTerm, setSearchTerm] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter threads based on search term
  const filteredThreads = threads.filter(thread =>
    thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.messages.some(msg => 
      msg.message_body.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleThreadSelect = async (threadId: string) => {
    setSelectedThreadId(threadId);
    await getThread(threadId);
  };

  const handleNewMessage = () => {
    setShowComposer(true);
    setSelectedThreadId(null);
    setCurrentThread(null);
  };

  const handleMessageSent = () => {
    setShowComposer(false);
    refreshData();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">High</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Low</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Normal</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Message Center</h2>
              <p className="text-sm text-gray-600">Communicate with our support team</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {stats.unread > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.unread} unread
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Refresh messages"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleNewMessage}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Message
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="text-lg font-bold text-blue-900">{stats.total}</div>
                <div className="text-xs text-blue-600">Total Messages</div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <div className="text-lg font-bold text-red-900">{stats.unread}</div>
                <div className="text-xs text-red-600">Unread</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <div className="text-lg font-bold text-green-900">{stats.sent}</div>
                <div className="text-xs text-green-600">Sent</div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <div className="text-lg font-bold text-purple-900">{stats.threads}</div>
                <div className="text-xs text-purple-600">Conversations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limit Info */}
        {rateLimit && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <div className="flex items-center text-yellow-800">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>
                Message limit: {rateLimit.remaining} of 10 remaining this hour
                {rateLimit.remaining === 0 && (
                  <span className="ml-2 font-medium">
                    (Resets at {new Date(rateLimit.reset_at).toLocaleTimeString()})
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-[calc(100%-200px)]">
        {/* Messages Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
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

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto">
            {loading && threads.length === 0 ? (
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
            ) : filteredThreads.length === 0 ? (
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
                {filteredThreads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleThreadSelect(thread.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      selectedThreadId === thread.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                    } ${thread.unreadCount > 0 ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {thread.lastMessage.sender_id !== thread.lastMessage.recipient_id ? (
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
                          <h4 className={`text-sm font-medium ${thread.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                            {thread.subject}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {thread.unreadCount > 0 && (
                              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {thread.unreadCount}
                              </div>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(thread.lastMessage.created_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center mt-1">
                          {getPriorityBadge(thread.lastMessage.priority)}
                          <p className="text-sm text-gray-600 ml-2 truncate">
                            {thread.lastMessage.message_body.substring(0, 50)}
                            {thread.lastMessage.message_body.length > 50 ? '...' : ''}
                          </p>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {thread.participants.find(p => p.id !== user?.id)?.full_name || 'Support Team'}
                        </p>
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
            {showComposer ? (
              <motion.div
                key="composer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <EnhancedMessageComposer
                  onMessageSent={handleMessageSent}
                  onCancel={() => setShowComposer(false)}
                  rateLimit={rateLimit}
                />
              </motion.div>
            ) : currentThread ? (
              <motion.div
                key="thread"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <EnhancedMessageThread
                  thread={currentThread}
                  onReply={() => {
                    // In a real app, you'd implement reply functionality here
                    // For now, we'll just show the composer
                    setShowComposer(true);
                  }}
                  onClose={() => {
                    setSelectedThreadId(null);
                    setCurrentThread(null);
                  }}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600 mb-6">Choose a conversation from the sidebar or start a new one</p>
                  <button
                    onClick={handleNewMessage}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Start New Conversation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-t border-red-200">
          <div className="flex items-center text-red-800">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMessageCenter;