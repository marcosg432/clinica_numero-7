// Script para criar usuário admin diretamente
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backendDir = join(__dirname, 'backend');

console.log('============================================');
console.log('  CRIANDO/ATUALIZANDO USUÁRIO ADMIN');
console.log('============================================\n');

console.log(`Diretório backend: ${backendDir}\n`);

if (!existsSync(join(backendDir, 'package.json'))) {
  console.error('❌ ERRO: package.json não encontrado no diretório backend!');
  process.exit(1);
}

try {
  process.chdir(backendDir);
  console.log(`Diretório atual: ${process.cwd()}\n`);
  
  console.log('Executando seed...\n');
  execSync('npm run seed', { 
    stdio: 'inherit',
    cwd: backendDir,
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  console.log('\n============================================');
  console.log('  ✅ SEED EXECUTADO COM SUCESSO!');
  console.log('============================================\n');
  console.log('Credenciais do Admin:');
  console.log('  Email: admin@clinicaodontoazul.com.br');
  console.log('  Senha: ChangeMe123!@#\n');
  console.log('(Ou a senha definida no .env como ADMIN_PASSWORD)\n');
  console.log('Agora você pode fazer login no painel admin!\n');
} catch (error) {
  console.error('\n❌ ERRO ao executar seed:');
  console.error(error.message);
  process.exit(1);
}


