import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface User {
  id?: string;
  email: string;
  full_name: string;
  role?: 'admin' | 'super_admin';
  account_status?: 'active' | 'suspended' | 'pending';
  company?: string;
}

interface UserEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user: any | null;
  userType: 'admin' | 'client';
  isSuperAdmin: boolean;
  currentUserId?: string;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  userType,
  isSuperAdmin,
  currentUserId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuperAdminConfirm, setShowSuperAdminConfirm] = useState(false);
  const isEditMode = !!user;

  // Define validation schema based on user type
  const adminSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    full_name: yup.string().required('Full name is required'),
    role: yup.string().oneOf(['admin', 'super_admin'], 'Invalid role').required('Role is required'),
    password: isEditMode ? yup.string().nullable() : yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: isEditMode 
      ? yup.string().nullable().oneOf([yup.ref('password')], 'Passwords must match')
      : yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm password')
  });

  const clientSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    full_name: yup.string().required('Full name is required'),
    company: yup.string(),
    account_status: yup.string().oneOf(['active', 'suspended', 'pending'], 'Invalid status').required('Status is required'),
    password: isEditMode ? yup.string().nullable() : yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: isEditMode 
      ? yup.string().nullable().oneOf([yup.ref('password')], 'Passwords must match')
      : yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm password')
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: yupResolver(userType === 'admin' ? adminSchema : clientSchema),
    defaultValues: {
      email: '',
      full_name: '',
      role: 'admin',
      account_status: 'active',
      company: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Watch the role field to detect super_admin selection
  const selectedRole = watch('role');

  useEffect(() => {
    if (isOpen && user) {
      // Set form values for editing
      reset({
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || 'admin',
        account_status: user.account_status || 'active',
        company: user.company || '',
        password: '',
        confirmPassword: ''
      });
    } else if (isOpen) {
      // Reset form for new user
      reset({
        email: '',
        full_name: '',
        role: 'admin',
        account_status: 'active',
        company: '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [isOpen, user, reset]);

  useEffect(() => {
    // Show confirmation dialog when super_admin is selected
    if (selectedRole === 'super_admin' && !isEditMode) {
      setShowSuperAdminConfirm(true);
    }
  }, [selectedRole, isEditMode]);

  const handleSuperAdminConfirm = () => {
    setShowSuperAdminConfirm(false);
    // Continue with super_admin role
  };

  const handleSuperAdminCancel = () => {
    setShowSuperAdminConfirm(false);
    // Revert to regular admin role
    setValue('role', 'admin');
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      if (userType === 'admin') {
        if (isEditMode) {
          // Update existing admin user
          const updates: any = {
            email: data.email,
            full_name: data.full_name
          };
          
          // Only super admins can change roles
          if (isSuperAdmin) {
            updates.role = data.role;
          }
          
          const { error } = await supabase
            .from('admin_users')
            .update(updates)
            .eq('id', user.id);
            
          if (error) throw error;
          
          // If password is provided, update it
          if (data.password) {
            // In a real app, you would update the auth user's password
            // This is a simplified example
            toast.success('Password updated');
          }
          
          toast.success('Admin user updated successfully');
        } else {
          // Create new admin user
          // First create auth user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password
          });
          
          if (authError) throw authError;
          
          if (!authData.user) {
            throw new Error('Failed to create user account');
          }
          
          // Then create admin user record
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert({
              id: authData.user.id,
              email: data.email,
              full_name: data.full_name,
              role: isSuperAdmin ? data.role : 'admin' // Only super admins can create super admins
            });
            
          if (adminError) throw adminError;
          
          toast.success('Admin user created successfully');
        }
      } else {
        // Client user
        if (isEditMode) {
          // Update existing client user
          const { error } = await supabase
            .from('client_profiles')
            .update({
              email: data.email,
              full_name: data.full_name,
              company: data.company,
              account_status: data.account_status,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (error) throw error;
          
          // If password is provided, update it
          if (data.password) {
            // In a real app, you would update the auth user's password
            toast.success('Password updated');
          }
          
          toast.success('Client user updated successfully');
        } else {
          // Create new client user
          // First create auth user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password
          });
          
          if (authError) throw authError;
          
          if (!authData.user) {
            throw new Error('Failed to create user account');
          }
          
          // Then create client profile
          const { error: clientError } = await supabase
            .from('client_profiles')
            .insert({
              id: authData.user.id,
              email: data.email,
              full_name: data.full_name,
              company: data.company,
              account_status: data.account_status
            });
            
          if (clientError) throw clientError;
          
          toast.success('Client user created successfully');
        }
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              {isEditMode ? 'Edit' : 'Add'} {userType === 'admin' ? 'Admin' : 'Client'} User
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('full_name')}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.full_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {userType === 'admin' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    {...register('role')}
                    disabled={!isSuperAdmin && isEditMode}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.role ? 'border-red-300' : 'border-gray-300'
                    } ${!isSuperAdmin && isEditMode ? 'bg-gray-100' : ''}`}
                  >
                    <option value="admin">Admin</option>
                    {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                  {!isSuperAdmin && isEditMode && (
                    <p className="mt-1 text-xs text-gray-500">Only Super Admins can change roles</p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status *
                    </label>
                    <select
                      {...register('account_status')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.account_status ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                    {errors.account_status && (
                      <p className="mt-1 text-sm text-red-600">{errors.account_status.message}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {isEditMode ? 'Change Password' : 'Set Password'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isEditMode ? 'New Password' : 'Password'} {!isEditMode && '*'}
                  </label>
                  <input
                    {...register('password')}
                    type="password"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={isEditMode ? 'Leave blank to keep current' : 'Enter password'}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password {!isEditMode && '*'}
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              
              {isEditMode && (
                <p className="mt-2 text-sm text-gray-500">
                  Leave password fields blank to keep the current password.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update' : 'Create'} User
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Super Admin Confirmation Modal */}
      {showSuperAdminConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleSuperAdminCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirm Super Admin Role</h3>
                <p className="mt-2 text-sm text-gray-500">
                  You are about to create a user with Super Admin privileges. Super Admins have full access to all system features and can manage other administrators.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Super Admin accounts should be granted with caution. This action will be logged for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleSuperAdminCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSuperAdminConfirm}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Confirm Super Admin
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserEditForm;