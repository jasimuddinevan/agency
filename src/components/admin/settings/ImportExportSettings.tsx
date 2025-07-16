import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  ArrowPathIcon, 
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

const ImportExportSettings: React.FC = () => {
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    {
      id: 'applications',
      name: 'Applications',
      description: 'Export all application data',
      checked: true
    },
    {
      id: 'users',
      name: 'Users',
      description: 'Export user accounts and profiles',
      checked: true
    },
    {
      id: 'messages',
      name: 'Messages',
      description: 'Export all message data',
      checked: true
    },
    {
      id: 'services',
      name: 'Services',
      description: 'Export service configurations',
      checked: true
    },
    {
      id: 'settings',
      name: 'System Settings',
      description: 'Export all system settings',
      checked: true
    },
    {
      id: 'templates',
      name: 'Email Templates',
      description: 'Export email templates',
      checked: true
    }
  ]);
  
  const [exportFormat, setExportFormat] = useState('json');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExportOptionChange = (id: string) => {
    setExportOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, checked: !option.checked }
          : option
      )
    );
  };

  const handleSelectAll = () => {
    const allChecked = exportOptions.every(option => option.checked);
    setExportOptions(prev => 
      prev.map(option => ({ ...option, checked: !allChecked }))
    );
  };

  const handleExport = async () => {
    const selectedOptions = exportOptions.filter(option => option.checked);
    
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one data type to export');
      return;
    }
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export process with progress
      for (let i = 0; i <= 100; i += 5) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // In a real app, this would generate and download a file
      toast.success('Data exported successfully');
      
      // Simulate file download
      const fileName = `growthpro-export${includeTimestamp ? `-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}` : ''}.${exportFormat}`;
      
      // Create a fake download link
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      link.click();
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }
    
    if (!window.confirm('Are you sure you want to import this data? This may overwrite existing data.')) {
      return;
    }
    
    setIsImporting(true);
    setImportProgress(0);
    
    try {
      // Simulate import process with progress
      for (let i = 0; i <= 100; i += 5) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      toast.success('Data imported successfully');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('importFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      toast.error('Failed to import data');
      console.error('Error importing data:', error);
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Import & Export</h2>
        <p className="text-gray-600 mt-1">Import and export system data</p>
      </div>

      <div className="space-y-6">
        {/* Export Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <DocumentArrowDownIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Export Data</h3>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">Select Data to Export</h4>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {exportOptions.every(option => option.checked) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportOptions.map((option) => (
                <div key={option.id} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`export-${option.id}`}
                    checked={option.checked}
                    onChange={() => handleExportOptionChange(option.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor={`export-${option.id}`} className="ml-2 block">
                    <span className="text-sm font-medium text-gray-900">{option.name}</span>
                    <span className="text-xs text-gray-500 block">{option.description}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700 mb-1">
                Export Format
              </label>
              <select
                id="exportFormat"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeTimestamp"
                checked={includeTimestamp}
                onChange={(e) => setIncludeTimestamp(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeTimestamp" className="ml-2 block text-sm text-gray-700">
                Include timestamp in filename
              </label>
            </div>
          </div>
          
          {isExporting && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${exportProgress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">
                {exportProgress}% Complete
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <motion.button
              type="button"
              onClick={handleExport}
              disabled={isExporting || exportOptions.every(option => !option.checked)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <DocumentArrowUpIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Import Data</h3>
          </div>
          
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Importing data may overwrite existing records. Make sure to backup your data before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="importFile" className="block text-sm font-medium text-gray-700 mb-2">
                Select File to Import
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="importFile"
                  onChange={handleFileChange}
                  accept=".json,.csv,.xml"
                  className="hidden"
                  disabled={isImporting}
                />
                <label
                  htmlFor="importFile"
                  className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isImporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: JSON, CSV, XML
              </p>
            </div>
            
            {isImporting && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${importProgress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 text-right">
                  {importProgress}% Complete
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <motion.button
              type="button"
              onClick={handleImport}
              disabled={isImporting || !selectedFile}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Import Data
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Templates Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <DocumentDuplicateIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Export/Import Templates</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Export Templates</h4>
              <p className="text-sm text-gray-600 mb-4">
                Export predefined templates for common data structures
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 text-blue-600 mr-2" />
                  User Import Template
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Application Import Template
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Service Import Template
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Data Migration</h4>
              <p className="text-sm text-gray-600 mb-4">
                Tools for migrating data between environments
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Export Production Data
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ArrowUpTrayIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Import to Staging
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Data Format Documentation</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    For detailed information about import/export data formats and requirements, please refer to our 
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium ml-1">documentation</a>.
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

export default ImportExportSettings;