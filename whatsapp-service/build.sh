#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install --production=false

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

echo "🌐 Checking for Chromium..."
if command -v chromium &> /dev/null || command -v chromium-browser &> /dev/null; then
  echo "✅ Chromium is installed"
else
  echo "⚠️ Chromium not found - will be installed via Aptfile"
fi
