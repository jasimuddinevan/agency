import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PaperAirplaneIcon,
  XMarkIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useMessaging } from '../../../hooks/useMessaging';
import { supabase } from '../../../lib/supabase';
import ClientSelector from './ClientSelector';
import toast from 'react-hot-toast';

interface MessageComposerProps {
  onMessageSent: () => void;
  onCancel: () => void;
  replyTo?: {
    participant_id: string;
    participant_name: string;
  };
}

interface ClientOption {
  id: string;
  full_name: string;
  email: string;
  company?: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  onMessageSent,
  onCancel,
  replyTo
}) => {
  const { sendMessage, loading } = useMessaging();
  
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState<'direct' | 'broadcast'>('direct');
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([]);
  const [availableClients, setAvailableClients] = useState<ClientOption[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchClients();
    
    if (replyTo) {
      setMessageType('direct');
      setSubject(`Re: Previous conversation`);
      // Find and select the reply recipient
      const replyClient = availableClients.find(c => c.id === replyTo.participant_id);
      if (replyClient) {
        setSelectedClients([replyClient]);
      }
    }
  }, [replyTo, availableClients.length]);

  const fetchClients = async () => {
    setIsLoadingClients(true);
    try {
      // Fetch all client profiles to get potential recipients
      const { data: clientProfiles, error: clientError } = await supabase
        .from('client_profiles')
        .select('id, full_name, email, company')
        .order('full_name');

      if (clientError) throw clientError;

      // Convert client profiles to ClientOption format
      const clients: ClientOption[] = clientProfiles?.map(client => ({
          id: client.id,
          full_name: client.full_name,
          email: client.email,
          company: client.company
        })) || [];

      setAvailableClients(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setIsLoadingClients(false);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Message content is required';
    }

    if (selectedClients.length === 0) {
      newErrors.recipients = 'Please select at least one recipient';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    // For testing purposes, use a direct message to the first recipient
    const recipientId = selectedClients[0]?.id;
    
    if (!recipientId) {
      toast.error('No valid recipient selected');
      return;
    }

    try {
      if (messageType === 'broadcast') {
        await sendMessage({
          content,
          subject,
          message_type: 'broadcast',
          recipient_ids: selectedClients.map(c => c.id)
        });
      } else {
        // Send individual messages to each selected client
        for (const client of selectedClients) {
          await sendMessage({
            receiver_id: client.id,
            content,
            subject,
            message_type: 'direct'
          });
        }
      }
      toast.success(`Message sent to ${selectedClients.length} recipient${selectedClients.length > 1 ? 's' : ''}!`);
      onMessageSent();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleClientSelect = (clients: ClientOption[]) => {
    setSelectedClients(clients);
    setErrors(prev => ({ ...prev, recipients: '' }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {replyTo ? `Reply to ${replyTo.participant_name}` : 'Compose Message'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Send a message to your clients
            </p>
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
          {/* Message Type Selection */}
          {!replyTo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Message Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="direct"
                    checked={messageType === 'direct'}
                    onChange={(e) => setMessageType(e.target.value as 'direct')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Direct Message</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="broadcast"
                    checked={messageType === 'broadcast'}
                    onChange={(e) => setMessageType(e.target.value as 'broadcast')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Broadcast Message</span>
                </label>
              </div>
            </div>
          )}

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients *
            </label>
            <ClientSelector
              clients={availableClients}
              selectedClients={selectedClients}
              onSelectionChange={handleClientSelect}
              isLoading={isLoadingClients}
              allowMultiple={!replyTo}
              disabled={!!replyTo}
            />
            {errors.recipients && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                {errors.recipients}
              </p>
            )}
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

          {/* Message Preview */}
          {selectedClients.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="bg-white border border-gray-200 rounded p-3">
                <div className="text-xs text-gray-500 mb-2">
                  <strong>To:</strong> {selectedClients.map(c => c.full_name).join(', ')}
                  {messageType === 'broadcast' && selectedClients.length > 3 && 
                    ` and ${selectedClients.length - 3} others`
                  }
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  <strong>Subject:</strong> {subject || 'No subject'}
                </div>
                <div className="text-sm text-gray-900 whitespace-pre-wrap">
                  {content || 'Message content will appear here...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            {messageType === 'broadcast' ? (
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                Broadcasting to {selectedClients.length} recipients
              </div>
            ) : (
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-1" />
                Sending {selectedClients.length} individual message{selectedClients.length !== 1 ? 's' : ''}
              </div>
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
              disabled={loading || selectedClients.length === 0}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
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

export default MessageComposer;