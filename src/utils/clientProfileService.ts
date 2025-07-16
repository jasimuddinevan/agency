import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { ClientProfile } from '../types/client';

export type ClientProfileData = Omit<ClientProfile, 'id' | 'created_at' | 'updated_at' | 'last_login' | 'total_spent'>;

export interface ClientProfileCreationResult {
  success: boolean;
  clientId?: string;
  password?: string;
  error?: string;
}

/**
 * Generate a secure random password
 */
const generateRandomPassword = (): string => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  // Ensure at least one character from each category
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Send welcome email via Supabase Edge Function
 */
const sendWelcomeEmailViaEdgeFunction = async (
  email: string,
  fullName: string,
  password: string,
  additionalData: any = {}
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-welcome-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email,
        fullName,
        password,
        additionalData
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Create client profile and authentication account
 */
export const createClientProfile = async (profileData: ClientProfileData): Promise<ClientProfileCreationResult> => {
  try {
    // First check if user already exists
    const { data: existingUser } = await supabase.auth.getUser();
    
    // Check if email is already registered
    const { data: existingProfile } = await supabase
      .from('client_profiles')
      .select('id, email')
      .eq('email', profileData.email)
      .maybeSingle();

    if (existingProfile) {
      return {
        success: false,
        error: 'User already registered'
      };
    }

    // Generate random password
    const generatedPassword = generateRandomPassword();
    
    // Step 1: Create authentication user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: profileData.email,
      password: generatedPassword,
      options: {
        data: {
          full_name: profileData.full_name,
          phone: profileData.phone
        }
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return {
        success: false,
        error: `Failed to create account: ${authError.message}`
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Failed to create user account'
      };
    }

    // Step 2: Create client profile record
    // Use upsert to create or update the client profile record
    const { error: profileError } = await supabase
      .from('client_profiles')
      .upsert({
        id: authData.user.id,
        email: profileData.email,
        full_name: profileData.full_name,
        phone: profileData.phone || null,
        company: profileData.company || '',
        website: profileData.website || '',
        address: profileData.address || '',
        account_status: 'active',
        timezone: 'UTC',
        language: 'en'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile update error:', profileError);
      return {
        success: false,
        error: `Failed to create client profile: ${profileError.message}`
      };
    }
    
    // Step 3: Send welcome email with credentials (placeholder for email service)
    const emailResult = await sendWelcomeEmailViaEdgeFunction(
      profileData.email, 
      profileData.full_name, 
      generatedPassword,
      {
        companyName: profileData.company || 'Your Business'
      }
    );

    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error);
      // Don't fail the entire process if email fails, but log it
      toast.error('Account created but welcome email failed to send');
    } else {
      toast.success('Account created and welcome email sent successfully!');
    }

    return {
      success: true,
      clientId: authData.user.id,
      password: generatedPassword
    };

  } catch (error) {
    console.error('Client profile creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Automatically sign in the newly created client
 */
export const signInClient = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Auto sign-in error:', error);
      return false;
    }

    return !!data.user;
  } catch (error) {
    console.error('Sign-in error:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isClientAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};