#!/bin/bash

# Script para executar a migration de notificações

echo "🔄 Executando migration de notificações..."

# Verificar se as variáveis de ambiente estão configuradas
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Erro: DATABASE_URL não está configurada"
    echo "💡 Configure a variável de ambiente DATABASE_URL com a URL do Supabase"
    exit 1
fi

# Executar a migration usando psql
psql "$DATABASE_URL" -f migrations/create_notifications.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration executada com sucesso!"
    echo "📊 Tabela 'notifications' criada"
else
    echo "❌ Erro ao executar migration"
    exit 1
fi
