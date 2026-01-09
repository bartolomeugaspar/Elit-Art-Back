#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install --production=false

echo "🌐 Installing Chromium for Puppeteer..."
npx puppeteer browsers install chrome

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
