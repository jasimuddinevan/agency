import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  ArrowPathIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
}

const ApiSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    enableApi: true,
    rateLimitPerMinute: 60,
    maxRequestsPerDay: 10000,
    requireApiKeys: true,
    logApiRequests: true,
    allowCors: true,
    corsOrigins: '*',
    apiTimeout: 30, // seconds
  });
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'gp_prod_a1b2c3d4e5f6g7h8i9j0',
      permissions: ['read', 'write'],
      createdAt: '2024-01-15T12:00:00Z',
      lastUsed: '2024-07-20T08:30:00Z',
      expiresAt: '2025-01-15T12:00:00Z'
    },
    {
      id: '2',
      name: 'Read-Only API Key',
      key: 'gp_read_k1l2m3n4o5p6q7r8s9t0',
      permissions: ['read'],
      createdAt: '2024-03-10T09:15:00Z',
      lastUsed: '2024-07-19T14:45:00Z',
      expiresAt: null
    }
  ]);
  
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);
  const [newKeyExpiry, setNewKeyExpiry] = useState('');
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

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

  const handlePermissionChange = (permission: string) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission));
    } else {
      setNewKeyPermissions([...newKeyPermissions, permission]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('API settings saved successfully');
    } catch (error) {
      toast.error('Failed to save API settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  const generateApiKey = async () => {
    if (!newKeyName) {
      toast.error('Please enter a name for the API key');
      return;
    }
    
    setIsGeneratingKey(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newKey: ApiKey = {
        id: `${apiKeys.length + 1}`,
        name: newKeyName,
        key: `gp_${newKeyPermissions.includes('write') ? 'full' : 'read'}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        permissions: newKeyPermissions,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        expiresAt: newKeyExpiry ? new Date(newKeyExpiry).toISOString() : null
      };
      
      setApiKeys([...apiKeys, newKey]);
      setVisibleKeys(prev => ({ ...prev, [newKey.id]: true }));
      setNewKeyName('');
      setNewKeyPermissions(['read']);
      setNewKeyExpiry('');
      setShowNewKeyForm(false);
      
      toast.success('API key generated successfully');
    } catch (error) {
      toast.error('Failed to generate API key');
      console.error('Error generating API key:', error);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    if (!window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast.success('API key revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke API key');
      console.error('Error revoking API key:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">API Settings</h2>
        <p className="text-gray-600 mt-1">Configure API access and manage API keys</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* API Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableApi"
                name="enableApi"
                checked={settings.enableApi}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableApi" className="ml-2 block text-sm font-medium text-gray-700">
                Enable API
              </label>
            </div>
          </div>
          
          <div className={settings.enableApi ? '' : 'opacity-50'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rateLimitPerMinute" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Limit (requests per minute)
                </label>
                <input
                  type="number"
                  id="rateLimitPerMinute"
                  name="rateLimitPerMinute"
                  value={settings.rateLimitPerMinute}
                  onChange={handleChange}
                  disabled={!settings.enableApi}
                  min={1}
                  max={1000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="maxRequestsPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Requests Per Day
                </label>
                <input
                  type="number"
                  id="maxRequestsPerDay"
                  name="maxRequestsPerDay"
                  value={settings.maxRequestsPerDay}
                  onChange={handleChange}
                  disabled={!settings.enableApi}
                  min={1}
                  max={1000000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="apiTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                  API Timeout (seconds)
                </label>
                <input
                  type="number"
                  id="apiTimeout"
                  name="apiTimeout"
                  value={settings.apiTimeout}
                  onChange={handleChange}
                  disabled={!settings.enableApi}
                  min={1}
                  max={120}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireApiKeys"
                  name="requireApiKeys"
                  checked={settings.requireApiKeys}
                  onChange={handleChange}
                  disabled={!settings.enableApi}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="requireApiKeys" className="ml-2 block text-sm text-gray-700">
                  Require API keys for all requests
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="logApiRequests"
                  name="logApiRequests"
                  checked={settings.logApiRequests}
                  onChange={handleChange}
                  disabled={!settings.enableApi}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="logApiRequests" className="ml-2 block text-sm text-gray-700">
                  Log all API requests
                </label>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="allowCors"
                  name="allowCors"
                  checked={settings.allowCors}
                  onChange={handleChange}
                  disabled={!settings.enableApi}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="allowCors" className="ml-2 block text-sm font-medium text-gray-700">
                  Allow Cross-Origin Requests (CORS)
                </label>
              </div>
              
              <div className={settings.allowCors && settings.enableApi ? '' : 'opacity-50'}>
                <label htmlFor="corsOrigins" className="block text-sm text-gray-700 mb-1">
                  Allowed Origins
                </label>
                <input
                  type="text"
                  id="corsOrigins"
                  name="corsOrigins"
                  value={settings.corsOrigins}
                  onChange={handleChange}
                  disabled={!settings.allowCors || !settings.enableApi}
                  placeholder="* for all origins, or comma-separated list of domains"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use * to allow all origins, or specify domains (e.g., https://example.com,https://api.example.com)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
            <button
              type="button"
              onClick={() => setShowNewKeyForm(!showNewKeyForm)}
              disabled={!settings.enableApi}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Generate New Key
            </button>
          </div>

          {showNewKeyForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Generate New API Key</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="newKeyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    id="newKeyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="permissionRead"
                        checked={newKeyPermissions.includes('read')}
                        onChange={() => handlePermissionChange('read')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="permissionRead" className="ml-2 block text-sm text-gray-700">
                        Read (GET requests)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="permissionWrite"
                        checked={newKeyPermissions.includes('write')}
                        onChange={() => handlePermissionChange('write')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="permissionWrite" className="ml-2 block text-sm text-gray-700">
                        Write (POST, PUT, DELETE requests)
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="newKeyExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="newKeyExpiry"
                    value={newKeyExpiry}
                    onChange={(e) => setNewKeyExpiry(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank for non-expiring key
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewKeyForm(false)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={generateApiKey}
                    disabled={isGeneratingKey || !newKeyName}
                    className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isGeneratingKey ? (
                      <>
                        <ArrowPathIcon className="animate-spin h-4 w-4 mr-1" />
                        Generating...
                      </>
                    ) : (
                      'Generate Key'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {apiKeys.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API Key
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {key.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                            {visibleKeys[key.id] ? key.key : '••••••••••••••••••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            {visibleKeys[key.id] ? (
                              <EyeSlashIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(key.key)}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                          >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-1">
                          {key.permissions.includes('read') && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Read
                            </span>
                          )}
                          {key.permissions.includes('write') && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Write
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(key.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.expiresAt ? formatDate(key.expiresAt) : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => revokeApiKey(key.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No API keys found</p>
              <button
                type="button"
                onClick={() => setShowNewKeyForm(true)}
                disabled={!settings.enableApi}
                className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Generate Your First API Key
              </button>
            </div>
          )}

          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">API Documentation</h4>
            <p className="text-sm text-gray-600 mb-2">
              Access our API documentation to learn how to integrate with our services.
            </p>
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View API Documentation →
            </a>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
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
    </div>
  );
};

export default ApiSettings;