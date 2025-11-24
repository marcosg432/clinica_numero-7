// Script para verificar tratamentos no banco
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n============================================');
  console.log('  TRATAMENTOS NO BANCO DE DADOS');
  console.log('============================================\n');
  
  try {
    const tratamentos = await prisma.tratamento.findMany({
      orderBy: { criadoEm: 'desc' }
    });
    
    tratamentos.forEach((t, index) => {
      console.log(`${index + 1}. ${t.nome}`);
      console.log(`   Slug: ${t.slug}`);
      console.log(`   Descrição: ${t.descricao || '(sem descrição)'}`);
      console.log(`   Ativo: ${t.ativo ? 'Sim' : 'Não'}`);
      console.log(`   Imagem: ${t.imagem || '(sem imagem)'}`);
      console.log('');
    });
    
    console.log(`Total: ${tratamentos.length} tratamentos\n`);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();



