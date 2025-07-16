import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useMessaging } from '../../../hooks/useMessaging';
import MessageComposer from './MessageComposer';
import MessageThread from './MessageThread';
import MessageList from './MessageList';
import ClientSelector from './ClientSelector';
import { ConversationSummary } from '../../../types/messaging';

const MessageCenter: React.FC = () => {
  const {
    conversations,
    currentThread,
    stats,
    loading,
    getThread,
    sendMessage,
    markAsRead,
    refreshData
  } = useMessaging();

  const [showComposer, setShowComposer] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'compose'>('conversations');

  const filteredConversations = conversations.filter(conv =>
    conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConversationSelect = async (participantId: string) => {
    setSelectedConversation(participantId);
    await getThread(participantId);
  };

  const handleNewMessage = () => {
    setActiveTab('compose');
    setShowComposer(true);
  };

  const handleMessageSent = () => {
    setShowComposer(false);
    setActiveTab('conversations');
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

  return (
    <div className="h-full flex bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button
              onClick={handleNewMessage}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-lg font-bold text-blue-900">{stats.total_messages}</div>
                  <div className="text-xs text-blue-600">Total</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <div className="text-lg font-bold text-red-900">{stats.unread_messages}</div>
                  <div className="text-xs text-red-600">Unread</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
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
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 mb-4">Start messaging your clients to see conversations here</p>
              <button
                onClick={handleNewMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Send First Message
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.participant_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                    selectedConversation === conversation.participant_id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                  }`}
                  onClick={() => handleConversationSelect(conversation.participant_id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {conversation.participant_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.participant_name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {conversation.unread_count > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {conversation.unread_count}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.last_message_time)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message_content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.participant_email}
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
          {activeTab === 'compose' || showComposer ? (
            <motion.div
              key="composer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <MessageComposer
                onMessageSent={handleMessageSent}
                onCancel={() => {
                  setShowComposer(false);
                  setActiveTab('conversations');
                }}
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
              <MessageThread
                thread={currentThread}
                onMarkAsRead={markAsRead}
                onSendMessage={sendMessage}
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
                <p className="text-gray-600 mb-6">Choose a conversation from the sidebar to start messaging</p>
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
  );
};

export default MessageCenter;