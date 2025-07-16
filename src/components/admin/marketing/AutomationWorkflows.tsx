import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PlayIcon,
  PauseIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  BoltIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { EmailTemplate, EmailAutomationWorkflow } from '../../../types/marketing';

interface AutomationWorkflowsProps {
  templates: EmailTemplate[];
}

const AutomationWorkflows: React.FC<AutomationWorkflowsProps> = ({ templates }) => {
  const [workflows, setWorkflows] = useState<EmailAutomationWorkflow[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<EmailAutomationWorkflow | null>(null);
  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    trigger_type: 'application_submitted' as EmailAutomationWorkflow['trigger_type'],
    trigger_conditions: {},
    template_id: '',
    delay_minutes: 0,
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const triggerTypes = [
    { value: 'application_submitted', label: 'Application Submitted' },
    { value: 'application_approved', label: 'Application Approved' },
    { value: 'application_rejected', label: 'Application Rejected' },
    { value: 'user_signup', label: 'User Signup' },
    { value: 'custom', label: 'Custom Trigger' }
  ];

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_automation_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = () => {
    setEditingWorkflow(null);
    setWorkflowForm({
      name: '',
      trigger_type: 'application_submitted',
      trigger_conditions: {},
      template_id: '',
      delay_minutes: 0,
      is_active: true
    });
    setShowEditor(true);
  };

  const handleEditWorkflow = (workflow: EmailAutomationWorkflow) => {
    setEditingWorkflow(workflow);
    setWorkflowForm({
      name: workflow.name,
      trigger_type: workflow.trigger_type,
      trigger_conditions: workflow.trigger_conditions,
      template_id: workflow.template_id || '',
      delay_minutes: workflow.delay_minutes,
      is_active: workflow.is_active
    });
    setShowEditor(true);
  };

  const handleSaveWorkflow = async () => {
    if (!workflowForm.name || !workflowForm.template_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      if (editingWorkflow) {
        const { error } = await supabase
          .from('email_automation_workflows')
          .update(workflowForm)
          .eq('id', editingWorkflow.id);

        if (error) throw error;
        toast.success('Workflow updated successfully!');
      } else {
        const { error } = await supabase
          .from('email_automation_workflows')
          .insert(workflowForm);

        if (error) throw error;
        toast.success('Workflow created successfully!');
      }

      setShowEditor(false);
      fetchWorkflows();
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWorkflow = async (workflowId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('email_automation_workflows')
        .update({ is_active: !isActive })
        .eq('id', workflowId);

      if (error) throw error;

      toast.success(`Workflow ${!isActive ? 'activated' : 'deactivated'} successfully!`);
      fetchWorkflows();
    } catch (error) {
      console.error('Error toggling workflow:', error);
      toast.error('Failed to toggle workflow');
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('email_automation_workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      toast.success('Workflow deleted successfully!');
      fetchWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast.error('Failed to delete workflow');
    }
  };

  const formatDelay = (minutes: number) => {
    if (minutes === 0) return 'Immediate';
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
    return `${Math.floor(minutes / 1440)} days`;
  };

  const getTriggerColor = (triggerType: string) => {
    switch (triggerType) {
      case 'application_submitted': return 'bg-blue-100 text-blue-800';
      case 'application_approved': return 'bg-green-100 text-green-800';
      case 'application_rejected': return 'bg-red-100 text-red-800';
      case 'user_signup': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && workflows.length === 0) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Automation</h2>
          <p className="text-gray-600 mt-1">Set up automated email workflows based on user actions</p>
        </div>
        <button
          onClick={handleCreateWorkflow}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Workflow
        </button>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => {
          const template = templates.find(t => t.id === workflow.template_id);
          
          return (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTriggerColor(workflow.trigger_type)}`}>
                      {triggerTypes.find(t => t.value === workflow.trigger_type)?.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleToggleWorkflow(workflow.id, workflow.is_active)}
                      className={`p-1 rounded transition-colors duration-200 ${
                        workflow.is_active 
                          ? 'text-green-600 hover:text-green-800' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={workflow.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {workflow.is_active ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEditWorkflow(workflow)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>Delay: {formatDelay(workflow.delay_minutes)}</span>
                  </div>

                  {template && (
                    <div className="flex items-center text-sm text-gray-600">
                      <BoltIcon className="h-4 w-4 mr-2" />
                      <span>Template: {template.name}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <div className={`w-2 h-2 rounded-full mr-2 ${workflow.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className={workflow.is_active ? 'text-green-600' : 'text-gray-500'}>
                      {workflow.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {workflows.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BoltIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No automation workflows yet</h3>
          <p className="text-gray-600 mb-6">Create automated email workflows to engage users at the right time</p>
          <button
            onClick={handleCreateWorkflow}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Workflow
          </button>
        </div>
      )}

      {/* Workflow Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">
                    {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
                  </h3>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name *</label>
                    <input
                      type="text"
                      value={workflowForm.name}
                      onChange={(e) => setWorkflowForm({ ...workflowForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter workflow name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Event *</label>
                    <select
                      value={workflowForm.trigger_type}
                      onChange={(e) => setWorkflowForm({ ...workflowForm, trigger_type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {triggerTypes.map((trigger) => (
                        <option key={trigger.value} value={trigger.value}>
                          {trigger.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Template *</label>
                    <select
                      value={workflowForm.template_id}
                      onChange={(e) => setWorkflowForm({ ...workflowForm, template_id: e.target.value })}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delay (minutes)</label>
                    <input
                      type="number"
                      min="0"
                      value={workflowForm.delay_minutes}
                      onChange={(e) => setWorkflowForm({ ...workflowForm, delay_minutes: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0 for immediate sending"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      How long to wait after the trigger event before sending the email
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={workflowForm.is_active}
                      onChange={(e) => setWorkflowForm({ ...workflowForm, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Activate workflow immediately
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveWorkflow}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                    )}
                    {editingWorkflow ? 'Update Workflow' : 'Create Workflow'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutomationWorkflows;