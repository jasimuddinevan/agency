import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { 
  ClientService, 
  ClientMessage, 
  ClientActivity, 
  ClientStats 
} from '../types/client';

export const useClientData = () => {
  const { user, clientProfile } = useClientAuth();
  const [services, setServices] = useState<ClientService[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [stats, setStats] = useState<ClientStats>({
    total_services: 0,
    active_services: 0,
    unread_messages: 0,
    upcoming_payments: 0,
    total_spent: 0,
    account_status: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && clientProfile) {
      fetchAllData();
    }
  }, [user, clientProfile]);

  const fetchAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchServices(),
        fetchMessages(),
        fetchActivities()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('client_services')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    setServices(data || []);
    updateStats(data || [], messages);
  };

  const fetchMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('client_messages')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    setMessages(data || []);
    updateStats(services, data || []);
  };

  const fetchActivities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('client_activities')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    setActivities(data || []);
  };

  const updateStats = (servicesData: ClientService[], messagesData: ClientMessage[]) => {
    const activeServices = servicesData.filter(s => s.status === 'active');
    const unreadMessages = messagesData.filter(m => !m.is_read);
    const totalSpent = servicesData.reduce((sum, service) => sum + (service.price || 0), 0);
    
    // Calculate upcoming payments (services with next billing date within 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingPayments = servicesData.filter(service => {
      if (!service.next_billing_date) return false;
      const billingDate = new Date(service.next_billing_date);
      return billingDate >= now && billingDate <= thirtyDaysFromNow;
    });

    setStats({
      total_services: servicesData.length,
      active_services: activeServices.length,
      unread_messages: unreadMessages.length,
      upcoming_payments: upcomingPayments.length,
      total_spent: totalSpent,
      account_status: clientProfile?.account_status || 'pending'
    });
  };

  const createService = async (serviceData: Omit<ClientService, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('client_services')
      .insert({
        ...serviceData,
        client_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchServices();
    return data;
  };

  const updateService = async (serviceId: string, updates: Partial<ClientService>) => {
    const { error } = await supabase
      .from('client_services')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId);

    if (error) throw error;
    
    await fetchServices();
  };

  const sendMessage = async (subject: string, content: string) => {
    if (!user || !clientProfile) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('client_messages')
      .insert({
        client_id: user.id,
        sender_id: user.id,
        sender_name: clientProfile.full_name,
        sender_type: 'client',
        subject,
        content
      });

    if (error) throw error;
    
    await fetchMessages();
  };

  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('client_messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
    
    await fetchMessages();
  };

  const logActivity = async (
    type: ClientActivity['type'], 
    title: string, 
    description: string, 
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    await supabase
      .from('client_activities')
      .insert({
        client_id: user.id,
        type,
        title,
        description,
        metadata: metadata || {}
      });

    await fetchActivities();
  };

  return {
    services,
    messages,
    activities,
    stats,
    loading,
    error,
    refetch: fetchAllData,
    createService,
    updateService,
    sendMessage,
    markMessageAsRead,
    logActivity
  };
};