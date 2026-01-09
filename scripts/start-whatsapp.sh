#!/bin/bash

# Script para iniciar o servidor com WhatsApp
# Uso: ./scripts/start-whatsapp.sh

echo "🚀 Iniciando Elit'Arte Backend com WhatsApp..."
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências..."
  npm install
  echo ""
fi

# Verificar se dist existe
if [ ! -d "dist" ]; then
  echo "🔨 Compilando TypeScript..."
  npm run build
  echo ""
fi

echo "📱 IMPORTANTE: O QR Code do WhatsApp será exibido no console."
echo "   Use seu telefone para escanear o código e conectar."
echo ""
echo "Iniciando servidor..."
echo ""

npm start
