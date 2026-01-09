#!/bin/bash
set -e

echo "📍 Current directory: $(pwd)"
echo "📁 Listing files:"
ls -la

echo ""
echo "🔍 Looking for dist/index.js..."
if [ -f "dist/index.js" ]; then
  echo "✅ Found dist/index.js"
  echo "🚀 Starting server..."
  node dist/index.js
elif [ -f "whatsapp-service/dist/index.js" ]; then
  echo "✅ Found whatsapp-service/dist/index.js"
  echo "🚀 Starting server from whatsapp-service..."
  cd whatsapp-service
  node dist/index.js
else
  echo "❌ Could not find index.js!"
  echo "📁 Directory structure:"
  find . -name "index.js" -type f
  exit 1
fi
