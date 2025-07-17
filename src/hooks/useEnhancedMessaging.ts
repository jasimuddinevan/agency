import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { 
  EnhancedMessage, 
  MessageThread, 
  MessageStats, 
  SendMessageRequest,
  RateLimitInfo,
  MessageStatus
} from '../types/messaging-enhanced';
import toast from 'react-hot-toast';

export const useEnhancedMessaging = () => {
  const { user } = useClientAuth();
  
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [currentThread, setCurrentThread] = useState<MessageThread | null>(null);
  const [stats, setStats] = useState<MessageStats>({
    total: 0,
    unread: 0,
    sent: 0,
    threads: 0
  });
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all messages for current user
  const fetchMessages = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('client_messages_enhanced')
        .select(`
          id, sender_id, recipient_id, subject, message_body, 
          priority, created_at, read_status, thread_id
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
      await fetchStats();
      await fetchRateLimit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch message threads
  const fetchThreads = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_messages_enhanced')
        .select(`
          id, sender_id, recipient_id, subject, message_body, 
          priority, created_at, read_status, thread_id
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by thread_id
      const threadMap = new Map<string, EnhancedMessage[]>();
      
      data?.forEach(message => {
        if (!threadMap.has(message.thread_id)) {
          threadMap.set(message.thread_id, []);
        }
        threadMap.get(message.thread_id)?.push(message);
      });

      // Create thread objects
      const threadList: MessageThread[] = [];
      
      for (const [threadId, threadMessages] of threadMap.entries()) {
        // Sort messages by date (oldest first)
        threadMessages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        // Get unique participants
        const participantIds = new Set<string>();
        threadMessages.forEach(msg => {
          participantIds.add(msg.sender_id);
          participantIds.add(msg.recipient_id);
        });
        
        // Get participant info (in a real app, you'd fetch this from users table)
        const participants = Array.from(participantIds).map(id => {
          // For demo purposes, we'll use placeholder data
          // In a real app, you'd fetch this from the database
          return {
            id,
            full_name: id === user.id ? 'You' : 'Support Team',
            email: id === user.id ? user.email || '' : 'support@growthpro.com'
          };
        });
        
        // Count unread messages
        const unreadCount = threadMessages.filter(msg => 
          msg.recipient_id === user.id && msg.read_status !== 'read'
        ).length;
        
        threadList.push({
          id: threadId,
          subject: threadMessages[0].subject,
          messages: threadMessages,
          participants,
          lastMessage: threadMessages[threadMessages.length - 1],
          unreadCount
        });
      }
      
      // Sort threads by last message date (newest first)
      threadList.sort((a, b) => 
        new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
      );
      
      setThreads(threadList);
    } catch (err) {
      console.error('Error fetching threads:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch message statistics
  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      // Total messages
      const { count: totalCount, error: totalError } = await supabase
        .from('client_messages_enhanced')
        .select('id', { count: 'exact' })
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      // Unread messages
      const { count: unreadCount, error: unreadError } = await supabase
        .from('client_messages_enhanced')
        .select('id', { count: 'exact' })
        .eq('recipient_id', user.id)
        .neq('read_status', 'read');

      // Sent messages
      const { count: sentCount, error: sentError } = await supabase
        .from('client_messages_enhanced')
        .select('id', { count: 'exact' })
        .eq('sender_id', user.id);

      // Thread count (unique thread_ids)
      const { data: threadData, error: threadError } = await supabase
        .from('client_messages_enhanced')
        .select('thread_id')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (totalError || unreadError || sentError || threadError) {
        throw new Error('Failed to fetch message stats');
      }

      // Count unique thread IDs
      const uniqueThreads = new Set(threadData?.map(item => item.thread_id));

      setStats({
        total: totalCount || 0,
        unread: unreadCount || 0,
        sent: sentCount || 0,
        threads: uniqueThreads.size
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [user]);

  // Fetch rate limit information
  const fetchRateLimit = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('message_rate_limits')
        .select('message_count, reset_at')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error('Error fetching rate limit:', error);
        return;
      }

      if (data) {
        const resetAt = new Date(data.reset_at);
        const now = new Date();
        const hourlyLimit = 10; // Same as in the database trigger
        
        setRateLimit({
          message_count: data.message_count,
          reset_at: data.reset_at,
          remaining: now > resetAt ? 
            hourlyLimit : 
            Math.max(0, hourlyLimit - data.message_count)
        });
      } else {
        // No rate limit record yet
        setRateLimit({
          message_count: 0,
          reset_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          remaining: 10
        });
      }
    } catch (err) {
      console.error('Error fetching rate limit:', err);
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback(async (messageData: SendMessageRequest) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      // Check rate limit first
      if (rateLimit && rateLimit.remaining <= 0) {
        const resetTime = new Date(rateLimit.reset_at);
        const now = new Date();
        const minutesRemaining = Math.ceil((resetTime.getTime() - now.getTime()) / 60000);
        
        throw new Error(`Rate limit exceeded. You can send more messages in ${minutesRemaining} minutes.`);
      }

      const { data, error } = await supabase
        .from('client_messages_enhanced')
        .insert({
          sender_id: user.id,
          recipient_id: messageData.recipient_id,
          subject: messageData.subject,
          message_body: messageData.message_body,
          priority: messageData.priority,
          thread_id: messageData.thread_id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Message sent successfully!');
      await fetchMessages();
      await fetchThreads();
      await fetchRateLimit();
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, rateLimit, fetchMessages, fetchThreads, fetchRateLimit]);

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('client_messages_enhanced')
        .update({ read_status: 'read' })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) throw error;

      await fetchMessages();
      await fetchThreads();
      await fetchStats();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, [user, fetchMessages, fetchThreads, fetchStats]);

  // Get thread by ID
  const getThread = useCallback(async (threadId: string) => {
    if (!user) return null;

    try {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        setCurrentThread(thread);
        
        // Mark all unread messages in this thread as read
        const unreadMessages = thread.messages.filter(msg => 
          msg.recipient_id === user.id && msg.read_status !== 'read'
        );
        
        for (const msg of unreadMessages) {
          await markAsRead(msg.id);
        }
        
        return thread;
      }
      return null;
    } catch (err) {
      console.error('Error getting thread:', err);
      return null;
    }
  }, [user, threads, markAsRead]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('enhanced-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_messages_enhanced',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          fetchMessages();
          fetchThreads();
          fetchStats();
          
          if (payload.eventType === 'INSERT' && payload.new.recipient_id === user.id) {
            toast.success('New message received!');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchMessages, fetchThreads, fetchStats]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchThreads();
    }
  }, [user, fetchMessages, fetchThreads]);

  return {
    messages,
    threads,
    currentThread,
    stats,
    rateLimit,
    loading,
    error,
    sendMessage,
    markAsRead,
    getThread,
    setCurrentThread,
    refreshData: () => {
      fetchMessages();
      fetchThreads();
      fetchStats();
      fetchRateLimit();
    }
  };
};