// Configuração dinâmica da API URL
(function() {
  // Verifica se está rodando localmente ou em produção
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';
  
  // URL da API baseada no ambiente
  if (!window.API_URL) {
    if (isLocalhost) {
      // Desenvolvimento local
      window.API_URL = 'http://localhost:3000/api';
    } else {
      // Produção - pega da variável de ambiente ou usa padrão
      // Vercel injeta variáveis via process.env no build, mas como é HTML estático,
      // vamos usar uma variável de ambiente do Vercel que será substituída
      window.API_URL = process.env.API_URL || 
                       'https://seu-backend.up.railway.app/api';
      
      // Alternativa: definir diretamente no HTML via variável do Vercel
      // ou usar o valor injetado pelo Vercel
      const apiUrlFromMeta = document.querySelector('meta[name="api-url"]');
      if (apiUrlFromMeta) {
        window.API_URL = apiUrlFromMeta.content;
      }
    }
  }
  
  console.log('API URL configurada:', window.API_URL);
})();

