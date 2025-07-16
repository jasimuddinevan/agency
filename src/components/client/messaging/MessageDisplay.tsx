import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  UserCircleIcon,
  ClockIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { ReplyIcon } from '@heroicons/react/24/solid';
import { Message } from '../../../types/messaging';
import { useClientAuth } from '../../../contexts/ClientAuthContext';

interface MessageDisplayProps {
  message: Message;
  onReply: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, onReply }) => {
  const { user } = useClientAuth();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isFromMe = message.sender_id === user?.id;
  const sender = isFromMe ? message.sender : message.sender;

  return (
    <div className="h-full flex flex-col">
      {/* Message Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isFromMe 
                ? 'bg-gray-300' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              {isFromMe ? (
                <UserCircleIcon className="h-6 w-6 text-gray-600" />
              ) : (
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isFromMe ? 'You' : (sender?.full_name || 'Support Team')}
              </h3>
              <p className="text-sm text-gray-600">
                {isFromMe ? 'To: Support Team' : sender?.email || 'support@growthpro.com'}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <ClockIcon className="h-3 w-3 mr-1" />
                {formatTime(message.created_at)}
                {message.message_type === 'broadcast' && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      Announcement
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {!isFromMe && (
            <button
              onClick={onReply}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <ReplyIcon className="h-4 w-4 mr-2" />
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Subject */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{message.subject}</h2>
            </div>
            
            {/* Message Body */}
            <div className="p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>

            {/* Message Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span>
                    {isFromMe ? 'Sent' : 'Received'} on {formatTime(message.created_at)}
                  </span>
                </div>
                
                {message.read_at && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Read on {formatTime(message.read_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!isFromMe && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="flex space-x-3">
                <button
                  onClick={onReply}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <ReplyIcon className="h-4 w-4 mr-2" />
                  Reply to Message
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Mark as Important
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MessageDisplay;