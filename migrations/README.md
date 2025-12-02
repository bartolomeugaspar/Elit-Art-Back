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

## Rollback (se necessário)

Caso precise reverter para as categorias antigas:

```sql
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;

ALTER TABLE events ADD CONSTRAINT events_category_check 
CHECK (category IN ('Workshop', 'Exposição', 'Masterclass', 'Networking'));
```

**⚠️ ATENÇÃO:** Fazer rollback irá falhar se houver eventos já criados com as novas categorias!
