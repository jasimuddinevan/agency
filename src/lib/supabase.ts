import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          business_name: string;
          website_url: string;
          business_description: string;
          industry: string;
          monthly_revenue: string;
          full_name: string;
          email: string;
          phone: string;
          address: string;
          preferred_contact: string;
          status: 'new' | 'in_progress' | 'contacted' | 'approved' | 'rejected';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          website_url: string;
          business_description: string;
          industry: string;
          monthly_revenue: string;
          full_name: string;
          email: string;
          phone: string;
          address: string;
          preferred_contact: string;
          status?: 'new' | 'in_progress' | 'contacted' | 'approved' | 'rejected';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          website_url?: string;
          business_description?: string;
          industry?: string;
          monthly_revenue?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          preferred_contact?: string;
          status?: 'new' | 'in_progress' | 'contacted' | 'approved' | 'rejected';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'super_admin';
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'super_admin';
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'super_admin';
          created_at?: string;
          last_login?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};