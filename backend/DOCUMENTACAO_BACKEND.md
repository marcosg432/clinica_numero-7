# Documentação Completa - Backend Clínica Odonto Azul

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Instalação e Configuração](#instalação-e-configuração)
5. [Banco de Dados](#banco-de-dados)
6. [Endpoints da API](#endpoints-da-api)
7. [Autenticação e Autorização](#autenticação-e-autorização)
8. [Segurança](#segurança)
9. [Deploy](#deploy)
10. [Integração Frontend](#integração-frontend)
11. [Monitoramento e Logs](#monitoramento-e-logs)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

API REST completa para gerenciar tratamentos, agendamentos e avaliações da Clínica Odonto Azul. Desenvolvida seguindo princípios SOLID, com arquitetura em camadas (Service → Controller → Route → Validator).

### Funcionalidades Principais

- ✅ CRUD completo de tratamentos
- ✅ Sistema de agendamentos com notificações por email
- ✅ Avaliações de clientes (com moderação)
- ✅ Autenticação JWT (access + refresh tokens)
- ✅ Rate limiting e proteções de segurança
- ✅ Upload de imagens (local/S3)
- ✅ Logging estruturado
- ✅ Testes automatizados
- ✅ Docker + docker-compose

---

## 🛠 Stack Tecnológica

### Justificativa da Escolha

**Node.js + Express:**
- Performance excelente para APIs REST
- Ecossistema rico (middleware, validação, ORM)
- Desenvolvimento rápido e produtividade alta
- Fácil deploy em diversos ambientes

**PostgreSQL:**
- Banco relacional robusto e confiável
- Suporte a JSON, migrations, transações ACID
- Open-source e amplamente adotado
- Escalabilidade vertical e horizontal

**Prisma ORM:**
- Type-safe queries e autocomplete
- Migrations automáticas e versionadas
- Developer experience superior
- Performance otimizada com prepared statements

**Zod:**
- Validação type-safe em runtime
- Schema inference automático
- Mensagens de erro claras
- Integração perfeita com TypeScript (futuro)

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações (env, logger, database)
│   ├── controllers/      # Handlers das rotas
│   ├── database/         # Seed scripts
│   ├── middleware/       # Auth, error handler, rate limiter, validator
│   ├── routes/           # Definição das rotas
│   ├── services/         # Lógica de negócio
│   ├── utils/            # Helpers e utilitários
│   ├── validators/       # Schemas Zod
│   └── server.js         # Entry point
├── prisma/
│   └── schema.prisma     # Schema do banco
├── tests/
│   ├── integration/      # Testes de integração
│   ├── unit/             # Testes unitários
│   └── setup.js          # Configuração dos testes
├── uploads/              # Imagens (local storage)
├── .env.example          # Exemplo de variáveis
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
└── README.md
```

---

## ⚙️ Instalação e Configuração

### Requisitos

- Node.js 18.0.0 ou superior
- PostgreSQL 15.0 ou superior
- npm 9.0.0 ou superior

### Passo a Passo

#### 1. Instalar Dependências

```bash
cd backend
npm install
```

#### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
# Obrigatórias
DATABASE_URL="postgresql://usuario:senha@localhost:5432/clinica_odonto?schema=public"
JWT_SECRET="sua-chave-secreta-minimo-32-caracteres"
JWT_REFRESH_SECRET="outra-chave-secreta-diferente-minimo-32-caracteres"

# Opcionais mas recomendadas
FRONTEND_URL="http://localhost:8080"
SENDGRID_API_KEY="sua-chave-sendgrid"
EMAIL_FROM="noreply@clinicaodontoazul.com.br"
```

#### 3. Configurar Banco de Dados

```bash
# Criar banco de dados (via psql ou pgAdmin)
createdb clinica_odonto

# Executar migrations
npm run migrate

# Popular dados iniciais
npm run seed
```

O seed criará:
- 1 usuário admin (email: admin@clinicaodontoazul.com.br, senha: configurável via ADMIN_PASSWORD)
- 5 tratamentos
- 5 avaliações aprovadas
- 2 agendamentos de exemplo

#### 4. Iniciar Servidor

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3000/api`

---

## 🗄 Banco de Dados

### Schema Principal

#### Tabela: `tratamentos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | String(200) | Nome do tratamento |
| descricao | Text | Descrição detalhada |
| slug | String(unique) | URL-friendly identifier |
| imagem | String | URL/caminho da imagem |
| ativo | Boolean | Se está ativo |
| criado_em | Timestamp | Data de criação |
| atualizado_em | Timestamp | Última atualização |

**Índices:** `slug`, `ativo`

#### Tabela: `agendamentos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | String(200) | Nome do paciente |
| telefone | String(20) | Telefone de contato |
| email | String | Email de contato |
| tratamento_id | UUID (FK) | Referência ao tratamento |
| data_agendada | DateTime | Data/hora desejada (opcional) |
| data_envio | Timestamp | Quando foi enviado |
| status | Enum | PENDENTE, CONFIRMADO, CANCELADO |
| notas | Text | Observações |
| criado_em | Timestamp | Data de criação |
| atualizado_em | Timestamp | Última atualização |

**Índices:** `status`, `tratamento_id`, `data_envio`

#### Tabela: `avaliacoes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | String(200) | Nome do avaliador |
| avatar | String | Iniciais ou URL |
| nota | Integer(1-5) | Nota de 1 a 5 |
| texto | Text | Texto da avaliação |
| data_avaliacao | Timestamp | Data da avaliação |
| aprovado | Boolean | Se está aprovada (moderação) |
| criado_em | Timestamp | Data de criação |
| atualizado_em | Timestamp | Última atualização |

**Índices:** `aprovado`, `data_avaliacao`

#### Tabela: `usuarios`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| nome | String | Nome do usuário |
| email | String(unique) | Email (login) |
| senha_hash | String | Hash bcrypt da senha |
| role | Enum | ADMIN, EDITOR |
| ativo | Boolean | Se está ativo |
| last_login | Timestamp | Último login |
| failed_attempts | Integer | Tentativas falhadas |
| locked_until | Timestamp | Bloqueio temporário |
| criado_em | Timestamp | Data de criação |
| atualizado_em | Timestamp | Última atualização |

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Visualizar schema no Prisma Studio
npm run prisma:studio
```

---

## 🔌 Endpoints da API

Base URL: `http://localhost:3000/api`

### Tratamentos

#### Listar Tratamentos
```http
GET /api/tratamentos
```

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `ativo` (boolean, optional)
- `search` (string, optional)
- `orderBy` (enum: nome, criadoEm, atualizadoEm, default: criadoEm)
- `order` (enum: asc, desc, default: desc)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nome": "Lentes de Contato Dental",
      "slug": "lentes-de-contato-dental",
      "descricao": "...",
      "imagem": "...",
      "ativo": true,
      "criadoEm": "2025-01-01T00:00:00Z",
      "atualizadoEm": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### Buscar por Slug
```http
GET /api/tratamentos/:slug
```

**Resposta:**
```json
{
  "success": true,
  "data": { /* tratamento */ }
}
```

#### Criar Tratamento (Admin)
```http
POST /api/tratamentos
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nome": "Novo Tratamento",
  "descricao": "Descrição...",
  "slug": "novo-tratamento", // opcional, auto-gerado se omitido
  "imagem": "https://...",
  "ativo": true
}
```

#### Atualizar Tratamento (Admin)
```http
PUT /api/tratamentos/:id
Authorization: Bearer {token}
```

#### Deletar Tratamento (Admin)
```http
DELETE /api/tratamentos/:id
Authorization: Bearer {token}
```

### Agendamentos

#### Criar Agendamento (Público)
```http
POST /api/agendamento
```

**Body:**
```json
{
  "nome": "João Silva",
  "telefone": "(67) 99999-9999",
  "email": "joao@example.com",
  "tratamentoId": "uuid-do-tratamento",
  "dataAgendada": "2025-12-01T10:00:00Z", // opcional
  "notas": "Observações..." // opcional
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(67) 99999-9999",
    "status": "PENDENTE",
    "tratamento": { /* dados do tratamento */ },
    "criadoEm": "2025-01-01T00:00:00Z"
  },
  "message": "Agendamento criado com sucesso. Em breve entraremos em contato!"
}
```

**Rate Limit:** 5 agendamentos por hora por IP

#### Listar Agendamentos (Admin)
```http
GET /api/agendamento
Authorization: Bearer {token}
```

**Query Params:** Similar aos tratamentos + `status`, `tratamentoId`, `dataInicio`, `dataFim`

### Avaliações

#### Listar Avaliações
```http
GET /api/avaliacoes
```

**Query Params:** `page`, `limit`, `aprovado`, `nota`, `orderBy`, `order`

**Nota:** Público só vê avaliações aprovadas (`aprovado=true`)

#### Criar Avaliação (Público)
```http
POST /api/avaliacoes
```

**Body:**
```json
{
  "nome": "Maria Santos",
  "avatar": "MS", // opcional, auto-gerado se omitido
  "nota": 5,
  "texto": "Excelente atendimento!",
  "dataAvaliacao": "2025-01-01T00:00:00Z" // opcional
}
```

**Resposta:** Avaliação criada com `aprovado=false` (requer moderação admin)

### Autenticação

#### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "admin@clinicaodontoazul.com.br",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "user": {
      "id": "uuid",
      "nome": "Administrador",
      "email": "admin@...",
      "role": "ADMIN"
    }
  }
}
```

**Rate Limit:** 5 tentativas a cada 15 minutos

#### Refresh Token
```http
POST /api/auth/refresh
```

**Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

#### Perfil do Usuário
```http
GET /api/auth/profile
Authorization: Bearer {accessToken}
```

### Health Check

```http
GET /health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00Z",
  "uptime": 3600,
  "environment": "production"
}
```

---

## 🔐 Autenticação e Autorização

### JWT Tokens

A API usa **JWT stateless** com dois tokens:

1. **Access Token:** Curta duração (15 minutos por padrão)
   - Incluído em: `Authorization: Bearer {token}`
   - Usado para autenticar requisições

2. **Refresh Token:** Longa duração (7 dias por padrão)
   - Usado para obter novo access token
   - Rotacionado a cada refresh

### Roles

- **ADMIN:** Acesso total (CRUD em tudo)
- **EDITOR:** Acesso limitado (futuro)

### Fluxo de Autenticação

1. Cliente faz login → recebe `accessToken` e `refreshToken`
2. Cliente usa `accessToken` nas requisições autenticadas
3. Quando `accessToken` expira → usar `refreshToken` para obter novo
4. Logout: remover tokens no frontend (stateless)

### Exemplo de Uso

```javascript
// Login
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { accessToken, refreshToken } = await response.json();

// Salvar tokens (localStorage/cookies)

// Requisições autenticadas
const data = await fetch('http://localhost:3000/api/tratamentos', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

## 🛡 Segurança

### Implementado

✅ **Helmet:** Headers de segurança (CSP, HSTS, etc)  
✅ **CORS:** Configurável por origem  
✅ **Rate Limiting:** Proteção contra DDoS/brute force  
✅ **Validação Zod:** Input sanitization  
✅ **Bcrypt:** Hash de senhas (12 rounds)  
✅ **JWT:** Tokens seguros com expiração  
✅ **Prisma:** Proteção SQL injection  
✅ **HTTPS:** Recomendado em produção  
✅ **Lockout:** Bloqueio após 5 tentativas falhadas  

### Headers de Segurança

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

### Rate Limits

- **Geral:** 100 req/15min por IP
- **Login:** 5 tentativas/15min por IP
- **Agendamento:** 5 agendamentos/hora por IP

### Checklist de Produção

- [ ] Alterar `JWT_SECRET` e `JWT_REFRESH_SECRET` para valores fortes (32+ caracteres)
- [ ] Configurar HTTPS (Let's Encrypt)
- [ ] Definir `FRONTEND_URL` correto
- [ ] Configurar email (SendGrid ou SMTP)
- [ ] Habilitar Sentry (opcional mas recomendado)
- [ ] Revisar CORS (`FRONTEND_URL`)
- [ ] Configurar backups do banco
- [ ] Revisar logs e monitoramento

---

## 🚀 Deploy

### Opções de Deploy

#### 1. Docker Compose (Recomendado para VPS)

```bash
# Subir
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar
docker-compose down
```

#### 2. Render.com / Railway / Heroku

1. Conectar repositório Git
2. Configurar variáveis de ambiente
3. Build command: `npm install && npm run migrate:deploy`
4. Start command: `npm start`

#### 3. VPS (Ubuntu/Debian)

```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install postgresql

# Clonar repositório
git clone <repo-url>
cd backend

# Instalar dependências
npm ci --production

# Configurar .env
cp .env.example .env
nano .env

# Executar migrations
npm run migrate:deploy

# Usar PM2 para gerenciar processo
npm install -g pm2
pm2 start src/server.js --name clinica-api
pm2 save
pm2 startup
```

#### 4. DigitalOcean App Platform

1. Conectar repositório
2. Selecionar "Node.js"
3. Build: `npm install && npx prisma generate && npm run migrate:deploy`
4. Run: `npm start`
5. Adicionar variáveis de ambiente

### Configurar Domínio e SSL

```bash
# Usando Nginx como reverse proxy
sudo apt-get install nginx certbot python3-certbot-nginx

# Configurar Nginx
sudo nano /etc/nginx/sites-available/clinica-api

# Conteúdo:
server {
    listen 80;
    server_name api.clinicaodontoazul.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Habilitar site
sudo ln -s /etc/nginx/sites-available/clinica-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Obter certificado SSL
sudo certbot --nginx -d api.clinicaodontoazul.com.br
```

---

## 💻 Integração Frontend

### Exemplos de Uso

#### Buscar Tratamentos

```javascript
// Listar todos
const response = await fetch('http://localhost:3000/api/tratamentos?ativo=true');
const { data, pagination } = await response.json();

// Buscar por slug
const tratamento = await fetch('http://localhost:3000/api/tratamentos/lentes-de-contato-dental');
const { data } = await tratamento.json();
```

#### Criar Agendamento

```javascript
async function criarAgendamento(dados) {
  try {
    const response = await fetch('http://localhost:3000/api/agendamento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        tratamentoId: dados.tratamentoId,
        dataAgendada: dados.dataAgendada || undefined,
        notas: dados.notas || undefined,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Erro ao criar agendamento');
    }

    return result;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

// Uso
await criarAgendamento({
  nome: 'João Silva',
  telefone: '(67) 99999-9999',
  email: 'joao@example.com',
  tratamentoId: 'uuid-do-tratamento',
});
```

#### Buscar Avaliações

```javascript
const response = await fetch('http://localhost:3000/api/avaliacoes?aprovado=true&limit=10');
const { data } = await response.json();
```

#### Criar Avaliação

```javascript
await fetch('http://localhost:3000/api/avaliacoes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Maria Santos',
    nota: 5,
    texto: 'Excelente atendimento!',
  }),
});
```

#### Autenticação

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@clinicaodontoazul.com.br',
    password: 'senha123',
  }),
});

const { accessToken, refreshToken } = await loginResponse.json();

// Salvar tokens (use httpOnly cookies em produção)
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Requisições autenticadas
const token = localStorage.getItem('accessToken');
const data = await fetch('http://localhost:3000/api/tratamentos', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

// Refresh token quando expirar
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('http://localhost:3000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const { accessToken, refreshToken: newRefreshToken } = await response.json();
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', newRefreshToken);
  return accessToken;
}
```

### Tratamento de Erros

```javascript
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      // Erro de validação
      if (response.status === 400) {
        console.error('Erros de validação:', data.error.details);
      }
      // Não autorizado
      else if (response.status === 401) {
        // Tentar refresh token ou redirecionar para login
        await refreshAccessToken();
      }
      // Rate limit
      else if (response.status === 429) {
        alert('Muitas tentativas. Tente novamente mais tarde.');
      }

      throw new Error(data.error?.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}
```

### Configuração CORS

No `.env`, configure:
```env
FRONTEND_URL=https://clinicaodontoazul.com.br,https://www.clinicaodontoazul.com.br
```

Para desenvolvimento local:
```env
FRONTEND_URL=http://localhost:8080
```

---

## 📊 Monitoramento e Logs

### Logging

Logs estruturados com **Pino**:

```javascript
// Níveis de log
logger.info({ userId, action }, 'User logged in');
logger.error({ error, context }, 'Failed to process');
logger.warn({ userId }, 'Multiple failed attempts');
```

**Arquivos de log:**
- `logs/app.log` (produção)
- Console (desenvolvimento)

### Health Check

Endpoint `/health` verifica:
- Status da API
- Conexão com banco de dados
- Uptime do servidor

### Monitoramento (Opcional)

**Sentry:**
```env
SENTRY_DSN=https://...
SENTRY_ENABLED=true
```

### Backups

Script de backup (exemplo):
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/clinica_odonto_$DATE.sql
# Upload para S3 (opcional)
```

**Cronjob (diário):**
```bash
0 2 * * * /path/to/backup.sh
```

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar DATABASE_URL no .env
# Formato correto: postgresql://user:pass@host:port/db?schema=public
```

### Erro: "Prisma Client not generated"

```bash
npx prisma generate
```

### Erro: "Migration failed"

```bash
# Resetar migrations (apenas desenvolvimento)
npx prisma migrate reset

# Aplicar migrations manualmente
npx prisma migrate deploy
```

### Rate Limit Excessivo

Aumentar limites no `.env`:
```env
RATE_LIMIT_WINDOW_MS=3600000  # 1 hora
RATE_LIMIT_MAX_REQUESTS=1000
```

### Email não está sendo enviado

Verificar:
1. `SENDGRID_API_KEY` ou credenciais SMTP configuradas
2. Logs do servidor (modo console se não houver provider)
3. Email de teste no service

---

## 📝 Checklist de Produção

- [ ] Variáveis de ambiente configuradas
- [ ] Secrets fortes (JWT, bcrypt)
- [ ] HTTPS habilitado
- [ ] CORS configurado corretamente
- [ ] Banco de dados em produção
- [ ] Migrations aplicadas
- [ ] Backups configurados
- [ ] Monitoramento (Sentry opcional)
- [ ] Logs configurados
- [ ] Rate limits ajustados
- [ ] Email funcionando
- [ ] Health check respondendo
- [ ] Testes passando

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs: `npm run docker:logs` ou `pm2 logs`
2. Verificar health: `curl http://localhost:3000/health`
3. Verificar banco: `npx prisma studio`
4. Documentação Prisma: https://www.prisma.io/docs

---

**Desenvolvido para Clínica Odonto Azul**  
Versão 1.0.0


