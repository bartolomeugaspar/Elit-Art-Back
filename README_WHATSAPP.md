# 📱 Integração WhatsApp - Elit'Arte

## ✨ O que foi implementado

Agora, sempre que você **confirmar uma inscrição** (mudar status para `attended`), o sistema enviará automaticamente:

1. ✉️ **Email de confirmação** (já existente)
2. 📱 **Mensagem WhatsApp** (novo!)

## 🎯 Arquivos Criados/Modificados

### Backend (Elit-Art-Back)

#### ✅ Novos Arquivos:
- `src/services/WhatsAppService.ts` - Serviço para enviar mensagens via WhatsApp Cloud API
- `src/migrations/add_phone_number_to_registrations.sql` - Migration para adicionar coluna phone_number
- `WHATSAPP_SETUP.md` - Guia completo de configuração da API
- `FRONTEND_INTEGRATION.md` - Guia para atualizar o frontend

#### 📝 Arquivos Modificados:
- `src/routes/registrations.ts` - Adicionado envio de WhatsApp ao confirmar
- `src/models/Registration.ts` - Adicionado campo `phone_number`
- `package.json` - Adicionada dependência `axios`
- `.env` e `.env.example` - Adicionadas variáveis de ambiente do WhatsApp

## 🚀 Como Usar

### 1. Configurar WhatsApp Cloud API

Siga o guia detalhado em [`WHATSAPP_SETUP.md`](./WHATSAPP_SETUP.md):

1. Criar app no Facebook Developers
2. Adicionar produto WhatsApp
3. Obter `PHONE_NUMBER_ID` e `ACCESS_TOKEN`
4. Configurar no `.env`:

```env
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
```

### 2. Executar Migration no Banco

Execute no **SQL Editor do Supabase**:

```sql
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
```

Ou use o arquivo: `src/migrations/add_phone_number_to_registrations.sql`

### 3. Instalar Dependências

```bash
cd /home/kali/Documentos/Elit-Art-Back
npm install
```

### 4. Atualizar Frontend

Siga o guia em [`FRONTEND_INTEGRATION.md`](./FRONTEND_INTEGRATION.md) para:

- Adicionar campo de telefone no formulário de inscrição
- Validar formato do telefone (+244XXXXXXXXX)
- Enviar `phone_number` na requisição de registro

### 5. Testar

```bash
# Iniciar o backend
npm run dev
```

**Fluxo de teste:**
1. Fazer uma inscrição em um evento (com telefone)
2. No painel admin, confirmar a inscrição (status → attended)
3. Verificar:
   - ✉️ Email recebido
   - 📱 Mensagem WhatsApp recebida

## 📋 Estrutura da Mensagem WhatsApp

A mensagem enviada tem este formato:

```
🎉 *Inscrição Confirmada - Elit'Arte*

Olá *[Nome]*! 👋

Sua inscrição foi *confirmada com sucesso* no seguinte evento:

📌 *[Título do Evento]*
📅 Data: [Data formatada]
📍 Local: [Local do evento]

✅ Guarde esta mensagem como comprovante da sua inscrição.

Você receberá mais informações sobre o evento em breve.

_© 2025 Elit'Arte. Todos os direitos reservados._
```

## 🔧 Funcionalidades do WhatsAppService

### 1. `sendRegistrationConfirmation()`
Envia mensagem de texto simples com confirmação do evento.

```typescript
await WhatsAppService.sendRegistrationConfirmation(
  '+244999123456',
  'João Silva',
  'Evento de Arte',
  '2025-01-15',
  'Luanda'
)
```

### 2. `sendTemplateMessage()` (opcional)
Envia mensagem usando template aprovado pela Meta.

```typescript
await WhatsAppService.sendTemplateMessage(
  '+244999123456',
  'confirmacao_evento',
  ['João Silva', 'Evento de Arte']
)
```

### 3. `testConnection()`
Testa se as credenciais estão configuradas corretamente.

```typescript
const isConnected = await WhatsAppService.testConnection()
```

### 4. `formatPhoneNumber()`
Formata e valida números de telefone automaticamente.

## 🛡️ Tratamento de Erros

- Se as credenciais não estiverem configuradas, apenas um aviso é exibido (não bloqueia)
- Se o número de telefone for inválido, apenas um aviso é exibido
- Se o WhatsApp falhar, o email ainda é enviado normalmente
- Todos os erros são logados no console para debug

## 💰 Custos

- **Primeiras 1.000 conversas/mês**: GRÁTIS
- **Após isso**: ~$0.005 - $0.10 por mensagem (varia por país)
- Para Angola, consulte: [Meta Pricing](https://developers.facebook.com/docs/whatsapp/pricing)

## 📱 Formato do Número

- **Angola**: `+244` + 9 dígitos
- **Exemplo**: `+244999123456`
- **Com espaços**: `+244 999 123 456` (aceito, é limpo automaticamente)

## 🐛 Troubleshooting

### Mensagens não chegam?

1. **Verificar credenciais no .env**
   ```bash
   grep WHATSAPP .env
   ```

2. **Testar conexão**
   ```typescript
   await WhatsAppService.testConnection()
   ```

3. **Verificar logs do servidor**
   - `✅ WhatsApp confirmation sent` = sucesso
   - `❌ Error sending WhatsApp` = erro (veja detalhes)

4. **Número de telefone**
   - Deve estar no formato `+244XXXXXXXXX`
   - Deve ter WhatsApp instalado
   - Em desenvolvimento, adicionar aos "test recipients" no Meta

### Token expirado?

Tokens temporários expiram em 24h. Para produção, use **System User Token**.

## 📚 Documentação Completa

- [`WHATSAPP_SETUP.md`](./WHATSAPP_SETUP.md) - Configuração da API
- [`FRONTEND_INTEGRATION.md`](./FRONTEND_INTEGRATION.md) - Integração no frontend
- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)

## ✅ Checklist de Implementação

- [x] Criar serviço WhatsAppService
- [x] Adicionar variáveis de ambiente
- [x] Instalar dependência axios
- [x] Integrar no fluxo de confirmação
- [x] Criar migration SQL
- [x] Atualizar modelo Registration
- [x] Criar documentação completa
- [ ] Configurar credenciais do WhatsApp (você precisa fazer)
- [ ] Executar migration no Supabase (você precisa fazer)
- [ ] Atualizar formulário do frontend (você precisa fazer)
- [ ] Testar envio completo (você precisa fazer)

## 🎨 Próximos Passos

1. **Configurar WhatsApp Business** (seguir `WHATSAPP_SETUP.md`)
2. **Executar migration** no Supabase
3. **Atualizar formulário** do frontend (seguir `FRONTEND_INTEGRATION.md`)
4. **Testar** com um número real
5. **(Opcional)** Criar templates para mensagens mais ricas

---

**Desenvolvido para Elit'Arte** 🎨  
**Data**: 19 de Novembro de 2025
