import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XIcon,
  AlertTriangleIcon,
  SendIcon,
  UserIcon,
  ClockIcon,
  InfoIcon,
  AlertCircleIcon
} from 'lucide-react';
import { useEnhancedMessaging } from '../../../hooks/useEnhancedMessaging';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { RateLimitInfo, MessagePriority } from '../../../types/messaging-enhanced';

interface EnhancedMessageComposerProps {
  onMessageSent: () => void;
  onCancel: () => void;
  replyToThread?: string;
  replyToSubject?: string;
  rateLimit: RateLimitInfo | null;
}

const EnhancedMessageComposer: React.FC<EnhancedMessageComposerProps> = ({
  onMessageSent,
  onCancel,
  replyToThread,
  replyToSubject,
  rateLimit
}) => {
  const { sendMessage, loading } = useEnhancedMessaging();
  
  const [subject, setSubject] = useState(replyToSubject ? `Re: ${replyToSubject}` : '');
  const [messageBody, setMessageBody] = useState('');
  const [priority, setPriority] = useState<MessagePriority>('normal');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (subject.length > 100) {
      newErrors.subject = 'Subject must be 100 characters or less';
    }

    if (!messageBody.trim()) {
      newErrors.messageBody = 'Message is required';
    } else if (messageBody.length > 1000) {
      newErrors.messageBody = 'Message must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    // Check rate limit
    if (rateLimit && rateLimit.remaining <= 0) {
      const resetTime = new Date(rateLimit.reset_at);
      const now = new Date();
      const minutesRemaining = Math.ceil((resetTime.getTime() - now.getTime()) / 60000);
      
      toast.error(`Rate limit exceeded. You can send more messages in ${minutesRemaining} minutes.`);
      return;
    }

    try {
      // Get admin user to send message to
      const { data: adminUsers, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('role', 'super_admin')
        .limit(1);

      if (error) throw error;

      if (!adminUsers || adminUsers.length === 0) {
        // Fallback to any admin user
        const { data: anyAdmin, error: anyAdminError } = await supabase
          .from('admin_users')
          .select('id')
          .limit(1);
          
        if (anyAdminError || !anyAdmin || anyAdmin.length === 0) {
          toast.error('No admin users found to send message to');
          return;
        }
        
        const adminId = anyAdmin[0].id;
        
        await sendMessage({
          recipient_id: adminId,
          subject,
          message_body: messageBody,
          priority,
          thread_id: replyToThread
        });

        toast.success('Message sent successfully!');
        onMessageSent();
      } else {
        const adminId = adminUsers[0].id;
        
        await sendMessage({
          recipient_id: adminId,
          subject,
          message_body: messageBody,
          priority,
          thread_id: replyToThread
        });

        toast.success('Message sent successfully!');
        onMessageSent();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {replyToThread ? 'Reply to Message' : 'New Message'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Send a message to our support team
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Cancel"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Recipient Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <UserIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">To: Support Team</p>
                <p className="text-xs text-blue-700">support@growthpro.com</p>
              </div>
            </div>
          </div>

          {/* Rate Limit Warning */}
          {rateLimit && rateLimit.remaining <= 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Message limit: {rateLimit.remaining} of 10 remaining this hour
                  </p>
                  {rateLimit.remaining === 0 && (
                    <p className="text-sm text-yellow-700 mt-1">
                      You've reached your hourly message limit. Please try again after {new Date(rateLimit.reset_at).toLocaleTimeString()}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors(prev => ({ ...prev, subject: '' }));
              }}
              maxLength={100}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.subject ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter message subject"
              disabled={!!replyToSubject}
            />
            <div className="flex justify-between mt-1">
              {errors.subject ? (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.subject}
                </p>
              ) : (
                <span className="text-xs text-gray-500">&nbsp;</span>
              )}
              <span className="text-xs text-gray-500">{subject.length}/100</span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={priority === 'low'}
                  onChange={() => setPriority('low')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Low</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="normal"
                  checked={priority === 'normal'}
                  onChange={() => setPriority('normal')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Normal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={priority === 'high'}
                  onChange={() => setPriority('high')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">High</span>
              </label>
            </div>
          </div>

          {/* Message Body */}
          <div>
            <label htmlFor="messageBody" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="messageBody"
              value={messageBody}
              onChange={(e) => {
                setMessageBody(e.target.value);
                setErrors(prev => ({ ...prev, messageBody: '' }));
              }}
              rows={10}
              maxLength={1000}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.messageBody ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Type your message here..."
            />
            <div className="flex justify-between mt-1">
              {errors.messageBody ? (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.messageBody}
                </p>
              ) : (
                <span className="text-xs text-gray-500">&nbsp;</span>
              )}
              <span className={`text-xs ${messageBody.length > 900 ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
                {messageBody.length}/1000
              </span>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Tips for better support</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Be specific about your issue or question</li>
                  <li>• Include relevant details like error messages</li>
                  <li>• Our team typically responds within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0 z-10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {rateLimit && (
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {rateLimit.remaining} of 10 messages remaining this hour
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSend}
              disabled={loading || !messageBody.trim() || !subject.trim() || (rateLimit && rateLimit.remaining <= 0)}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              aria-label="Send message"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <SendIcon className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessageComposer;