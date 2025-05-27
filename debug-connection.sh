#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== AgriSenti Supabase Connection Debug ===${NC}\n"

# Extract Supabase URL from .env
SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d '=' -f2)
SUPABASE_URL_TRIMMED=$(echo "$SUPABASE_URL" | xargs)

if [ -z "$SUPABASE_URL_TRIMMED" ]; then
  echo -e "${RED}Error: Cannot find Supabase URL in .env file${NC}"
  exit 1
fi

echo -e "${BLUE}Testing connection to:${NC} $SUPABASE_URL_TRIMMED"

# Check if curl is available
if ! command -v curl &> /dev/null; then
  echo -e "${RED}Error: curl is not installed. Please install curl and try again.${NC}"
  exit 1
fi

# Basic connectivity check
echo -e "\n${BLUE}Basic connectivity check:${NC}"
if curl -s --head --connect-timeout 5 "$SUPABASE_URL_TRIMMED" > /dev/null; then
  echo -e "${GREEN}✓ Can reach Supabase URL${NC}"
else
  echo -e "${RED}✗ Cannot reach Supabase URL${NC}"
  
  # Try to diagnose DNS issues
  echo -e "\n${YELLOW}Attempting to diagnose DNS issues:${NC}"
  DOMAIN=$(echo "$SUPABASE_URL_TRIMMED" | sed -E 's|https?://||' | sed 's|/.*||')
  
  echo -e "${BLUE}Resolving domain:${NC} $DOMAIN"
  if host "$DOMAIN" > /dev/null 2>&1; then
    HOST_OUTPUT=$(host "$DOMAIN")
    echo -e "${GREEN}✓ DNS resolution successful:${NC}"
    echo "$HOST_OUTPUT"
  else
    echo -e "${RED}✗ DNS resolution failed${NC}"
    
    echo -e "\n${YELLOW}Testing alternative DNS servers:${NC}"
    if dig "@8.8.8.8" "$DOMAIN" +short > /dev/null 2>&1; then
      DIG_OUTPUT=$(dig "@8.8.8.8" "$DOMAIN" +short)
      echo -e "${GREEN}✓ Can resolve using Google DNS (8.8.8.8):${NC}"
      echo "$DIG_OUTPUT"
      echo -e "\n${YELLOW}Your system DNS server may be having issues. Consider changing your DNS settings.${NC}"
    else
      echo -e "${RED}✗ Still cannot resolve with Google DNS${NC}"
      echo -e "${YELLOW}This suggests the domain might be incorrect or no longer exists.${NC}"
    fi
  fi
fi

# Ping test
echo -e "\n${BLUE}Ping test:${NC}"
DOMAIN=$(echo "$SUPABASE_URL_TRIMMED" | sed -E 's|https?://||' | sed 's|/.*||')
if ping -c 3 "$DOMAIN" > /dev/null 2>&1; then
  PING_OUTPUT=$(ping -c 3 "$DOMAIN" | grep "time=")
  echo -e "${GREEN}✓ Ping successful:${NC}"
  echo "$PING_OUTPUT"
else
  echo -e "${RED}✗ Ping failed${NC}"
  echo -e "${YELLOW}Note: Some servers block ICMP ping requests, so this may not indicate an issue.${NC}"
fi

# Extended HTTP check
echo -e "\n${BLUE}HTTP connection check:${NC}"
CURL_OUTPUT=$(curl -s -I -L --connect-timeout 10 "$SUPABASE_URL_TRIMMED" 2>&1)
if echo "$CURL_OUTPUT" | grep -q "HTTP/"; then
  STATUS=$(echo "$CURL_OUTPUT" | grep "HTTP/" | tail -1 | awk '{print $2}')
  echo -e "${GREEN}✓ HTTP connection established (Status: $STATUS)${NC}"
  
  # Extract important headers
  echo -e "\n${BLUE}Response Headers:${NC}"
  echo "$CURL_OUTPUT" | grep -E 'HTTP/|Content-Type:|Server:|Access-Control-Allow-Origin:|Date:'
else
  echo -e "${RED}✗ HTTP connection failed${NC}"
  echo "$CURL_OUTPUT"
fi

# REST API endpoint check (Supabase Health)
echo -e "\n${BLUE}Checking Supabase REST API (health check):${NC}"
HEALTH_URL="${SUPABASE_URL_TRIMMED}/rest/v1/?apikey=anon"
if curl -s --head --connect-timeout 5 "$HEALTH_URL" > /dev/null; then
  HEALTH_OUTPUT=$(curl -s --head -L --connect-timeout 10 "$HEALTH_URL" 2>&1)
  echo -e "${GREEN}✓ REST API endpoint is reachable${NC}"
  echo -e "\n${BLUE}Health Check Response:${NC}"
  echo "$HEALTH_OUTPUT" | grep -E 'HTTP/|Content-Type:|Server:|Date:'
else
  echo -e "${RED}✗ REST API endpoint is unreachable${NC}"
fi

# Check for SSL/TLS issues
echo -e "\n${BLUE}Checking SSL/TLS configuration:${NC}"
if command -v openssl &> /dev/null; then
  DOMAIN=$(echo "$SUPABASE_URL_TRIMMED" | sed -E 's|https?://||' | sed 's|/.*||')
  if echo | openssl s_client -connect "${DOMAIN}:443" -servername "$DOMAIN" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ SSL/TLS connection successful${NC}"
    
    # Get certificate expiration date
    CERT_INFO=$(echo | openssl s_client -connect "${DOMAIN}:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -dates)
    echo "$CERT_INFO"
  else
    echo -e "${RED}✗ SSL/TLS connection failed${NC}"
    echo -e "${YELLOW}There might be an issue with the SSL certificate or TLS configuration.${NC}"
  fi
else
  echo -e "${YELLOW}openssl not installed, skipping SSL/TLS check${NC}"
fi

# System network info
echo -e "\n${BLUE}System Network Information:${NC}"
echo -e "${YELLOW}Network interfaces:${NC}"
ifconfig 2>/dev/null || ip a 2>/dev/null || echo "Cannot display network interfaces"

echo -e "\n${YELLOW}Current DNS configuration:${NC}"
cat /etc/resolv.conf 2>/dev/null || echo "Cannot read DNS configuration"

echo -e "\n${YELLOW}Traceroute to Supabase domain:${NC}"
DOMAIN=$(echo "$SUPABASE_URL_TRIMMED" | sed -E 's|https?://||' | sed 's|/.*||')
if command -v traceroute &> /dev/null; then
  traceroute -m 10 "$DOMAIN" 2>&1
else
  echo "traceroute not installed, skipping"
fi

# Check Supabase Auth Endpoints
echo -e "\n${BLUE}Testing Supabase Auth endpoints:${NC}"
AUTH_URL="${SUPABASE_URL_TRIMMED}/auth/v1/token?grant_type=password"
if curl -s --head --connect-timeout 5 "$AUTH_URL" > /dev/null; then
  AUTH_OUTPUT=$(curl -s --head -L --connect-timeout 10 "$AUTH_URL" 2>&1)
  echo -e "${GREEN}✓ Auth endpoint is reachable${NC}"
  echo -e "\n${BLUE}Auth Endpoint Response:${NC}"
  echo "$AUTH_OUTPUT" | grep -E 'HTTP/|Content-Type:|Server:|Date:'
else
  echo -e "${RED}✗ Auth endpoint is unreachable${NC}"
fi

# Print Supabase health check guidance
echo -e "\n${BLUE}Next steps:${NC}"
echo -e "${YELLOW}1. If DNS issues were detected, try changing your DNS resolver (e.g., to 8.8.8.8)${NC}"
echo -e "${YELLOW}2. Check if Supabase is experiencing any outages: https://status.supabase.com/${NC}"
echo -e "${YELLOW}3. Verify your Supabase project is active in the dashboard: https://app.supabase.io${NC}"
echo -e "${YELLOW}4. Ensure the anon key in your .env file is correct and has not been revoked${NC}"
echo -e "${YELLOW}5. Check if your network blocks outgoing connections to Supabase domains${NC}"

echo -e "\n${GREEN}Debug complete.${NC}"
