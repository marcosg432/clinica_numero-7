// Script para carregar tratamentos da API e sincronizar com o site público
// Configuração dinâmica da API URL
const getApiUrl = () => {
  if (window.API_URL) {
    console.log('✅ Usando window.API_URL existente:', window.API_URL);
    return window.API_URL;
  }
  const metaTag = document.querySelector('meta[name="api-url"]');
  if (metaTag && metaTag.content && metaTag.content !== '__API_URL__') {
    console.log('✅ URL encontrada no meta tag:', metaTag.content);
    return metaTag.content;
  }
  // Fallback para localhost em desenvolvimento
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  const fallbackUrl = isLocalhost 
    ? 'http://localhost:3000/api' 
    : 'https://clinicanumero-7-production.up.railway.app/api';
  console.warn('⚠️ Usando URL fallback:', fallbackUrl);
  return fallbackUrl;
};

if (!window.API_URL) {
  window.API_URL = getApiUrl();
}

console.log('🔍 treatments.js carregado');
console.log('🌐 API URL final:', window.API_URL);

// Função para carregar tratamentos na home (index.html)
async function loadTreatmentsHome() {
  console.log('📥 Carregando tratamentos para home...');
  console.log('🔗 URL da requisição:', `${window.API_URL}/tratamentos?ativo=true&limit=10&orderBy=criadoEm&order=desc`);
  
  // Mostrar indicador de carregamento
  const carousel = document.querySelector('.treatments-carousel') || document.getElementById('treatments-carousel');
  if (carousel) {
    carousel.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666; width: 100%;">
        <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
        <p>Carregando tratamentos...</p>
        <p style="font-size: 0.85em; color: #999; margin-top: 0.5rem;">Aguarde...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  try {
    // Timeout de 5 segundos (mais rápido)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.error('⏱️ TIMEOUT: Requisição demorou mais de 5 segundos');
      controller.abort();
    }, 5000);
    
    console.log('🌐 Fazendo requisição para:', `${window.API_URL}/tratamentos?ativo=true&limit=10&orderBy=criadoEm&order=desc`);
    const startTime = Date.now();
    
    const response = await fetch(`${window.API_URL}/tratamentos?ativo=true&limit=10&orderBy=criadoEm&order=desc`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    const endTime = Date.now();
    console.log(`⏱️ Requisição completada em ${endTime - startTime}ms`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText.substring(0, 100)}`);
    }
    
    const data = await response.json();
    console.log('✅ Dados recebidos da API:', data);

    if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
      if (!carousel) {
        console.error('❌ Elemento .treatments-carousel não encontrado após carregar dados!');
        return;
      }
        const cardsAntigos = carousel.children.length;
        console.log(`🔄 Carousel encontrado! Substituindo ${cardsAntigos} elementos por ${data.data.length} cards da API`);
        
        // Limpar mensagem de "Carregando..." se houver
        carousel.innerHTML = '';
        
        const htmlCards = data.data.map(tratamento => {
          // Mapear slugs para URLs das páginas
          const slugToPage = {
            'lentes-de-contato-dental': 'lentes-contato.html',
            'clareamento-a-laser': 'clareamento-laser.html',
            'implantes-de-carga-imediata': 'implantes-carga-imediata.html',
            'ortodontia-digital': 'ortodontia-digital.html',
            'harmonizacao-facial': 'harmonizacao-facial.html'
          };
          
          const pageUrl = slugToPage[tratamento.slug] || `tratamento.html?slug=${tratamento.slug}`;
          const imagem = tratamento.imagem || `assets/img/home/tratamento-${tratamento.slug?.replace(/-/g, '-') || 'default'}.webp`;
          
          // Usar descrição do banco, ou uma descrição padrão curta
          const descricao = tratamento.descricao 
            ? (tratamento.descricao.length > 80 ? tratamento.descricao.substring(0, 80) + '...' : tratamento.descricao)
            : 'Tratamento personalizado com tecnologia de ponta.';

          console.log(`  - ${tratamento.nome}: "${descricao.substring(0, 40)}..."`);

          return `
            <article class="treatment-card">
              <div class="img-placeholder" data-label="${tratamento.nome}" style="--photo: url('${imagem}');"></div>
              <h3>${tratamento.nome}</h3>
              <p>${descricao}</p>
              <a class="btn ghost" href="${pageUrl}">Saiba mais</a>
            </article>
          `;
        });
        
        // Substituir o conteúdo
        carousel.innerHTML = htmlCards.join('');
        
        console.log(`✅ Home atualizada: ${cardsAntigos} cards → ${data.data.length} cards da API`);
        console.log(`   Tratamentos carregados: ${data.data.map(t => t.nome).join(', ')}`);
      } else {
        console.error('❌ Elemento .treatments-carousel ou #treatments-carousel não encontrado!');
        console.error('   Procurando por:', document.querySelector('.treatments-carousel'));
        console.error('   Procurando por:', document.getElementById('treatments-carousel'));
      }
    } else {
      console.warn('⚠️ Nenhum tratamento retornado da API:', data);
      if (carousel) {
        carousel.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><p>Nenhum tratamento disponível no momento.</p></div>';
      }
    }
  } catch (error) {
    console.error('❌ ERRO ao carregar tratamentos na home:', error);
    console.error('   Tipo:', error.name);
    console.error('   Mensagem:', error.message);
    console.error('   URL tentada:', `${window.API_URL}/tratamentos?ativo=true&limit=10&orderBy=criadoEm&order=desc`);
    
    // Mostrar mensagem de erro clara
    const carousel = document.querySelector('.treatments-carousel') || document.getElementById('treatments-carousel');
    if (carousel) {
      let errorMessage = '';
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        errorMessage = `
          <div style="text-align: center; padding: 40px; color: #e74c3c;">
            <p style="font-size: 1.2em; font-weight: 600; margin-bottom: 0.5rem;">⏱️ Tempo esgotado</p>
            <p>O servidor demorou muito para responder (> 5s).</p>
            <p style="font-size: 0.85em; color: #666; margin-top: 1rem;">Verifique se o backend está online.</p>
          </div>
        `;
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('CORS')) {
        errorMessage = `
          <div style="text-align: center; padding: 40px; color: #e74c3c;">
            <p style="font-size: 1.2em; font-weight: 600; margin-bottom: 0.5rem;">🌐 Erro de conexão</p>
            <p>Não foi possível conectar ao backend.</p>
            <p style="font-size: 0.85em; color: #666; margin-top: 1rem; word-break: break-all;">URL: ${window.API_URL}</p>
            <p style="font-size: 0.85em; color: #666;">Possível problema: CORS ou backend offline</p>
          </div>
        `;
      } else {
        errorMessage = `
          <div style="text-align: center; padding: 40px; color: #e74c3c;">
            <p style="font-size: 1.2em; font-weight: 600; margin-bottom: 0.5rem;">❌ Erro ao carregar</p>
            <p>${error.message || 'Erro desconhecido'}</p>
            <p style="font-size: 0.85em; color: #666; margin-top: 1rem;">Tente recarregar a página (F5)</p>
          </div>
        `;
      }
      carousel.innerHTML = errorMessage;
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
  
  // Verificar qual página está aberta
  if (document.querySelector('.treatments-carousel')) {
    console.log('📄 Página detectada: index.html (home)');
    loadTreatmentsHome();
  }
  if (document.querySelector('.treatment-showcase')) {
    console.log('📄 Página detectada: tratamentos.html');
    loadTreatmentsPage();
  }
}

if (document.readyState === 'loading') {
  console.log('⏳ DOM ainda carregando, aguardando DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', init);
} else {
  console.log('✅ DOM já carregado, executando imediatamente...');
  init();
}
