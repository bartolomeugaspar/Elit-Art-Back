# Fix: Forum Replies 401 Error

## Problema
Ao tentar enviar uma resposta no fórum, o endpoint retorna erro **401 Unauthorized**.

**URL afetada:** `POST /api/forum/topics/{id}/replies`

**Erro no frontend:**
```
Erro ao enviar resposta: Error: Erro ao enviar resposta
```

## Causa Raiz
A tabela `forum_replies` no Supabase tem **Row Level Security (RLS)** habilitada com políticas que bloqueiam INSERT sem autenticação.

Como o endpoint permite respostas anônimas (sem token JWT), o Supabase está rejeitando com 401.

## Solução

### Passo 1: Acessar Supabase Dashboard
1. Vá para https://supabase.com
2. Faça login com sua conta
3. Selecione o projeto **Elit-Art**

### Passo 2: Abrir SQL Editor
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**

### Passo 3: Executar Script SQL
Cole o seguinte script:

```sql
-- Desabilitar RLS na tabela forum_replies
ALTER TABLE forum_replies DISABLE ROW LEVEL SECURITY;

-- Verificar se foi desabilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'forum_replies';
```

### Passo 4: Executar
1. Clique no botão **Run** (ou Ctrl+Enter)
2. Você deve ver uma mensagem de sucesso

### Passo 5: Testar
1. Volte ao frontend
2. Tente enviar uma resposta novamente
3. Deve funcionar agora!

## Alternativa: Criar Políticas Públicas

Se preferir manter RLS habilitado, execute este script:

```sql
-- Habilitar RLS
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "Enable read access for all users" ON forum_replies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON forum_replies;
DROP POLICY IF EXISTS "Enable update for users based on id" ON forum_replies;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON forum_replies;

-- Criar novas políticas públicas
CREATE POLICY "Allow public read"
ON forum_replies
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert"
ON forum_replies
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
ON forum_replies
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow delete for authenticated users"
ON forum_replies
FOR DELETE
USING (auth.uid() IS NOT NULL);
```

## Verificação

Após executar, você pode verificar o status com:

```sql
SELECT 
  tablename,
  rowsecurity,
  (SELECT COUNT(*) FROM information_schema.role_routine_grants 
   WHERE routine_name LIKE 'forum_replies%') as policy_count
FROM pg_tables 
WHERE tablename = 'forum_replies';
```

## Resultado Esperado

✅ Usuários anônimos podem enviar respostas  
✅ Usuários autenticados podem enviar respostas  
✅ Erro 401 desaparece  

## Próximas Ações

1. Execute o script SQL acima
2. Teste o endpoint no frontend
3. Se ainda houver erro, verifique:
   - Se a tabela `forum_replies` existe
   - Se há dados na tabela `forum_topics` com o ID usado no teste
   - Se o backend está rodando corretamente

## Referência

- **Arquivo afetado:** `/src/routes/forum.ts` (linha 369-391)
- **Serviço:** `/src/services/ForumService.ts` (método `createReply`)
- **Tabela:** `forum_replies` no Supabase
