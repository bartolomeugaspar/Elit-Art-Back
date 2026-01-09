# 🚀 Deploy WhatsApp - Guia Completo

## ⚠️ IMPORTANTE: WhatsApp NÃO funciona na Vercel

O `whatsapp-web.js` precisa de:
- Sistema de arquivos persistente (sessões)
- Processo em execução contínua
- Navegador Chrome/Chromium

Vercel é **serverless** = funções efêmeras que não mantêm estado.

---

## ✅ Opção 1: Deploy em VPS (RECOMENDADO)

### Providers Recomendados:
- **DigitalOcean** - $6/mês (Droplet básico)
- **Hetzner** - €4/mês (mais barato)
- **Linode** - $5/mês
- **AWS EC2** - t2.micro (free tier)

### Passos:

1. **Criar servidor Ubuntu 22.04**

2. **Instalar dependências:**
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar dependências do Puppeteer
sudo apt install -y \
  gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
  libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
  libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
  libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
  libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
  fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

3. **Clonar e configurar projeto:**
```bash
cd /home
git clone https://github.com/bartolomeugaspar/Elit-Art-Back.git
cd Elit-Art-Back

# Copiar .env.example para .env
cp .env.example .env
nano .env  # Editar variáveis de ambiente

# Instalar dependências
npm install

# Build do projeto
npm run build
```

4. **Iniciar com PM2:**
```bash
# Usar o ecosystem.config.js existente
pm2 start ecosystem.config.js --env production

# Salvar configuração
pm2 save

# Auto-start no boot
pm2 startup
```

5. **Configurar Nginx (opcional, para HTTPS):**
```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Configurar domínio
sudo nano /etc/nginx/sites-available/elit-arte-api

# Adicionar:
server {
    listen 80;
    server_name api.elit-arte.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Ativar site
sudo ln -s /etc/nginx/sites-available/elit-arte-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL com Let's Encrypt
sudo certbot --nginx -d api.elit-arte.com
```

6. **Primeiro acesso - Escanear QR Code:**
```bash
# Ver logs em tempo real
pm2 logs elit-arte-backend

# Quando aparecer o QR Code, escanear com WhatsApp
# Depois que conectar, pode fechar os logs (Ctrl+C)
```

---

## ✅ Opção 2: Railway.app (Mais Fácil)

### Vantagens:
- Deploy automático via Git
- Suporte nativo para processos contínuos
- Free tier generoso ($5/mês de crédito)

### Passos:

1. **Criar conta em railway.app**

2. **Criar novo projeto:**
   - New Project → Deploy from GitHub
   - Selecionar repositório `Elit-Art-Back`

3. **Configurar variáveis de ambiente:**
   - Settings → Variables
   - Adicionar todas do `.env`:
     - `NODE_ENV=production`
     - `SUPABASE_URL=...`
     - `SUPABASE_ANON_KEY=...`
     - `JWT_SECRET=...`
     - etc.

4. **Configurar start command:**
   - Settings → Deploy
   - Start Command: `npm start`

5. **Deploy automático:**
   - Railway detecta mudanças no GitHub
   - Deploy automático em cada push

6. **Escanear QR Code:**
   - Logs → Ver QR Code no terminal
   - Escanear com WhatsApp

---

## ✅ Opção 3: Render.com

Similar ao Railway, com free tier.

### Passos:

1. **Criar conta em render.com**

2. **New Web Service:**
   - Conectar GitHub
   - Selecionar `Elit-Art-Back`

3. **Configurar:**
   - Name: `elit-arte-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Starter` (free)

4. **Environment Variables:**
   - Adicionar todas do `.env`

5. **Deploy**

---

## 📝 Atualizar Frontend

Depois de fazer deploy do backend, atualizar URL no frontend:

**`.env` do Frontend:**
```env
NEXT_PUBLIC_API_URL=https://seu-backend-url.com/api
```

Exemplos:
- VPS: `https://api.elit-arte.com/api`
- Railway: `https://elit-arte-back-production.up.railway.app/api`
- Render: `https://elit-arte-backend.onrender.com/api`

---

## 🔍 Verificar Status

Depois do deploy:

1. **Testar API:**
```bash
curl https://seu-backend-url.com/api/whatsapp-api/status
```

2. **Acessar painel:**
   - Frontend → Admin → WhatsApp
   - Verificar se aparece "WhatsApp conectado"

3. **Enviar mensagem de teste**

---

## 🐛 Troubleshooting

### QR Code não aparece:
```bash
# VPS/SSH
pm2 logs elit-arte-backend

# Railway/Render
Ver logs no dashboard
```

### WhatsApp desconecta:
- Sessão expira após ~2 semanas inativo
- Escanear QR Code novamente

### Erro de memória:
```bash
# Aumentar memória do PM2
pm2 delete elit-arte-backend
pm2 start ecosystem.config.js --max-memory-restart 500M
```

---

## 💡 Recomendação Final

**Para produção profissional:**
- **Backend WhatsApp** → VPS dedicado (DigitalOcean $6/mês)
- **API REST** → Vercel (grátis)
- **Frontend** → Vercel (grátis)

Isso garante:
- ✅ WhatsApp sempre conectado
- ✅ Escalabilidade da API
- ✅ Performance máxima
- ✅ Custos otimizados
