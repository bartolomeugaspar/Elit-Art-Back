-- Fix RLS policies on audit_logs table
-- This migration removes the restrictive RLS policies that were blocking inserts and selects

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable read access for admins" ON audit_logs;
DROP POLICY IF EXISTS "Prevent modifications to audit logs" ON audit_logs;

-- Disable RLS on audit_logs table (simplest solution)
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS, uncomment below and comment out the DISABLE line above
-- CREATE POLICY "Allow insert for audit logs"
-- ON audit_logs
-- FOR INSERT
-- WITH CHECK (true);
--
-- CREATE POLICY "Allow read for authenticated users"
-- ON audit_logs
-- FOR SELECT
-- TO authenticated
-- USING (true);
--
-- CREATE POLICY "Prevent delete and update"
-- ON audit_logs
-- FOR UPDATE, DELETE
-- USING (false);
