import React from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  BuildingOfficeIcon,
  UserIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Application } from '../../../types/admin';

interface ApplicationDetailsProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (application: Application) => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  isOpen,
  onClose,
  onEdit
}) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sections = [
    {
      title: 'Business Information',
      icon: BuildingOfficeIcon,
      fields: [
        { label: 'Business Name', value: application.business_name, icon: BuildingOfficeIcon },
        { label: 'Website URL', value: application.website_url, icon: GlobeAltIcon, isLink: true },
        { label: 'Industry', value: application.industry, icon: BuildingOfficeIcon },
        { label: 'Monthly Revenue', value: application.monthly_revenue, icon: CurrencyDollarIcon },
        { label: 'Description', value: application.business_description, icon: DocumentTextIcon, isTextArea: true }
      ]
    },
    {
      title: 'Contact Information',
      icon: UserIcon,
      fields: [
        { label: 'Full Name', value: application.full_name, icon: UserIcon },
        { label: 'Email', value: application.email, icon: EnvelopeIcon, isLink: true, linkType: 'email' },
        { label: 'Phone', value: application.phone, icon: PhoneIcon, isLink: true, linkType: 'phone' },
        { label: 'Address', value: application.address, icon: MapPinIcon, isTextArea: true },
        { label: 'Preferred Contact', value: application.preferred_contact, icon: ChatBubbleLeftRightIcon }
      ]
    }
  ];

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
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Application Details</h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(application.status)}`}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </span>
                <div className="flex items-center text-blue-100">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    Created: {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <motion.div
                      key={field.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (fieldIndex * 0.05) }}
                      className={`${field.isTextArea ? 'md:col-span-2' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <field.icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-600 mb-1 block">
                            {field.label}
                          </label>
                          {field.isLink ? (
                            <a
                              href={
                                field.linkType === 'email' 
                                  ? `mailto:${field.value}` 
                                  : field.linkType === 'phone'
                                  ? `tel:${field.value}`
                                  : field.value
                              }
                              target={field.linkType ? undefined : "_blank"}
                              rel={field.linkType ? undefined : "noopener noreferrer"}
                              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 break-all"
                            >
                              {field.value}
                            </a>
                          ) : (
                            <div className={`text-gray-900 ${field.isTextArea ? 'whitespace-pre-wrap' : ''}`}>
                              {field.value}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Notes Section */}
            {application.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-yellow-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Admin Notes</h3>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Application Created</div>
                    <div className="text-sm text-gray-600">
                      {new Date(application.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Last Updated</div>
                    <div className="text-sm text-gray-600">
                      {new Date(application.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEdit(application)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Edit Application
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApplicationDetails;