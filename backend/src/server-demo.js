import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from './config/logger.js';

const app = express();
const PORT = 3000;

// Mock data - Dados de exemplo para demonstração
const tratamentosMock = [
  {
    id: '1',
    nome: 'Lentes de Contato Dental',
    slug: 'lentes-de-contato-dental',
    descricao: 'Lamínas ultrafinas planejadas digitalmente para entregar cor, forma e brilho sob medida.',
    imagem: '/assets/img/tratamentos/lentes-banner.webp',
    ativo: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Clareamento a Laser',
    slug: 'clareamento-a-laser',
    descricao: 'Gel exclusivo ativado por luz azul, com monitoramento de sensibilidade em tempo real.',
    imagem: '/assets/img/tratamentos/clareamento-banner.webp',
    ativo: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '3',
    nome: 'Implantes de Carga Imediata',
    slug: 'implantes-de-carga-imediata',
    descricao: 'Cirurgias guiadas por tomografia e prótese provisória instalada na sequência.',
    imagem: '/assets/img/tratamentos/implantes-banner.webp',
    ativo: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '4',
    nome: 'Ortodontia Digital',
    slug: 'ortodontia-digital',
    descricao: 'Escaneamento intraoral e acompanhamento remoto para movimentos controlados.',
    imagem: '/assets/img/tratamentos/ortodontia-banner.webp',
    ativo: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '5',
    nome: 'Harmonização Facial',
    slug: 'harmonizacao-facial',
    descricao: 'Protocolos personalizados para realçar traços e valorizar o sorriso.',
    imagem: '/assets/img/tratamentos/harmonizacao-banner.webp',
    ativo: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
];

const avaliacoesMock = [
  {
    id: '1',
    nome: 'Gabriela Lopes',
    avatar: 'GL',
    nota: 5,
    texto: 'Atendimento muito acolhedor. Fiz lentes de contato dental e fiquei impressionada com o planejamento digital e o cuidado no ajuste final.',
    dataAvaliacao: new Date('2025-10-15').toISOString(),
    aprovado: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Rafael Mendes',
    avatar: 'RM',
    nota: 5,
    texto: 'Passei pelo clareamento a laser e o resultado saiu muito acima da expectativa. Zero sensibilidade e equipe super atenciosa.',
    dataAvaliacao: new Date('2025-09-20').toISOString(),
    aprovado: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '3',
    nome: 'Viviane Campos',
    avatar: 'VC',
    nota: 5,
    texto: 'Implantes de carga imediata transformaram minha qualidade de vida. Profissionais excelentes e infraestrutura de ponta!',
    dataAvaliacao: new Date('2025-09-10').toISOString(),
    aprovado: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '4',
    nome: 'Marcos Silva',
    avatar: 'MS',
    nota: 5,
    texto: 'Ortodontia digital mudou completamente minha experiência. Alinhadores confortáveis e resultado incrível!',
    dataAvaliacao: new Date('2025-08-25').toISOString(),
    aprovado: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '5',
    nome: 'Ana Paula',
    avatar: 'AP',
    nota: 5,
    texto: 'Harmonização facial feita com muito cuidado e atenção. Resultado natural e profissionalismo de primeira.',
    dataAvaliacao: new Date('2025-08-15').toISOString(),
    aprovado: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '6',
    nome: 'Carlos Eduardo',
    avatar: 'CE',
    nota: 5,
    texto: 'Experiência incrível do início ao fim. Profissionais qualificados e ambiente acolhedor. Recomendo!',
    dataAvaliacao: new Date('2025-08-10').toISOString(),
    aprovado: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '7',
    nome: 'Juliana Costa',
    avatar: 'JC',
    nota: 5,
    texto: 'Fiz lentes dentais e ficou perfeito! A equipe é muito atenciosa e o resultado superou minhas expectativas.',
    dataAvaliacao: new Date('2025-07-20').toISOString(),
    aprovado: true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
];

let agendamentosMock = [];

// Security
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
}));

// Body parser
app.use(express.json());

// Logging
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'demo',
    timestamp: new Date().toISOString(),
  });
});

// API Routes

// Tratamentos
app.get('/api/tratamentos', (req, res) => {
  const { ativo, search, page = 1, limit = 10 } = req.query;
  
  let tratamentos = [...tratamentosMock];
  
  if (ativo !== undefined) {
    tratamentos = tratamentos.filter(t => t.ativo === (ativo === 'true'));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    tratamentos = tratamentos.filter(t => 
      t.nome.toLowerCase().includes(searchLower) ||
      t.descricao?.toLowerCase().includes(searchLower)
    );
  }
  
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginated = tratamentos.slice(start, end);
  
  res.json({
    success: true,
    data: paginated,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: tratamentos.length,
      totalPages: Math.ceil(tratamentos.length / limit),
    },
  });
});

app.get('/api/tratamentos/:slug', (req, res) => {
  const { slug } = req.params;
  const tratamento = tratamentosMock.find(t => t.slug === slug);
  
  if (!tratamento) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Tratamento not found',
      },
    });
  }
  
  res.json({
    success: true,
    data: tratamento,
  });
});

// Avaliações
app.get('/api/avaliacoes', (req, res) => {
  const { aprovado, limit = 10, page = 1 } = req.query;
  
  let avaliacoes = [...avaliacoesMock];
  
  // Público só vê aprovadas
  if (aprovado === undefined || aprovado === 'true') {
    avaliacoes = avaliacoes.filter(a => a.aprovado);
  }
  
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paginated = avaliacoes.slice(start, end);
  
  res.json({
    success: true,
    data: paginated,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: avaliacoes.length,
      totalPages: Math.ceil(avaliacoes.length / limit),
    },
  });
});

app.post('/api/avaliacoes', (req, res) => {
  const { nome, nota, texto, avatar } = req.body;
  
  // Validações básicas
  if (!nome || nome.length < 3) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Nome deve ter no mínimo 3 caracteres',
      },
    });
  }
  
  if (!nota || nota < 1 || nota > 5) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Nota deve ser entre 1 e 5',
      },
    });
  }
  
  if (!texto || texto.length < 10) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Texto deve ter no mínimo 10 caracteres',
      },
    });
  }
  
  const novaAvaliacao = {
    id: String(avaliacoesMock.length + 1),
    nome,
    avatar: avatar || (nome.split(' ').length >= 2 
      ? (nome.split(' ')[0][0] + nome.split(' ')[nome.split(' ').length - 1][0]).toUpperCase()
      : nome.substring(0, 2).toUpperCase()),
    nota: parseInt(nota),
    texto,
    dataAvaliacao: new Date().toISOString(),
    aprovado: false,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  
  avaliacoesMock.push(novaAvaliacao);
  
  res.status(201).json({
    success: true,
    data: novaAvaliacao,
    message: 'Avaliação enviada com sucesso! Será revisada antes de ser publicada.',
  });
});

// Agendamentos
app.post('/api/agendamento', (req, res) => {
  const { nome, telefone, email, tratamentoId, dataAgendada, notas } = req.body;
  
  // Validações básicas
  if (!nome || nome.length < 3) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Nome deve ter no mínimo 3 caracteres',
        details: [{ path: 'nome', message: 'Nome deve ter no mínimo 3 caracteres' }],
      },
    });
  }
  
  const phoneRegex = /^[\d\s\(\)\-\+]+$/;
  if (!telefone || !phoneRegex.test(telefone) || telefone.length < 10) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Telefone inválido',
        details: [{ path: 'telefone', message: 'Telefone inválido' }],
      },
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email inválido',
        details: [{ path: 'email', message: 'Email inválido' }],
      },
    });
  }
  
  const tratamento = tratamentosMock.find(t => t.id === tratamentoId);
  if (!tratamento) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Tratamento not found',
      },
    });
  }
  
  const novoAgendamento = {
    id: String(agendamentosMock.length + 1),
    nome,
    telefone,
    email: email.toLowerCase(),
    tratamentoId,
    tratamento: {
      id: tratamento.id,
      nome: tratamento.nome,
      slug: tratamento.slug,
    },
    dataAgendada: dataAgendada || null,
    dataEnvio: new Date().toISOString(),
    status: 'PENDENTE',
    notas: notas || null,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  
  agendamentosMock.push(novoAgendamento);
  
  console.log('📅 Novo agendamento recebido:', novoAgendamento);
  
  res.status(201).json({
    success: true,
    data: novoAgendamento,
    message: 'Agendamento criado com sucesso. Em breve entraremos em contato!',
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Servidor Demo rodando na porta ${PORT}`);
  logger.info(`📡 API disponível em http://localhost:${PORT}/api`);
  logger.info(`❤️  Health check em http://localhost:${PORT}/health`);
  logger.info(`⚠️  MODO DEMO - Dados em memória (não persistem após reiniciar)`);
});

export default app;


