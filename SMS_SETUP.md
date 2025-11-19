# SMS Configuration Guide

## Overview
O sistema Elit'Art agora suporta envio automático de mensagens de texto (SMS) quando usuários se inscrevem em eventos e quando o admin confirma a inscrição.

## Fluxo de SMS

### 1. Inscrição Inicial (Automático)
Quando um usuário se inscreve em um evento e fornece um número de telefone:
```
📱 SMS Recebido: "Elit'Arte - Inscrição Recebida
Olá João!
Recebemos sua inscrição no evento:
📌 Workshop de Arte
📅 2026-02-20
🕐 14:30
📍 Estúdio Elit Arte
Sua inscrição está sendo processada..."
```

### 2. Confirmação (Quando Admin Confirma)
Quando o admin confirma a inscrição no painel:
```
📱 SMS Recebido: "✅ Elit'Arte - Inscrição Confirmada
Olá João!
Sua inscrição foi confirmada com sucesso!
📌 Workshop de Arte
📅 2026-02-20
🕐 14:30
📍 Estúdio Elit Arte
Guarde esta mensagem como comprovante..."
```

## Setup com Twilio

### Passo 1: Criar Conta Twilio
1. Acesse https://www.twilio.com/console
2. Crie uma conta (versão gratuita disponível)
3. Verifique seu número de telefone

### Passo 2: Obter Credenciais
1. No dashboard Twilio, vá para **Account Info**
2. Copie:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`

3. Vá para **Phone Numbers** → **Manage Numbers**
4. Compre um número Twilio (ex: +1234567890)
5. Copie o número → `TWILIO_PHONE_NUMBER`

### Passo 3: Configurar .env
```bash
# SMS Configuration (Twilio)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Passo 4: Testar Conexão
```bash
# No backend, execute:
curl -X POST http://localhost:5000/api/test-sms
```

## Formatos de Número de Telefone Suportados

O sistema aceita números em vários formatos e converte automaticamente:

- ✅ `+244999123456` (formato internacional)
- ✅ `244999123456` (sem +, código de país)
- ✅ `999123456` (apenas número, assume Angola +244)
- ✅ `+244 999 123 456` (com espaços)
- ✅ `(244) 999-123-456` (com formatação)

## Integração no Frontend

### Exemplo de Requisição de Inscrição
```javascript
const response = await fetch(`${API_URL}/events/${eventId}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'João Silva',
    email: 'joao@example.com',
    phone_number: '+244999123456', // Campo novo
    payment_method: 'bank_transfer',
    proof_url: 'https://...'
  })
})
```

## Tratamento de Erros

O sistema trata erros graciosamente:
- Se o SMS falhar, a inscrição é criada normalmente
- Erros são logados no console do backend
- O usuário não é notificado de falhas de SMS (email é a prioridade)

## Logs

Verifique os logs do backend para rastrear SMS:

```bash
# SMS enviado com sucesso
✅ SMS sent successfully to +244999123456
📱 Message SID: SM1234567890abcdef

# Erro de SMS
❌ Error sending SMS: [erro detalhado]
```

## Custo

### Twilio
- **Conta Gratuita**: $15 de crédito inicial
- **Custo por SMS**: ~$0.0075 por SMS (varia por país)
- **Exemplo**: 1000 SMS = ~$7.50

### Outras Opções
- **Nexmo/Vonage**: Similar ao Twilio
- **AWS SNS**: Integração com AWS
- **Provedores Locais**: Podem ter taxas menores em Angola

## Troubleshooting

### "SMS não configurado"
- Verifique se `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` e `TWILIO_PHONE_NUMBER` estão no `.env`
- Reinicie o backend após adicionar variáveis

### "Número de telefone inválido"
- Verifique se o número está em formato internacional
- Exemplo: `+244` para Angola, `+55` para Brasil, etc

### "Falha ao enviar SMS"
- Verifique credenciais Twilio
- Certifique-se de que há saldo na conta Twilio
- Verifique se o número de destino é válido

## Próximas Melhorias

- [ ] Suporte para Nexmo/Vonage
- [ ] Suporte para AWS SNS
- [ ] Suporte para provedores locais (Angola)
- [ ] Dashboard de histórico de SMS
- [ ] Retry automático para SMS falhados
- [ ] Agendamento de SMS
