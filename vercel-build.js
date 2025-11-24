// Script de build para Vercel que substitui a URL da API e cria pasta public
const fs = require('fs');
const path = require('path');

// Pega a URL da API da variável de ambiente do Vercel
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://seu-backend.up.railway.app/api';

console.log(`🔧 Configurando API_URL para: ${API_URL}`);

// Criar pasta public se não existir
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('📁 Pasta public criada');
}

// Função para copiar arquivo ou diretório
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copiar pasta assets para public
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(publicDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  copyRecursiveSync(assetsSrc, assetsDest);
  console.log('📁 Pasta assets copiada para public');
}

// Copiar todos os arquivos HTML
const HTML_FILES = ['index.html', 'admin.html', 'agendamento.html', 'tratamentos.html', 
                   'clareamento-laser.html', 'harmonizacao-facial.html', 
                   'implantes-carga-imediata.html', 'lentes-contato.html', 
                   'ortodontia-digital.html'];

HTML_FILES.forEach(file => {
  const filePath = path.join(__dirname, file);
  const destPath = path.join(publicDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Substitui o placeholder ou atualiza a meta tag
  content = content.replace(/__API_URL__/g, API_URL);
  
  // Atualiza meta tag se existir
  if (content.includes('name="api-url"')) {
    content = content.replace(
      /<meta\s+name="api-url"\s+content="[^"]*">/,
      `<meta name="api-url" content="${API_URL}">`
    );
  }
  
  // Salva na pasta public
  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`✅ Atualizado e copiado: ${file}`);
});

console.log('✨ Build do Vercel concluído!');

