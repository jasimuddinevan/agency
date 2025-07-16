import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  role?: 'admin' | 'super_admin';
  account_status?: 'active' | 'suspended' | 'pending';
  company?: string;
  created_at: string;
  last_login: string | null;
}

interface UserCreateParams {
  email: string;
  password: string;
  full_name: string;
  userType: 'admin' | 'client';
  role?: 'admin' | 'super_admin';
  company?: string;
  account_status?: 'active' | 'suspended' | 'pending';
}

interface UserUpdateParams {
  id: string;
  email?: string;
  full_name?: string;
  role?: 'admin' | 'super_admin';
  company?: string;
  account_status?: 'active' | 'suspended' | 'pending';
  password?: string;
}

export const useUserManagement = () => {
  const { user } = useAuth();
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [clientUsers, setClientUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Check if current user is super admin
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setIsSuperAdmin(data?.role === 'super_admin');
      } catch (err) {
        console.error('Error checking user role:', err);
      }
    };
    
    checkUserRole();
  }, [user]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  // Create user
  const createUser = async (params: UserCreateParams) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      // For super admin creation, verify current user is super admin
      if (params.userType === 'admin' && params.role === 'super_admin' && !isSuperAdmin) {
        throw new Error('Only super admins can create super admin users');
      }
      
      // Use the edge function to create user
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'x-user-id': user.id
        },
        body: JSON.stringify(params)
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create user');
      }
      
      // Refresh user list
      await fetchUsers();
      
      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update user
  const updateUser = async (params: UserUpdateParams) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      const { id, ...updates } = params;
      
      // Determine if this is an admin or client user
      const isAdmin = adminUsers.some(admin => admin.id === id);
      
      if (isAdmin) {
        // For role updates, verify current user is super admin
        if (updates.role && !isSuperAdmin) {
          throw new Error('Only super admins can change user roles');
        }
        
        const { error } = await supabase
          .from('admin_users')
          .update({
            email: updates.email,
            full_name: updates.full_name,
            role: updates.role
          })
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Client user
        const { error } = await supabase
          .from('client_profiles')
          .update({
            email: updates.email,
            full_name: updates.full_name,
            company: updates.company,
            account_status: updates.account_status,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
      }
      
      // If password is provided, update it
      if (updates.password) {
        // In a real app, you would update the auth user's password
        // This would require admin privileges or a custom API
        console.log('Password update would happen here');
      }
      
      // Refresh user list
      await fetchUsers();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      // Prevent deleting own account
      if (id === user.id) {
        throw new Error('You cannot delete your own account');
      }
      
      // Determine if this is an admin or client user
      const isAdmin = adminUsers.some(admin => admin.id === id);
      
      if (isAdmin) {
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Client user
        const { error } = await supabase
          .from('client_profiles')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      }
      
      // In a production app, you would also delete the auth user
      // This requires admin privileges or a custom API
      
      // Refresh user list
      await fetchUsers();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Get audit logs
  const getAuditLogs = async (userId?: string, limit = 50) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      let query = supabase
        .from('user_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (userId) {
        query = query.eq('target_user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audit logs';
      console.error(errorMessage);
      throw err;
    }
  };

  return {
    adminUsers,
    clientUsers,
    loading,
    error,
    isSuperAdmin,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getAuditLogs
  };
};

export default useUserManagement;