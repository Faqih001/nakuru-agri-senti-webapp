# Email Verification System Documentation

This document provides information on the email verification system in the AgriSenti web application.

## Overview

The email verification flow works as follows:

1. User signs up with their email and password
2. A verification email is sent to the user's email address
3. User clicks the verification link in the email
4. The system verifies the user's email and marks it as confirmed
5. User is redirected to the login page
6. User can now log in successfully

## Components

### 1. Signup Process

The signup process in `AuthContext.tsx` initiates the email verification by:

- Sending a verification email to the user's email address
- Creating an unverified user account
- In development mode, it auto-confirms the email for testing purposes
- In production, it requires the user to click the verification link

### 2. Email Verification Page

The `VerifyEmail.tsx` component handles:

- Extracting the token from the URL
- Calling the Supabase function to verify the email
- Displaying the verification status (loading/success/error)
- Redirecting to the login page upon successful verification

### 3. Resend Verification Page

The `ResendVerification.tsx` component allows users to:

- Request a new verification email if they didn't receive the original
- Enter their email address
- Submit to have a new verification email sent

### 4. Supabase Function

The `verify-email` Supabase function:

- Receives the verification token
- Validates the user
- Updates the user's profile to mark the email as verified
- Returns a response with redirection information

## Environment Configuration

The system behaves differently based on the environment:

### Development Environment

- Email verification can be bypassed (auto-confirmed)
- Redirects happen within the local development server
- URLs use the local origin (e.g. <http://localhost:5173>)

### Production Environment

- Full email verification flow is enforced
- All redirects use the production URL: <https://nakuru-agri-senti-webapp.vercel.app/>
- Email verification redirects to: <https://nakuru-agri-senti-webapp.vercel.app/auth>

## Troubleshooting

Common issues and solutions:

### User cannot log in after signup

- Check if the email verification is completed
- Use the "Resend verification email" option
- Check spam/junk folders

### Verification link doesn't work

- Ensure the link is clicked without any modifications
- Check if the link has expired (valid for 24 hours)
- Request a new verification link if needed

### Redirect issues

- Ensure the correct URLs are configured in both development and production
- Check for any cross-domain redirect issues

## Testing

Use the provided test script to test the email verification flow:

```bash
./test-email-verification.sh
```

This script:

1. Creates a test user
2. Simulates email verification
3. Tests signing in with the verified user
4. Tests the verify-email function
5. Validates the redirect URL points to the correct production URL

## Production URL

The production application is deployed at:

[https://nakuru-agri-senti-webapp.vercel.app/](https://nakuru-agri-senti-webapp.vercel.app/)

All redirects and verification links should use this base URL in production.
