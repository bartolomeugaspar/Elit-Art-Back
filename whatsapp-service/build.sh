#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install --production=false

echo "🌐 Installing Chromium via Puppeteer..."
export PUPPETEER_CACHE_DIR="/opt/render/project/src/whatsapp-service/.cache/puppeteer"
mkdir -p "$PUPPETEER_CACHE_DIR"
npx puppeteer browsers install chrome

echo "📁 Verificando instalação do Chromium..."
CHROME_PATH=$(find "$PUPPETEER_CACHE_DIR" -name "chrome" -type f 2>/dev/null | head -1)
if [ -n "$CHROME_PATH" ]; then
  echo "✅ Chromium instalado em: $CHROME_PATH"
else
  echo "⚠️ Chromium não encontrado, tentando fallback..."
fi

echo "🔨 Building TypeScript..."
npm run build

echo "✅ Build complete!"
echo "📁 Checking dist folder..."
ls -la dist/

echo "🔍 Checking if index.js exists..."
if [ -f "dist/index.js" ]; then
  echo "✅ index.js found!"
else
  echo "❌ index.js not found!"
  exit 1
fi
