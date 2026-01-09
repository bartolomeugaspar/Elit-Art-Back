# 🚀 Deploy WhatsApp Service no Render.com

## 📋 Pré-requisitos

1. Conta no [Render.com](https://render.com)
2. Repositório Git com o código

---

## ⚙️ Configuração de Chromium

Este serviço utiliza o Chromium instalado via Aptfile do Render para garantir compatibilidade e persistência entre builds e deployments.

### Arquivos Importantes:

- **Aptfile**: Instala Chromium no sistema operacional do Render
- **build.sh**: Script de build que compila o TypeScript
- **render.yaml**: Configuração do serviço incluindo variáveis de ambiente

### Como Funciona:

1. O Render lê o `Aptfile` e instala Chromium no sistema
2. O build script (`build.sh`) compila o código TypeScript
3. A aplicação localiza automaticamente o Chromium instalado em `/usr/bin/chromium`
4. O WhatsApp Web.js usa este Chromium para funcionar

---

## 🔧 Passos para Deploy

### 1. Criar Repositório Separado (Opção A - Recomendado)

```bash
# Criar novo repositório no GitHub: elit-arte-whatsapp-service
cd /home/bajoao/sgoinfre/Elit-Art-Back/whatsapp-service

# Inicializar Git
git init
git add .
git commit -m "Initial commit - WhatsApp Service"

# Adicionar remote (substitua SEU-USUARIO)
git remote add origin https://github.com/bartolomeugaspar/elit-arte-whatsapp-service.git
git branch -M main
git push -u origin main
```

### 2. Ou usar Pasta no Repositório Existente (Opção B)

```bash
# Fazer commit da pasta whatsapp-service no repositório principal
cd /home/bajoao/sgoinfre/Elit-Art-Back
git add whatsapp-service/
git commit -m "Add WhatsApp microservice"
git push
```

---

## 🌐 Configurar no Render.com

### 1. Criar Novo Web Service

1. Login em [dashboard.render.com](https://dashboard.render.com)
2. Click em **"New +"** → **"Web Service"**
3. Conectar GitHub e selecionar o repositório

### 2. Configurações do Serviço

**Opção A - Repositório Separado:**
- **Name**: `elit-arte-whatsapp`
- **Region**: `Frankfurt` (Europa, mais perto de Angola)
- **Branch**: `main`
- **Root Directory**: deixar vazio
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Opção B - Pasta no Repositório:**
- **Name**: `elit-arte-whatsapp`
- **Region**: `Frankfurt`
- **Branch**: `main`
- **Root Directory**: `whatsapp-service`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 3. Plano

- **Instance Type**: 
  - **Starter ($7/mês)** - Recomendado (sempre ativo, 512MB RAM)
  - **Free** - Possível, mas hiberna após inatividade

⚠️ **Importante**: Free tier hiberna após 15min de inatividade. Para WhatsApp, recomendo **Starter Plan**.

### 4. Adicionar Disco Persistente (CRÍTICO)

Renderiza sessões do WhatsApp precisam ser persistidas:

1. Na página do serviço → **"Disks"** → **"Add Disk"**
2. Configurar:
   - **Name**: `whatsapp-sessions`
   - **Mount Path**: `/opt/render/project/src/.wwebjs_auth`
   - **Size**: `1 GB`

### 5. Variáveis de Ambiente

Adicionar em **"Environment"**:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://elit-arte.vercel.app
```

### 6. Deploy

Click em **"Create Web Service"**

---

## 📱 Escanear QR Code

### Após Deploy:

1. Ir em **"Logs"** no dashboard do Render
2. Aguardar aparecer o QR Code ASCII no terminal
3. Abrir WhatsApp no celular:
   - **Android/iOS**: Configurações → Aparelhos conectados → Conectar aparelho
4. Escanear o QR Code que aparece nos logs
5. ✅ WhatsApp conectado!

**Nota**: Depois de escanear, a sessão fica salva no disco persistente. Não precisa escanear novamente.

---

## 🔗 Atualizar Frontend

Depois do deploy, você receberá uma URL tipo:
```
https://elit-arte-whatsapp.onrender.com
```

### Atualizar Frontend para usar o WhatsApp Service:

**Arquivo**: `Elit-Art-Front/src/app/admin/whatsapp/page.tsx`

```typescript
// Trocar a URL base para o serviço WhatsApp
const WHATSAPP_API_URL = 'https://elit-arte-whatsapp.onrender.com/api'

// Atualizar as chamadas fetch:
const response = await fetch(`${WHATSAPP_API_URL}/whatsapp-api/status`)
```

Ou criar variável de ambiente:
```env
# .env do Frontend
NEXT_PUBLIC_WHATSAPP_API_URL=https://elit-arte-whatsapp.onrender.com/api
```

---

## ✅ Testar o Serviço

### 1. Health Check
```bash
curl https://elit-arte-whatsapp.onrender.com/health
```

Resposta esperada:
```json
{"status":"ok","service":"WhatsApp Service"}
```

### 2. Status WhatsApp
```bash
curl https://elit-arte-whatsapp.onrender.com/api/whatsapp-api/status
```

### 3. Enviar Mensagem de Teste
```bash
curl -X POST https://elit-arte-whatsapp.onrender.com/api/whatsapp-api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "921389141",
    "message": "Teste do serviço WhatsApp!"
  }'
```

---

## 🔄 Atualizações Automáticas

Render detecta pushes no GitHub e faz redeploy automático:

```bash
cd whatsapp-service
# fazer alterações...
git add .
git commit -m "Update WhatsApp service"
git push
```

Render fará deploy automaticamente!

---

## 🐛 Troubleshooting

### Serviço não inicia:
- Verificar logs: Dashboard → Logs
- Confirmar `package.json` tem script `start`

### QR Code não aparece:
- Aguardar 1-2 minutos após deploy
- Refresh nos logs

### WhatsApp desconecta:
- Verificar se disco persistente está montado
- Pode precisar escanear QR novamente

### Memória insuficiente:
- Upgrade para plano maior (1GB RAM)
- Render Starter é suficiente

---

## 💰 Custos

- **Free**: $0 - Hiberna após 15min (não recomendado para WhatsApp)
- **Starter**: $7/mês - Sempre ativo, 512MB RAM ✅ **Recomendado**
- **Standard**: $25/mês - 2GB RAM (overkill para WhatsApp)

---

## 📞 Suporte

Problemas? Verificar:
1. Logs do Render
2. Disco persistente configurado
3. Variáveis de ambiente corretas
4. Plano não é free (ou aceitar hibernação)

---

## ✨ Resultado Final

Backend principal → Vercel (grátis)
WhatsApp Service → Render ($7/mês)
Frontend → Vercel (grátis)

Total: **$7/mês** para WhatsApp sempre ativo! 🎉
