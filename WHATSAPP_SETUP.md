# 📱 Guia de Configuração WhatsApp - Elit'Arte

## 🎯 Visão Geral

O sistema Elit'Arte agora utiliza **whatsapp-web.js** para enviar mensagens automáticas via WhatsApp quando:
- ✅ Usuário se inscreve em evento
- ✅ Usuário cria conta
- ✅ Usuário recupera senha
- ✅ Admin responde mensagem de contato
- ✅ Novo evento é publicado

## 🚀 Instalação e Configuração

### 1. Dependências já instaladas
```bash
npm install  # whatsapp-web.js e qrcode-terminal já estão no package.json
```

### 2. Estrutura criada
```
src/
├── whatsapp/
│   ├── client.ts      # Cliente WhatsApp singleton
│   └── routes.ts      # API endpoints para WhatsApp
├── services/
│   └── WhatsAppService.ts  # Serviço atualizado
└── index.ts           # Integração automática
```

## 📲 Como Conectar o WhatsApp

### Método 1: Inicialização Automática (Recomendado)

Quando você inicia o servidor, o WhatsApp tenta conectar automaticamente:

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

**Você verá um QR Code no console do terminal:**

```
==================================================
📲 ESCANEIE O QR CODE ABAIXO COM O WHATSAPP:
==================================================

█▀▀▀▀▀█ ▀▀ █▄▀█ ▀ █▀▀▀▀▀█
█ ███ █ ▄▀██ ▄▄▀█ █ ███ █
█ ▀▀▀ █ ▀ ▄█▀▄ ▀█ █ ▀▀▀ █
...

==================================================
⏳ Aguardando escaneamento...
==================================================
```

**Para escanear:**
1. Abra WhatsApp no seu celular
2. Vá em **Configurações** → **Aparelhos conectados**
3. Toque em **Conectar um aparelho**
4. Escaneie o QR Code exibido no terminal

### Método 2: Inicialização Manual via API

Se o WhatsApp não conectar automaticamente, use:

```bash
# 1. Fazer login como admin e obter token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@email.com","password":"sua-senha"}'

# 2. Inicializar WhatsApp
curl -X POST http://localhost:5000/api/whatsapp/initialize \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 3. Verificar logs do servidor para ver o QR Code
```

## ✅ Verificar Status

```bash
# Verificar se WhatsApp está conectado
curl -X GET http://localhost:5000/api/whatsapp/status \
  -H "Authorization: Bearer SEU_TOKEN"
```

Resposta esperada quando conectado:
```json
{
  "success": true,
  "connected": true,
  "message": "WhatsApp conectado com sucesso",
  "service": "whatsapp-web.js"
}
```

## 🧪 Testar Envio de Mensagens

### Via API (Admin):

```bash
curl -X POST http://localhost:5000/api/whatsapp/test-send \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "244921389141",
    "message": "Teste de mensagem do Elit Arte!"
  }'
```

### Via API Direta (Desenvolvimento):

```bash
# Enviar mensagem única
curl -X POST http://localhost:5000/api/whatsapp-api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "244923456789",
    "message": "Olá! Esta é uma mensagem de teste."
  }'

# Enviar mensagens em massa
curl -X POST http://localhost:5000/api/whatsapp-api/send-bulk \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["244923456789", "244912345678"],
    "message": "Mensagem em massa!",
    "delayMs": 2000
  }'
```

## 🔧 Endpoints Disponíveis

### Para Administradores (`/api/whatsapp`):
- `GET /status` - Verificar status da conexão
- `POST /initialize` - Inicializar/reconectar WhatsApp
- `POST /test-send` - Enviar mensagem de teste
- `GET /info` - Informações da configuração

### API Direta (`/api/whatsapp-api`):
- `GET /status` - Status do cliente
- `POST /initialize` - Inicializar cliente
- `POST /send` - Enviar mensagem única
- `POST /send-bulk` - Enviar mensagens em massa

## 📁 Armazenamento de Sessão

A autenticação do WhatsApp é salva localmente em:
```
.wwebjs_auth/
```

**⚠️ IMPORTANTE:**
- Adicione ao `.gitignore` (já configurado)
- Faça backup desta pasta se quiser manter a sessão
- Se deletar, precisará escanear o QR Code novamente

## 🎬 Mensagens Automáticas Configuradas

### 1. Inscrição em Evento
Enviado quando alguém se inscreve em um evento:
```
🎉 Inscrição Recebida - Elit'Arte

Olá *Nome do Usuário*,

Obrigado por se inscrever! Recebemos sua inscrição no seguinte evento:

📌 *Nome do Evento*
📅 Data: 15/01/2026
🕒 Hora: 18:00
📍 Local: Centro Cultural

Sua inscrição está sendo processada...
```

### 2. Boas-vindas (Novo Usuário)
```
🎉 Bem-vindo à Elit'Arte!

Olá *Nome*! 👋

Sua conta foi criada com sucesso!
📧 Email: usuario@email.com
🔑 Senha temporária: ABC123

🚀 Acesse: https://elit-arte.vercel.app/admin/login
```

### 3. Recuperação de Senha
```
🔐 Recuperação de Senha - Elit'Arte

Olá *Nome*,

Recebemos uma solicitação para recuperar sua senha.

🔗 Link para redefinir:
https://...

⏰ Este link expira em 1 hora.
```

### 4. Confirmação de Participação
```
🎉 Inscrição Confirmada - Elit'Arte

Olá *Nome*! 👋

Sua inscrição foi confirmada com sucesso!

📌 *Nome do Evento*
📅 Data: 15/01/2026
📍 Local: Centro Cultural

✅ Guarde esta mensagem como comprovante.
```

## 🚀 Executar em Produção com PM2

### Instalação do PM2:
```bash
npm install -g pm2
```

### Iniciar servidor:
```bash
# Usar script automatizado
./scripts/pm2-start.sh

# Ou manualmente
npm run build
pm2 start ecosystem.config.js --env production
pm2 save
```

### Comandos PM2 úteis:
```bash
pm2 logs elit-arte-backend    # Ver logs (incluindo QR Code)
pm2 status                     # Status dos processos
pm2 restart elit-arte-backend  # Reiniciar
pm2 stop elit-arte-backend     # Parar
pm2 monit                      # Monitor em tempo real
pm2 delete elit-arte-backend   # Remover processo
```

### Ver QR Code no PM2:
```bash
pm2 logs elit-arte-backend --lines 50
```

## ⚠️ Regras IMPORTANTES

### ✅ Boas Práticas:
- Use número WhatsApp dedicado para o sistema
- Mantenha volume de mensagens moderado
- Envie apenas mensagens informativas/transacionais
- Adicione delay entre mensagens em massa (2-3 segundos)
- Faça backup da pasta `.wwebjs_auth`

### ❌ Evite:
- Spam ou mensagens não solicitadas
- Volume muito alto de mensagens
- Mensagens de marketing agressivo
- Usar conta pessoal importante

### 🔒 Segurança:
- WhatsApp pode banir contas com comportamento suspeito
- Respeite a política de uso do WhatsApp
- Não compartilhe a sessão (pasta `.wwebjs_auth`)
- Monitore logs regularmente

## 🐛 Troubleshooting

### WhatsApp não conecta:
```bash
# 1. Deletar sessão antiga
rm -rf .wwebjs_auth

# 2. Reiniciar servidor
pm2 restart elit-arte-backend

# 3. Verificar logs para novo QR Code
pm2 logs elit-arte-backend
```

### "WhatsApp não está pronto":
- Verifique se o QR Code foi escaneado
- Aguarde alguns segundos após escanear
- Verifique status: `GET /api/whatsapp/status`

### Mensagens não enviadas:
- Verifique se número tem código do país (244 para Angola)
- Formato aceito: `244923456789` ou `923456789`
- Verifique logs do servidor para erros

### Erro de autenticação:
- Delete `.wwebjs_auth` e reconecte
- Verifique se WhatsApp está ativo no celular
- Tente desconectar outros dispositivos no WhatsApp

## 📊 Monitoramento

### Verificar logs em tempo real:
```bash
# Com PM2
pm2 logs elit-arte-backend --lines 100

# Modo desenvolvimento
# Os logs aparecem direto no terminal
```

### Logs importantes:
- `✅ WhatsApp conectado e pronto` - Sucesso!
- `📲 ESCANEIE O QR CODE` - Precisa conectar
- `⚠️ WhatsApp desconectado` - Perdeu conexão
- `✅ WhatsApp enviado com sucesso` - Mensagem enviada

## 🔄 Próximos Passos

Escolha uma melhoria:

1. **Salvar logs de mensagens** - Registrar no banco de dados
2. **Fila de envio** - Sistema de filas para evitar sobrecarga
3. **Dockerizar** - Container Docker para deploy fácil
4. **Autenticar API** - Proteger endpoints de WhatsApp
5. **Templates dinâmicos** - Sistema de templates personalizáveis
6. **Dashboard** - Interface para gerenciar mensagens
7. **Relatórios** - Estatísticas de envio e entregas

## 📚 Documentação API

Acesse a documentação completa em:
```
http://localhost:5000/api-docs
```

Procure pela tag **WhatsApp** ou **WhatsApp API**.

## 💡 Dicas

- Mantenha o servidor sempre rodando para receber mensagens
- Use PM2 em produção para auto-restart
- Configure firewall para proteger o servidor
- Monitore uso de memória (puppeteer consome RAM)
- Considere usar VPS com pelo menos 2GB RAM

---

**🎨 Elit'Arte - Sistema de Notificações WhatsApp**
*Conectando arte e cultura através da tecnologia* 🇦🇴
