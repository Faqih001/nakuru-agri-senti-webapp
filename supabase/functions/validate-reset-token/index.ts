import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from validate-reset-token endpoint!')

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
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      throw new Error('Token and new password are required')
    }

    // Get the reset token record
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Invalid reset token')
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error('Reset token has expired')
    }

    // Check if token is already used
    if (tokenData.used_at) {
      throw new Error('Reset token has already been used')
    }

    // Begin transaction to update password and mark token as used
    const { data, error } = await supabaseClient.rpc('reset_password', {
      p_token: token,
      p_new_password: newPassword,
      p_user_id: tokenData.user_id
    })

    if (error) {
      throw error
    }

    // Log the security event
    await supabaseClient.rpc('log_security_event', {
      p_user_id: tokenData.user_id,
      p_event_type: 'password_reset_completed',
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      p_user_agent: req.headers.get('user-agent') || 'unknown',
      p_details: { token: token }
    })

    return new Response(
      JSON.stringify({ message: 'Password reset successfully' }),
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
