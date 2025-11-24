# Guia de Integração Frontend

Exemplos práticos para integrar o frontend com a API.

## Configuração Base

```javascript
// config/api.js
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Função helper para requisições
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('accessToken');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    // Tratar erro 401 (token expirado)
    if (response.status === 401 && token) {
      // Tentar refresh
      const newToken = await refreshToken();
      if (newToken) {
        // Retry com novo token
        return apiRequest(endpoint, options);
      }
    }
    throw new Error(data.error?.message || 'Erro na requisição');
  }

  return data;
}

async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data.data.accessToken;
    }
  } catch (error) {
    // Redirecionar para login
    window.location.href = '/login';
  }

  return null;
}
```

## Tratamentos

```javascript
// Buscar todos os tratamentos
async function getTratamentos(filters = {}) {
  const params = new URLSearchParams({
    ativo: 'true',
    ...filters,
  });
  const data = await apiRequest(`/tratamentos?${params}`);
  return data;
}

// Buscar por slug
async function getTratamentoBySlug(slug) {
  const data = await apiRequest(`/tratamentos/${slug}`);
  return data.data;
}

// Exemplo de uso
const tratamentos = await getTratamentos({ limit: 5 });
const lentes = await getTratamentoBySlug('lentes-de-contato-dental');
```

## Agendamentos

```javascript
// Criar agendamento
async function criarAgendamento(formData) {
  // Validar telefone
  const phoneRegex = /^[\d\s\(\)\-\+]+$/;
  if (!phoneRegex.test(formData.telefone)) {
    throw new Error('Telefone inválido');
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    throw new Error('Email inválido');
  }

  const data = await apiRequest('/agendamento', {
    method: 'POST',
    body: {
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email.toLowerCase(),
      tratamentoId: formData.tratamentoId,
      dataAgendada: formData.dataAgendada || undefined,
      notas: formData.notas || undefined,
    },
  });

  return data;
}

// Exemplo de uso no formulário
document.getElementById('agendamento-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value,
    tratamentoId: document.getElementById('tratamento').value,
    notas: document.getElementById('notas').value,
  };

  try {
    const result = await criarAgendamento(formData);
    alert(result.message || 'Agendamento criado com sucesso!');
    e.target.reset();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
});
```

## Avaliações

```javascript
// Buscar avaliações aprovadas
async function getAvaliacoes(limit = 10) {
  const data = await apiRequest(`/avaliacoes?aprovado=true&limit=${limit}`);
  return data.data;
}

// Criar avaliação
async function criarAvaliacao(formData) {
  if (formData.nota < 1 || formData.nota > 5) {
    throw new Error('Nota deve ser entre 1 e 5');
  }

  if (formData.texto.length < 10) {
    throw new Error('Texto deve ter no mínimo 10 caracteres');
  }

  const data = await apiRequest('/avaliacoes', {
    method: 'POST',
    body: {
      nome: formData.nome,
      nota: parseInt(formData.nota),
      texto: formData.texto,
    },
  });

  return data;
}
```

## Autenticação

```javascript
// Login
async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email: email.toLowerCase(), password },
  });

  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return data.data.user;
  }

  throw new Error('Login falhou');
}

// Logout
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/';
}

// Verificar se está autenticado
function isAuthenticated() {
  return !!localStorage.getItem('accessToken');
}
```

## Tratamento de Erros

```javascript
// Interceptor global
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('401')) {
    // Token expirado, tentar refresh
    refreshToken();
  } else if (event.reason?.message?.includes('429')) {
    alert('Muitas tentativas. Tente novamente mais tarde.');
  }
});

// Wrapper com tratamento de erro
async function safeApiRequest(endpoint, options) {
  try {
    return await apiRequest(endpoint, options);
  } catch (error) {
    console.error('API Error:', error);
    
    // Exibir mensagem amigável
    const errorMessage = error.message || 'Erro desconhecido';
    showNotification(errorMessage, 'error');
    
    throw error;
  }
}
```


