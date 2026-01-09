#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install --production=false

echo "🌐 Installing Chromium for Puppeteer..."
export PUPPETEER_CACHE_DIR="/opt/render/project/src/whatsapp-service/.cache/puppeteer"
mkdir -p "$PUPPETEER_CACHE_DIR"
npx puppeteer browsers install chrome

echo "📁 Checking Chromium installation..."
find "$PUPPETEER_CACHE_DIR" -name "chrome" -type f 2>/dev/null || echo "Chrome binary search completed"

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

echo "ℹ️  Note: Chromium will be installed from Aptfile by Render"
