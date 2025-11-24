# Clínica Odonto Azul

Sistema completo para gestão de uma clínica odontológica, incluindo website público, painel administrativo e API REST.

## 🚀 Tecnologias

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Hospedado na **Vercel**

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL (Railway)
- JWT Authentication
- Hospedado na **Railway**

## 📁 Estrutura do Projeto

```
clinica_numero-7/
├── assets/              # CSS, JS e imagens do frontend
├── backend/             # API REST
│   ├── src/
│   │   ├── config/      # Configurações
│   │   ├── controllers/ # Controladores
│   │   ├── routes/      # Rotas da API
│   │   ├── services/    # Lógica de negócio
│   │   └── server.js    # Servidor Express
│   └── prisma/          # Schema e migrations
├── *.html               # Páginas do frontend
└── vercel.json          # Configuração Vercel
```

## 🔧 Configuração e Deploy

### 1. Deploy do Backend (Railway)

1. Acesse [Railway.app](https://railway.app)
2. Crie uma nova conta ou faça login
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Conecte o repositório `clinica_numero-7`
5. Selecione a pasta `backend` como root directory
6. Adicione as variáveis de ambiente:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://seu-site.vercel.app

# Database (Railway cria automaticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secrets (gere valores únicos e seguros)
JWT_SECRET=seu-jwt-secret-super-seguro-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-diferente-aqui

# Email (opcional)
SENDGRID_API_KEY=sua-chave-sendgrid
EMAIL_FROM=noreply@clinicaodontoazul.com.br

# Admin
ADMIN_EMAIL=admin@clinicaodontoazul.com.br
ADMIN_PASSWORD=SuaSenhaSegura123!@#

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

7. Após o deploy, Railway irá:
   - Executar `prisma generate`
   - Executar migrations automaticamente
   - Iniciar o servidor

8. **Copie a URL da API** (ex: `https://seu-backend.up.railway.app`)

### 2. Deploy do Frontend (Vercel)

1. Acesse [Vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "Add New Project"
4. Importe o repositório `clinica_numero-7`
5. Configure o projeto:
   - **Framework Preset:** Other
   - **Root Directory:** `.` (raiz do projeto)
   - **Build Command:** (deixe vazio)
   - **Output Directory:** `.`

6. Adicione variável de ambiente:
   - **Key:** `API_URL`
   - **Value:** `https://seu-backend.up.railway.app/api`

7. Deploy!

### 3. Configuração do Frontend para Produção

Após fazer o deploy, atualize os arquivos JavaScript para usar a variável de ambiente:

1. No Vercel, vá em **Settings → Environment Variables**
2. Adicione: `API_URL` = `https://seu-backend.up.railway.app/api`
3. No código, a variável será acessível via `window.API_URL` ou `process.env.API_URL`

## 🔐 Credenciais Padrão do Admin

Após o primeiro deploy:

- **Email:** admin@clinicaodontoazul.com.br
- **Senha:** (a definida na variável `ADMIN_PASSWORD` no Railway)

**Importante:** Altere a senha após o primeiro login!

## 📝 Scripts Disponíveis

### Backend

```bash
cd backend

# Desenvolvimento
npm run dev

# Produção
npm start

# Migrations
npm run migrate:deploy

# Seed (criar admin)
npm run seed:admin
```

## 🔄 Atualizações e Deploy Contínuo

Tanto Railway quanto Vercel fazem deploy automático quando você faz push para o repositório:

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

## 🛠️ Desenvolvimento Local

### Backend

```bash
cd backend
npm install
cp env.example .env
# Configure o .env
npm run dev
```

### Frontend

```bash
# Use qualquer servidor HTTP simples
python -m http.server 8080
# ou
npx serve
```

## 📞 Suporte

Para problemas ou dúvidas sobre o deploy:
1. Verifique os logs no Railway (backend)
2. Verifique os logs no Vercel (frontend)
3. Verifique as variáveis de ambiente em ambas as plataformas

## 📄 Licença

MIT

---

**Desenvolvido para Clínica Odonto Azul** 🦷

