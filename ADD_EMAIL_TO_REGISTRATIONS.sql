-- Verifica se a coluna email já existe na tabela registrations
DO $$
BEGIN
    -- Tenta adicionar a coluna, se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'registrations' AND column_name = 'email'
    ) THEN
        ALTER TABLE registrations 
        ADD COLUMN email VARCHAR(255);
        
        RAISE NOTICE 'Coluna email adicionada à tabela registrations';
    ELSE
        RAISE NOTICE 'A coluna email já existe na tabela registrations';
    END IF;
END $$;
