-- Remove foreign key constraint from registrations.user_id
-- This allows anonymous users to register with email-based IDs

-- First, identify the constraint name
-- ALTER TABLE registrations DROP CONSTRAINT registrations_user_id_fkey;

-- Alternative approach: Drop and recreate the constraint as optional
-- Get the constraint name first
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the foreign key constraint name
    SELECT constraint_name INTO constraint_name
    FROM information_schema.table_constraints
    WHERE table_name = 'registrations' 
    AND constraint_type = 'FOREIGN KEY'
    AND column_name = 'user_id';
    
    -- If constraint exists, drop it
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE registrations DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped foreign key constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No foreign key constraint found on registrations.user_id';
    END IF;
END $$;

-- Verify the constraint is removed
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'registrations';
