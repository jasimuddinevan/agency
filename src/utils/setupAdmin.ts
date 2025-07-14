export const setupAdminUser = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/setup-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Admin user created successfully:', result.credentials);
      return result;
    } else {
      console.error('Failed to create admin user:', result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
    throw error;
  }
};