# Authentication Configuration

This application uses Supabase for authentication and database operations. To properly configure the authentication system:

## Required Environment Variables

1. Copy `.env.example` to `.env` in the root directory:

   ```bash
   cp env.example .env
   ```

2. Set up the following variables in your `.env` file:
   - `VITE_SUPABASE_URL`: Your Supabase project URL (provided)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key (provided)
   - `VITE_SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (**critical for user profile creation**)

### Getting the Service Role Key

1. Log into the [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Project Settings > API
4. Copy your service role key (under "Project API keys")
5. Paste it in your `.env` file for the `VITE_SUPABASE_SERVICE_ROLE_KEY` variable

### Important Security Notes

- The service role key has full access to your database, bypassing Row Level Security (RLS)
- Never expose this key in frontend code that gets sent to browsers
- Only use the service role key for secure server operations or during development
- In production, consider replacing the direct service role key usage with a secure API endpoint

### Troubleshooting Authentication Issues

If you encounter authentication errors like "Invalid API key" during signup:

1. Check that `VITE_SUPABASE_SERVICE_ROLE_KEY` is properly set in your `.env` file
2. Make sure the key is not surrounded by quotes
3. Restart the development server after making changes to environment variables
4. Verify the key is still valid in your Supabase dashboard
