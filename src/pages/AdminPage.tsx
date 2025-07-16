import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { UsersIcon, CogIcon } from '@heroicons/react/24/outline';

// Import admin components
import MarketingDashboard from '../components/admin/marketing/MarketingDashboard';
import AdminSidebar from '../components/admin/layout/AdminSidebar';
import AdminHeader from '../components/admin/layout/AdminHeader';
import DashboardStats from '../components/admin/dashboard/DashboardStats';
import ApplicationList from '../components/admin/applications/ApplicationList';
import ApplicationDetails from '../components/admin/applications/ApplicationDetails';
import ApplicationEditForm from '../components/admin/applications/ApplicationEditForm';
import ConfirmationModal from '../components/admin/common/ConfirmationModal';

// Import types
import { Application, DashboardStats as StatsType, BreadcrumbItem } from '../types/admin';

const AdminPage: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatsType>({
    total: 0,
    new: 0,
    in_progress: 0,
    contacted: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    if (user && isAdmin) {
      fetchApplications();
    }
  }, [user, isAdmin]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
      
      // Calculate stats
      const newStats = {
        total: data?.length || 0,
        new: data?.filter(app => app.status === 'new').length || 0,
        in_progress: data?.filter(app => app.status === 'in_progress').length || 0,
        contacted: data?.filter(app => app.status === 'contacted').length || 0,
        approved: data?.filter(app => app.status === 'approved').length || 0,
        rejected: data?.filter(app => app.status === 'rejected').length || 0
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplication = async (applicationId: string, updates: Partial<Application>) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast.success('Application updated successfully');
      await fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteApplication = async (applicationId: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast.success('Application deleted successfully');
      await fetchApplications();
      setShowDeleteModal(false);
      setApplicationToDelete(null);
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    } finally {
      setIsUpdating(false);
    }
  };

  // Event handlers
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleEditApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowEditModal(true);
  };

  const handleDeleteApplication = (application: Application) => {
    setApplicationToDelete(application);
    setShowDeleteModal(true);
  };

  const handleSaveApplication = async (updates: Partial<Application>) => {
    if (selectedApplication) {
      await updateApplication(selectedApplication.id, updates);
      setShowEditModal(false);
      setSelectedApplication(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (applicationToDelete) {
      await deleteApplication(applicationToDelete.id);
    }
  };

  // Get breadcrumbs based on active tab
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    switch (activeTab) {
      case 'dashboard':
        return [{ label: 'Dashboard', current: true }];
      case 'applications':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Applications', current: true }
        ];
      case 'users':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Users', current: true }
        ];
      case 'settings':
        return [
          { label: 'Dashboard', href: '#' },
          { label: 'Settings', current: true }
        ];
      default:
        return [{ label: 'Dashboard', current: true }];
    }
  };

  // Get page title and subtitle
  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Overview of your business applications'
        };
      case 'applications':
        return {
          title: 'Applications',
          subtitle: 'Manage all business applications'
        };
      case 'marketing':
        return {
          title: 'Marketing',
          subtitle: 'Manage email campaigns and marketing automation'
        };
      case 'users':
        return {
          title: 'Users',
          subtitle: 'Manage admin users and permissions'
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Configure system settings'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Overview of your business applications'
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pageInfo = getPageInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={signOut}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          breadcrumbs={getBreadcrumbs()}
          isCollapsed={isCollapsed}
          user={{
            name: 'Admin User',
            email: 'admin@growthpro.com'
          }}
        />

        {/* Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Stats */}
                <DashboardStats stats={stats} isLoading={isLoading} />

                {/* Recent Applications */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                  </div>
                  <ApplicationList
                    applications={applications.slice(0, 5)}
                    onView={handleViewApplication}
                    onEdit={handleEditApplication}
                    onDelete={handleDeleteApplication}
                    isLoading={isLoading}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ApplicationList
                  applications={applications}
                  onView={handleViewApplication}
                  onEdit={handleEditApplication}
                  onDelete={handleDeleteApplication}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {activeTab === 'marketing' && (
              <motion.div
                key="marketing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MarketingDashboard isLoading={isLoading} />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <p className="text-gray-600 mt-2">User management features coming soon</p>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                <p className="text-gray-600 mt-2">Settings panel coming soon</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      {selectedApplication && (
        <>
          <ApplicationDetails
            application={selectedApplication}
            isOpen={showApplicationModal}
            onClose={() => {
              setShowApplicationModal(false);
              setSelectedApplication(null);
            }}
            onEdit={handleEditApplication}
          />

          <ApplicationEditForm
            application={selectedApplication}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedApplication(null);
            }}
            onSave={handleSaveApplication}
            isLoading={isUpdating}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setApplicationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        message={`Are you sure you want to delete the application from "${applicationToDelete?.business_name}"? This action cannot be undone.`}
        confirmText="Delete Application"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  );
};

export default AdminPage;