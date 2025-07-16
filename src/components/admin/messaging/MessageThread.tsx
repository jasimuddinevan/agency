import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PaperAirplaneIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { MessageThread as ThreadType, Message } from '../../../types/messaging';
import { useAuth } from '../../../contexts/AuthContext';

interface MessageThreadProps {
  thread: ThreadType;
  onMarkAsRead: (messageId: string) => void;
  onSendMessage: (data: any) => Promise<any>;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  thread,
  onMarkAsRead,
  onSendMessage
}) => {
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Mark unread messages as read
    thread.messages.forEach(message => {
      if (message.receiver_id === user?.id && !message.is_read) {
        onMarkAsRead(message.id);
      }
    });
  }, [thread.messages, user?.id, onMarkAsRead]);

  const handleSendReply = async () => {
    if (!replyContent.trim() || !user) return;

    setIsSending(true);
    try {
      await onSendMessage({
        receiver_id: thread.participant.id,
        content: replyContent,
        subject: `Re: ${thread.last_message.subject}`,
        message_type: 'direct'
      });
      
      setReplyContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffInHours < 48) return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isFromCurrentUser = (message: Message) => {
    return message.sender_id === user?.id;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Thread Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {thread.participant.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {thread.participant.full_name}
            </h3>
            <p className="text-sm text-gray-600">{thread.participant.email}</p>
          </div>
          {thread.unread_count > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {thread.unread_count} unread
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {thread.messages.length === 0 ? (
          <div className="text-center py-8">
            <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No messages in this conversation yet</p>
          </div>
        ) : (
          thread.messages.map((message, index) => {
            const isFromMe = isFromCurrentUser(message);
            const showAvatar = index === 0 || 
              thread.messages[index - 1].sender_id !== message.sender_id;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${isFromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${isFromMe ? 'ml-2' : 'mr-2'}`}>
                    {showAvatar ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isFromMe 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isFromMe ? (
                          <ShieldCheckIcon className="h-4 w-4" />
                        ) : (
                          <UserCircleIcon className="h-4 w-4" />
                        )}
                      </div>
                    ) : (
                      <div className="w-8 h-8"></div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`relative px-4 py-2 rounded-2xl ${
                    isFromMe
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    {/* Subject (only for first message or if different) */}
                    {(index === 0 || message.subject !== thread.messages[index - 1].subject) && 
                     message.subject && (
                      <div className={`text-xs font-semibold mb-1 ${
                        isFromMe ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        {message.subject}
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    
                    {/* Message Info */}
                    <div className={`flex items-center justify-between mt-2 text-xs ${
                      isFromMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span>{formatTime(message.created_at)}</span>
                      {isFromMe && (
                        <div className="flex items-center ml-2">
                          {message.is_read ? (
                            <CheckIcon className="h-3 w-3" />
                          ) : (
                            <ClockIcon className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={replyContent}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={`Reply to ${thread.participant.full_name}...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ minHeight: '40px', maxHeight: '120px' }}
              disabled={isSending}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendReply}
            disabled={!replyContent.trim() || isSending}
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="h-4 w-4" />
            )}
          </motion.button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{replyContent.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;