// Script rápido para criar usuário admin
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@clinicaodontoazul.com.br';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!@#';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador';

async function main() {
  console.log('============================================');
  console.log('  CRIANDO/ATUALIZANDO USUÁRIO ADMIN');
  console.log('============================================\n');
  
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Senha: ${ADMIN_PASSWORD}`);
  console.log(`Nome: ${ADMIN_NAME}\n`);
  
  try {
    // Criar hash da senha
    const senhaHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    
    // Verificar se usuário já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    let admin;
    if (usuarioExistente) {
      // Atualizar usuário existente
      admin = await prisma.usuario.update({
        where: { email: ADMIN_EMAIL },
        data: {
          senhaHash,
          nome: ADMIN_NAME,
          role: 'ADMIN',
          ativo: true,
          failedAttempts: 0,
          lockedUntil: null,
        },
      });
      console.log('✅ Usuário admin ATUALIZADO!');
    } else {
      // Criar novo usuário
      admin = await prisma.usuario.create({
        data: {
          nome: ADMIN_NAME,
          email: ADMIN_EMAIL,
          senhaHash,
          role: 'ADMIN',
          ativo: true,
        },
      });
      console.log('✅ Usuário admin CRIADO!');
    }
    
    console.log('✅ Usuário admin criado/atualizado com sucesso!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nome: ${admin.nome}`);
    console.log(`   Role: ${admin.role}\n`);
    
    console.log('============================================\n');
    console.log('Agora você pode fazer login no painel admin!');
    console.log('   URL: http://localhost:5000/admin.html\n');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

