import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from reset-password endpoint!')

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
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    // Get user by email
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (userError || !userData) {
      // Return success even if user doesn't exist for security
      return new Response(
        JSON.stringify({ message: 'If an account exists, a reset link has been sent' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Generate reset token (uuid)
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Store reset token
    const { error: tokenError } = await supabaseClient
      .from('password_reset_tokens')
      .insert({
        user_id: userData.id,
        token: token,
        expires_at: expiresAt.toISOString()
      })

    if (tokenError) {
      throw tokenError
    }

    // Create reset URL
    const resetUrl = `${Deno.env.get('FRONTEND_URL')}/reset-password?token=${token}`

    // TODO: Integrate with email service (e.g., SendGrid, AWS SES)
    // For now, we'll just return the reset URL in development
    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development'

    // Log the security event
    await supabaseClient.rpc('log_security_event', {
      p_user_id: userData.id,
      p_event_type: 'password_reset_requested',
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      p_user_agent: req.headers.get('user-agent') || 'unknown',
      p_details: { email: email }
    })

    return new Response(
      JSON.stringify({ 
        message: 'If an account exists, a reset link has been sent',
        ...(isDevelopment && { resetUrl }) // Only include reset URL in development
      }),
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
