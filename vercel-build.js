// Script de build para Vercel que substitui a URL da API
const fs = require('fs');
const path = require('path');

// Pega a URL da API da variável de ambiente do Vercel
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://seu-backend.up.railway.app/api';

console.log(`🔧 Configurando API_URL para: ${API_URL}`);

const HTML_FILES = ['index.html', 'admin.html', 'agendamento.html', 'tratamentos.html'];

HTML_FILES.forEach(file => {
  const filePath = path.join(__dirname, file);
  
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
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Atualizado: ${file}`);
});

console.log('✨ Build do Vercel concluído!');

