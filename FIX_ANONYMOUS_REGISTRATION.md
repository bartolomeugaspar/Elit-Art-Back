# 🔧 Corrigir Registros Anônimos em Eventos

## Problema
Usuários anônimos (sem autenticação) não conseguem se registrar em eventos porque há uma restrição de chave estrangeira que exige que o `user_id` exista na tabela `users`.

## Solução
Remover a restrição de chave estrangeira na coluna `user_id` da tabela `registrations`.

## Como Fazer

### 1. Acessar o Supabase
1. Vá para [supabase.com](https://supabase.com)
2. Acesse seu projeto
3. Clique em **SQL Editor**

### 2. Executar o Script SQL
Copie e execute o seguinte comando:

```sql
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_user_id_fkey;
```

### 3. Verificar se foi removido
Execute este comando para confirmar:

```sql
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'registrations'
AND constraint_type = 'FOREIGN KEY';
```

Se não houver resultados, a restrição foi removida com sucesso.

## Fluxo de Registro Agora

### Usuário Autenticado
- `user_id` = UUID do usuário (ex: `550e8400-e29b-41d4-a716-446655440000`)
- Verificação: Impede registros duplicados por `user_id`

### Usuário Anônimo
- `user_id` = `anon_{email}` (ex: `anon_joao@example.com`)
- Verificação: Impede registros duplicados por `email`
- Dados salvos: `full_name`, `email`, `payment_method`, `proof_url`

## Campos da Tabela `registrations`

```
id                  UUID (chave primária)
user_id             VARCHAR (agora sem restrição de chave estrangeira)
event_id            UUID (chave estrangeira para events)
full_name           VARCHAR (nome do inscrito)
email               VARCHAR (email do inscrito)
payment_status      VARCHAR (pending, completed, pending_approval)
payment_method      VARCHAR (M-Pesa, Bank Transfer, etc)
proof_url           VARCHAR (URL do comprovativo de pagamento)
registration_date   TIMESTAMP
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

## Teste

1. Reinicie o backend: `npm run dev`
2. Abra o frontend: http://localhost:3000
3. Vá para um evento
4. Clique em "Inscrever-se"
5. Preencha:
   - Nome Completo
   - E-mail
   - (Método de Pagamento e Comprovativo se for evento pago)
6. Clique em "Enviar"

Deve funcionar sem erros! ✅

## Notas Importantes

- ✅ Usuários autenticados ainda têm proteção contra registros duplicados
- ✅ Usuários anônimos são identificados pelo e-mail
- ✅ Impossível registrar o mesmo e-mail duas vezes no mesmo evento
- ✅ Todos os dados do registro são salvos (nome, email, pagamento)
