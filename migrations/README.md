# Database Migrations

## Como Executar as Migrations

### No Supabase (Recomendado)

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral)
4. Copie o conteúdo do arquivo `update_events_category_constraint.sql`
5. Cole no editor SQL
6. Clique em **Run** para executar

### Usando Cliente PostgreSQL Local

```bash
# Se você tiver acesso direto ao banco de dados
psql -h <host> -U <usuario> -d <database> -f migrations/update_events_category_constraint.sql
```

## Migration: Update Events Category Constraint

**Data:** 2025-12-02  
**Descrição:** Adiciona novas categorias de eventos (Palestra, Performance, Lançamento, Encontro, Outro)

**Arquivo:** `update_events_category_constraint.sql`

### O que essa migration faz:

1. Remove a constraint antiga `events_category_check`
2. Adiciona nova constraint com as seguintes categorias:
   - Workshop
   - Exposição
   - Masterclass
   - Networking
   - Palestra (NOVO)
   - Performance (NOVO)
   - Lançamento (NOVO)
   - Encontro (NOVO)
   - Outro (NOVO)

### Verificação

Após executar a migration, você pode verificar se funcionou executando:

```sql
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'events_category_check';
```

---

## Migration: Add Show in Public to Artists

**Data:** 2025-12-08  
**Descrição:** Adiciona campo `show_in_public` para controlar quais artistas aparecem na seção pública

**Arquivo:** `add_show_in_public_to_artists.sql`

### O que essa migration faz:

1. Adiciona coluna `show_in_public` (BOOLEAN, padrão true)
2. Atualiza artistas existentes para `show_in_public = true`
3. Adiciona comentário explicativo na coluna

### Como executar:

```bash
# No SQL Editor do Supabase, execute o conteúdo do arquivo
cat migrations/add_show_in_public_to_artists.sql
```

---

## Script: Insert Team Leaders

**Data:** 2025-12-08  
**Descrição:** Insere membros administrativos (Faustino, Josemara, Luísa) com `show_in_public = false`

**Arquivo:** `insert_team_leaders.sql`

### O que esse script faz:

1. Insere os 3 líderes administrativos na tabela `artists`
2. Define `show_in_public = false` para que não apareçam em "Artistas do Movimento"
3. Usa `ON CONFLICT` para atualizar se já existirem

### Como executar:

```bash
# Execute DEPOIS da migration add_show_in_public_to_artists.sql
# No SQL Editor do Supabase, execute o conteúdo do arquivo
cat migrations/insert_team_leaders.sql
```

### Ordem de Execução:

1. ✅ `add_show_in_public_to_artists.sql`
2. ✅ `insert_team_leaders.sql`

## Rollback (se necessário)

Caso precise reverter para as categorias antigas:

```sql
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;

ALTER TABLE events ADD CONSTRAINT events_category_check 
CHECK (category IN ('Workshop', 'Exposição', 'Masterclass', 'Networking'));
```

**⚠️ ATENÇÃO:** Fazer rollback irá falhar se houver eventos já criados com as novas categorias!
