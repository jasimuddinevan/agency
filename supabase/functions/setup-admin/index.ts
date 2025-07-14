const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the admin user in Supabase Auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create auth user
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
      },
      body: JSON.stringify({
        email: "admin@growthpro.com",
        password: "admin123",
        email_confirm: true,
        user_metadata: {
          full_name: "Admin User"
        }
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("Auth user creation failed:", errorText);
      
      // If user already exists, that's okay
      if (errorText.includes("already registered")) {
        console.log("Admin user already exists in auth");
      } else {
        throw new Error(`Failed to create auth user: ${errorText}`);
      }
    }

    const authUser = authResponse.ok ? await authResponse.json() : null;
    const userId = authUser?.id || "00000000-0000-0000-0000-000000000000"; // fallback ID

    // Create admin user record in admin_users table
    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/admin_users`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        id: userId,
        email: "admin@growthpro.com",
        full_name: "Admin User",
        role: "super_admin"
      }),
    });

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      console.error("Admin user DB record creation failed:", errorText);
      
      // If record already exists, that's okay
      if (!errorText.includes("duplicate key")) {
        throw new Error(`Failed to create admin user record: ${errorText}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user created successfully",
        credentials: {
          email: "admin@growthpro.com",
          password: "admin123"
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error creating admin user:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});