#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AgriSenti Supabase Authentication Setup ===${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${YELLOW}No .env file found. Creating one from env.example...${NC}"
  
  if [ -f env.example ]; then
    cp env.example .env
    echo -e "${GREEN}Created .env file from template.${NC}"
  else
    echo -e "${RED}Error: env.example file not found.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}Found existing .env file.${NC}"
fi

# Check for service role key
SERVICE_ROLE_KEY=$(grep "VITE_SUPABASE_SERVICE_ROLE_KEY" .env | cut -d '=' -f2)
SERVICE_ROLE_KEY_TRIMMED=$(echo "$SERVICE_ROLE_KEY" | xargs)

if [ -z "$SERVICE_ROLE_KEY_TRIMMED" ] || [ "$SERVICE_ROLE_KEY_TRIMMED" = "your_service_role_key_here" ]; then
  echo -e "\n${RED}WARNING: Missing or placeholder Supabase Service Role Key detected.${NC}"
  echo -e "${YELLOW}User profile creation will fail without a valid service role key.${NC}"
  
  echo -e "\n${BLUE}To fix this issue:${NC}"
  echo "1. Go to Supabase Dashboard: https://app.supabase.com"
  echo "2. Select your project"
  echo "3. Navigate to Project Settings > API"
  echo "4. Copy your 'service_role' key (under 'Project API Keys')"
  echo -e "5. Add it to your .env file as: ${GREEN}VITE_SUPABASE_SERVICE_ROLE_KEY=your_key_here${NC}"
  echo -e "6. Restart your development server\n"
  
  # Optional: Prompt to open text editor
  read -p "Would you like to edit your .env file now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v nano &> /dev/null; then
      nano .env
    elif command -v vim &> /dev/null; then
      vim .env
    else
      echo -e "${YELLOW}No suitable text editor found. Please edit the .env file manually.${NC}"
    fi
  fi
else
  echo -e "${GREEN}Supabase Service Role Key is configured.${NC}"
fi

# Test Supabase connection
echo -e "\n${BLUE}Testing Supabase connection...${NC}"

# Extract URL from .env
SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d '=' -f2)
SUPABASE_URL_TRIMMED=$(echo "$SUPABASE_URL" | xargs)

if [ -z "$SUPABASE_URL_TRIMMED" ]; then
  echo -e "${RED}Error: VITE_SUPABASE_URL not found in .env file.${NC}"
else
  # Check if curl is available
  if command -v curl &> /dev/null; then
    # Simple check to see if the URL is reachable
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL_TRIMMED")
    
    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "404" ]; then
      echo -e "${GREEN}Supabase URL is reachable.${NC}"
    else
      echo -e "${RED}Warning: Supabase URL returned HTTP status $HTTP_STATUS.${NC}"
    fi
  else
    echo -e "${YELLOW}curl not found, skipping connection test.${NC}"
  fi
fi

echo -e "\n${GREEN}Setup check complete.${NC}"
echo -e "${BLUE}If you need further assistance, refer to AUTH_README.md${NC}\n"
