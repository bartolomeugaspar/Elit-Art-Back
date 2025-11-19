# Configuração do WhatsApp Cloud API (Meta)

Este guia explica como configurar o envio automático de mensagens via WhatsApp quando uma inscrição é confirmada.

## 📋 Pré-requisitos

- Conta Facebook Business
- Número de telefone business (pode ser um número de teste inicialmente)

## 🚀 Passo a Passo

### 1. Criar App no Facebook Developers

1. Acesse [Facebook Developers](https://developers.facebook.com/apps/)
2. Clique em **"Criar App"**
3. Selecione **"Business"** como tipo de app
4. Preencha as informações do app:
   - Nome do app: `Elit'Arte WhatsApp`
   - Email de contato
   - Business Portfolio (opcional)
5. Clique em **"Criar App"**

### 2. Adicionar WhatsApp ao App

1. No dashboard do app, procure por **"WhatsApp"**
2. Clique em **"Configurar"** ou **"Add Product"**
3. Siga o assistente de configuração

### 3. Configurar Número de Telefone

1. Vá para **WhatsApp > API Setup** no menu lateral
2. Você verá um número de teste fornecido pela Meta (opcional para desenvolvimento)
3. Para produção, clique em **"Add Phone Number"** e siga as instruções para verificar seu número business

### 4. Obter Credenciais

#### Phone Number ID
1. Em **WhatsApp > API Setup**
2. Copie o **"Phone Number ID"** (não é o número de telefone, é um ID longo)
3. Exemplo: `109876543210987`

#### Access Token

**Para Desenvolvimento (Token Temporário - 24h):**
1. Em **WhatsApp > API Setup**
2. Clique em **"Generate Access Token"**
3. Copie o token gerado

**Para Produção (Token Permanente):**
1. Vá para **Configurações > Básico**
2. Em **"System Users"**, crie um usuário do sistema
3. Atribua permissões de WhatsApp ao usuário
4. Gere um token permanente para esse usuário

### 5. Configurar Variáveis de Ambiente

Adicione as credenciais no arquivo `.env`:

```env
# WhatsApp Cloud API Configuration
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_ACCESS_TOKEN=seu_access_token_aqui
```

### 6. Adicionar Número de Telefone nas Inscrições

⚠️ **IMPORTANTE**: Para que o WhatsApp funcione, você precisa adicionar o campo `phone_number` na tabela `registrations` do Supabase.

#### SQL para adicionar a coluna:

```sql
-- Adicionar coluna phone_number na tabela registrations
ALTER TABLE registrations 
ADD COLUMN phone_number VARCHAR(20);

-- (Opcional) Adicionar comentário
COMMENT ON COLUMN registrations.phone_number IS 'Número de telefone no formato internacional (+244...)';
```

Execute este SQL no **SQL Editor** do Supabase.

### 7. Atualizar Frontend para Coletar Telefone

Você precisará atualizar o formulário de inscrição no frontend para incluir o campo de telefone:

```tsx
// Em EventRegistrationModal.tsx ou formulário de inscrição
<input
  type="tel"
  placeholder="+244 XXX XXX XXX"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
/>
```

E enviar o `phone_number` no body da requisição POST para `/events/:id/register`.

### 8. Testar a Configuração

Você pode testar a conexão executando:

```typescript
import { WhatsAppService } from './services/WhatsAppService'

// Teste de conexão
await WhatsAppService.testConnection()

// Teste de envio (substitua pelo seu número)
await WhatsAppService.sendRegistrationConfirmation(
  '+244999999999',
  'João Silva',
  'Evento de Arte Contemporânea',
  '2025-01-15',
  'Luanda, Angola'
)
```

## 📱 Formato do Número de Telefone

- **Angola**: `+244` + 9 dígitos (ex: `+244999123456`)
- Sempre use formato internacional com `+` e código do país
- Sem espaços, parênteses ou traços

## 🔒 Segurança

### Para Produção:

1. **Nunca commite o `.env`** com tokens reais
2. Use **System User tokens** em vez de tokens de usuário
3. Configure **webhooks** para receber status de entrega
4. Implemente **rate limiting** para evitar spam
5. Adicione **IP whitelist** nas configurações do app

## 💰 Custos

- **Mensagens iniciadas pelo cliente**: GRÁTIS
- **Mensagens iniciadas pela empresa** (como confirmações):
  - Primeiras 1.000 conversas/mês: GRÁTIS
  - Após isso: varia por país (~$0.005 - $0.10 por mensagem)
  - Angola: consultar [Meta Pricing](https://developers.facebook.com/docs/whatsapp/pricing)

## 🎯 Templates (Opcional)

Para mensagens automáticas para clientes que nunca contataram você, precisa usar **templates aprovados**:

1. Vá para **WhatsApp > Message Templates**
2. Clique em **"Create Template"**
3. Crie um template com variáveis:

```
Olá {{1}}! 🎉

Sua inscrição foi confirmada no evento:
📌 {{2}}
📅 {{3}}
📍 {{4}}

Até breve!
```

4. Aguarde aprovação (geralmente 24h)
5. Use o método `sendTemplateMessage()` do `WhatsAppService`

## 🐛 Troubleshooting

### Erro: "Invalid access token"
- Verifique se o token está correto e não expirou
- Para produção, use System User token

### Erro: "Phone number not registered"
- O número destinatário precisa ter WhatsApp instalado
- Em desenvolvimento, adicione o número aos "test numbers"

### Erro: "Template not found"
- Certifique-se que o template foi aprovado
- Verifique o nome do template

### Mensagens não chegam
- Verifique se o PHONE_NUMBER_ID está correto
- Confirme que o número está no formato internacional
- Em desenvolvimento, adicione números aos "recipients" de teste

## 📚 Recursos

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Getting Started Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Pricing](https://developers.facebook.com/docs/whatsapp/pricing)

## ✅ Funcionamento

Quando você confirmar uma inscrição (mudando status para `attended`):

1. ✉️ Um email é enviado automaticamente
2. 📱 Uma mensagem WhatsApp é enviada automaticamente (se houver número cadastrado)
3. Ambos contêm os detalhes do evento confirmado

---

**Desenvolvido para Elit'Arte** 🎨
