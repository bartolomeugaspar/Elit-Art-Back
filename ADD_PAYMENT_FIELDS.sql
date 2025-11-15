-- Add payment fields to registrations table
-- This script adds support for offline payment with proof of payment

-- Add new columns to registrations table
ALTER TABLE registrations
ADD COLUMN full_name VARCHAR(255),
ADD COLUMN proof_url VARCHAR(500),
ADD COLUMN payment_method VARCHAR(50),
ADD COLUMN payment_notes VARCHAR(500);

-- Update payment_status check constraint to include 'pending_approval'
-- Note: You may need to drop and recreate the constraint depending on your database

-- Create index for payment status queries
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);

-- Create index for full_name for searching
CREATE INDEX idx_registrations_full_name ON registrations(full_name);

-- Add comment to document the payment flow
COMMENT ON COLUMN registrations.proof_url IS 'URL to uploaded payment proof (image or PDF)';
COMMENT ON COLUMN registrations.payment_method IS 'Payment method used: M-Pesa, Bank Transfer, etc.';
COMMENT ON COLUMN registrations.payment_notes IS 'Admin notes about the payment';
COMMENT ON COLUMN registrations.full_name IS 'Full name of the registrant';
