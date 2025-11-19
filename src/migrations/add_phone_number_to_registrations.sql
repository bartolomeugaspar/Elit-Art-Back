-- Migration: Add phone_number field to registrations table
-- Date: 2025-11-19
-- Description: Adiciona campo phone_number para permitir envio de confirmação via WhatsApp

-- Adicionar coluna phone_number
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Adicionar comentário explicativo
COMMENT ON COLUMN registrations.phone_number IS 'Número de telefone no formato internacional (ex: +244999123456) para envio de notificações via WhatsApp';

-- (Opcional) Adicionar índice se precisar buscar por telefone
-- CREATE INDEX IF NOT EXISTS idx_registrations_phone_number ON registrations(phone_number);
