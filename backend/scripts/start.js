#!/usr/bin/env node
/**
 * Script de start que executa migrações e cria admin automaticamente
 * Usado no Railway para garantir que tudo esteja configurado
 */
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Inicializando sistema...');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não está definida!');
  process.exit(1);
}

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    // 1. Criar ENUMs primeiro
    console.log('🔧 Criando ENUMs necessários...');
    try {
      await prisma.$executeRawUnsafe(`
        DO $$ BEGIN
          CREATE TYPE "StatusAgendamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CANCELADO');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      await prisma.$executeRawUnsafe(`
        DO $$ BEGIN
          CREATE TYPE "RoleUsuario" AS ENUM ('ADMIN', 'EDITOR');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      console.log('✅ ENUMs criados/verificados');
    } catch (enumError) {
      console.warn('⚠️  Erro ao criar ENUMs (podem já existir):', enumError.message);
    }

    // 2. Executar migrações
    console.log('📦 Executando migrações...');
    try {
      const result = execSync('npx prisma migrate deploy', {
        cwd: join(__dirname, '..'),
        stdio: 'pipe',
        env: process.env,
        encoding: 'utf8',
      });
      console.log('✅ Migrações executadas');
    } catch (migrateError) {
      const stderr = migrateError.stderr?.toString() || migrateError.message || '';
      if (stderr.includes('No pending migrations') || stderr.includes('already applied')) {
        console.log('ℹ️  Migrações já aplicadas');
      } else {
        console.warn('⚠️  Erro nas migrações (continuando):', stderr.substring(0, 200));
      }
    }

    // 3. Verificar/criar admin automaticamente
    console.log('👤 Verificando usuário admin...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@clinicaodontoazul.com.br';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!@#';
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    try {
      const existingAdmin = await prisma.usuario.findUnique({
        where: { email: adminEmail },
      });

      if (existingAdmin) {
        console.log(`✅ Admin já existe: ${adminEmail}`);
        // Atualizar senha se necessário
        const senhaHash = await bcrypt.hash(adminPassword, 12);
        await prisma.usuario.update({
          where: { email: adminEmail },
          data: {
            senhaHash,
            nome: adminName,
            role: 'ADMIN',
            ativo: true,
          },
        });
        console.log('✅ Senha do admin atualizada');
      } else {
        console.log('🔧 Criando usuário admin...');
        const senhaHash = await bcrypt.hash(adminPassword, 12);
        await prisma.usuario.create({
          data: {
            nome: adminName,
            email: adminEmail,
            senhaHash,
            role: 'ADMIN',
            ativo: true,
          },
        });
        console.log(`✅ Admin criado: ${adminEmail}`);
        console.log(`   Senha: ${adminPassword}`);
      }
    } catch (adminError) {
      console.error('❌ Erro ao criar/verificar admin:', adminError.message);
      // Continuar mesmo assim - pode ser que a tabela ainda não exista
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erro no setup:', error.message);
    await prisma.$disconnect();
    // Continuar mesmo com erro
  }
}

// Executar setup
await setupDatabase();

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

