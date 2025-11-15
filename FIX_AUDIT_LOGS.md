# Corrigir Audit Logs - RLS Issue

## Problema
A tabela `audit_logs` tem Row Level Security (RLS) habilitada com políticas que bloqueiam:
- Inserção de novos logs
- Leitura dos logs

## Solução

### Passo 1: Acessar Supabase Dashboard
1. Vá para https://supabase.com
2. Faça login com sua conta
3. Selecione seu projeto

### Passo 2: Abrir SQL Editor
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**

### Passo 3: Executar o SQL

Cole o seguinte SQL e clique em **Run**:

```sql
-- Remove problematic RLS policies
DROP POLICY IF EXISTS "Enable read access for admins" ON audit_logs;
DROP POLICY IF EXISTS "Prevent modifications to audit logs" ON audit_logs;

-- Disable RLS on audit_logs table
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
```

### Passo 4: Verificar
1. Volte para a aplicação
2. Tente fazer login com credenciais erradas
3. Acesse "Logs do Sistema"
4. Você deve ver as tentativas falhadas registradas

## Alternativa: Manter RLS com Políticas Corretas

Se preferir manter RLS habilitado, use este SQL:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for admins" ON audit_logs;
DROP POLICY IF EXISTS "Prevent modifications to audit logs" ON audit_logs;

-- Create new policies
CREATE POLICY "Allow insert for audit logs"
ON audit_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow read for authenticated users"
ON audit_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Prevent delete and update"
ON audit_logs
FOR UPDATE, DELETE
USING (false);
```

## Verificação

Após executar o SQL, você deve ver:
- ✅ Tentativas de login falhadas sendo registradas
- ✅ Cards mostrando "Tentativas Falhadas" > 0
- ✅ Logs aparecendo na tabela

## Troubleshooting

Se ainda não funcionar:
1. Verifique se o SQL foi executado com sucesso (sem erros)
2. Recarregue a página da aplicação (F5)
3. Tente fazer login novamente com credenciais erradas
4. Verifique o console do navegador (F12) para erros
