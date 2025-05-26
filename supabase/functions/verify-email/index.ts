import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from verify-email endpoint!')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    // Get the request body
    const { token } = await req.json()

    if (!token) {
      throw new Error('Verification token is required')
    }

    // Get the verification token record
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Invalid verification token')
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error('Verification token has expired')
    }

    // Check if token is already used
    if (tokenData.used_at) {
      throw new Error('Verification token has already been used')
    }

    // Begin transaction to update user and token
    const { data, error } = await supabaseClient.rpc('verify_email', {
      p_token: token,
      p_user_id: tokenData.user_id
    })

    if (error) {
      throw error
    }

    // Log the security event
    await supabaseClient.rpc('log_security_event', {
      p_user_id: tokenData.user_id,
      p_event_type: 'email_verified',
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      p_user_agent: req.headers.get('user-agent') || 'unknown',
      p_details: { token: token }
    })

    return new Response(
      JSON.stringify({ message: 'Email verified successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
