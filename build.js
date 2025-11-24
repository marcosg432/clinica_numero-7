// Script para substituir a URL da API nos arquivos HTML antes do deploy
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'https://seu-backend.up.railway.app/api';
const HTML_FILES = ['index.html', 'admin.html', 'agendamento.html', 'tratamentos.html'];

console.log(`🔧 Configurando API_URL: ${API_URL}`);

HTML_FILES.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Adiciona ou atualiza meta tag com a URL da API
  const metaTag = `<meta name="api-url" content="${API_URL}">`;
  
  if (content.includes('name="api-url"')) {
    // Atualiza meta tag existente
    content = content.replace(
      /<meta\s+name="api-url"\s+content="[^"]*">/,
      metaTag
    );
  } else {
    // Adiciona meta tag no <head>
    content = content.replace(
      /(<head[^>]*>)/i,
      `$1\n  ${metaTag}`
    );
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Atualizado: ${file}`);
});

console.log('✨ Build concluído!');

