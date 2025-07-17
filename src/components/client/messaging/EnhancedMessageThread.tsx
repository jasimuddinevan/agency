import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  UserCircleIcon,
  ClockIcon,
  ReplyIcon,
  XIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { MessageThread } from '../../../types/messaging-enhanced';
import { useClientAuth } from '../../../contexts/ClientAuthContext';

interface EnhancedMessageThreadProps {
  thread: MessageThread;
  onReply: () => void;
  onClose: () => void;
}

const EnhancedMessageThread: React.FC<EnhancedMessageThreadProps> = ({ 
  thread, 
  onReply,
  onClose
}) => {
  const { user } = useClientAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when thread changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center">
            <AlertCircleIcon className="h-3 w-3 mr-1" />
            High Priority
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 flex items-center">
            <InfoIcon className="h-3 w-3 mr-1" />
            Low Priority
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
            <InfoIcon className="h-3 w-3 mr-1" />
            Normal Priority
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'read':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Read
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
            <CheckIcon className="h-3 w-3 mr-1" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            Sent
          </span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Thread Header */}
      <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <ShieldCheckIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{thread.subject}</h3>
              <p className="text-sm text-gray-600">
                {thread.messages.length} messages • Started {formatTime(thread.messages[0].created_at)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onReply}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Reply to thread"
            >
              <ReplyIcon className="h-4 w-4 mr-2" />
              Reply
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close thread"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {thread.messages.map((message, index) => {
            const isFromMe = message.sender_id === user?.id;
            const showHeader = index === 0 || thread.messages[index - 1].sender_id !== message.sender_id;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-lg ${isFromMe ? 'order-1' : 'order-2'}`}>
                  {showHeader && (
                    <div className={`flex items-center mb-2 ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-center ${isFromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isFromMe 
                            ? 'bg-blue-100 ml-2' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 mr-2'
                        }`}>
                          {isFromMe ? (
                            <UserCircleIcon className="h-4 w-4 text-blue-600" />
                          ) : (
                            <ShieldCheckIcon className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {isFromMe ? 'You' : 'Support Team'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className={`rounded-lg p-4 ${
                    isFromMe 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      {getPriorityBadge(message.priority)}
                      {!isFromMe && message.read_status === 'read' && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Read
                        </span>
                      )}
                    </div>
                    
                    <div className="whitespace-pre-wrap break-words">
                      {message.message_body}
                    </div>
                    
                    <div className={`flex justify-between mt-2 text-xs ${
                      isFromMe ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      <span>{formatTime(message.created_at)}</span>
                      {isFromMe && (
                        <div className="flex items-center">
                          {getStatusBadge(message.read_status)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Thread Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={onReply}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ReplyIcon className="h-5 w-5 mr-2" />
          Reply to this conversation
        </button>
      </div>
    </div>
  );
};

export default EnhancedMessageThread;