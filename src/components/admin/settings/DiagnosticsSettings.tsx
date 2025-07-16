import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  ArrowPathIcon, 
  BoltIcon,
  ExclamationTriangleIcon,
  ServerIcon,
  CircleStackIcon,
  EnvelopeIcon,
  CloudIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SystemCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'warning' | 'failed' | 'running' | 'pending';
  details?: string;
  lastRun: string | null;
}

const DiagnosticsSettings: React.FC = () => {
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([
    {
      id: 'database',
      name: 'Database Connection',
      description: 'Checks database connectivity and performance',
      status: 'pending',
      lastRun: null
    },
    {
      id: 'email',
      name: 'Email System',
      description: 'Verifies email sending capabilities',
      status: 'pending',
      lastRun: null
    },
    {
      id: 'storage',
      name: 'Storage System',
      description: 'Checks file storage access and permissions',
      status: 'pending',
      lastRun: null
    },
    {
      id: 'cache',
      name: 'Cache System',
      description: 'Verifies cache functionality',
      status: 'pending',
      lastRun: null
    },
    {
      id: 'security',
      name: 'Security Checks',
      description: 'Performs basic security validation',
      status: 'pending',
      lastRun: null
    },
    {
      id: 'api',
      name: 'API Endpoints',
      description: 'Tests critical API endpoints',
      status: 'pending',
      lastRun: null
    }
  ]);
  
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    version: '1.5.2',
    nodeVersion: '18.16.0',
    databaseVersion: 'PostgreSQL 14.5',
    uptime: '15 days, 7 hours',
    lastDeployment: '2024-07-10 09:45:12',
    environment: 'production',
    serverMemory: '4 GB',
    serverCPU: '2 vCPUs',
    diskSpace: '50 GB (32% used)'
  });

  const runSystemChecks = async () => {
    setIsRunningChecks(true);
    
    // Reset all checks to running
    setSystemChecks(prev => 
      prev.map(check => ({ ...check, status: 'running' }))
    );
    
    try {
      // Simulate running checks with different outcomes
      for (let i = 0; i < systemChecks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Randomly determine check result for demo purposes
        const random = Math.random();
        let status: SystemCheck['status'] = 'passed';
        let details = undefined;
        
        if (random < 0.2) {
          status = 'warning';
          details = `Minor issue detected: ${systemChecks[i].name} is functioning but with reduced performance`;
        } else if (random < 0.1) {
          status = 'failed';
          details = `Failed to connect to ${systemChecks[i].name.toLowerCase()} system`;
        }
        
        setSystemChecks(prev => 
          prev.map((check, index) => 
            index === i 
              ? { 
                  ...check, 
                  status, 
                  details,
                  lastRun: new Date().toISOString()
                }
              : check
          )
        );
      }
      
      toast.success('System checks completed');
    } catch (error) {
      toast.error('Failed to complete system checks');
      console.error('Error running system checks:', error);
    } finally {
      setIsRunningChecks(false);
    }
  };

  const generateDiagnosticReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Diagnostic report generated successfully');
      
      // Simulate file download
      const fileName = `growthpro-diagnostic-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
      
      // Create a fake download link
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      link.click();
    } catch (error) {
      toast.error('Failed to generate diagnostic report');
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'running':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <BoltIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCheckIcon = (id: string) => {
    switch (id) {
      case 'database':
        return <CircleStackIcon className="h-5 w-5" />;
      case 'email':
        return <EnvelopeIcon className="h-5 w-5" />;
      case 'storage':
        return <ServerIcon className="h-5 w-5" />;
      case 'cache':
        return <BoltIcon className="h-5 w-5" />;
      case 'security':
        return <LockClosedIcon className="h-5 w-5" />;
      case 'api':
        return <CloudIcon className="h-5 w-5" />;
      default:
        return <BoltIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">System Diagnostics</h2>
        <p className="text-gray-600 mt-1">Run diagnostics and generate system reports</p>
      </div>

      <div className="space-y-6">
        {/* System Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">System Version</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.version}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Node.js Version</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.nodeVersion}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Database Version</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.databaseVersion}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Environment</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.environment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">System Uptime</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.uptime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Deployment</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.lastDeployment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Server Memory</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.serverMemory}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Server CPU</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.serverCPU}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Disk Space</p>
              <p className="text-sm font-medium text-gray-900">{systemInfo.diskSpace}</p>
            </div>
          </div>
        </div>

        {/* System Health Checks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BoltIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">System Health Checks</h3>
            </div>
            <button
              type="button"
              onClick={runSystemChecks}
              disabled={isRunningChecks}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isRunningChecks ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Running Checks...
                </>
              ) : (
                <>
                  <BoltIcon className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            {systemChecks.map((check) => (
              <div key={check.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      check.status === 'passed' ? 'bg-green-100 text-green-600' :
                      check.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      check.status === 'failed' ? 'bg-red-100 text-red-600' :
                      check.status === 'running' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    } mr-3`}>
                      {getCheckIcon(check.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{check.name}</h4>
                      <p className="text-xs text-gray-500">{check.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(check.status)}`}>
                      {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {check.details && (
                  <div className={`mt-2 p-2 rounded text-sm ${
                    check.status === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    check.status === 'failed' ? 'bg-red-50 text-red-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {check.details}
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>Last run: {formatDate(check.lastRun)}</span>
                  {check.status === 'failed' && (
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        // In a real app, this would show more detailed error information
                        alert(`Detailed error for ${check.name}: ${check.details}`);
                      }}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={generateDiagnosticReport}
              disabled={isGeneratingReport || systemChecks.some(check => check.status === 'running' || check.status === 'pending')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isGeneratingReport ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Generate Diagnostic Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Troubleshooting Tools */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Troubleshooting Tools</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Database Diagnostics</h4>
              <p className="text-sm text-gray-600 mb-4">
                Run database diagnostics to identify and fix common issues
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <CircleStackIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Check Database Connections
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <CircleStackIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Analyze Query Performance
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <CircleStackIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Verify Database Integrity
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Email System Tests</h4>
              <p className="text-sm text-gray-600 mb-4">
                Verify email functionality and troubleshoot delivery issues
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <EnvelopeIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Test SMTP Connection
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <EnvelopeIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Send Test Email
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <EnvelopeIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Check Email Queue
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">File System Checks</h4>
              <p className="text-sm text-gray-600 mb-4">
                Diagnose file storage and permission issues
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ServerIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Check Disk Space
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ServerIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Verify File Permissions
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ServerIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Test File Upload
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Security Diagnostics</h4>
              <p className="text-sm text-gray-600 mb-4">
                Run security checks and identify vulnerabilities
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <LockClosedIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Security Headers Check
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <LockClosedIcon className="h-4 w-4 text-blue-600 mr-2" />
                  SSL Certificate Validation
                </button>
                <button
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <LockClosedIcon className="h-4 w-4 text-blue-600 mr-2" />
                  Authentication System Test
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Need Help?</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    If you're experiencing issues that can't be resolved with these tools, please contact our support team or refer to the 
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium ml-1">troubleshooting documentation</a>.
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

export default DiagnosticsSettings;