# 🔧 Solução: Problema de Memória no WhatsApp (Render)

## 🔴 Problema
```
Instance failed: 6mfrp
Ran out of memory (used over 512MB) while running your code.
```

## ✅ Soluções Aplicadas

### 1. **Otimização do Puppeteer** ⚙️
Adicionadas flags para reduzir uso de memória do Chrome/Chromium:
- `--single-process`: Executa tudo num único processo
- `--disable-gpu`: Desabilita aceleração de GPU
- `--disable-software-rasterizer`: Desabilita renderização por software
- `--disable-background-networking`: Remove conexões em background
- `--disable-extensions`: Sem extensões
- E mais 20+ flags de otimização

**Arquivos modificados:**
- `/src/whatsapp/client.ts`
- `/whatsapp-service/src/whatsapp/client.ts`

### 2. **Limite de Memória Node.js** 📊
Adicionado no `render.yaml`:
```yaml
NODE_OPTIONS: '--max-old-space-size=450'
```
Limita Node.js a 450MB (deixa margem para o sistema).

### 3. **WhatsApp Desabilitado no Vercel** 🚫
O servidor principal (Vercel) NÃO inicializa WhatsApp - apenas a Render.
Isso evita consumo duplo de memória.

## 🚀 Próximos Passos

### Opção 1: Testar com Plano Gratuito Otimizado
1. Faça commit e push das alterações:
```bash
cd /home/bajoao/sgoinfre/Elit-Art-Back
git add .
git commit -m "fix: otimizar uso de memória do WhatsApp para Render"
git push
```

2. A Render vai fazer redeploy automático
3. Monitore os logs e uso de memória

### Opção 2: Upgrade para Starter Plus (se problema persistir)
No `render.yaml`, altere:
```yaml
plan: starter plus  # $7/mês - 2GB RAM
```

O `whatsapp-web.js` com Chromium pode consumir:
- **Mínimo**: 300-400MB
- **Pico**: 600-800MB (com sessão ativa)

### Opção 3: Alternativa sem Chromium 💡
Se o problema persistir, considere migrar para:
- **Twilio WhatsApp API** (pago, mas estável)
- **WhatsApp Business API oficial** (requer aprovação)
- **Baileys** (biblioteca alternativa, mais leve)

## 📈 Monitoramento
Acesse o dashboard da Render para ver:
- Uso de memória em tempo real
- Logs de crashes
- Métricas de performance

## 🔍 Verificação
Após deploy, teste:
1. Status: `https://elit-art-back.onrender.com/api/whatsapp/status`
2. Logs na Render
3. Conexão do WhatsApp

---
**Data:** 09/01/2026
**Status:** Otimizações aplicadas ✅
