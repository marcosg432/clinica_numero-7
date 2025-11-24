// Script para carregar tratamentos da API e sincronizar com o site público
// Configuração dinâmica da API URL
const getApiUrl = () => {
  // 1. Tentar usar window.API_URL se já existir
  if (window.API_URL && !window.API_URL.includes('__API_URL__')) {
    console.log('✅ Usando window.API_URL existente:', window.API_URL);
    return window.API_URL;
  }
  
  // 2. Tentar ler do meta tag
  const metaTag = document.querySelector('meta[name="api-url"]');
  if (metaTag && metaTag.content) {
    const metaUrl = metaTag.content.trim();
    // Verificar se não é placeholder
    if (metaUrl && metaUrl !== '__API_URL__' && !metaUrl.includes('__API_URL__') && metaUrl.startsWith('http')) {
      console.log('✅ URL encontrada no meta tag:', metaUrl);
      return metaUrl;
    } else {
      console.warn('⚠️ Meta tag contém placeholder ou URL inválida:', metaUrl);
    }
  } else {
    console.warn('⚠️ Meta tag api-url não encontrada ou vazia');
  }
  
  // 3. Fallback baseado no ambiente
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';
  
  const fallbackUrl = isLocalhost 
    ? 'http://localhost:3000/api' 
    : 'https://clinicanumero-7-production.up.railway.app/api';
  
  console.warn('⚠️ Usando URL fallback:', fallbackUrl);
  console.warn('   Hostname atual:', window.location.hostname);
  return fallbackUrl;
};

// Inicializar API_URL
if (!window.API_URL) {
  window.API_URL = getApiUrl();
} else if (window.API_URL.includes('__API_URL__')) {
  // Se window.API_URL contém placeholder, tentar novamente
  console.warn('⚠️ window.API_URL contém placeholder, tentando obter URL válida...');
  window.API_URL = getApiUrl();
}

console.log('🔍 treatments.js carregado');
console.log('🌐 API URL final configurada:', window.API_URL);
console.log('📍 URL atual da página:', window.location.href);

// Tratamentos estáticos de fallback
const tratamentosEstaticos = [
  {
    nome: 'Lentes de Contato Dental',
    descricao: 'Lâminas ultrafinas planejadas digitalmente para entregar cor, forma e brilho sob medida.',
    slug: 'lentes-de-contato-dental',
    imagem: 'assets/img/home/tratamento-lentes.webp',
    pageUrl: 'lentes-contato.html'
  },
  {
    nome: 'Clareamento a Laser',
    descricao: 'Gel exclusivo ativado por luz azul, com monitoramento de sensibilidade em tempo real.',
    slug: 'clareamento-a-laser',
    imagem: 'assets/img/home/tratamento-clareamento.webp',
    pageUrl: 'clareamento-laser.html'
  },
  {
    nome: 'Implantes de Carga Imediata',
    descricao: 'Cirurgias guiadas por tomografia e prótese provisória instalada na sequência.',
    slug: 'implantes-de-carga-imediata',
    imagem: 'assets/img/home/tratamento-implantes.webp',
    pageUrl: 'implantes-carga-imediata.html'
  },
  {
    nome: 'Ortodontia Digital',
    descricao: 'Escaneamento intraoral e acompanhamento remoto para movimentos controlados.',
    slug: 'ortodontia-digital',
    imagem: 'assets/img/home/tratamento-ortodontia.webp',
    pageUrl: 'ortodontia-digital.html'
  },
  {
    nome: 'Harmonização Facial',
    descricao: 'Protocolos personalizados para realçar traços e valorizar o sorriso.',
    slug: 'harmonizacao-facial',
    imagem: 'assets/img/home/tratamento-harmonizacao.webp',
    pageUrl: 'harmonizacao-facial.html'
  }
];

// Função para renderizar cards de tratamentos
function renderTreatmentCards(tratamentos, carousel) {
  const htmlCards = tratamentos.map(tratamento => {
    const pageUrl = tratamento.pageUrl || `tratamento.html?slug=${tratamento.slug}`;
    const imagem = tratamento.imagem || `assets/img/home/tratamento-${tratamento.slug?.replace(/-/g, '-') || 'default'}.webp`;
    const descricao = tratamento.descricao 
      ? (tratamento.descricao.length > 80 ? tratamento.descricao.substring(0, 80) + '...' : tratamento.descricao)
      : 'Tratamento personalizado com tecnologia de ponta.';

    return `
      <article class="treatment-card">
        <div class="img-placeholder" data-label="${tratamento.nome}" style="--photo: url('${imagem}');"></div>
        <h3>${tratamento.nome}</h3>
        <p>${descricao}</p>
        <a class="btn ghost" href="${pageUrl}">Saiba mais</a>
      </article>
    `;
  });
  
  carousel.innerHTML = htmlCards.join('');
  console.log(`✅ ${tratamentos.length} tratamentos renderizados`);
}

// Função para carregar tratamentos na home (index.html)
async function loadTreatmentsHome() {
  console.log('📥 Carregando tratamentos para home...');
  console.log('🔗 API URL:', window.API_URL);
  
  const carousel = document.querySelector('.treatments-carousel') || document.getElementById('treatments-carousel');
  if (!carousel) {
    console.error('❌ Elemento .treatments-carousel não encontrado!');
    return;
  }
  
  // Mostrar indicador de carregamento
  carousel.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #666; width: 100%;">
      <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
      <p>Carregando tratamentos...</p>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  try {
    // Tentar diferentes formatos de URL
    const apiUrl = window.API_URL.endsWith('/api') ? window.API_URL : window.API_URL + '/api';
    const url = `${apiUrl}/tratamentos?ativo=true&limit=10&orderBy=criadoEm&order=desc`;
    
    console.log('🌐 Tentando conectar:', url);
    
    // Timeout de 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ TIMEOUT: Requisição demorou mais de 5 segundos');
      controller.abort();
    }, 5000);
    
    const startTime = Date.now();
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    
    clearTimeout(timeoutId);
    const endTime = Date.now();
    console.log(`⏱️ Resposta recebida em ${endTime - startTime}ms`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erro desconhecido');
      console.error(`❌ Erro HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
    }
    
    const data = await response.json();
    console.log('✅ Dados recebidos:', data);

    // Verificar se a resposta tem dados válidos
    if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
      console.log(`✅ ${data.data.length} tratamentos encontrados na API`);
      
      // Mapear slugs para URLs das páginas
      const slugToPage = {
        'lentes-de-contato-dental': 'lentes-contato.html',
        'clareamento-a-laser': 'clareamento-laser.html',
        'implantes-de-carga-imediata': 'implantes-carga-imediata.html',
        'ortodontia-digital': 'ortodontia-digital.html',
        'harmonizacao-facial': 'harmonizacao-facial.html'
      };
      
      // Converter dados da API para o formato esperado
      const tratamentos = data.data.map(t => ({
        nome: t.nome,
        descricao: t.descricao,
        slug: t.slug,
        imagem: t.imagem,
        pageUrl: slugToPage[t.slug] || `tratamento.html?slug=${t.slug}`
      }));
      
      renderTreatmentCards(tratamentos, carousel);
      console.log(`   Tratamentos: ${tratamentos.map(t => t.nome).join(', ')}`);
    } else {
      console.warn('⚠️ API retornou sem dados válidos:', data);
      console.log('📦 Usando tratamentos estáticos de fallback...');
      renderTreatmentCards(tratamentosEstaticos, carousel);
    }
  } catch (error) {
    console.error('❌ ERRO ao carregar tratamentos da API:', error);
    console.error('   Tipo:', error.name);
    console.error('   Mensagem:', error.message);
    
    // Em caso de erro, mostrar tratamentos estáticos
    console.log('📦 Usando tratamentos estáticos devido ao erro...');
    renderTreatmentCards(tratamentosEstaticos, carousel);
    
    // Mostrar aviso discreto (opcional)
    console.warn('⚠️ Não foi possível carregar tratamentos da API. Mostrando versão estática.');
  }
}
}

// Função para carregar tratamentos na página tratamentos.html
async function loadTreatmentsPage() {
  console.log('📥 Carregando tratamentos para página tratamentos.html...');
  console.log('🔗 URL da requisição:', `${window.API_URL}/tratamentos?ativo=true&limit=100&orderBy=criadoEm&order=desc`);
  
  try {
    // Timeout de 10 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${window.API_URL}/tratamentos?ativo=true&limit=100&orderBy=criadoEm&order=desc`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText.substring(0, 100)}`);
    }
    
    const data = await response.json();
    console.log('✅ Dados recebidos da API:', data);
    console.log(`📊 Total de tratamentos: ${data.data?.length || 0}`);

    if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
      let atualizados = 0;
      let naoEncontrados = [];
      
      // Atualizar cada seção de tratamento usando data-slug
      data.data.forEach(tratamento => {
        console.log(`\n🔍 Processando: ${tratamento.nome} (slug: ${tratamento.slug})`);
        
        // Buscar seção pelo atributo data-slug
        const section = document.querySelector(`[data-slug="${tratamento.slug}"]`);
        if (section) {
          console.log(`  ✅ Seção encontrada: #${section.id}`);
          
          // Atualizar o treatment-copy (descrição principal)
          const treatmentCopy = section.querySelector('.treatment-copy');
          if (treatmentCopy) {
            const eyebrow = treatmentCopy.querySelector('.eyebrow');
            // Buscar o parágrafo de descrição - tentar várias opções
            let p = treatmentCopy.querySelector('.treatment-description');
            if (!p) {
              // Se não encontrar com a classe, buscar todos os <p> dentro de treatment-copy
              const allP = treatmentCopy.querySelectorAll('p');
              console.log(`  📄 Encontrados ${allP.length} parágrafos`);
              // Pular o eyebrow (primeiro p geralmente) e pegar o segundo (descrição)
              p = allP.length > 1 ? allP[1] : allP[0];
            }
            
            if (eyebrow) {
              const nomeAntigo = eyebrow.textContent.trim();
              eyebrow.textContent = tratamento.nome;
              if (nomeAntigo !== tratamento.nome) {
                console.log(`  📝 Nome atualizado: "${nomeAntigo}" → "${tratamento.nome}"`);
              }
            }
            
            if (p) {
              const descAntiga = p.textContent.trim();
              if (tratamento.descricao) {
                // SEMPRE atualizar, mesmo que seja igual (garante sincronização)
                p.textContent = tratamento.descricao;
                
                if (descAntiga !== tratamento.descricao) {
                  console.log(`  ✅ Descrição ATUALIZADA:`);
                  console.log(`     ANTES: "${descAntiga}"`);
                  console.log(`     DEPOIS: "${tratamento.descricao}"`);
                } else {
                  console.log(`  ✓ Descrição já está sincronizada: "${descAntiga.substring(0, 50)}..."`);
                }
                atualizados++;
              } else {
                console.warn(`  ⚠️ Tratamento sem descrição no banco`);
              }
            } else {
              console.error(`  ❌ Parágrafo de descrição não encontrado!`);
            }
          } else {
            console.error(`  ❌ .treatment-copy não encontrado na seção!`);
          }

          // Atualizar a imagem do banner se houver
          const heroImg = section.querySelector('.treatment-hero .img-placeholder.ultra');
          if (heroImg && tratamento.imagem) {
            heroImg.style.setProperty('--photo', `url('${tratamento.imagem}')`);
            console.log(`  🖼️ Imagem atualizada: ${tratamento.imagem}`);
          }
        } else {
          console.warn(`  ⚠️ Seção com data-slug="${tratamento.slug}" NÃO encontrada!`);
          naoEncontrados.push(tratamento.nome);
        }
      });
      
      console.log(`\n✅ RESUMO:`);
      console.log(`   Tratamentos atualizados: ${atualizados}`);
      if (naoEncontrados.length > 0) {
        console.log(`   Não encontrados: ${naoEncontrados.join(', ')}`);
      }
      console.log(`✅ Página tratamentos.html atualizada!\n`);
    } else {
      console.warn('⚠️ Nenhum tratamento retornado da API:', data);
    }
  } catch (error) {
    console.error('❌ Erro ao carregar tratamentos na página:', error);
    console.error('Detalhes:', error.message);
    console.error('URL tentada:', `${window.API_URL}/tratamentos?ativo=true&limit=100&orderBy=criadoEm&order=desc`);
    console.error('Stack:', error.stack);
    
    // Mostrar mensagem de erro no console e manter HTML estático
    if (error.name === 'AbortError') {
      console.error('⏱️ Tempo de carregamento excedido (10 segundos)');
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.error('🌐 Erro de conexão - verifique se o backend está online em:', window.API_URL);
    }
    // Se der erro, mantém o HTML estático (não altera a página)
  }
}

// Carregar tratamentos quando a página carregar
function init() {
  console.log('🚀 Inicializando carregamento de tratamentos...');
  console.log('Estado do DOM:', document.readyState);
  console.log('API URL atual:', window.API_URL);
  
  // Verificar meta tag novamente (pode ter sido carregado depois)
  const metaTag = document.querySelector('meta[name="api-url"]');
  if (metaTag && metaTag.content && metaTag.content !== '__API_URL__' && !metaTag.content.includes('__API_URL__')) {
    const newUrl = metaTag.content;
    if (newUrl !== window.API_URL) {
      console.log('🔄 Atualizando API_URL do meta tag:', newUrl);
      window.API_URL = newUrl;
    }
  }
  
  // Pequeno delay para garantir que o DOM está totalmente carregado
  setTimeout(() => {
    // Verificar qual página está aberta
    const carousel = document.querySelector('.treatments-carousel') || document.getElementById('treatments-carousel');
    const showcase = document.querySelector('.treatment-showcase');
    
    if (carousel) {
      console.log('📄 Página detectada: index.html (home)');
      console.log('✅ Elemento .treatments-carousel encontrado:', carousel);
      loadTreatmentsHome();
    } else if (showcase) {
      console.log('📄 Página detectada: tratamentos.html');
      console.log('✅ Elemento .treatment-showcase encontrado:', showcase);
      loadTreatmentsPage();
    } else {
      console.warn('⚠️ Nenhuma página de tratamentos detectada!');
      console.warn('   Elementos procurados:');
      console.warn('   - .treatments-carousel:', document.querySelector('.treatments-carousel'));
      console.warn('   - #treatments-carousel:', document.getElementById('treatments-carousel'));
      console.warn('   - .treatment-showcase:', showcase);
    }
  }, 100);
}

// Múltiplas formas de garantir que seja executado
if (document.readyState === 'loading') {
  console.log('⏳ DOM ainda carregando, aguardando DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', init);
} else if (document.readyState === 'interactive') {
  console.log('⏳ DOM interativo, aguardando um momento...');
  setTimeout(init, 100);
} else {
  console.log('✅ DOM já carregado, executando imediatamente...');
  init();
}

// Fallback: tentar novamente quando a janela carregar completamente
window.addEventListener('load', () => {
  console.log('📦 Window.onload disparado');
  const carousel = document.querySelector('.treatments-carousel') || document.getElementById('treatments-carousel');
  if (carousel && carousel.innerHTML.includes('Carregando tratamentos...')) {
    console.log('🔄 Tentando carregar novamente após window.onload...');
    setTimeout(init, 200);
  }
});
