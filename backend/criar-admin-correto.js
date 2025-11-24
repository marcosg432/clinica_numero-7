// Script para criar admin com email e senha corretos
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Usar o email e senha que estão no admin.html
const ADMIN_EMAIL = 'admin@clinica.com';
const ADMIN_PASSWORD = 'Admin123!@';
const ADMIN_NAME = 'Administrador';

async function main() {
  console.log('\n============================================');
  console.log('  CRIANDO ADMIN COM CREDENCIAIS CORRETAS');
  console.log('============================================\n');
  
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Senha: ${ADMIN_PASSWORD}\n`);
  
  try {
    // Criar hash da senha
    const senhaHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    
    // Criar ou atualizar usuário admin
    const admin = await prisma.usuario.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        senhaHash,
        nome: ADMIN_NAME,
        role: 'ADMIN',
        ativo: true,
        failedAttempts: 0,
        lockedUntil: null,
      },
      create: {
        nome: ADMIN_NAME,
        email: ADMIN_EMAIL,
        senhaHash,
        role: 'ADMIN',
        ativo: true,
      },
    });
    
    console.log('✅ Usuário admin criado/atualizado!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nome: ${admin.nome}`);
    console.log(`   Role: ${admin.role}\n`);
    
    // Testar a senha
    console.log('🧪 Testando senha...');
    const senhaTeste = await bcrypt.compare(ADMIN_PASSWORD, admin.senhaHash);
    if (senhaTeste) {
      console.log('✅ Senha está correta e funcionando!\n');
    } else {
      console.log('❌ ERRO: Senha não está funcionando!\n');
      process.exit(1);
    }
    
    console.log('============================================');
    console.log('  CREDENCIAIS PARA LOGIN:');
    console.log('============================================');
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Senha: ${ADMIN_PASSWORD}`);
    console.log('');
    console.log('✅ Agora você pode fazer login!');
    console.log('URL: http://localhost:5000/admin.html');
    console.log('============================================\n');
    
  } catch (error) {
    console.error('\n❌ ERRO ao criar usuário admin:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

