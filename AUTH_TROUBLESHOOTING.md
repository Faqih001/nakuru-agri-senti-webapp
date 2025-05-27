# Authentication Troubleshooting Guide

This guide will help you diagnose and fix common authentication issues with Supabase in the AgriSenti application.

## Common Issues and Solutions

### 1. Email Verification Problems

**Symptoms:**

- Users cannot log in after signing up
- You see errors like "Email not confirmed" or "Email not verified"

**Solutions:**

- Email verification has been disabled in the application code
- If you're still experiencing issues, use the `email-confirmation-test.html` tool to manually verify email addresses
- Check the Supabase dashboard to ensure email confirmation is disabled in the project settings

### 2. Connection Issues

**Symptoms:**

- Error messages containing "ERR_NAME_NOT_RESOLVED", "Failed to fetch", or "Connection refused"
- Authentication operations fail but the internet connection works for other sites

**Solutions:**

- Run `./debug-connection.sh` to diagnose DNS and connectivity issues
- Check if your network blocks the Supabase domain
- Try using a different DNS server (like 8.8.8.8) if your default DNS has issues
- Test the connection using `./public/supabase-test.html` in your browser

### 3. Service Role Authentication Issues

**Symptoms:**

- Profile creation fails after signup
- Error messages related to JWT token or authorization
- Error messages mentioning "role" claim or permission denied

**Solutions:**

- Run `./debug-jwt.sh` to check for JWT token format issues
- Ensure your Supabase service role key has "role": "service_role" (not "rose": "service_role")
- Verify you're using the correct service role key from your Supabase dashboard
- Check that the environmental variable `VITE_SUPABASE_SERVICE_ROLE_KEY` is correctly set

### 4. Complete Authentication Testing

Run the full test suite to validate all authentication components:

```sh
./test-auth.sh
```

This will check:

1. Basic connectivity to Supabase
2. JWT token format and claims
3. Authentication with anon key
4. Authentication with service role key
5. Set up URLs for in-browser testing tools

## Debugging Tools

This project includes several debugging tools:

- **./debug-connection.sh**: Diagnoses network connectivity issues with Supabase
- **./debug-jwt.sh**: Validates your JWT token format and can fix common typos
- **./test-auth.sh**: Comprehensive test suite for all authentication components
- **/public/supabase-test.html**: Browser-based connection testing
- **/public/email-confirmation-test.html**: Tool to test and fix email confirmation issues

## Environmental Variables

Make sure your `.env` file contains these correctly configured variables:

VITE_SUPABASE_URL=<https://your-project-ref.supabase.co>
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Getting Help

If you're still experiencing issues after trying these solutions:

1. Check the browser console for detailed error messages
2. Look at the Network tab in developer tools for failed requests
3. Check the Supabase project logs in your dashboard
4. Contact support at <support@agrisenti.com> with the error details and results of the debugging tools
