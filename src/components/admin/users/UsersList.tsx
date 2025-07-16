import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import UserEditForm from './UserEditForm';
import ConfirmationModal from '../common/ConfirmationModal';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login: string | null;
}

interface ClientUser {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  account_status: 'active' | 'suspended' | 'pending';
  created_at: string;
  last_login: string | null;
}

interface UsersListProps {
  isLoading?: boolean;
}

const UsersList: React.FC<UsersListProps> = ({ isLoading = false }) => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'admins' | 'clients'>('admins');
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | ClientUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | ClientUser | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isLoading) {
      fetchUsers();
      checkCurrentUserRole();
    }
  }, [isLoading]);

  const checkCurrentUserRole = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      
      if (error) throw error;
      
      setIsSuperAdmin(data?.role === 'super_admin');
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchUsers = async () => {
    setDataLoading(true);
    try {
      // Fetch admin users
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminError) throw adminError;
      setAdminUsers(adminData || []);

      // Fetch client users
      const { data: clientData, error: clientError } = await supabase
        .from('client_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientError) throw clientError;
      setClientUsers(clientData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddUser = () => {
    setUserToEdit(null);
    setShowAddUserModal(true);
  };

  const handleEditUser = (user: User | ClientUser) => {
    setUserToEdit(user);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = (user: User | ClientUser) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      let error;
      
      if ('role' in userToDelete) {
        // Admin user
        if (userToDelete.id === currentUser?.id) {
          toast.error("You cannot delete your own account");
          return;
        }
        
        const { error: deleteError } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', userToDelete.id);
          
        error = deleteError;
      } else {
        // Client user
        const { error: deleteError } = await supabase
          .from('client_profiles')
          .delete()
          .eq('id', userToDelete.id);
          
        error = deleteError;
      }
      
      if (error) throw error;
      
      toast.success('User deleted successfully');
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleBulkAction = async (action: 'delete' | 'suspend' | 'activate') => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    try {
      if (activeTab === 'admins') {
        if (action === 'delete') {
          // Check if trying to delete own account
          if (selectedUsers.includes(currentUser?.id || '')) {
            toast.error("You cannot delete your own account");
            return;
          }
          
          const { error } = await supabase
            .from('admin_users')
            .delete()
            .in('id', selectedUsers);
            
          if (error) throw error;
        }
      } else {
        // Client users
        if (action === 'delete') {
          const { error } = await supabase
            .from('client_profiles')
            .delete()
            .in('id', selectedUsers);
            
          if (error) throw error;
        } else if (action === 'suspend' || action === 'activate') {
          const { error } = await supabase
            .from('client_profiles')
            .update({ 
              account_status: action === 'activate' ? 'active' : 'suspended',
              updated_at: new Date().toISOString()
            })
            .in('id', selectedUsers);
            
          if (error) throw error;
        }
      }
      
      toast.success(`Bulk action completed successfully`);
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleUserSaved = () => {
    fetchUsers();
    setShowAddUserModal(false);
    setShowEditUserModal(false);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (activeTab === 'admins') {
        setSelectedUsers(adminUsers.map(user => user.id));
      } else {
        setSelectedUsers(clientUsers.map(user => user.id));
      }
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronUpDownIcon className="h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4" /> : 
      <ChevronDownIcon className="h-4 w-4" />;
  };

  // Filter and sort users
  const filteredAdminUsers = adminUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClientUsers = clientUsers.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || user.account_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const sortedAdminUsers = [...filteredAdminUsers].sort((a, b) => {
    const aValue = a[sortField as keyof User];
    const bValue = b[sortField as keyof User];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedClientUsers = [...filteredClientUsers].sort((a, b) => {
    const aValue = a[sortField as keyof ClientUser];
    const bValue = b[sortField as keyof ClientUser];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const currentUsers = activeTab === 'admins' ? sortedAdminUsers : sortedClientUsers;
  const totalPages = Math.ceil(currentUsers.length / itemsPerPage);
  const paginatedUsers = currentUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading || dataLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">Manage admin and client users</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleAddUser}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('admins');
                setStatusFilter('all');
                setSelectedUsers([]);
                setCurrentPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admins'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Admin Users
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('clients');
                setSelectedUsers([]);
                setCurrentPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-2" />
                Client Users
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'admins' ? 'admin' : 'client'} users...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter - Only for clients */}
          {activeTab === 'clients' && (
            <div className="sm:w-48">
              <div className="relative">
                <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-700">
                <span className="font-medium">{selectedUsers.length}</span> users selected
              </div>
              <div className="flex space-x-2">
                {activeTab === 'clients' && (
                  <>
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleBulkAction('suspend')}
                      className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                    >
                      Suspend
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {paginatedUsers.length} of {currentUsers.length} users
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length > 0 && selectedUsers.length === paginatedUsers.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('full_name')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                >
                  <span>User</span>
                  {getSortIcon('full_name')}
                </button>
              </th>
              {activeTab === 'clients' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('company')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </button>
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'admins' ? (
                  <button
                    onClick={() => handleSort('role')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                  >
                    <span>Role</span>
                    {getSortIcon('role')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSort('account_status')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                  >
                    <span>Status</span>
                    {getSortIcon('account_status')}
                  </button>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Created</span>
                  {getSortIcon('created_at')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('last_login')}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                >
                  <span>Last Login</span>
                  {getSortIcon('last_login')}
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  {activeTab === 'clients' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(user as ClientUser).company || '-'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activeTab === 'admins' ? (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor((user as User).role)}`}>
                        {(user as User).role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor((user as ClientUser).account_status)}`}>
                        {(user as ClientUser).account_status.charAt(0).toUpperCase() + (user as ClientUser).account_status.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.last_login)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit User"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                        disabled={activeTab === 'admins' && user.id === currentUser?.id}
                      >
                        <TrashIcon className={`h-4 w-4 ${activeTab === 'admins' && user.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {paginatedUsers.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : `No ${activeTab === 'admins' ? 'admin' : 'client'} users found`
            }
          </p>
          <button
            onClick={handleAddUser}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add {activeTab === 'admins' ? 'Admin' : 'Client'} User
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {(showAddUserModal || showEditUserModal) && (
          <UserEditForm
            isOpen={showAddUserModal || showEditUserModal}
            onClose={() => {
              setShowAddUserModal(false);
              setShowEditUserModal(false);
              setUserToEdit(null);
            }}
            onSave={handleUserSaved}
            user={userToEdit}
            userType={activeTab === 'admins' ? 'admin' : 'client'}
            isSuperAdmin={isSuperAdmin}
            currentUserId={currentUser?.id}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`Delete ${activeTab === 'admins' ? 'Admin' : 'Client'} User`}
        message={`Are you sure you want to delete ${userToDelete?.full_name}? This action cannot be undone.`}
        confirmText="Delete User"
        variant="danger"
      />
    </motion.div>
  );
};

export default UsersList;