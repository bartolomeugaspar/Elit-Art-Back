# Migration: Adicionar Coordenadas Bancárias aos Eventos

## Problema
A tabela `events` no Supabase não tinha o campo `bank_details` para armazenar as coordenadas bancárias dos eventos.

## Solução
Adicionar a coluna `bank_details` (JSONB) à tabela `events`.

## Passos para Executar

### 1. Acessar o Supabase SQL Editor
1. Vá para https://supabase.com
2. Acesse seu projeto
3. Clique em "SQL Editor" no menu lateral esquerdo
4. Clique em "New Query"

### 2. Executar o SQL

Copie e execute o seguinte comando no SQL Editor:

```sql
-- Adicionar coluna bank_details à tabela events
ALTER TABLE events ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_events_bank_details ON events USING GIN (bank_details);
```

### 3. Verificar se foi criado corretamente

Execute este comando para confirmar:

```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'events' AND column_name = 'bank_details';
```

Você deve ver um resultado como:
```
column_name      | data_type
bank_details     | jsonb
```

## Estrutura do bank_details

O campo `bank_details` armazena um objeto JSON com a seguinte estrutura:

```json
{
  "account_holder": "Nome do Titular",
  "account_number": "1234567890",
  "bank_name": "BAI",
  "iban": "AO06000100037131174310147"
}
```

Todos os campos são opcionais.

## Pronto!

Após executar a migration, o sistema estará pronto para:
- ✅ Criar eventos com preço
- ✅ Adicionar coordenadas bancárias aos eventos
- ✅ Exibir as coordenadas bancárias na página de detalhes do evento
- ✅ Mostrar o preço na listagem de eventos

## Rollback (se necessário)

Se precisar desfazer a mudança, execute:

```sql
DROP INDEX IF EXISTS idx_events_bank_details;
ALTER TABLE events DROP COLUMN IF EXISTS bank_details;
```
