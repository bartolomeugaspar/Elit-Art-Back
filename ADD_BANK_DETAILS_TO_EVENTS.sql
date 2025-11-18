-- Adicionar coluna bank_details à tabela events
ALTER TABLE events ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_events_bank_details ON events USING GIN (bank_details);

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'events' AND column_name = 'bank_details';
