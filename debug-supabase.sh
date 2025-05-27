#!/bin/bash

# Script to debug Supabase database structure

echo "--- Supabase Database Debug Script ---"
echo ""

# Get Supabase version and connection info
echo "🔍 Checking Supabase CLI"
if ! command -v npx supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first: npm install supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if Supabase is running
echo "🔍 Checking Supabase Status"
echo "-----------------------------"
npx supabase status || {
    echo "❌ Supabase is not running locally. Starting Supabase..."
    npx supabase start || {
        echo "❌ Failed to start Supabase. Please check your installation."
        exit 1
    }
}

echo ""
echo "🔍 Getting Database Table Structure"
echo "-----------------------------"
echo "Tables in the database:"
npx supabase db dump | grep -E "CREATE TABLE|CREATE TYPE"

echo ""
echo "🔍 Examining user_profiles table structure"
echo "-----------------------------"
npx supabase db query --file get_schema.sql

echo ""
echo "🔍 Testing connection to user_profiles table"
echo "-----------------------------"
# Test insert operation to user_profiles table
npx supabase db query "
INSERT INTO user_profiles (id, first_name, last_name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Test', 'User')
ON CONFLICT (id) DO UPDATE SET 
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name
RETURNING *;
"

# Checking authentication settings
echo ""
echo "🔍 Checking Auth Settings"
echo "-----------------------------"
npx supabase db query "SELECT * FROM auth.config;"

echo ""
echo "--- End of Supabase Debug Script ---"
