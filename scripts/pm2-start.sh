#!/bin/bash

# Script para iniciar o servidor com PM2
# Uso: ./scripts/pm2-start.sh

echo "🚀 Iniciando Elit'Arte Backend com PM2..."
echo ""

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
  echo "❌ PM2 não encontrado. Instalando globalmente..."
  npm install -g pm2
  echo ""
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências..."
  npm install
  echo ""
fi

# Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run build
echo ""

# Criar diretório de logs se não existir
mkdir -p logs

# Parar processo existente
echo "🛑 Parando processo existente (se houver)..."
pm2 delete elit-arte-backend 2>/dev/null || true
echo ""

# Iniciar com PM2
echo "▶️  Iniciando com PM2..."
pm2 start ecosystem.config.js --env production
echo ""

# Salvar configuração PM2
echo "💾 Salvando configuração PM2..."
pm2 save
echo ""

# Configurar PM2 para iniciar no boot
echo "🔄 Configurando PM2 para iniciar automaticamente..."
pm2 startup
echo ""

echo "✅ Servidor iniciado com sucesso!"
echo ""
echo "📊 Comandos úteis:"
echo "   pm2 logs elit-arte-backend    - Ver logs em tempo real"
echo "   pm2 status                     - Ver status dos processos"
echo "   pm2 restart elit-arte-backend  - Reiniciar servidor"
echo "   pm2 stop elit-arte-backend     - Parar servidor"
echo "   pm2 monit                      - Monitor em tempo real"
echo ""
echo "📱 Para escanear o QR Code do WhatsApp:"
echo "   pm2 logs elit-arte-backend"
echo ""
