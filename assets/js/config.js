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
      // Produção - pega do meta tag primeiro
      const apiUrlFromMeta = document.querySelector('meta[name="api-url"]');
      if (apiUrlFromMeta && apiUrlFromMeta.content && apiUrlFromMeta.content !== '__API_URL__') {
        window.API_URL = apiUrlFromMeta.content;
      } else {
        // Fallback apenas se não encontrar no meta tag
        window.API_URL = 'https://clinicanumero-7-production.up.railway.app/api';
      }
    }
  }
  
  console.log('🔧 API URL configurada:', window.API_URL);
  console.log('🌐 Hostname atual:', window.location.hostname);
})();

