-- Fix phone column length constraint in users table
-- The error "value too long for type character varying(20)" suggests 
-- the phone column is limited to 20 characters

-- First, check current schema
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'phone';

-- Increase phone column length to accommodate international phone numbers
-- International phone numbers can be up to 15 digits + country code + formatting
ALTER TABLE users 
ALTER COLUMN phone TYPE VARCHAR(30);

-- Verify the change
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'phone';
