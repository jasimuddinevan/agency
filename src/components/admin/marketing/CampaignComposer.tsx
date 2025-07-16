import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { HexColorPicker } from 'react-colorful';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { EmailTemplate, RecipientFilter, RecipientListItem } from '../../../types/marketing';

interface CampaignComposerProps {
  isOpen: boolean;
  onClose: () => void;
  templates: EmailTemplate[];
  onCampaignCreated: () => void;
  editCampaign?: any;
}

const CampaignComposer: React.FC<CampaignComposerProps> = ({
  isOpen,
  onClose,
  templates,
  onCampaignCreated,
  editCampaign
}) => {
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('GrowthPro Team');
  const [senderEmail, setSenderEmail] = useState('noreply@growthpro.com');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>({
    type: 'all'
  });
  const [scheduledAt, setScheduledAt] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isLoading, setIsLoading] = useState(false);
  const [recipientCount, setRecipientCount] = useState(0);
  const [recipientList, setRecipientList] = useState<RecipientListItem[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Color,
      TextStyle,
    ],
    content: '<p>Start writing your email content here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editCampaign) {
      setCampaignName(editCampaign.name);
      setSubject(editCampaign.subject);
      setSenderName(editCampaign.sender_name);
      setSenderEmail(editCampaign.sender_email);
      setRecipientFilter(editCampaign.recipient_filter);
      setScheduledAt(editCampaign.scheduled_at || '');
      if (editor) {
        editor.commands.setContent(editCampaign.html_content);
      }
    }
  }, [editCampaign, editor]);

  useEffect(() => {
    if (recipientFilter) {
      fetchRecipientCount();
    }
  }, [recipientFilter]);

  const fetchRecipientCount = async () => {
    try {
      let query = supabase.from('applications').select('email, full_name, status, industry, monthly_revenue, created_at');

      switch (recipientFilter.type) {
        case 'approved':
          query = query.eq('status', 'approved');
          break;
        case 'non_approved':
          query = query.neq('status', 'approved');
          break;
        case 'rejected':
          query = query.eq('status', 'rejected');
          break;
        case 'specific':
          if (recipientFilter.specific_emails?.length) {
            query = query.in('email', recipientFilter.specific_emails);
          }
          break;
      }

      if (recipientFilter.date_range) {
        query = query
          .gte('created_at', recipientFilter.date_range.start)
          .lte('created_at', recipientFilter.date_range.end);
      }

      if (recipientFilter.industry?.length) {
        query = query.in('industry', recipientFilter.industry);
      }

      if (recipientFilter.revenue_range?.length) {
        query = query.in('monthly_revenue', recipientFilter.revenue_range);
      }

      const { data, error } = await query;

      if (error) throw error;

      const recipients: RecipientListItem[] = (data || []).map(item => ({
        email: item.email,
        name: item.full_name,
        type: 'applicant',
        status: item.status,
        industry: item.industry,
        revenue: item.monthly_revenue,
        created_at: item.created_at
      }));

      setRecipientList(recipients);
      setRecipientCount(recipients.length);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      setRecipientCount(0);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && editor) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      editor.commands.setContent(template.html_content);
    }
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const applyColor = (color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
    setShowColorPicker(false);
  };

  const handleSendNow = async () => {
    if (!campaignName || !subject || !editor?.getHTML()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();

      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          name: campaignName,
          subject,
          sender_name: senderName,
          sender_email: senderEmail,
          template_id: selectedTemplate || null,
          html_content: htmlContent,
          text_content: textContent,
          recipient_filter: recipientFilter,
          status: 'sending',
          total_recipients: recipientCount,
          sent_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Insert recipients
      if (recipientList.length > 0) {
        const recipients = recipientList.map(recipient => ({
          campaign_id: data.id,
          recipient_email: recipient.email,
          recipient_name: recipient.name,
          recipient_type: recipient.type,
          status: 'pending'
        }));

        await supabase
          .from('campaign_recipients')
          .insert(recipients);
      }

      toast.success('Campaign sent successfully!');
      onCampaignCreated();
      onClose();
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!campaignName || !subject || !editor?.getHTML() || !scheduledAt) {
      toast.error('Please fill in all required fields including schedule time');
      return;
    }

    setIsLoading(true);
    try {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();

      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          name: campaignName,
          subject,
          sender_name: senderName,
          sender_email: senderEmail,
          template_id: selectedTemplate || null,
          html_content: htmlContent,
          text_content: textContent,
          recipient_filter: recipientFilter,
          status: 'scheduled',
          scheduled_at: scheduledAt,
          total_recipients: recipientCount
        })
        .select()
        .single();

      if (error) throw error;

      // Insert recipients
      if (recipientList.length > 0) {
        const recipients = recipientList.map(recipient => ({
          campaign_id: data.id,
          recipient_email: recipient.email,
          recipient_name: recipient.name,
          recipient_type: recipient.type,
          status: 'pending'
        }));

        await supabase
          .from('campaign_recipients')
          .insert(recipients);
      }

      toast.success('Campaign scheduled successfully!');
      onCampaignCreated();
      onClose();
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      toast.error('Failed to schedule campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!campaignName || !subject) {
      toast.error('Please provide campaign name and subject');
      return;
    }

    setIsLoading(true);
    try {
      const htmlContent = editor?.getHTML() || '';
      const textContent = editor?.getText() || '';

      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          name: campaignName,
          subject,
          sender_name: senderName,
          sender_email: senderEmail,
          template_id: selectedTemplate || null,
          html_content: htmlContent,
          text_content: textContent,
          recipient_filter: recipientFilter,
          status: 'draft',
          total_recipients: recipientCount
        });

      if (error) throw error;

      toast.success('Campaign saved as draft!');
      onCampaignCreated();
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Email Campaign Composer</h2>
              <p className="text-blue-100 mt-1">Create and send professional email campaigns</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full max-h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Campaign Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name *</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email subject"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
                      <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipients */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipients</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Type</label>
                    <select
                      value={recipientFilter.type}
                      onChange={(e) => setRecipientFilter({ ...recipientFilter, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Applicants</option>
                      <option value="approved">Approved Only</option>
                      <option value="non_approved">Non-Approved Only</option>
                      <option value="rejected">Rejected Only</option>
                      <option value="specific">Specific Users</option>
                    </select>
                  </div>

                  {recipientFilter.type === 'specific' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Addresses</label>
                      <textarea
                        rows={3}
                        placeholder="Enter email addresses, one per line"
                        onChange={(e) => setRecipientFilter({
                          ...recipientFilter,
                          specific_emails: e.target.value.split('\n').filter(email => email.trim())
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center text-blue-800">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {recipientCount} recipients selected
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduling</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Send Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col">
            {/* Editor Toolbar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center space-x-2 flex-wrap">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                >
                  <BoldIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                >
                  <ItalicIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={insertLink}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={insertImage}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <PhotoIcon className="h-4 w-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <PaintBrushIcon className="h-4 w-4" />
                  </button>
                  {showColorPicker && (
                    <div className="absolute top-full left-0 z-10 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <HexColorPicker color={currentColor} onChange={setCurrentColor} />
                      <button
                        onClick={() => applyColor(currentColor)}
                        className="mt-2 w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Apply Color
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto">
              {showPreview ? (
                <div className="p-6">
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                      <div className="text-sm text-gray-600">
                        <strong>From:</strong> {senderName} &lt;{senderEmail}&gt;
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Subject:</strong> {subject}
                      </div>
                    </div>
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                    />
                  </div>
                </div>
              ) : (
                <EditorContent editor={editor} className="h-full" />
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
                  >
                    Save Draft
                  </button>
                </div>
                <div className="flex space-x-3">
                  {scheduledAt && (
                    <button
                      onClick={handleSchedule}
                      disabled={isLoading}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Schedule
                    </button>
                  )}
                  <button
                    onClick={handleSendNow}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    )}
                    Send Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CampaignComposer;