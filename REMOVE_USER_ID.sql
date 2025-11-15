-- PASSO 1: Remover as políticas RLS que dependem de user_id
DROP POLICY IF EXISTS "Users can read own registrations" ON registrations;
DROP POLICY IF EXISTS "Organizers can read event registrations" ON registrations;
DROP POLICY IF EXISTS "Users can register for events" ON registrations;
DROP POLICY IF EXISTS "Users can cancel own registrations" ON registrations;

-- PASSO 2: Remover a coluna user_id
ALTER TABLE registrations DROP COLUMN IF EXISTS user_id CASCADE;

-- PASSO 3: Verificar a estrutura da tabela
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
