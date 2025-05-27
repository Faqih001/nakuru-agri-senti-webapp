#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AgriSenti JWT Token Validator ===${NC}\n"

# Extract JWT token from .env
SERVICE_ROLE_KEY=$(grep "VITE_SUPABASE_SERVICE_ROLE_KEY" .env | cut -d '=' -f2)
SERVICE_ROLE_KEY_TRIMMED=$(echo "$SERVICE_ROLE_KEY" | xargs)

if [ -z "$SERVICE_ROLE_KEY_TRIMMED" ]; then
  echo -e "${RED}Error: Cannot find Supabase service role key in .env file${NC}"
  exit 1
fi

echo -e "${BLUE}Analyzing JWT token:${NC}"
echo -e "${YELLOW}$SERVICE_ROLE_KEY_TRIMMED${NC}"

# Check if the string has three parts separated by dots
if [[ ! "$SERVICE_ROLE_KEY_TRIMMED" =~ ^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$ ]]; then
  echo -e "${RED}✗ Invalid JWT format. Should have 3 parts separated by dots.${NC}"
  exit 1
fi

# Split the token into parts
IFS='.' read -r header payload signature <<< "$SERVICE_ROLE_KEY_TRIMMED"

# Decode header
echo -e "\n${BLUE}Header:${NC}"
decoded_header=$(echo -n "$header" | base64 -d 2>/dev/null || echo -n "$header" | base64 --decode 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "$decoded_header" | python3 -m json.tool 2>/dev/null || echo "$decoded_header"
else
  echo -e "${RED}Failed to decode header${NC}"
fi

# Decode payload
echo -e "\n${BLUE}Payload:${NC}"
decoded_payload=$(echo -n "$payload" | base64 -d 2>/dev/null || echo -n "$payload" | base64 --decode 2>/dev/null)
if [ $? -eq 0 ]; then
  payload_json=$(echo "$decoded_payload" | python3 -m json.tool 2>/dev/null || echo "$decoded_payload")
  echo "$payload_json"
  
  # Check for 'role' vs 'rose' typo
  if echo "$payload_json" | grep -q '"rose"'; then
    echo -e "\n${RED}✗ Found 'rose' claim instead of 'role'. This is a common typo!${NC}"
    echo -e "${YELLOW}Do you want to fix this by replacing 'rose' with 'role' in the payload? [y/N]${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      # Create corrected payload
      corrected_payload=$(echo "$decoded_payload" | sed 's/"rose"/"role"/g')
      echo -e "${BLUE}Corrected payload:${NC}"
      echo "$corrected_payload" | python3 -m json.tool
      
      # Re-encode payload
      if command -v python3 &>/dev/null; then
        # Use Python for base64 encoding to handle padding correctly
        encoded_payload=$(python3 -c "import base64; import sys; print(base64.urlsafe_b64encode(sys.argv[1].encode()).decode().rstrip('='))" "$corrected_payload")
        new_token="$header.$encoded_payload.$signature"
        
        echo -e "\n${GREEN}✓ Generated corrected token:${NC}"
        echo "$new_token"
        
        # Offer to update .env file
        echo -e "\n${YELLOW}Do you want to update the .env file with the corrected token? [y/N]${NC}"
        read -r update_response
        if [[ "$update_response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
          # Create backup
          cp .env .env.backup
          echo -e "${GREEN}✓ Created backup at .env.backup${NC}"
          
          # Update the token in .env
          sed -i "s|VITE_SUPABASE_SERVICE_ROLE_KEY=.*|VITE_SUPABASE_SERVICE_ROLE_KEY=$new_token|" .env
          echo -e "${GREEN}✓ Updated token in .env file${NC}"
        fi
      else
        echo -e "${RED}✗ Python3 is required for token correction but was not found${NC}"
      fi
    fi
  elif ! echo "$payload_json" | grep -q '"role"'; then
    echo -e "\n${RED}✗ Missing 'role' claim in the payload!${NC}"
  elif ! echo "$payload_json" | grep -q '"role".*:"service_role"'; then
    echo -e "\n${RED}✗ The 'role' claim is not set to 'service_role'!${NC}"
  else
    echo -e "\n${GREEN}✓ JWT has correct 'role' claim${NC}"
  fi
else
  echo -e "${RED}Failed to decode payload${NC}"
fi

# Check if the signature is present (we don't verify it, just check it's there)
if [ -n "$signature" ]; then
  echo -e "\n${GREEN}✓ JWT has a signature${NC}"
else
  echo -e "\n${RED}✗ JWT is missing a signature${NC}"
fi

echo -e "\n${BLUE}==== JWT Analysis Complete ====${NC}"
