// Simple script to test authentication flow with Supabase
import { createClient } from '@supabase/supabase-js';

// Configure your Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'http://localhost:54321',  // Default local Supabase URL
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'  // Default local anon key
);

// Test user credentials - change these for your test
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

async function testAuthFlow() {
  console.log('Starting auth flow test...');
  
  try {
    // 1. Sign up a test user
    console.log(`Signing up user: ${TEST_EMAIL}`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      options: {
        data: {
          full_name: 'Test User',
          location: 'Test Location',
          farm_size: 'Small'
        }
      }
    });

    if (signUpError) {
      throw signUpError;
    }
    
    console.log('Signup successful:', signUpData.user);
    
    // 2. Check if the user profile was created
    console.log('Checking for user profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', signUpData.user.id)
      .single();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else {
      console.log('Profile created successfully:', profileData);
    }
    
    // 3. Sign in with the created user
    console.log('Testing sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (signInError) {
      throw signInError;
    }
    
    console.log('Sign in successful!', signInData.user.email);
    
    // 4. Sign out
    await supabase.auth.signOut();
    console.log('Sign out successful');
    
    console.log('Auth flow test completed successfully!');
  } catch (error) {
    console.error('Auth test failed:', error);
  }
}

// Run the test
testAuthFlow();
