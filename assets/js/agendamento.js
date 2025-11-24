// Script para gerenciar o formulário de agendamento
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
    : 'https://clinicanumero-7-production.up.railway.app/api';
};
const API_URL = getApiUrl();

// Função para carregar tratamentos do backend
async function loadTratamentos() {
  try {
    const select = document.getElementById('tratamento_id');
    if (!select) return;

    select.innerHTML = '<option value="">Carregando tratamentos...</option>';

    const response = await fetch(`${API_URL}/tratamentos?ativo=true&limit=100&orderBy=nome&order=asc`);
    const data = await response.json();

    if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
      select.innerHTML = '<option value="">Selecione um tratamento</option>';
      
      data.data.forEach(tratamento => {
        const option = document.createElement('option');
        option.value = tratamento.id;
        option.textContent = tratamento.nome;
        select.appendChild(option);
      });

      console.log(`✅ ${data.data.length} tratamentos carregados`);
    } else {
      select.innerHTML = '<option value="">Nenhum tratamento disponível</option>';
      console.warn('⚠️ Nenhum tratamento encontrado');
    }
  } catch (error) {
    console.error('❌ Erro ao carregar tratamentos:', error);
    const select = document.getElementById('tratamento_id');
    if (select) {
      select.innerHTML = '<option value="">Erro ao carregar tratamentos</option>';
    }
  }
}

// Função para formatar telefone
function formatarTelefone(telefone) {
  // Remove tudo que não é número
  const numeros = telefone.replace(/\D/g, '');
  
  // Formata para o padrão brasileiro
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
}

// Função para enviar agendamento
async function enviarAgendamento(event) {
  event.preventDefault();

  const form = document.getElementById('form-agendamento');
  const mensagemDiv = document.getElementById('agendamento-mensagem');
  const btnEnviar = document.getElementById('btn-enviar');
  
  // Obter valores do formulário
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();
  const tratamentoId = document.getElementById('tratamento_id').value;

  // Validar campos
  if (!nome || !telefone || !email || !tratamentoId) {
    mostrarMensagem('Por favor, preencha todos os campos.', 'erro');
    return;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    mostrarMensagem('Por favor, insira um e-mail válido.', 'erro');
    return;
  }

  // Desabilitar botão durante o envio
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';
  mensagemDiv.style.display = 'none';

  try {
    // Preparar dados para envio (backend espera tratamentoId em camelCase)
    const dados = {
      nome: nome,
      telefone: telefone,
      email: email,
      tratamentoId: tratamentoId, // Backend espera camelCase, não snake_case
    };

    console.log('📤 Enviando agendamento:', dados);

    // Enviar para a API
    const response = await fetch(`${API_URL}/agendamento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Agendamento enviado com sucesso!', data);
      mostrarMensagem('✅ Agendamento enviado com sucesso! Entraremos em contato em breve.', 'sucesso');
      
      // Limpar formulário
      form.reset();
      
      // Recarregar lista de tratamentos
      loadTratamentos();
    } else {
      console.error('❌ Erro ao enviar agendamento:', data);
      const errorMsg = data.error?.message || data.message || 'Erro ao enviar agendamento. Tente novamente.';
      mostrarMensagem(`❌ ${errorMsg}`, 'erro');
    }
  } catch (error) {
    console.error('❌ Erro ao enviar agendamento:', error);
    mostrarMensagem('❌ Erro ao enviar agendamento. Verifique sua conexão e tente novamente.', 'erro');
  } finally {
    // Reabilitar botão
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar agendamento';
  }
}

// Função para mostrar mensagem
function mostrarMensagem(mensagem, tipo) {
  const mensagemDiv = document.getElementById('agendamento-mensagem');
  if (!mensagemDiv) return;

  mensagemDiv.textContent = mensagem;
  mensagemDiv.style.display = 'block';

  // Estilizar conforme o tipo
  if (tipo === 'sucesso') {
    mensagemDiv.style.backgroundColor = '#d4edda';
    mensagemDiv.style.color = '#155724';
    mensagemDiv.style.border = '1px solid #c3e6cb';
  } else if (tipo === 'erro') {
    mensagemDiv.style.backgroundColor = '#f8d7da';
    mensagemDiv.style.color = '#721c24';
    mensagemDiv.style.border = '1px solid #f5c6cb';
  }

  // Rolar até a mensagem
  mensagemDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Adicionar máscara de telefone
document.addEventListener('DOMContentLoaded', function() {
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
      const valor = e.target.value;
      const formatado = formatarTelefone(valor);
      if (formatado !== valor) {
        e.target.value = formatado;
      }
    });
  }
});

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando página de agendamento...');
  
  // Carregar tratamentos
  loadTratamentos();

  // Adicionar listener no formulário
  const form = document.getElementById('form-agendamento');
  if (form) {
    form.addEventListener('submit', enviarAgendamento);
    console.log('✅ Listener do formulário adicionado');
  } else {
    console.error('❌ Formulário não encontrado!');
  }
});

// Se o DOM já estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadTratamentos();
    const form = document.getElementById('form-agendamento');
    if (form) {
      form.addEventListener('submit', enviarAgendamento);
    }
  });
} else {
  loadTratamentos();
  const form = document.getElementById('form-agendamento');
  if (form) {
    form.addEventListener('submit', enviarAgendamento);
  }
}

