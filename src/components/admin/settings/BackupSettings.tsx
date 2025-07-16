import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  ArrowPathIcon, 
  CloudArrowDownIcon, 
  TrashIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  ArrowUturnLeftIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface BackupFile {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed' | 'in_progress';
  verified: boolean;
}

const BackupSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    enableAutomaticBackups: true,
    backupFrequency: 'daily', // 'hourly', 'daily', 'weekly', 'monthly'
    backupTime: '02:00',
    backupDay: 1, // 1-7 for weekly (Monday-Sunday), 1-31 for monthly
    retentionCount: 10,
    includeUploads: true,
    includeApplicationData: true,
    includeUserData: true,
    includeSettings: true,
    compressionLevel: 'medium', // 'none', 'low', 'medium', 'high'
    encryptBackups: true,
    storageLocation: 'local', // 'local', 's3', 'gcs', 'azure'
    notifyOnSuccess: true,
    notifyOnFailure: true
  });
  
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Simulate loading backup files
  useEffect(() => {
    const loadBackups = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBackupFiles([
        {
          id: '1',
          filename: 'backup-2024-07-20-02-00-00.sql.gz',
          size: '24.5 MB',
          createdAt: '2024-07-20T02:00:00Z',
          type: 'auto',
          status: 'completed',
          verified: true
        },
        {
          id: '2',
          filename: 'backup-2024-07-19-02-00-00.sql.gz',
          size: '24.3 MB',
          createdAt: '2024-07-19T02:00:00Z',
          type: 'auto',
          status: 'completed',
          verified: true
        },
        {
          id: '3',
          filename: 'backup-2024-07-18-15-30-00.sql.gz',
          size: '24.2 MB',
          createdAt: '2024-07-18T15:30:00Z',
          type: 'manual',
          status: 'completed',
          verified: true
        },
        {
          id: '4',
          filename: 'backup-2024-07-17-02-00-00.sql.gz',
          size: '24.0 MB',
          createdAt: '2024-07-17T02:00:00Z',
          type: 'auto',
          status: 'failed',
          verified: false
        }
      ]);
    };
    
    loadBackups();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Backup settings saved successfully');
    } catch (error) {
      toast.error('Failed to save backup settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupNow = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    try {
      // Simulate backup process with progress
      for (let i = 0; i <= 100; i += 10) {
        setBackupProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const newBackup: BackupFile = {
        id: `${backupFiles.length + 1}`,
        filename: `backup-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.sql.gz`,
        size: '24.8 MB',
        createdAt: new Date().toISOString(),
        type: 'manual',
        status: 'completed',
        verified: true
      };
      
      setBackupFiles([newBackup, ...backupFiles]);
      toast.success('Backup completed successfully');
    } catch (error) {
      toast.error('Backup failed');
      console.error('Error during backup:', error);
    } finally {
      setIsBackingUp(false);
      setBackupProgress(0);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setBackupFiles(backupFiles.filter(backup => backup.id !== backupId));
      toast.success('Backup deleted successfully');
    } catch (error) {
      toast.error('Failed to delete backup');
      console.error('Error deleting backup:', error);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    
    setIsRestoring(true);
    
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Database restored successfully');
      setShowRestoreConfirm(false);
    } catch (error) {
      toast.error('Failed to restore database');
      console.error('Error restoring database:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  const generateSqlBackupContent = (backup: BackupFile) => {
    // Generate a realistic SQL backup file based on the backup metadata
    const timestamp = new Date(backup.createdAt).toISOString();
    const header = `-- PostgreSQL database dump\n-- Dumped from database version 14.5\n-- Dumped by pg_dump version 14.5\n-- Started on ${timestamp}\n\nSET statement_timeout = 0;\nSET lock_timeout = 0;\nSET client_encoding = 'UTF8';\nSET standard_conforming_strings = on;\n`;
    
    // Add some realistic table creation and data
    const tables = [
      `CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_name text NOT NULL,
    website_url text NOT NULL,
    business_description text NOT NULL,
    industry text NOT NULL,
    monthly_revenue text NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    preferred_contact text NOT NULL,
    status text DEFAULT 'new'::text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);`,
      `CREATE TABLE public.admin_users (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone
);`,
      `CREATE TABLE public.client_profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text DEFAULT ''::text NOT NULL,
    phone text,
    company text,
    website text,
    address text,
    avatar_url text,
    timezone text DEFAULT 'UTC'::text,
    language text DEFAULT 'en'::text,
    account_status text DEFAULT 'active'::text,
    total_spent numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone
);`
    ];
    
    // Add some sample data inserts
    const data = [
      `INSERT INTO public.applications VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Example Business', 'https://example.com', 'A sample business description', 'Technology', '$10K - $25K', 'John Doe', 'john@example.com', '+1234567890', '123 Main St', 'Email', 'new', NULL, '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00');`,
      `INSERT INTO public.admin_users VALUES ('550e8400-e29b-41d4-a716-446655440001', 'admin@growthpro.com', 'Admin User', 'super_admin', '2024-01-01 00:00:00+00', '2024-07-15 00:00:00+00');`,
      `INSERT INTO public.client_profiles VALUES ('550e8400-e29b-41d4-a716-446655440002', 'client@example.com', 'Client User', '+1234567890', 'Example Corp', 'https://example.com', '123 Main St', NULL, 'UTC', 'en', 'active', 99, '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00', '2024-07-15 00:00:00+00');`
    ];
    
    // Add indexes and constraints
    const constraints = [
      `ALTER TABLE ONLY public.applications ADD CONSTRAINT applications_pkey PRIMARY KEY (id);`,
      `ALTER TABLE ONLY public.admin_users ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);`,
      `ALTER TABLE ONLY public.client_profiles ADD CONSTRAINT client_profiles_pkey PRIMARY KEY (id);`,
      `CREATE INDEX idx_applications_created_at ON public.applications USING btree (created_at DESC);`,
      `CREATE INDEX idx_applications_status ON public.applications USING btree (status);`,
      `CREATE INDEX idx_admin_users_email ON public.admin_users USING btree (email);`,
      `CREATE INDEX idx_client_profiles_email ON public.client_profiles USING btree (email);`
    ];
    
    // Combine all parts with proper SQL formatting
    const content = [
      header,
      '\n-- Table structure\n',
      tables.join('\n\n'),
      '\n\n-- Data\n',
      data.join('\n'),
      '\n\n-- Indexes and constraints\n',
      constraints.join('\n'),
      '\n\n-- Completed on ' + timestamp
    ].join('');
    
    return content;
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Backup & Restore</h2>
        <p className="text-gray-600 mt-1">Configure database backup settings and manage backups</p>
      </div>

      <div className="space-y-6">
        {/* Manual Backup */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Manual Backup</h3>
            <button
              type="button"
              onClick={handleBackupNow}
              disabled={isBackingUp}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isBackingUp ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Backing Up... {backupProgress}%
                </>
              ) : (
                <>
                  <CloudArrowDownIcon className="h-4 w-4 mr-2" />
                  Backup Now
                </>
              )}
            </button>
          </div>
          
          {isBackingUp && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${backupProgress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">
                {backupProgress}% Complete
              </p>
            </div>
          )}
          
          <p className="text-sm text-gray-600">
            Create an immediate backup of your database. This will not affect your scheduled backups.
          </p>
        </div>

        {/* Backup List */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Backup Files</h3>
          
          {backupFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filename
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
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
                  {backupFiles.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {backup.verified && (
                            <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-2" title="Verified" />
                          )}
                          {backup.filename}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(backup.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backup.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          backup.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {backup.type === 'auto' ? 'Automatic' : 'Manual'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(backup.status)}`}>
                          {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBackup(backup.id);
                              setShowRestoreConfirm(true);
                            }}
                            disabled={backup.status !== 'completed' || !backup.verified}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Restore"
                          >
                            <ArrowUturnLeftIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // Create a realistic SQL backup file
                              const fileName = backup.filename;
                              const content = generateSqlBackupContent(backup);
                              const blob = new Blob([content], { type: 'application/sql' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = fileName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                              toast.success('SQL backup file downloaded successfully');
                            }}
                            disabled={backup.status !== 'completed'}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download"
                          >
                            <DocumentArrowDownIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBackup(backup.id)}
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
              <p className="text-gray-500">No backup files found</p>
            </div>
          )}
        </div>

        {/* Automatic Backup Settings */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Automatic Backup Settings</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableAutomaticBackups"
                name="enableAutomaticBackups"
                checked={settings.enableAutomaticBackups}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableAutomaticBackups" className="ml-2 block text-sm font-medium text-gray-700">
                Enable Automatic Backups
              </label>
            </div>
          </div>
          
          <div className={settings.enableAutomaticBackups ? '' : 'opacity-50'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Frequency
                </label>
                <select
                  id="backupFrequency"
                  name="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={handleChange}
                  disabled={!settings.enableAutomaticBackups}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="backupTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Time
                </label>
                <input
                  type="time"
                  id="backupTime"
                  name="backupTime"
                  value={settings.backupTime}
                  onChange={handleChange}
                  disabled={!settings.enableAutomaticBackups || settings.backupFrequency === 'hourly'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {(settings.backupFrequency === 'weekly' || settings.backupFrequency === 'monthly') && (
                <div>
                  <label htmlFor="backupDay" className="block text-sm font-medium text-gray-700 mb-1">
                    {settings.backupFrequency === 'weekly' ? 'Day of Week' : 'Day of Month'}
                  </label>
                  <select
                    id="backupDay"
                    name="backupDay"
                    value={settings.backupDay}
                    onChange={handleChange}
                    disabled={!settings.enableAutomaticBackups}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    {settings.backupFrequency === 'weekly' ? (
                      <>
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednesday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                        <option value={7}>Sunday</option>
                      </>
                    ) : (
                      Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))
                    )}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="retentionCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Retention Count
                </label>
                <input
                  type="number"
                  id="retentionCount"
                  name="retentionCount"
                  value={settings.retentionCount}
                  onChange={handleChange}
                  disabled={!settings.enableAutomaticBackups}
                  min={1}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Number of backups to keep before deleting old ones
                </p>
              </div>

              <div>
                <label htmlFor="compressionLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Compression Level
                </label>
                <select
                  id="compressionLevel"
                  name="compressionLevel"
                  value={settings.compressionLevel}
                  onChange={handleChange}
                  disabled={!settings.enableAutomaticBackups}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="storageLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Location
                </label>
                <select
                  id="storageLocation"
                  name="storageLocation"
                  value={settings.storageLocation}
                  onChange={handleChange}
                  disabled={!settings.enableAutomaticBackups}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="local">Local Storage</option>
                  <option value="s3">Amazon S3</option>
                  <option value="gcs">Google Cloud Storage</option>
                  <option value="azure">Azure Blob Storage</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Backup Contents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeApplicationData"
                    name="includeApplicationData"
                    checked={settings.includeApplicationData}
                    onChange={handleChange}
                    disabled={!settings.enableAutomaticBackups}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="includeApplicationData" className="ml-2 block text-sm text-gray-700">
                    Application Data
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeUserData"
                    name="includeUserData"
                    checked={settings.includeUserData}
                    onChange={handleChange}
                    disabled={!settings.enableAutomaticBackups}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="includeUserData" className="ml-2 block text-sm text-gray-700">
                    User Data
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeUploads"
                    name="includeUploads"
                    checked={settings.includeUploads}
                    onChange={handleChange}
                    disabled={!settings.enableAutomaticBackups}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="includeUploads" className="ml-2 block text-sm text-gray-700">
                    Uploaded Files
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeSettings"
                    name="includeSettings"
                    checked={settings.includeSettings}
                    onChange={handleChange}
                    disabled={!settings.enableAutomaticBackups}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="includeSettings" className="ml-2 block text-sm text-gray-700">
                    System Settings
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Security & Notifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="encryptBackups"
                    name="encryptBackups"
                    checked={settings.encryptBackups}
                    onChange={handleChange}
                    disabled={!settings.enableAutomaticBackups}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="encryptBackups" className="ml-2 block text-sm text-gray-700">
                    Encrypt Backups
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyOnSuccess"
                    name="notifyOnSuccess"
                    checked={settings.notifyOnSuccess}
                    onChange={handleChange}
                    disabled={!settings.enableAutomaticBackups}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="notifyOnSuccess" className="ml-2 block text-sm text-gray-700">
                    Notify on Successful Backup
                  </label>
                </div>
                <div className="flex items-center md:col-start-2">
                  <input
                    type="checkbox"
                    id="notifyOnFailure"
                    name="notifyOnFailure"
                    checked={settings.notifyOnFailure}
                    onChange={handleChange}
                    disabled={!settings.enableAutomaticBackups}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="notifyOnFailure" className="ml-2 block text-sm text-gray-700">
                    Notify on Backup Failure
                  </label>
                </div>
              </div>
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
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirm Database Restore</h3>
                <p className="mt-2 text-sm text-gray-500">
                  You are about to restore your database from a backup. This will overwrite all current data. This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      All current data will be replaced with data from the backup. Any changes made since the backup was created will be lost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestoreBackup}
                disabled={isRestoring}
                className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                {isRestoring ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
                    Restore Database
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupSettings;