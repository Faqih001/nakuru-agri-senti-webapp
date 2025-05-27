#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AgriSenti Authentication Test Suite ===${NC}\n"

# Check for required tools
command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl is required but not installed.${NC}"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo -e "${YELLOW}Warning: jq is not installed. Some tests may not work properly.${NC}"; }

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

# Test 1: Basic connectivity to Supabase
echo -e "\n${BLUE}Test 1: Basic connectivity to Supabase${NC}"
if curl -s --head --connect-timeout 5 "$SUPABASE_URL" >/dev/null; then
  echo -e "${GREEN}✓ Can reach Supabase URL${NC}"
else
  echo -e "${RED}✗ Cannot reach Supabase URL${NC}"
  echo "Running DNS diagnostics..."
  DOMAIN=$(echo "$SUPABASE_URL" | sed -E 's|https?://||' | sed 's|/.*||')
  echo -e "${BLUE}Resolving domain:${NC} $DOMAIN"
  host "$DOMAIN" || echo -e "${RED}DNS resolution failed${NC}"
  exit 1
fi

# Test 2: Validate JWT token format
echo -e "\n${BLUE}Test 2: Validating JWT token format${NC}"
JWT_PARTS=$(echo "$SUPABASE_SERVICE_KEY" | awk -F'.' '{print NF-1}')
if [ "$JWT_PARTS" -eq 2 ]; then
  echo -e "${GREEN}✓ JWT has correct number of parts${NC}"
  
  # Decode JWT payload to check claims
  PAYLOAD=$(echo "$SUPABASE_SERVICE_KEY" | cut -d'.' -f2)
  PAYLOAD_PADDED=$(echo "$PAYLOAD" | awk '{gsub(/.{76}/,"&\n"); print}')
  
  if command -v jq >/dev/null 2>&1; then
    DECODED=$(echo "$PAYLOAD" | base64 -d 2>/dev/null | jq -r '.')
    
    if echo "$DECODED" | jq -e 'has("role")' >/dev/null; then
      ROLE=$(echo "$DECODED" | jq -r '.role')
      if [ "$ROLE" = "service_role" ]; then
        echo -e "${GREEN}✓ JWT has correct 'role' claim: service_role${NC}"
      else
        echo -e "${RED}✗ JWT has incorrect 'role' value: $ROLE${NC}"
      fi
    elif echo "$DECODED" | jq -e 'has("rose")' >/dev/null; then
      echo -e "${RED}✗ JWT has 'rose' claim instead of 'role' - this is a typo!${NC}"
    else
      echo -e "${RED}✗ JWT is missing 'role' claim${NC}"
    fi
  else
    echo -e "${YELLOW}⚠ Cannot validate JWT payload without jq. Please install jq for complete validation.${NC}"
  fi
else
  echo -e "${RED}✗ Invalid JWT format. Expected 3 parts separated by dots.${NC}"
fi

# Test 3: Test authentication with anon key
echo -e "\n${BLUE}Test 3: Testing authentication with anon key${NC}"
ANON_AUTH_TEST=$(curl -s -X GET \
  "$SUPABASE_URL/rest/v1/user_profiles?limit=1" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY")

if echo "$ANON_AUTH_TEST" | grep -q "error"; then
  echo -e "${RED}✗ Anon key authentication failed${NC}"
  echo "$ANON_AUTH_TEST"
else
  echo -e "${GREEN}✓ Anon key authentication successful${NC}"
fi

# Test 4: Test authentication with service role key
echo -e "\n${BLUE}Test 4: Testing authentication with service role key${NC}"
SERVICE_AUTH_TEST=$(curl -s -X GET \
  "$SUPABASE_URL/rest/v1/user_profiles?limit=1" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY")

if echo "$SERVICE_AUTH_TEST" | grep -q "error"; then
  echo -e "${RED}✗ Service role key authentication failed${NC}"
  echo "$SERVICE_AUTH_TEST"
else
  echo -e "${GREEN}✓ Service role key authentication successful${NC}"
fi

# Test 5: Generate a test frontend URL
echo -e "\n${BLUE}Test 5: Setting up test frontend${NC}"
TEST_PORT=5173
if command -v lsof >/dev/null 2>&1; then
  while lsof -i:$TEST_PORT >/dev/null 2>&1; do
    TEST_PORT=$((TEST_PORT+1))
  done
fi
TEST_URL="http://localhost:$TEST_PORT"

echo -e "${GREEN}✓ Test URLs prepared${NC}"
echo -e "Authentication test page: ${TEST_URL}/email-confirmation-test.html"
echo -e "Supabase connection test page: ${TEST_URL}/supabase-test.html"

echo -e "\n${BLUE}All tests completed!${NC}"
echo -e "${YELLOW}To complete testing, start your development server:${NC}"
echo "npm run dev -- --port $TEST_PORT"
echo -e "Then visit the test pages in your browser."
