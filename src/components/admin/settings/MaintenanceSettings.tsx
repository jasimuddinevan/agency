import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  ArrowPathIcon, 
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface MaintenanceWindow {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  message: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

const MaintenanceSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    maintenanceModeEnabled: false,
    allowAdminAccess: true,
    maintenanceMessage: 'The system is currently undergoing scheduled maintenance. Please check back soon.',
    customCss: '',
    showEstimatedTime: true,
    estimatedDowntime: 60, // minutes
    redirectUrl: '',
    statusPageUrl: '',
    notifyBeforeMaintenance: true,
    notificationLeadTime: 24, // hours
    logMaintenanceEvents: true
  });
  
  const [maintenanceWindows, setMaintenanceWindows] = useState<MaintenanceWindow[]>([
    {
      id: '1',
      title: 'Database Optimization',
      startTime: '2024-08-15T02:00:00Z',
      endTime: '2024-08-15T04:00:00Z',
      message: 'Scheduled database maintenance and optimization.',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'System Upgrade',
      startTime: '2024-07-10T01:00:00Z',
      endTime: '2024-07-10T03:00:00Z',
      message: 'System upgrade to version 2.5.0.',
      status: 'completed'
    }
  ]);
  
  const [showNewWindowForm, setShowNewWindowForm] = useState(false);
  const [editingWindow, setEditingWindow] = useState<MaintenanceWindow | null>(null);
  const [newWindow, setNewWindow] = useState<Omit<MaintenanceWindow, 'id' | 'status'>>({
    title: '',
    startTime: '',
    endTime: '',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingWindow, setIsSavingWindow] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseInt(value) 
          : value
    }));
  };

  const handleNewWindowChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setNewWindow(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Maintenance settings saved successfully');
    } catch (error) {
      toast.error('Failed to save maintenance settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWindow = async () => {
    if (!newWindow.title || !newWindow.startTime || !newWindow.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (new Date(newWindow.startTime) >= new Date(newWindow.endTime)) {
      toast.error('End time must be after start time');
      return;
    }
    
    setIsSavingWindow(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingWindow) {
        // Update existing window
        setMaintenanceWindows(prev => 
          prev.map(window => 
            window.id === editingWindow.id 
              ? { 
                  ...window, 
                  title: newWindow.title,
                  startTime: newWindow.startTime,
                  endTime: newWindow.endTime,
                  message: newWindow.message
                }
              : window
          )
        );
        toast.success('Maintenance window updated successfully');
      } else {
        // Add new window
        const window: MaintenanceWindow = {
          id: `${maintenanceWindows.length + 1}`,
          title: newWindow.title,
          startTime: newWindow.startTime,
          endTime: newWindow.endTime,
          message: newWindow.message,
          status: 'scheduled'
        };
        
        setMaintenanceWindows([...maintenanceWindows, window]);
        toast.success('Maintenance window scheduled successfully');
      }
      
      setNewWindow({
        title: '',
        startTime: '',
        endTime: '',
        message: ''
      });
      setEditingWindow(null);
      setShowNewWindowForm(false);
    } catch (error) {
      toast.error('Failed to save maintenance window');
      console.error('Error saving maintenance window:', error);
    } finally {
      setIsSavingWindow(false);
    }
  };

  const handleEditWindow = (window: MaintenanceWindow) => {
    setEditingWindow(window);
    setNewWindow({
      title: window.title,
      startTime: window.startTime,
      endTime: window.endTime,
      message: window.message
    });
    setShowNewWindowForm(true);
  };

  const handleDeleteWindow = async (windowId: string) => {
    if (!window.confirm('Are you sure you want to delete this maintenance window?')) {
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMaintenanceWindows(maintenanceWindows.filter(window => window.id !== windowId));
      toast.success('Maintenance window deleted successfully');
    } catch (error) {
      toast.error('Failed to delete maintenance window');
      console.error('Error deleting maintenance window:', error);
    }
  };

  const handleCancelWindow = async (windowId: string) => {
    if (!window.confirm('Are you sure you want to cancel this maintenance window?')) {
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMaintenanceWindows(prev => 
        prev.map(window => 
          window.id === windowId 
            ? { ...window, status: 'cancelled' }
            : window
        )
      );
      toast.success('Maintenance window cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel maintenance window');
      console.error('Error cancelling maintenance window:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Maintenance Mode</h2>
        <p className="text-gray-600 mt-1">Configure maintenance mode and schedule maintenance windows</p>
      </div>

      <div className="space-y-6">
        {/* Maintenance Mode Toggle */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Maintenance Mode</h3>
              <p className="text-sm text-gray-600 mt-1">
                When enabled, the site will display a maintenance message to visitors
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="maintenanceModeEnabled"
                name="maintenanceModeEnabled"
                checked={settings.maintenanceModeEnabled}
                onChange={handleChange}
                className="opacity-0 w-0 h-0"
              />
              <label
                htmlFor="maintenanceModeEnabled"
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                  settings.maintenanceModeEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                    settings.maintenanceModeEnabled ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
          </div>
          
          {settings.maintenanceModeEnabled && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Maintenance Mode Active</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your site is currently in maintenance mode and is not accessible to regular users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Maintenance Settings */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Message
              </label>
              <textarea
                id="maintenanceMessage"
                name="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the message to display during maintenance"
              />
            </div>

            <div>
              <label htmlFor="estimatedDowntime" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Downtime (minutes)
              </label>
              <input
                type="number"
                id="estimatedDowntime"
                name="estimatedDowntime"
                value={settings.estimatedDowntime}
                onChange={handleChange}
                min={5}
                max={1440}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notificationLeadTime" className="block text-sm font-medium text-gray-700 mb-1">
                Notification Lead Time (hours)
              </label>
              <input
                type="number"
                id="notificationLeadTime"
                name="notificationLeadTime"
                value={settings.notificationLeadTime}
                onChange={handleChange}
                min={1}
                max={168}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                How many hours before maintenance to send notifications
              </p>
            </div>

            <div>
              <label htmlFor="redirectUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Redirect URL (Optional)
              </label>
              <input
                type="url"
                id="redirectUrl"
                name="redirectUrl"
                value={settings.redirectUrl}
                onChange={handleChange}
                placeholder="https://status.example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Redirect users to this URL during maintenance
              </p>
            </div>

            <div>
              <label htmlFor="statusPageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Status Page URL (Optional)
              </label>
              <input
                type="url"
                id="statusPageUrl"
                name="statusPageUrl"
                value={settings.statusPageUrl}
                onChange={handleChange}
                placeholder="https://status.example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="customCss" className="block text-sm font-medium text-gray-700 mb-1">
                Custom CSS (Optional)
              </label>
              <textarea
                id="customCss"
                name="customCss"
                value={settings.customCss}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder=".maintenance-page { background-color: #f0f4f8; }"
              />
              <p className="mt-1 text-xs text-gray-500">
                Custom CSS for the maintenance page
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowAdminAccess"
                name="allowAdminAccess"
                checked={settings.allowAdminAccess}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allowAdminAccess" className="ml-2 block text-sm text-gray-700">
                Allow admin access during maintenance
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showEstimatedTime"
                name="showEstimatedTime"
                checked={settings.showEstimatedTime}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showEstimatedTime" className="ml-2 block text-sm text-gray-700">
                Show estimated completion time
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyBeforeMaintenance"
                name="notifyBeforeMaintenance"
                checked={settings.notifyBeforeMaintenance}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifyBeforeMaintenance" className="ml-2 block text-sm text-gray-700">
                Notify users before maintenance
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="logMaintenanceEvents"
                name="logMaintenanceEvents"
                checked={settings.logMaintenanceEvents}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="logMaintenanceEvents" className="ml-2 block text-sm text-gray-700">
                Log maintenance events
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset to Defaults
            </button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Scheduled Maintenance Windows */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Scheduled Maintenance Windows</h3>
            <button
              type="button"
              onClick={() => {
                setEditingWindow(null);
                setNewWindow({
                  title: '',
                  startTime: '',
                  endTime: '',
                  message: ''
                });
                setShowNewWindowForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </button>
          </div>
          
          {showNewWindowForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                {editingWindow ? 'Edit Maintenance Window' : 'Schedule New Maintenance Window'}
              </h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newWindow.title}
                    onChange={handleNewWindowChange}
                    placeholder="e.g., Database Upgrade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={newWindow.startTime ? new Date(newWindow.startTime).toISOString().slice(0, 16) : ''}
                      onChange={handleNewWindowChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      name="endTime"
                      value={newWindow.endTime ? new Date(newWindow.endTime).toISOString().slice(0, 16) : ''}
                      onChange={handleNewWindowChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={newWindow.message}
                    onChange={handleNewWindowChange}
                    rows={3}
                    placeholder="Describe the maintenance purpose and impact"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewWindowForm(false)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveWindow}
                    disabled={isSavingWindow || !newWindow.title || !newWindow.startTime || !newWindow.endTime}
                    className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSavingWindow ? (
                      <>
                        <ArrowPathIcon className="animate-spin h-4 w-4 mr-1" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" />
                        {editingWindow ? 'Update' : 'Schedule'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {maintenanceWindows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenanceWindows.map((window) => (
                    <tr key={window.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {window.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(window.startTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(window.endTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(window.status)}`}>
                          {window.status.charAt(0).toUpperCase() + window.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {window.status === 'scheduled' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEditWindow(window)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelWindow(window.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Cancel"
                              >
                                <ClockIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteWindow(window.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No maintenance windows scheduled</p>
              <button
                type="button"
                onClick={() => setShowNewWindowForm(true)}
                className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Schedule Your First Maintenance
              </button>
            </div>
          )}
          
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">User Impact</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    During scheduled maintenance windows, users will see the maintenance page with the message you've configured.
                    Make sure to schedule maintenance during low-traffic periods to minimize disruption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSettings;