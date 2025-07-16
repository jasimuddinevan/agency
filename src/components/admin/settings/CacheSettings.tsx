import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  ArrowPathIcon, 
  FireIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TrashIcon,
  CircleStackIcon,
  DocumentTextIcon,
  PhotoIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface CacheStats {
  type: string;
  size: string;
  items: number;
  hitRate: number;
  lastCleared: string | null;
}

const CacheSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    enablePageCache: true,
    pageCacheTTL: 60, // minutes
    enableDataCache: true,
    dataCacheTTL: 30, // minutes
    enableAssetCache: true,
    assetCacheTTL: 1440, // minutes (1 day)
    enableApiCache: true,
    apiCacheTTL: 15, // minutes
    cacheExclusions: '/admin/*, /api/webhook/*, /user/profile',
    clearCacheOnDeploy: true,
    enableAutoCleanup: true,
    cleanupInterval: 24, // hours
    maxCacheSize: 500, // MB
    enableCacheWarming: false,
    cacheWarmingUrls: '',
    logCacheOperations: true
  });
  
  const [cacheStats, setCacheStats] = useState<CacheStats[]>([
    {
      type: 'Page Cache',
      size: '24.5 MB',
      items: 128,
      hitRate: 87.5,
      lastCleared: '2024-07-15T10:30:00Z'
    },
    {
      type: 'Data Cache',
      size: '12.8 MB',
      items: 256,
      hitRate: 92.3,
      lastCleared: '2024-07-15T10:30:00Z'
    },
    {
      type: 'Asset Cache',
      size: '156.2 MB',
      items: 432,
      hitRate: 98.1,
      lastCleared: '2024-07-10T08:15:00Z'
    },
    {
      type: 'API Cache',
      size: '8.7 MB',
      items: 94,
      hitRate: 76.4,
      lastCleared: '2024-07-15T10:30:00Z'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState<Record<string, boolean>>({});
  const [clearProgress, setClearProgress] = useState(0);

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
      toast.success('Cache settings saved successfully');
    } catch (error) {
      toast.error('Failed to save cache settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async (cacheType: string) => {
    setIsClearingCache(prev => ({ ...prev, [cacheType]: true }));
    setClearProgress(0);
    
    try {
      // Simulate cache clearing with progress
      for (let i = 0; i <= 100; i += 10) {
        setClearProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Update cache stats
      setCacheStats(prev => 
        prev.map(stat => 
          stat.type === cacheType 
            ? { ...stat, size: '0 B', items: 0, lastCleared: new Date().toISOString() }
            : stat
        )
      );
      
      toast.success(`${cacheType} cleared successfully`);
    } catch (error) {
      toast.error(`Failed to clear ${cacheType}`);
      console.error(`Error clearing ${cacheType}:`, error);
    } finally {
      setIsClearingCache(prev => ({ ...prev, [cacheType]: false }));
      setClearProgress(0);
    }
  };

  const handleClearAllCaches = async () => {
    if (!window.confirm('Are you sure you want to clear all caches? This may temporarily slow down the application.')) {
      return;
    }
    
    const cacheTypes = cacheStats.map(stat => stat.type);
    setIsClearingCache(
      cacheTypes.reduce((acc, type) => ({ ...acc, [type]: true }), {})
    );
    setClearProgress(0);
    
    try {
      // Simulate cache clearing with progress
      for (let i = 0; i <= 100; i += 10) {
        setClearProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Update all cache stats
      setCacheStats(prev => 
        prev.map(stat => ({ 
          ...stat, 
          size: '0 B', 
          items: 0, 
          lastCleared: new Date().toISOString() 
        }))
      );
      
      toast.success('All caches cleared successfully');
    } catch (error) {
      toast.error('Failed to clear all caches');
      console.error('Error clearing all caches:', error);
    } finally {
      setIsClearingCache({});
      setClearProgress(0);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCacheIcon = (cacheType: string) => {
    switch (cacheType) {
      case 'Page Cache':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'Data Cache':
        return <CircleStackIcon className="h-5 w-5" />;
      case 'Asset Cache':
        return <PhotoIcon className="h-5 w-5" />;
      case 'API Cache':
        return <CodeBracketIcon className="h-5 w-5" />;
      default:
        return <FireIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cache Management</h2>
        <p className="text-gray-600 mt-1">Configure and manage system caches</p>
      </div>

      <div className="space-y-6">
        {/* Cache Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Cache Statistics</h3>
            <button
              type="button"
              onClick={handleClearAllCaches}
              disabled={Object.values(isClearingCache).some(Boolean) || cacheStats.every(stat => stat.items === 0)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Clear All Caches
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cacheStats.map((stat) => (
              <div key={stat.type} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                      {getCacheIcon(stat.type)}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">{stat.type}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleClearCache(stat.type)}
                    disabled={isClearingCache[stat.type] || stat.items === 0}
                    className="flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isClearingCache[stat.type] ? (
                      <>
                        <ArrowPathIcon className="animate-spin h-3 w-3 mr-1" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="h-3 w-3 mr-1" />
                        Clear
                      </>
                    )}
                  </button>
                </div>
                
                {isClearingCache[stat.type] && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${clearProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      {clearProgress}% Complete
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Size:</p>
                    <p className="font-medium text-gray-900">{stat.size}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Items:</p>
                    <p className="font-medium text-gray-900">{stat.items.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hit Rate:</p>
                    <p className="font-medium text-gray-900">{stat.hitRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Cleared:</p>
                    <p className="font-medium text-gray-900">{formatDate(stat.lastCleared)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cache Settings */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cache Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Page Cache */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="enablePageCache" className="block text-sm font-medium text-gray-700">
                  Page Cache
                </label>
                <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id="enablePageCache"
                    name="enablePageCache"
                    checked={settings.enablePageCache}
                    onChange={handleChange}
                    className="opacity-0 w-0 h-0"
                  />
                  <label
                    htmlFor="enablePageCache"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      settings.enablePageCache ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 bottom-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        settings.enablePageCache ? 'transform translate-x-5' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className={settings.enablePageCache ? '' : 'opacity-50'}>
                <label htmlFor="pageCacheTTL" className="block text-sm text-gray-700 mb-1">
                  TTL (minutes)
                </label>
                <input
                  type="number"
                  id="pageCacheTTL"
                  name="pageCacheTTL"
                  value={settings.pageCacheTTL}
                  onChange={handleChange}
                  disabled={!settings.enablePageCache}
                  min={1}
                  max={10080} // 1 week
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Data Cache */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="enableDataCache" className="block text-sm font-medium text-gray-700">
                  Data Cache
                </label>
                <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id="enableDataCache"
                    name="enableDataCache"
                    checked={settings.enableDataCache}
                    onChange={handleChange}
                    className="opacity-0 w-0 h-0"
                  />
                  <label
                    htmlFor="enableDataCache"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      settings.enableDataCache ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 bottom-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        settings.enableDataCache ? 'transform translate-x-5' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className={settings.enableDataCache ? '' : 'opacity-50'}>
                <label htmlFor="dataCacheTTL" className="block text-sm text-gray-700 mb-1">
                  TTL (minutes)
                </label>
                <input
                  type="number"
                  id="dataCacheTTL"
                  name="dataCacheTTL"
                  value={settings.dataCacheTTL}
                  onChange={handleChange}
                  disabled={!settings.enableDataCache}
                  min={1}
                  max={10080} // 1 week
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Asset Cache */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="enableAssetCache" className="block text-sm font-medium text-gray-700">
                  Asset Cache
                </label>
                <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id="enableAssetCache"
                    name="enableAssetCache"
                    checked={settings.enableAssetCache}
                    onChange={handleChange}
                    className="opacity-0 w-0 h-0"
                  />
                  <label
                    htmlFor="enableAssetCache"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      settings.enableAssetCache ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 bottom-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        settings.enableAssetCache ? 'transform translate-x-5' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className={settings.enableAssetCache ? '' : 'opacity-50'}>
                <label htmlFor="assetCacheTTL" className="block text-sm text-gray-700 mb-1">
                  TTL (minutes)
                </label>
                <input
                  type="number"
                  id="assetCacheTTL"
                  name="assetCacheTTL"
                  value={settings.assetCacheTTL}
                  onChange={handleChange}
                  disabled={!settings.enableAssetCache}
                  min={1}
                  max={43200} // 30 days
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* API Cache */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="enableApiCache" className="block text-sm font-medium text-gray-700">
                  API Cache
                </label>
                <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out">
                  <input
                    type="checkbox"
                    id="enableApiCache"
                    name="enableApiCache"
                    checked={settings.enableApiCache}
                    onChange={handleChange}
                    className="opacity-0 w-0 h-0"
                  />
                  <label
                    htmlFor="enableApiCache"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      settings.enableApiCache ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 bottom-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        settings.enableApiCache ? 'transform translate-x-5' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className={settings.enableApiCache ? '' : 'opacity-50'}>
                <label htmlFor="apiCacheTTL" className="block text-sm text-gray-700 mb-1">
                  TTL (minutes)
                </label>
                <input
                  type="number"
                  id="apiCacheTTL"
                  name="apiCacheTTL"
                  value={settings.apiCacheTTL}
                  onChange={handleChange}
                  disabled={!settings.enableApiCache}
                  min={1}
                  max={1440} // 1 day
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="md:col-span-2">
              <label htmlFor="cacheExclusions" className="block text-sm font-medium text-gray-700 mb-1">
                Cache Exclusions
              </label>
              <textarea
                id="cacheExclusions"
                name="cacheExclusions"
                value={settings.cacheExclusions}
                onChange={handleChange}
                rows={2}
                placeholder="Enter paths to exclude from caching, one per line or comma-separated"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Paths or patterns to exclude from caching (e.g., /admin/*, /api/webhook/*)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxCacheSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Cache Size (MB)
                </label>
                <input
                  type="number"
                  id="maxCacheSize"
                  name="maxCacheSize"
                  value={settings.maxCacheSize}
                  onChange={handleChange}
                  min={50}
                  max={10000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="cleanupInterval" className="block text-sm font-medium text-gray-700 mb-1">
                  Cleanup Interval (hours)
                </label>
                <input
                  type="number"
                  id="cleanupInterval"
                  name="cleanupInterval"
                  value={settings.cleanupInterval}
                  onChange={handleChange}
                  min={1}
                  max={168} // 1 week
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="clearCacheOnDeploy"
                  name="clearCacheOnDeploy"
                  checked={settings.clearCacheOnDeploy}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="clearCacheOnDeploy" className="ml-2 block text-sm text-gray-700">
                  Clear cache on deployment
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableAutoCleanup"
                  name="enableAutoCleanup"
                  checked={settings.enableAutoCleanup}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableAutoCleanup" className="ml-2 block text-sm text-gray-700">
                  Enable automatic cache cleanup
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="logCacheOperations"
                  name="logCacheOperations"
                  checked={settings.logCacheOperations}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="logCacheOperations" className="ml-2 block text-sm text-gray-700">
                  Log cache operations
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="enableCacheWarming"
                  name="enableCacheWarming"
                  checked={settings.enableCacheWarming}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableCacheWarming" className="ml-2 block text-sm font-medium text-gray-700">
                  Enable Cache Warming
                </label>
              </div>
              
              <div className={settings.enableCacheWarming ? '' : 'opacity-50'}>
                <label htmlFor="cacheWarmingUrls" className="block text-sm text-gray-700 mb-1">
                  Cache Warming URLs
                </label>
                <textarea
                  id="cacheWarmingUrls"
                  name="cacheWarmingUrls"
                  value={settings.cacheWarmingUrls}
                  onChange={handleChange}
                  disabled={!settings.enableCacheWarming}
                  rows={3}
                  placeholder="Enter URLs to pre-cache, one per line"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  These URLs will be automatically visited to warm up the cache
                </p>
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
    </div>
  );
};


export default CacheSettings