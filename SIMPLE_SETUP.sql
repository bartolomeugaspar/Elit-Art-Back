-- Script 1: Remover restrição de chave estrangeira
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_user_id_fkey;

-- Script 2: Adicionar coluna de email (se não existir)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Script 3: Verificar estrutura da tabela
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
