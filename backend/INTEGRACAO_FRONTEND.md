# Integração Frontend - Guia Rápido

## Configuração Inicial

### 1. Variável de Ambiente

Adicione ao seu `.env` ou `config.js`:

```javascript
const API_URL = 'http://localhost:3000/api'; // ou sua URL de produção
```

### 2. CORS

Configure no backend `.env`:

```env
FRONTEND_URL=http://localhost:8080
```

## Exemplos Práticos

### Buscar Tratamentos (Home)

```javascript
// Listar todos os tratamentos ativos
async function carregarTratamentos() {
  try {
    const response = await fetch(`${API_URL}/tratamentos?ativo=true&limit=10`);
    const { data, pagination } = await response.json();
    
    // Renderizar tratamentos
    data.forEach(tratamento => {
      console.log(tratamento.nome, tratamento.slug);
      // Criar cards, etc.
    });
  } catch (error) {
    console.error('Erro ao carregar tratamentos:', error);
  }
}
```

### Buscar Tratamento por Slug (Página Detalhe)

```javascript
async function carregarTratamento(slug) {
  try {
    const response = await fetch(`${API_URL}/tratamentos/${slug}`);
    const { data } = await response.json();
    
    // Preencher página
    document.getElementById('nome-tratamento').textContent = data.nome;
    document.getElementById('descricao').textContent = data.descricao;
    document.getElementById('imagem').src = data.imagem;
  } catch (error) {
    console.error('Tratamento não encontrado:', error);
  }
}

// Uso: carregarTratamento('lentes-de-contato-dental');
```

### Criar Agendamento (Formulário)

```javascript
// Integrar com seu formulário HTML
document.getElementById('form-agendamento').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    nome: document.getElementById('nome').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    email: document.getElementById('email').value.trim().toLowerCase(),
    tratamentoId: document.getElementById('tratamento-select').value,
    dataAgendada: document.getElementById('data').value || undefined,
    notas: document.getElementById('notas').value.trim() || undefined,
  };

  // Validações básicas
  if (!formData.nome || formData.nome.length < 3) {
    alert('Nome deve ter no mínimo 3 caracteres');
    return;
  }

  const phoneRegex = /^[\d\s\(\)\-\+]+$/;
  if (!phoneRegex.test(formData.telefone)) {
    alert('Telefone inválido');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert('Email inválido');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/agendamento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || 'Agendamento criado com sucesso!');
      e.target.reset(); // Limpar formulário
    } else {
      // Exibir erros de validação
      if (result.error?.details) {
        const errors = result.error.details.map(e => e.message).join('\n');
        alert('Erros:\n' + errors);
      } else {
        alert(result.error?.message || 'Erro ao criar agendamento');
      }
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro de conexão. Tente novamente.');
  }
});
```

### Carregar Avaliações (Seção Home)

```javascript
async function carregarAvaliacoes() {
  try {
    const response = await fetch(`${API_URL}/avaliacoes?aprovado=true&limit=10&orderBy=dataAvaliacao&order=desc`);
    const { data } = await response.json();
    
    // Renderizar avaliações
    const container = document.getElementById('avaliacoes-container');
    container.innerHTML = '';

    data.forEach(avaliacao => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-header">
          <div class="review-avatar">${avaliacao.avatar}</div>
          <div>
            <strong>${avaliacao.nome}</strong>
            <div class="review-meta">⭐${'⭐'.repeat(avaliacao.nota - 1)}</div>
          </div>
        </div>
        <p class="review-text">${avaliacao.texto}</p>
        <span class="review-date">${new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}</span>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error);
  }
}
```

### Criar Avaliação (Formulário)

```javascript
document.getElementById('form-avaliacao').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    nome: document.getElementById('nome-avaliacao').value.trim(),
    nota: parseInt(document.getElementById('nota').value),
    texto: document.getElementById('texto-avaliacao').value.trim(),
  };

  // Validações
  if (formData.nota < 1 || formData.nota > 5) {
    alert('Nota deve ser entre 1 e 5');
    return;
  }

  if (formData.texto.length < 10) {
    alert('Texto deve ter no mínimo 10 caracteres');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/avaliacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || 'Avaliação enviada! Será revisada antes de ser publicada.');
      e.target.reset();
    } else {
      alert(result.error?.message || 'Erro ao enviar avaliação');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro de conexão. Tente novamente.');
  }
});
```

## Exemplos cURL

### Testar Endpoints

```bash
# Listar tratamentos
curl http://localhost:3000/api/tratamentos

# Buscar por slug
curl http://localhost:3000/api/tratamentos/lentes-de-contato-dental

# Criar agendamento
curl -X POST http://localhost:3000/api/agendamento \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "(67) 99999-9999",
    "email": "joao@example.com",
    "tratamentoId": "uuid-do-tratamento"
  }'

# Login (admin)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinicaodontoazul.com.br",
    "password": "senha123"
  }'

# Buscar avaliações
curl http://localhost:3000/api/avaliacoes?aprovado=true

# Health check
curl http://localhost:3000/health
```

## Tratamento de Erros Comum

```javascript
// Função helper genérica
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...(options.body && {
        body: typeof options.body === 'string' 
          ? options.body 
          : JSON.stringify(options.body)
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Erro de validação (400)
      if (response.status === 400) {
        const errors = data.error?.details?.map(e => e.message).join(', ');
        throw new Error(errors || data.error?.message || 'Erro de validação');
      }
      
      // Não autorizado (401)
      if (response.status === 401) {
        throw new Error('Não autorizado');
      }
      
      // Rate limit (429)
      if (response.status === 429) {
        throw new Error('Muitas tentativas. Tente novamente mais tarde.');
      }
      
      throw new Error(data.error?.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Erro de conexão com o servidor');
    }
    throw error;
  }
}

// Uso
try {
  const tratamentos = await fetchAPI('/tratamentos?ativo=true');
  console.log(tratamentos.data);
} catch (error) {
  alert(error.message);
}
```

## Variáveis de Ambiente Frontend

Crie um arquivo `.env` ou configure no seu build:

```env
# Desenvolvimento
API_URL=http://localhost:3000/api

# Produção
API_URL=https://api.clinicaodontoazul.com.br/api
```

## Notas Importantes

1. **CORS:** Certifique-se de que `FRONTEND_URL` no backend inclui sua URL
2. **Rate Limiting:** Respeite os limites (5 agendamentos/hora, 100 req/15min)
3. **Validação:** Sempre valide no frontend antes de enviar (melhor UX)
4. **Telefone:** Use máscara de input para melhorar UX
5. **Email:** Sempre converter para lowercase antes de enviar
6. **Tratamento de Erros:** Sempre mostrar mensagens amigáveis ao usuário


