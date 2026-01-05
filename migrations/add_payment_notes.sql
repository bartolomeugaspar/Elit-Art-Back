-- Migration: Adicionar coluna payment_notes na tabela registrations
-- Data: 2026-01-05

-- Adicionar coluna payment_notes
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Comentário na coluna
COMMENT ON COLUMN registrations.payment_notes IS 'Notas ou observações sobre o pagamento';
