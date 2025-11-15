# 📋 Instruções de Setup - Registros com Nome e E-mail

## Passo 1: Remover Restrição de Chave Estrangeira

Acesse o **Supabase** → **SQL Editor** e execute:

```sql
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_user_id_fkey;
```

## Passo 2: Adicionar Coluna de E-mail

Execute no **SQL Editor**:

```sql
ALTER TABLE registrations 
ADD COLUMN email VARCHAR(255);
```

Ou use o script com verificação:

```sql
DO $$
BEGIN
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
```

## Passo 3: Verificar Estrutura da Tabela

Execute para confirmar que a coluna foi adicionada:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
```

Você deve ver:
- `id` - UUID
- `user_id` - character varying
- `event_id` - UUID
- `full_name` - character varying
- **`email` - character varying** ← Deve aparecer aqui
- `status` - character varying
- `payment_status` - character varying
- `payment_method` - character varying
- `proof_url` - character varying
- `created_at` - timestamp
- `updated_at` - timestamp

## Passo 4: Reiniciar Backend

```bash
npm run dev
```

## Passo 5: Reiniciar Frontend

```bash
npm run dev
```

## Passo 6: Testar

1. Vá para um evento no frontend
2. Clique em "Inscrever-se"
3. Preencha:
   - Nome Completo
   - E-mail
4. Clique em "Enviar"
5. Acesse o painel administrativo → Inscrições
6. Você deve ver o nome e e-mail na tabela

## Troubleshooting

### E-mail não aparece na tabela

**Causa**: A coluna `email` não foi adicionada ao banco de dados.

**Solução**: Execute o script SQL acima no Supabase.

### Erro ao registrar: "violates foreign key constraint"

**Causa**: A restrição de chave estrangeira ainda existe.

**Solução**: Execute o primeiro script SQL para remover a restrição.

### Erro 500 no endpoint `/api/registrations`

**Causa**: Pode ser um erro no JOIN com a tabela `users`.

**Solução**: Verifique se os scripts foram executados corretamente.

## Resumo dos Arquivos

- `REMOVE_FK_CONSTRAINT.sql` - Remove a restrição de chave estrangeira
- `ADD_EMAIL_TO_REGISTRATIONS.sql` - Adiciona a coluna de e-mail
- `FIX_ANONYMOUS_REGISTRATION.md` - Documentação sobre registros anônimos
