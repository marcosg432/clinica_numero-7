// Carregar avaliações da API e sincronizar com o site
// Configuração dinâmica da API URL
const getApiUrl = () => {
  if (window.API_URL) return window.API_URL;
  const metaTag = document.querySelector('meta[name="api-url"]');
  if (metaTag && metaTag.content && metaTag.content !== '__API_URL__') {
    return metaTag.content;
  }
  // Fallback para localhost em desenvolvimento
  return window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://seu-backend.up.railway.app/api';
};
if (!window.API_URL) {
  window.API_URL = getApiUrl();
}

async function loadReviews() {
  try {
    // Carregar apenas avaliações aprovadas para o site público
    const apiUrl = window.API_URL.endsWith('/api') ? window.API_URL : window.API_URL + '/api';
    const url = `${apiUrl}/avaliacoes?aprovado=true&limit=10&orderBy=dataAvaliacao&order=desc`;
    
    console.log('📥 Carregando avaliações da API:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      console.warn(`⚠️ Erro ao carregar avaliações: ${response.status}`);
      // Se der erro, manter avaliações estáticas do HTML
      return;
    }

    const data = await response.json();
    console.log('✅ Dados de avaliações recebidos:', data);

    if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
      const reviewsContainer = document.querySelector('.reviews-grid');
      if (reviewsContainer) {
        console.log(`📊 ${data.data.length} avaliações encontradas na API`);
        
        // SUBSTITUIR todas as avaliações estáticas pelas da API
        // Limitar a 7 avaliações no site
        const reviewsToShow = data.data.slice(0, 7);
        
        reviewsContainer.innerHTML = reviewsToShow.map(review => {
          // Formatar data
          const date = new Date(review.dataAvaliacao || review.criadoEm);
          const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          const formattedDate = `${monthNames[date.getMonth()]}/${date.getFullYear()}`;

          // Gerar avatar se não tiver
          const avatar = review.avatar || getInitials(review.nome);

          // Gerar estrelas
          const stars = '⭐'.repeat(review.nota || 5);

          return `
            <article class="review-card">
              <div class="review-header">
                <div class="review-avatar">${avatar}</div>
                <div>
                  <strong>${review.nome}</strong>
                  <div class="review-meta">Google Reviews · ${stars}</div>
                </div>
              </div>
              <p class="review-text">"${review.texto}"</p>
              <span class="review-date">Avaliado em ${formattedDate}</span>
            </article>
          `;
        }).join('');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error);
    // Se der erro, mantém as avaliações estáticas do HTML
  }
}

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Carregar avaliações quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadReviews);
} else {
  loadReviews();
}
