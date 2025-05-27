#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AgriSenti Email Verification Test ===${NC}\n"

# Check for required tools
command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl is required but not installed.${NC}"; exit 1; }

# Extract environment variables
source .env
SUPABASE_URL=${VITE_SUPABASE_URL}
SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_KEY=${VITE_SUPABASE_SERVICE_ROLE_KEY}

# Validate environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo -e "${RED}Error: Missing required environment variables in .env file.${NC}"
  echo "Please ensure VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_SUPABASE_SERVICE_ROLE_KEY are defined."
  exit 1
fi

echo -e "${YELLOW}Using Supabase URL:${NC} $SUPABASE_URL"

# Generate a test email with timestamp to avoid conflicts
TIMESTAMP=$(date +%s)
TEST_EMAIL="test.user.${TIMESTAMP}@example.com"
TEST_PASSWORD="Password123!"
echo -e "${YELLOW}Using test email:${NC} $TEST_EMAIL"

# Step 1: Create a test user
echo -e "\n${BLUE}Step 1: Creating test user${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/auth/v1/signup" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"options\": {
      \"data\": {
        \"full_name\": \"Test User\"
      }
    }
  }")

echo "$SIGNUP_RESPONSE" | grep -q "id"
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ User created successfully${NC}"
  USER_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo -e "User ID: $USER_ID"
else
  echo -e "${RED}✗ Failed to create user${NC}"
  echo "$SIGNUP_RESPONSE"
  exit 1
fi

# Step 2: Simulate email verification by updating the user status with admin API
echo -e "\n${BLUE}Step 2: Simulating email verification${NC}"
VERIFY_RESPONSE=$(curl -s -X PUT "$SUPABASE_URL/auth/v1/admin/users/$USER_ID" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"email_confirmed_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
  }")

echo "$VERIFY_RESPONSE" | grep -q '"email_confirmed_at"'
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Email verified successfully${NC}"
else
  echo -e "${RED}✗ Failed to verify email${NC}"
  echo "$VERIFY_RESPONSE"
  exit 1
fi

# Step 3: Try to sign in with the verified user
echo -e "\n${BLUE}Step 3: Testing sign-in with verified user${NC}"
SIGNIN_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "$SIGNIN_RESPONSE" | grep -q "access_token"
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Sign-in successful${NC}"
  ACCESS_TOKEN=$(echo "$SIGNIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
  echo -e "Access token obtained"
else
  echo -e "${RED}✗ Sign-in failed${NC}"
  echo "$SIGNIN_RESPONSE"
  exit 1
fi

# Step 4: Verify email via the Supabase function
echo -e "\n${BLUE}Step 4: Testing verify-email function${NC}"
FUNCTION_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/verify-email" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$ACCESS_TOKEN\"
  }")

echo "$FUNCTION_RESPONSE" | grep -q '"message":"Email verified successfully"'
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ verify-email function successful${NC}"
  REDIRECT_URL=$(echo "$FUNCTION_RESPONSE" | grep -o '"redirectUrl":"[^"]*"' | cut -d'"' -f4)
  echo -e "Redirect URL: $REDIRECT_URL"
else
  echo -e "${RED}✗ verify-email function failed${NC}"
  echo "$FUNCTION_RESPONSE"
fi

echo -e "\n${GREEN}Email verification flow test complete!${NC}"
echo -e "${YELLOW}To complete the test:${NC}"
echo -e "1. Run the development server with 'npm run dev'"
echo -e "2. Visit http://localhost:5173/verify-email?token=access_token=$ACCESS_TOKEN&type=recovery"
echo -e "3. Verify you are redirected to the Auth page with the email pre-filled"
