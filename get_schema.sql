-- Detailed query to check user_profiles table structure
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'user_profiles'
ORDER BY 
    ordinal_position;
