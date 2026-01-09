#!/bin/bash

# Script para iniciar o servidor em modo desenvolvimento com WhatsApp
# Uso: ./scripts/start-dev-whatsapp.sh

echo "🚀 Iniciando Elit'Arte Backend (Desenvolvimento) com WhatsApp..."
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências..."
  npm install
  echo ""
fi

echo "📱 IMPORTANTE: O QR Code do WhatsApp será exibido no console."
echo "   Use seu telefone para escanear o código e conectar."
echo ""
echo "Iniciando servidor em modo desenvolvimento..."
echo ""

npm run dev
