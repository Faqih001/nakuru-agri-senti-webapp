import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from resend-phone-verification endpoint!')

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
    const { phoneNumber, userId } = await req.json()

    if (!phoneNumber || !userId) {
      throw new Error('Phone number and user ID are required')
    }

    // Generate new 6-digit token
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Token expires in 10 minutes

    // Store new verification token
    const { error: tokenError } = await supabaseClient
      .from('phone_verification_tokens')
      .insert({
        user_id: userId,
        phone_number: phoneNumber,
        token: token,
        expires_at: expiresAt.toISOString()
      })

    if (tokenError) {
      throw tokenError
    }

    // TODO: Integrate with SMS service provider (e.g., Twilio, MessageBird)
    // For now, we'll just return the token in development
    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development'

    // Log the security event
    await supabaseClient.rpc('log_security_event', {
      p_user_id: userId,
      p_event_type: 'phone_verification_resent',
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      p_user_agent: req.headers.get('user-agent') || 'unknown',
      p_details: { phone_number: phoneNumber }
    })

    return new Response(
      JSON.stringify({ 
        message: 'Verification code sent successfully',
        ...(isDevelopment && { token }) // Only include token in development
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
