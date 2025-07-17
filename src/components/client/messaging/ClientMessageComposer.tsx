import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useMessaging } from '../../../hooks/useMessaging';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface ClientMessageComposerProps {
  onMessageSent: () => void;
  onCancel: () => void;
  replyTo?: {
    id: string;
    subject: string;
  };
}

const ClientMessageComposer: React.FC<ClientMessageComposerProps> = ({
  onMessageSent,
  onCancel,
  replyTo
}) => {
  const { sendMessage, loading } = useMessaging();
  
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [content, setContent] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Message content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    let adminId = null;

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
        
        adminId = anyAdmin[0].id;
      } else {
        adminId = adminUsers[0].id;
      }

      await sendMessage({
        receiver_id: adminId,
        content,
        subject,
        message_type: 'direct'
      });

      toast.success('Message sent successfully!');
      onMessageSent();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {replyTo ? 'Reply to Message' : 'New Message'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Send a message to our support team
            </p>
          </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Recipient Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-semibold">S</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">To: Support Team</p>
                <p className="text-xs text-blue-700">support@growthpro.com</p>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors(prev => ({ ...prev, subject: '' }));
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.subject ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter message subject"
              disabled={!!replyTo}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrors(prev => ({ ...prev, content: '' }));
              }}
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Type your message here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errors.content}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {content.length} characters
            </p>
          </div>

          {/* Help Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 Tips for better support</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Be specific about your issue or question</li>
              <li>• Include relevant details like error messages or steps you've taken</li>
              <li>• Our team typically responds within 24 hours</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Your message will be sent to our support team
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
              disabled={loading || !content.trim() || !subject.trim()}
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
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
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

export default ClientMessageComposer;