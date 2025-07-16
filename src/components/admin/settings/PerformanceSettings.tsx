import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  ArrowPathIcon, 
  ChartBarIcon,
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  history: { timestamp: string; value: number }[];
}

const PerformanceSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    enablePerformanceMonitoring: true,
    monitoringInterval: 5, // minutes
    alertThreshold: 80, // percentage
    logPerformanceIssues: true,
    enableAutomaticOptimization: false,
    optimizationTime: '02:00',
    enableQueryCaching: true,
    queryCacheTTL: 60, // minutes
    maxConcurrentRequests: 100,
    requestTimeout: 30, // seconds
    enableResourceLimiting: true,
    cpuLimit: 80, // percentage
    memoryLimit: 80, // percentage
    notifyOnPerformanceIssues: true
  });
  
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingMetrics, setIsRefreshingMetrics] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Simulate loading performance metrics
  useEffect(() => {
    loadPerformanceMetrics();
  }, []);

  const loadPerformanceMetrics = async () => {
    setIsRefreshingMetrics(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generateHistory = () => {
        const history = [];
        const now = new Date();
        
        for (let i = 0; i < 24; i++) {
          const timestamp = new Date(now);
          timestamp.setHours(now.getHours() - i);
          
          history.push({
            timestamp: timestamp.toISOString(),
            value: Math.floor(Math.random() * 100)
          });
        }
        
        return history.reverse();
      };
      
      setMetrics([
        {
          name: 'CPU Usage',
          value: Math.floor(Math.random() * 100),
          unit: '%',
          status: Math.random() > 0.7 ? 'warning' : 'good',
          history: generateHistory()
        },
        {
          name: 'Memory Usage',
          value: Math.floor(Math.random() * 100),
          unit: '%',
          status: Math.random() > 0.8 ? 'warning' : 'good',
          history: generateHistory()
        },
        {
          name: 'Database Connections',
          value: Math.floor(Math.random() * 50),
          unit: '',
          status: Math.random() > 0.9 ? 'warning' : 'good',
          history: generateHistory()
        },
        {
          name: 'Average Response Time',
          value: Math.floor(Math.random() * 500),
          unit: 'ms',
          status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'good',
          history: generateHistory()
        },
        {
          name: 'Requests Per Minute',
          value: Math.floor(Math.random() * 200),
          unit: '',
          status: 'good',
          history: generateHistory()
        },
        {
          name: 'Disk Usage',
          value: Math.floor(Math.random() * 100),
          unit: '%',
          status: Math.random() > 0.8 ? 'warning' : 'good',
          history: generateHistory()
        }
      ]);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading performance metrics:', error);
      toast.error('Failed to load performance metrics');
    } finally {
      setIsRefreshingMetrics(false);
    }
  };

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
      toast.success('Performance settings saved successfully');
    } catch (error) {
      toast.error('Failed to save performance settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'CPU Usage':
        return <CpuChipIcon className="h-5 w-5" />;
      case 'Memory Usage':
        return <ServerIcon className="h-5 w-5" />;
      case 'Database Connections':
        return <CircleStackIcon className="h-5 w-5" />;
      case 'Average Response Time':
        return <ClockIcon className="h-5 w-5" />;
      case 'Requests Per Minute':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'Disk Usage':
        return <ServerIcon className="h-5 w-5" />;
      default:
        return <ChartBarIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Monitoring</h2>
          <p className="text-gray-600 mt-1">Monitor and optimize system performance</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            onClick={loadPerformanceMetrics}
            disabled={isRefreshingMetrics}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isRefreshingMetrics ? (
              <>
                <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh Metrics
              </>
            )}
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Current Performance Metrics</h3>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        {isRefreshingMetrics && metrics.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading performance metrics...</p>
          </div>
        ) : metrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric) => (
              <div key={metric.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getStatusColor(metric.status)} bg-opacity-10`}>
                      {getMetricIcon(metric.name)}
                    </div>
                    <h4 className="ml-2 text-sm font-medium text-gray-900">{metric.name}</h4>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(metric.status)}`}>
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-baseline mt-2">
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="ml-1 text-sm text-gray-500">{metric.unit}</div>
                </div>
                
                {/* Simple sparkline chart */}
                <div className="mt-4 h-10">
                  <div className="flex items-end h-full space-x-1">
                    {metric.history.slice(-12).map((point, index) => {
                      const height = `${Math.max(10, point.value)}%`;
                      let bgColor = 'bg-blue-500';
                      
                      if (point.value > 80) bgColor = 'bg-red-500';
                      else if (point.value > 60) bgColor = 'bg-yellow-500';
                      
                      return (
                        <div
                          key={index}
                          className={`w-full ${bgColor} rounded-t`}
                          style={{ height }}
                          title={`${new Date(point.timestamp).toLocaleTimeString()}: ${point.value}${metric.unit}`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>12 hours ago</span>
                  <span>Now</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No performance metrics available</p>
          </div>
        )}
      </div>

      {/* Performance Settings */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Performance Settings</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enablePerformanceMonitoring"
              name="enablePerformanceMonitoring"
              checked={settings.enablePerformanceMonitoring}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enablePerformanceMonitoring" className="ml-2 block text-sm font-medium text-gray-700">
              Enable Performance Monitoring
            </label>
          </div>
        </div>
        
        <div className={settings.enablePerformanceMonitoring ? '' : 'opacity-50'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="monitoringInterval" className="block text-sm font-medium text-gray-700 mb-1">
                Monitoring Interval (minutes)
              </label>
              <input
                type="number"
                id="monitoringInterval"
                name="monitoringInterval"
                value={settings.monitoringInterval}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                min={1}
                max={60}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                How often to collect performance metrics
              </p>
            </div>

            <div>
              <label htmlFor="alertThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Alert Threshold (%)
              </label>
              <input
                type="number"
                id="alertThreshold"
                name="alertThreshold"
                value={settings.alertThreshold}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                min={50}
                max={95}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Send alerts when resource usage exceeds this percentage
              </p>
            </div>

            <div>
              <label htmlFor="maxConcurrentRequests" className="block text-sm font-medium text-gray-700 mb-1">
                Max Concurrent Requests
              </label>
              <input
                type="number"
                id="maxConcurrentRequests"
                name="maxConcurrentRequests"
                value={settings.maxConcurrentRequests}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                min={10}
                max={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="requestTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                Request Timeout (seconds)
              </label>
              <input
                type="number"
                id="requestTimeout"
                name="requestTimeout"
                value={settings.requestTimeout}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                min={5}
                max={120}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Resource Limits</h4>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="enableResourceLimiting"
                name="enableResourceLimiting"
                checked={settings.enableResourceLimiting}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="enableResourceLimiting" className="ml-2 block text-sm font-medium text-gray-700">
                Enable Resource Limiting
              </label>
            </div>
            
            <div className={settings.enableResourceLimiting && settings.enablePerformanceMonitoring ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'opacity-50 grid grid-cols-1 md:grid-cols-2 gap-6'}>
              <div>
                <label htmlFor="cpuLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  CPU Limit (%)
                </label>
                <input
                  type="number"
                  id="cpuLimit"
                  name="cpuLimit"
                  value={settings.cpuLimit}
                  onChange={handleChange}
                  disabled={!settings.enableResourceLimiting || !settings.enablePerformanceMonitoring}
                  min={50}
                  max={95}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="memoryLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Memory Limit (%)
                </label>
                <input
                  type="number"
                  id="memoryLimit"
                  name="memoryLimit"
                  value={settings.memoryLimit}
                  onChange={handleChange}
                  disabled={!settings.enableResourceLimiting || !settings.enablePerformanceMonitoring}
                  min={50}
                  max={95}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Optimization</h4>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="enableAutomaticOptimization"
                name="enableAutomaticOptimization"
                checked={settings.enableAutomaticOptimization}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="enableAutomaticOptimization" className="ml-2 block text-sm font-medium text-gray-700">
                Enable Automatic Optimization
              </label>
            </div>
            
            <div className={settings.enableAutomaticOptimization && settings.enablePerformanceMonitoring ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'opacity-50 grid grid-cols-1 md:grid-cols-2 gap-6'}>
              <div>
                <label htmlFor="optimizationTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Optimization Time
                </label>
                <input
                  type="time"
                  id="optimizationTime"
                  name="optimizationTime"
                  value={settings.optimizationTime}
                  onChange={handleChange}
                  disabled={!settings.enableAutomaticOptimization || !settings.enablePerformanceMonitoring}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Time of day to run automatic optimization
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Query Caching</h4>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="enableQueryCaching"
                name="enableQueryCaching"
                checked={settings.enableQueryCaching}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="enableQueryCaching" className="ml-2 block text-sm font-medium text-gray-700">
                Enable Query Caching
              </label>
            </div>
            
            <div className={settings.enableQueryCaching && settings.enablePerformanceMonitoring ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'opacity-50 grid grid-cols-1 md:grid-cols-2 gap-6'}>
              <div>
                <label htmlFor="queryCacheTTL" className="block text-sm font-medium text-gray-700 mb-1">
                  Cache TTL (minutes)
                </label>
                <input
                  type="number"
                  id="queryCacheTTL"
                  name="queryCacheTTL"
                  value={settings.queryCacheTTL}
                  onChange={handleChange}
                  disabled={!settings.enableQueryCaching || !settings.enablePerformanceMonitoring}
                  min={1}
                  max={1440}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Time to live for cached query results
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="logPerformanceIssues"
                name="logPerformanceIssues"
                checked={settings.logPerformanceIssues}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="logPerformanceIssues" className="ml-2 block text-sm text-gray-700">
                Log Performance Issues
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifyOnPerformanceIssues"
                name="notifyOnPerformanceIssues"
                checked={settings.notifyOnPerformanceIssues}
                onChange={handleChange}
                disabled={!settings.enablePerformanceMonitoring}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="notifyOnPerformanceIssues" className="ml-2 block text-sm text-gray-700">
                Notify on Performance Issues
              </label>
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
  );
};

export default PerformanceSettings;