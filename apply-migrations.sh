#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")"

echo "Starting Supabase migration process..."

# Check if Supabase CLI is installed
if ! command -v npx supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI not installed."
    echo "Please install it with: npm install -g supabase"
    exit 1
fi

echo "🔄 Applying migrations to local database..."
npx supabase db reset --debug || {
    echo "❌ Error applying migrations."
    echo "Make sure the Supabase local development server is running."
    echo "Try running: npx supabase start"
    exit 1
}

echo "🔍 Verifying user_profiles table structure..."
# Run the schema query and save output to a file
npx supabase db query --file get_schema.sql > user_profiles_schema.txt

# Check if the table has all the required columns
echo "🔎 Checking for required columns in user_profiles table..."
required_columns=("id" "email" "username" "first_name" "last_name" "phone_number" "account_type" "email_verified" "status")

for column in "${required_columns[@]}"; do
    if grep -q "$column" user_profiles_schema.txt; then
        echo "✅ Column found: $column"
    else
        echo "❌ Missing column: $column"
    fi
done

echo "✅ Migration complete! Please restart your application."
echo "Check user_profiles_schema.txt for the table structure."
