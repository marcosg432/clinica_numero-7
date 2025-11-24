// Script para FORÇAR criação/atualização do admin
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@clinicaodontoazul.com.br';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!@#';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador';

async function main() {
  console.log('\n============================================');
  console.log('  FORÇANDO CRIAÇÃO/ATUALIZAÇÃO DO ADMIN');
  console.log('============================================\n');
  
  try {
    // Primeiro, verificar se usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: ADMIN_EMAIL },
    });
    
    if (usuarioExistente) {
      console.log('✅ Usuário encontrado no banco de dados');
      console.log(`   Email: ${usuarioExistente.email}`);
      console.log(`   Ativo: ${usuarioExistente.ativo}`);
      console.log(`   Role: ${usuarioExistente.role}\n`);
      
      // Criar nova hash da senha
      console.log('🔐 Criando nova hash da senha...');
      const novaSenhaHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
      // Atualizar FORÇADAMENTE
      console.log('🔄 Atualizando senha e dados do usuário...');
      const adminAtualizado = await prisma.usuario.update({
        where: { email: ADMIN_EMAIL },
        data: {
          senhaHash: novaSenhaHash,
          nome: ADMIN_NAME,
          role: 'ADMIN',
          ativo: true,
          failedAttempts: 0,
          lockedUntil: null,
        },
      });
      
      console.log('✅ Usuário ATUALIZADO com sucesso!');
      console.log(`   ID: ${adminAtualizado.id}`);
      console.log(`   Email: ${adminAtualizado.email}`);
      console.log(`   Nome: ${adminAtualizado.nome}`);
      console.log(`   Role: ${adminAtualizado.role}\n`);
      
      // Testar a senha
      console.log('🧪 Testando senha...');
      const senhaTeste = await bcrypt.compare(ADMIN_PASSWORD, adminAtualizado.senhaHash);
      if (senhaTeste) {
        console.log('✅ Senha está correta e funcionando!\n');
      } else {
        console.log('❌ ERRO: Senha não está funcionando!\n');
      }
      
    } else {
      console.log('⚠️  Usuário NÃO encontrado. Criando novo usuário...\n');
      
      // Criar hash da senha
      const senhaHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
      // Criar novo usuário
      const novoAdmin = await prisma.usuario.create({
        data: {
          nome: ADMIN_NAME,
          email: ADMIN_EMAIL,
          senhaHash,
          role: 'ADMIN',
          ativo: true,
        },
      });
      
      console.log('✅ Usuário CRIADO com sucesso!');
      console.log(`   ID: ${novoAdmin.id}`);
      console.log(`   Email: ${novoAdmin.email}`);
      console.log(`   Nome: ${novoAdmin.nome}`);
      console.log(`   Role: ${novoAdmin.role}\n`);
      
      // Testar a senha
      console.log('🧪 Testando senha...');
      const senhaTeste = await bcrypt.compare(ADMIN_PASSWORD, novoAdmin.senhaHash);
      if (senhaTeste) {
        console.log('✅ Senha está correta e funcionando!\n');
      } else {
        console.log('❌ ERRO: Senha não está funcionando!\n');
      }
    }
    
    console.log('============================================');
    console.log('  CREDENCIAIS PARA LOGIN:');
    console.log('============================================');
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Senha: ${ADMIN_PASSWORD}`);
    console.log('');
    console.log('Agora você pode fazer login no painel admin!');
    console.log('URL: http://localhost:5000/admin.html');
    console.log('============================================\n');
    
  } catch (error) {
    console.error('\n❌ ERRO ao criar/atualizar usuário admin:');
    console.error(error);
    console.error('\nDetalhes do erro:');
    if (error.code) console.error(`  Código: ${error.code}`);
    if (error.meta) console.error(`  Meta: ${JSON.stringify(error.meta)}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();


