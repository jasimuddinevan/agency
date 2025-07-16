import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ClientUser, ClientProfile } from '../types/client';

interface ClientAuthContextType {
  user: User | null;
  clientProfile: ClientProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ClientProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
};

export const ClientAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setUser(null);
          setClientProfile(null);
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchClientProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setClientProfile(null);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, !!session?.user);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchClientProfile(session.user.id);
        
        // Update last login if this is a sign in
        if (event === 'SIGNED_IN') {
          await updateLastLogin(session.user.id);
        }
      } else {
        setClientProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchClientProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching client profile:', error);
        setClientProfile(null);
      } else {
        // data will be null if no matching row is found (e.g., for admin users)
        if (data === null) {
          console.warn('No client profile found for user (likely admin user):', userId);
        }
        setClientProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching client profile:', error);
      setClientProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateLastLogin = async (userId: string) => {
    try {
      await supabase
        .from('client_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setClientProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<ClientProfile>) => {
    if (!user) throw new Error('No authenticated user');
    
    const { error } = await supabase
      .from('client_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;
    
    // Refresh profile data
    await fetchClientProfile(user.id);
    
    // Log activity
    await supabase
      .from('client_activities')
      .insert({
        client_id: user.id,
        type: 'profile_updated',
        title: 'Profile Updated',
        description: 'Client profile information has been updated'
      });
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchClientProfile(user.id);
    }
  };

  const value = {
    user,
    clientProfile,
    loading,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};