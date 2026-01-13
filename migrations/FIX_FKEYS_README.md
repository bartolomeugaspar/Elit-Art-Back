# Correção das Foreign Keys - artist_quota_payments

## Problema
A tabela `artist_quota_payments` foi criada com referências incorretas para `auth.users` em vez de `users`, causando erro no Supabase.

## Solução

### Opção 1: Via SQL Editor do Supabase (RECOMENDADO)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo do arquivo: `migrations/fix_artist_quota_payments_fkeys.sql`

### Opção 2: Via CLI do Supabase

```bash
# Se você tiver o Supabase CLI configurado
supabase db execute -f migrations/fix_artist_quota_payments_fkeys.sql
```

## O que foi corrigido

### ANTES (incorreto):
```sql
artist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
aprovado_por UUID REFERENCES auth.users(id)
```

### DEPOIS (correto):
```sql
artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
aprovado_por UUID REFERENCES users(id) ON DELETE SET NULL
```

## Verificação

Após executar a migração, teste criando um pagamento de cota via frontend para confirmar que tudo está funcionando.

## Nota
⚠️ Este script irá **DROPAR** a tabela existente e recriar. Se você já tem dados na tabela, faça backup antes!
