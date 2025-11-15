-- PASSO 1: Remover a restrição de chave estrangeira
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_user_id_fkey;

-- PASSO 2: Verificar se funcionou
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'registrations' 
AND constraint_type = 'FOREIGN KEY';
