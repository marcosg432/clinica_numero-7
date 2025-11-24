#!/bin/bash
# Script para iniciar o servidor após executar migrações

echo "🔄 Executando migrações do Prisma..."
npx prisma migrate deploy || echo "⚠️  Migrações podem já estar aplicadas"

echo "🚀 Iniciando servidor..."
node src/server.js


