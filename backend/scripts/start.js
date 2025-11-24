#!/usr/bin/env node
/**
 * Script de start que executa migrações antes de iniciar o servidor
 * Usado no Railway para garantir que as migrações sejam aplicadas
 */
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Executando migrações do Prisma antes de iniciar o servidor...');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não está definida!');
  process.exit(1);
}

try {
  // Executar migrações
  console.log('📦 Executando: prisma migrate deploy');
  execSync('npx prisma migrate deploy', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit',
    env: process.env,
  });
  console.log('✅ Migrações executadas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao executar migrações:', error.message);
  // Em produção, continuar mesmo assim (pode ser que já estejam aplicadas)
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️  Continuando mesmo assim...');
  } else {
    process.exit(1);
  }
}

// Iniciar servidor
console.log('🚀 Iniciando servidor...');
const serverPath = join(__dirname, '..', 'src', 'server.js');
const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env,
});

serverProcess.on('exit', (code) => {
  process.exit(code);
});

