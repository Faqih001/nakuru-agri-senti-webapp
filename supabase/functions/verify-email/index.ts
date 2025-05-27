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

    // Update user's email verification status
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        email_verified: true,
        status: 'active' as const
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
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
