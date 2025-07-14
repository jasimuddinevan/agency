import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  ShoppingCartIcon,
  MegaphoneIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { ClientService } from '../../../types/client';

interface ServicesListProps {
  services: ClientService[];
  isLoading?: boolean;
  onServiceAction?: (serviceId: string, action: 'pause' | 'resume' | 'cancel' | 'renew') => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ 
  services, 
  isLoading = false,
  onServiceAction 
}) => {
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'web-management':
        return ShieldCheckIcon;
      case 'shopify-growth':
        return ShoppingCartIcon;
      case 'facebook-ads':
        return MegaphoneIcon;
      default:
        return ShieldCheckIcon;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'web-management':
        return 'from-green-500 to-emerald-600';
      case 'shopify-growth':
        return 'from-purple-500 to-pink-600';
      case 'facebook-ads':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {services.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ShieldCheckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Yet</h3>
          <p className="text-gray-600 mb-6">You don't have any active services. Contact us to get started!</p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Contact Sales
          </button>
        </div>
      ) : (
        services.map((service, index) => {
          const IconComponent = getServiceIcon(service.type);
          const colorClasses = getServiceColor(service.type);
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Service Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`bg-gradient-to-r ${colorClasses} p-3 rounded-lg mr-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {service.plan} Plan • {service.billing_cycle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${service.price}/{service.billing_cycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Metrics */}
              {service.metrics && (
                <div className="p-6 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {service.metrics.uptime && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{service.metrics.uptime}</div>
                        <div className="text-xs text-gray-600">Uptime</div>
                      </div>
                    )}
                    {service.metrics.performance_score && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{service.metrics.performance_score}/100</div>
                        <div className="text-xs text-gray-600">Performance</div>
                      </div>
                    )}
                    {service.metrics.conversions && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{service.metrics.conversions}</div>
                        <div className="text-xs text-gray-600">Conversions</div>
                      </div>
                    )}
                    {service.metrics.revenue_generated && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">${service.metrics.revenue_generated.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Revenue Generated</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Included Features</h4>
                    <ul className="space-y-2">
                      {service.features.slice(0, 4).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 4 && (
                        <li className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                          +{service.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Billing Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Billing Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Started: {formatDate(service.start_date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        Next billing: {formatDate(service.next_billing_date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        Billing cycle: {service.billing_cycle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {service.status === 'active' && (
                    <>
                      <button
                        onClick={() => onServiceAction?.(service.id, 'pause')}
                        className="flex items-center px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                      >
                        <PauseIcon className="h-4 w-4 mr-2" />
                        Pause Service
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        View Reports
                      </button>
                    </>
                  )}
                  
                  {service.status === 'paused' && (
                    <button
                      onClick={() => onServiceAction?.(service.id, 'resume')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors duration-200"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Resume Service
                    </button>
                  )}

                  <button
                    onClick={() => onServiceAction?.(service.id, 'renew')}
                    className="flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                  >
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Renew Service
                  </button>

                  {service.status !== 'cancelled' && (
                    <button
                      onClick={() => onServiceAction?.(service.id, 'cancel')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    >
                      <StopIcon className="h-4 w-4 mr-2" />
                      Cancel Service
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default ServicesList;