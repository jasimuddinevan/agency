import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { 
  Message, 
  MessageThread, 
  MessageStats, 
  SendMessageRequest,
  ConversationSummary 
} from '../types/messaging';
import toast from 'react-hot-toast';

export const useMessaging = () => {
  const { user: adminUser, isAdmin } = useAuth();
  const { user: clientUser } = useClientAuth();
  const user = adminUser || clientUser;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [currentThread, setCurrentThread] = useState<MessageThread | null>(null);
  const [stats, setStats] = useState<MessageStats>({
    total_messages: 0,
    unread_messages: 0,
    total_conversations: 0,
    recent_messages: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all messages for current user
  const fetchMessages = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('messages')
        .select(`
          id, sender_id, receiver_id, content, subject, message_type, is_read, read_at, created_at, updated_at
        `)
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        // Clients can only see messages they sent or received
        query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Handle broadcast messages for clients
      if (!isAdmin) {
        const { data: broadcastMessages, error: broadcastError } = await supabase
          .from('message_recipients')
          .select(`
            message:message_id(
              *,
              sender:sender_id(id, full_name, email)
            )
          `)
          .eq('recipient_id', user.id);

        if (broadcastError) throw broadcastError;

        const broadcasts = broadcastMessages?.map(br => ({
          ...br.message,
          receiver_id: user.id // Set current user as receiver for display
        })) || [];

        setMessages([...data || [], ...broadcasts]);
      } else {
        setMessages(data || []);
      }

      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  // Fetch conversation summaries
  const fetchConversations = useCallback(async () => {
    if (!user || !isAdmin) return;

    try {
      // Get all unique conversation participants
      const { data: conversationData, error } = await supabase.rpc('get_conversation_summaries', {
        admin_user_id: user.id
      });
      
      if (error) {
        console.error('RPC error:', error);
        // Fallback to manual query if RPC doesn't exist
        const { data: directMessages, error: directError } = await supabase
          .from('messages')
          .select(`
            sender_id,
            receiver_id,
            content,
            created_at,
            is_read,
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (directError) throw directError;

        // Process messages to create conversation summaries
        const conversationMap = new Map<string, ConversationSummary>();

        directMessages?.forEach(msg => {
          const isFromAdmin = msg.sender_id === user.id;
          const participantId = isFromAdmin ? msg.receiver_id : msg.sender_id;
          const participant = isFromAdmin ? msg.receiver : msg.sender;

          if (!participant || !participantId) return;

          const existing = conversationMap.get(participantId);
          if (!existing || new Date(msg.created_at) > new Date(existing.last_message_time)) {
            conversationMap.set(participantId, {
              participant_id: participantId,
              participant_name: participant.full_name,
              participant_email: participant.email,
              last_message_content: msg.content,
              last_message_time: msg.created_at,
              unread_count: 0 // Will be calculated separately
            });
          }
        });

        setConversations(Array.from(conversationMap.values()));
      } else {
        setConversations(conversationData || []);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  }, [user, isAdmin]);

  // Fetch message statistics
  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      let totalQuery = supabase
        .from('messages')
        .select('id', { count: 'exact' });

      let unreadQuery = supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('is_read', false);

      if (!isAdmin) {
        totalQuery = totalQuery.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
        unreadQuery = unreadQuery.eq('receiver_id', user.id).eq('is_read', false);
      }

      const [totalResult, unreadResult] = await Promise.all([
        totalQuery,
        unreadQuery
      ]);

      if (totalResult.error) throw totalResult.error;
      if (unreadResult.error) throw unreadResult.error;

      setStats(prev => ({
        ...prev,
        total_messages: totalResult.count || 0,
        unread_messages: unreadResult.count || 0
      }));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, [user, isAdmin]);

  // Send a message
  const sendMessage = useCallback(async (messageData: SendMessageRequest) => {
    if (!user) throw new Error('User not authenticated');

    console.log('Sending message with data:', messageData);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: messageData.receiver_id,
          content: messageData.content,
          subject: messageData.subject,
          message_type: messageData.message_type
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Message sent successfully:', data);
      // Handle broadcast message recipients
      if (messageData.message_type === 'broadcast' && messageData.recipient_ids?.length) {
        const recipients = messageData.recipient_ids.map(recipientId => ({
          message_id: data.id,
          recipient_id: recipientId
        }));

        const { error: recipientError } = await supabase
          .from('message_recipients')
          .insert(recipients);

        if (recipientError) throw recipientError;
      }

      toast.success('Message sent successfully!');
      await fetchMessages();
      await fetchConversations();
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchMessages, fetchConversations]);

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', messageId)
        .eq('receiver_id', user.id);

      if (error) throw error;

      // Also update broadcast message recipients
      await supabase
        .from('message_recipients')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('message_id', messageId)
        .eq('recipient_id', user.id);

      await fetchMessages();
      await fetchStats();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, [user, fetchMessages, fetchStats]);

  // Get thread with specific user
  const getThread = useCallback(async (participantId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, sender_id, receiver_id, content, subject, message_type, is_read, read_at, created_at, updated_at
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${participantId}),and(sender_id.eq.${participantId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const participant = data?.[0]?.sender?.id === participantId 
        ? data[0].sender 
        : data?.[0]?.receiver;

      if (!participant) return null;

      const unreadCount = data?.filter(msg => 
        msg.receiver_id === user.id && !msg.is_read
      ).length || 0;

      const thread: MessageThread = {
        participant,
        messages: data || [],
        unread_count: unreadCount,
        last_message: data?.[data.length - 1] || data?.[0]
      };

      setCurrentThread(thread);
      return thread;
    } catch (err) {
      console.error('Error fetching thread:', err);
      return null;
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          fetchMessages();
          fetchStats();
          
          if (payload.eventType === 'INSERT') {
            toast.success('New message received!');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchMessages, fetchStats]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchConversations();
    }
  }, [user, fetchMessages, fetchConversations]);

  return {
    messages,
    conversations,
    currentThread,
    stats,
    loading,
    error,
    sendMessage,
    markAsRead,
    getThread,
    fetchMessages,
    fetchConversations,
    refreshData: () => {
      fetchMessages();
      fetchConversations();
    }
  };
};