-- Remove the foreign key constraint from registrations.user_id
-- This allows anonymous users to register without being in the users table
-- Anonymous users will use email-based IDs like "anon_user@example.com"

-- Step 1: Drop the foreign key constraint
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_user_id_fkey;

-- Step 2: Verify the constraint was removed
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'registrations'
AND constraint_type = 'FOREIGN KEY';
