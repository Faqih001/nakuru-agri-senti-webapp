import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from update-phone endpoint!')

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
    const { userId, phoneNumber } = await req.json()

    if (!userId || !phoneNumber) {
      throw new Error('User ID and phone number are required')
    }

    // Update the user's phone number (no verification needed)
    const { error } = await supabaseClient.rpc('set_phone_number', {
      p_user_id: userId,
      p_phone_number: phoneNumber
    })

    if (error) {
      throw error
    }

    // Log the security event
    await supabaseClient.rpc('log_security_event', {
      p_user_id: userId,
      p_event_type: 'phone_number_updated',
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      p_user_agent: req.headers.get('user-agent') || 'unknown',
      p_details: { phone_number: phoneNumber }
    })

    return new Response(
      JSON.stringify({ message: 'Phone number updated successfully' }),
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
