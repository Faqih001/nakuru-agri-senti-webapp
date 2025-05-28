import { serve, createClient } from '../deps.ts';
import { corsHeaders } from '../_shared/cors.ts';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

interface SecurityEventDetails {
  email: string;
  [key: string]: unknown;
}

interface UserProfile {
  id: string;
  email: string;
  email_verified: boolean;
  status: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Authorization token required');
    }

    // Create Supabase admin client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Create regular client with the user's token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Get the user's info from their token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Check if the user profile exists
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Add a small delay to ensure the auth system has fully created the user
    await new Promise(resolve => setTimeout(resolve, 2000));

    // If no profile exists, try to create one with basic information
    if (!existingProfile && !fetchError) {
      const newProfile = {
        id: user.id,
        email: user.email,
        email_verified: true,
        status: 'active',
      };

      // Try to create the profile
      const { error: insertError } = await supabaseAdmin
        .from('user_profiles')
        .insert(newProfile);

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        // We'll continue since the frontend will also try to create the profile
      }
    }

    // Update user's email verification status
    // We use upsert to either create or update the profile
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({ 
        id: user.id,
        email: user.email,
        email_verified: true,
        status: 'active'
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      // Continue execution but log the error
    }

    // Log the security event
    await supabaseAdmin.rpc('log_security_event', {
      p_user_id: user.id,
      p_event_type: 'email_verified' as const,
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      p_user_agent: req.headers.get('user-agent') || 'unknown',
      p_details: { email: user.email } as SecurityEventDetails
    });

    return new Response(
      JSON.stringify({ 
        message: 'Email verified successfully',
        user: {
          id: user.id,
          email: user.email,
          email_verified: true
        },
        // Include the redirect URL for frontend to use
        redirectUrl: 'https://nakuru-agri-senti-webapp.vercel.app/auth'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error('Verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStatus = (error as { status?: number }).status || 400;
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: errorStatus,
      }
    );
  }
});
