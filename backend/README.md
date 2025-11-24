# Clínica Odonto Azul - API Backend

API REST completa para o site da Clínica Odonto Azul, desenvolvida com Node.js, Express, PostgreSQL e Prisma.

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- npm ou yarn

### Instalação Local

1. **Clone e instale dependências:**

```bash
cd backend
npm install
```

2. **Configure as variáveis de ambiente:**

```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

3. **Configure o banco de dados:**

```bash
# Criar e executar migrations
npx prisma migrate dev

# Popular dados iniciais
npm run seed
```

4. **Inicie o servidor:**

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3000/api`

## 🐳 Docker

### Usar Docker Compose (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar serviços
docker-compose down
```

Acesse:
- API: http://localhost:3000
- Adminer (DB): http://localhost:8081

### Build manual

```bash
docker build -t clinica-odonto-api .
docker run -p 3000:3000 --env-file .env clinica-odonto-api
```

## 📚 Documentação da API

### Swagger/OpenAPI

Após iniciar o servidor, acesse:
- Swagger UI: http://localhost:3000/api-docs (quando implementado)

### Endpoints Principais

#### Tratamentos
- `GET /api/tratamentos` - Listar tratamentos (público)
- `GET /api/tratamentos/:slug` - Buscar por slug (público)
- `POST /api/tratamentos` - Criar (admin)
- `PUT /api/tratamentos/:id` - Atualizar (admin)
- `DELETE /api/tratamentos/:id` - Deletar (admin)

#### Agendamentos
- `POST /api/agendamento` - Criar agendamento (público, rate-limited)
- `GET /api/agendamento` - Listar (admin)
- `GET /api/agendamento/:id` - Detalhes (admin)
- `PUT /api/agendamento/:id` - Atualizar (admin)
- `DELETE /api/agendamento/:id` - Deletar (admin)

#### Avaliações
- `GET /api/avaliacoes` - Listar (público - só aprovadas)
- `POST /api/avaliacoes` - Criar (público)
- `PUT /api/avaliacoes/:id` - Atualizar (admin)
- `DELETE /api/avaliacoes/:id` - Deletar (admin)

#### Autenticação
- `POST /api/auth/login` - Login (rate-limited)
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Perfil do usuário logado

#### Health Check
- `GET /health` - Status da API e conexão DB

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Com coverage
npm test -- --coverage

# Modo watch
npm run test:watch
```

## 🔐 Segurança

- Helmet para headers de segurança
- CORS configurável
- Rate limiting em rotas públicas
- Validação com Zod
- JWT com refresh tokens
- Bcrypt para senhas (12 rounds)
- Proteção contra SQL injection (Prisma)
- Input sanitization

## 📝 Scripts Disponíveis

```bash
npm start              # Inicia em produção
npm run dev            # Desenvolvimento com nodemon
npm run migrate        # Executa migrations
npm run seed           # Popula banco com dados iniciais
npm test               # Executa testes
npm run lint           # Verifica código
npm run lint:fix       # Corrige problemas de lint
npm run docker:build   # Build da imagem Docker
npm run docker:up      # Sobe containers com docker-compose
```

## 🌐 Deploy

Veja `DOCUMENTACAO_BACKEND.md` para instruções completas de deploy.

### Variáveis de Ambiente Importantes

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
FRONTEND_URL=https://seu-site.com
EMAIL_FROM=noreply@clinicaodontoazul.com.br
```

## 📞 Suporte

Para mais detalhes, consulte `DOCUMENTACAO_BACKEND.md`.


