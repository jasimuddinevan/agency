import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface ClientProfileData {
  full_name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
}

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
 * Create client profile and authentication account
 */
export const createClientProfile = async (profileData: ClientProfileData): Promise<ClientProfileCreationResult> => {
  try {
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
    const clientProfile = {
      id: authData.user.id,
      email: profileData.email,
      full_name: profileData.full_name,
      phone: profileData.phone,
      company: profileData.company || '',
      address: profileData.address || '',
      created_at: new Date().toISOString(),
      account_status: 'pending' as const
    };

    // Note: In a real application, you would create a clients table
    // For now, we'll use the user metadata and a separate client_profiles table if needed
    
    // Step 3: Send welcome email with credentials (placeholder for email service)
    await sendWelcomeEmail(profileData.email, profileData.full_name, generatedPassword);

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
 * Send welcome email with login credentials
 * Note: This is a placeholder - actual email service integration needed
 */
const sendWelcomeEmail = async (email: string, fullName: string, password: string): Promise<void> => {
  try {
    // Placeholder for email service integration
    // In production, this would integrate with your email service (SendGrid, AWS SES, etc.)
    
    const emailData = {
      to: email,
      subject: 'Welcome to GrowthPro - Your Account is Ready!',
      template: 'welcome-client',
      data: {
        fullName,
        email,
        password,
        loginUrl: `${window.location.origin}/client_area`,
        supportEmail: 'support@growthpro.com'
      }
    };

    // This would be replaced with actual email service call
    console.log('Email would be sent:', emailData);
    
    // For development, show a toast notification
    toast.success(`Welcome email would be sent to ${email}`);
    
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't fail the entire process if email fails
    toast.error('Account created but welcome email failed to send');
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