# 🚀 Guia de Deploy - Clínica Odonto Azul

Este guia detalha passo a passo como fazer o deploy do projeto na Railway (Backend) e Vercel (Frontend).

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no [Railway.app](https://railway.app)
- Conta no [Vercel.com](https://vercel.com)
- Repositório criado no GitHub: `clinica_numero-7`

## 🎯 Passo 1: Preparar o Repositório no GitHub

1. Abra o terminal no diretório do projeto
2. Inicialize o Git (se ainda não foi feito):

```bash
git init
git add .
git commit -m "Initial commit - Clínica Odonto Azul"
```

3. Conecte ao repositório remoto:

```bash
git remote add origin https://github.com/SEU_USUARIO/clinica_numero-7.git
git branch -M main
git push -u origin main
```

## 🔧 Passo 2: Deploy do Backend (Railway)

### 2.1 Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize o Railway a acessar seu GitHub
5. Selecione o repositório `clinica_numero-7`

### 2.2 Configurar o Backend

1. No projeto criado, clique em **"Add Service"**
2. Selecione **"GitHub Repo"** novamente
3. Selecione o mesmo repositório
4. Na seção **"Settings"**, configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start`

### 2.3 Adicionar Banco de Dados PostgreSQL

1. No mesmo projeto Railway, clique em **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway criará automaticamente o banco
3. A variável `DATABASE_URL` será criada automaticamente

### 2.4 Configurar Variáveis de Ambiente

No serviço do backend, vá em **"Variables"** e adicione:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://seu-site.vercel.app

# DATABASE_URL já será criado automaticamente pelo Railway

# JWT Secrets (GERE VALORES ÚNICOS E SEGUROS!)
JWT_SECRET=seu-jwt-secret-super-seguro-minimo-32-caracteres-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-diferente-minimo-32-caracteres

JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Opcional - configure depois se quiser)
SENDGRID_API_KEY=
EMAIL_FROM=noreply@clinicaodontoazul.com.br
EMAIL_FROM_NAME=Clínica Odonto Azul

# Admin
ADMIN_EMAIL=admin@clinicaodontoazul.com.br
ADMIN_PASSWORD=SuaSenhaSegura123!@#

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AGENDAMENTO_WINDOW_MS=3600000
RATE_LIMIT_AGENDAMENTO_MAX_REQUESTS=5

# Storage
STORAGE_TYPE=local
MAX_FILE_SIZE=5242880
```

**⚠️ IMPORTANTE:**
- Gere valores únicos para `JWT_SECRET` e `JWT_REFRESH_SECRET`
- Use uma senha forte para `ADMIN_PASSWORD`
- Você poderá atualizar o `FRONTEND_URL` depois, quando tiver a URL do Vercel

### 2.5 Executar Migrations

1. Após o primeiro deploy, vá em **"Deployments"**
2. Clique nos três pontos do deployment mais recente
3. Selecione **"View Logs"**
4. Verifique se as migrations foram executadas

Ou execute manualmente:
- No Railway, vá em **"Settings"** do serviço backend
- Na seção **"Deploy"**, adicione um comando customizado:
  - **Post Deploy Command:** `npx prisma migrate deploy`

### 2.6 Criar Usuário Admin

Após o deploy, você pode criar o admin via terminal do Railway ou aguardar o primeiro acesso (se o seed estiver configurado).

### 2.7 Copiar URL da API

1. No serviço backend, clique em **"Settings"**
2. Em **"Networking"**, copie a URL do domínio (ex: `https://backend-production-xxxx.up.railway.app`)
3. **GUARDE ESSA URL!** Você precisará dela para configurar o frontend

## 🌐 Passo 3: Deploy do Frontend (Vercel)

### 3.1 Criar Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New Project"**
3. Importe o repositório `clinica_numero-7`

### 3.2 Configurar o Projeto

Na tela de configuração:

- **Framework Preset:** `Other`
- **Root Directory:** `.` (raiz do projeto, não a pasta backend)
- **Build Command:** (deixe vazio)
- **Output Directory:** `.`
- **Install Command:** (deixe vazio)

### 3.3 Configurar Variáveis de Ambiente

Antes de fazer o deploy, clique em **"Environment Variables"**:

- **Key:** `API_URL`
- **Value:** `https://seu-backend.up.railway.app/api` (use a URL que você copiou do Railway)
- Marque todas as opções (Production, Preview, Development)

### 3.4 Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde o processo (leva alguns segundos)
3. Vercel fornecerá uma URL (ex: `https://clinica-numero-7.vercel.app`)

### 3.5 Atualizar Frontend para Usar a API

Crie um arquivo de configuração que será usado no frontend para apontar para a API de produção.

Adicione no início de cada arquivo HTML principal (`index.html`, `admin.html`):

```html
<script>
  // Configuração da API
  window.API_URL = window.API_URL || (window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://seu-backend.up.railway.app/api');
</script>
```

Ou configure via variável de ambiente do Vercel e use no build.

### 3.6 Atualizar FRONTEND_URL no Railway

1. Volte ao Railway
2. No serviço backend, vá em **"Variables"**
3. Atualize `FRONTEND_URL` com a URL do Vercel:
   ```
   FRONTEND_URL=https://seu-site.vercel.app
   ```
4. Railway fará redeploy automaticamente

## ✅ Passo 4: Verificação Final

### 4.1 Testar a API

Acesse no navegador:
```
https://seu-backend.up.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...,
  "environment": "production"
}
```

### 4.2 Testar o Frontend

1. Acesse: `https://seu-site.vercel.app`
2. Abra o Console do navegador (F12)
3. Verifique se não há erros de conexão com a API
4. Teste fazer login no admin: `https://seu-site.vercel.app/admin.html`

### 4.3 Testar Login Admin

1. Acesse `/admin.html`
2. Use as credenciais:
   - Email: `admin@clinicaodontoazul.com.br`
   - Senha: (a que você definiu em `ADMIN_PASSWORD`)

## 🔄 Deploy Contínuo

Agora, sempre que você fizer push para o GitHub:

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

Ambas as plataformas farão deploy automático:
- **Railway:** Deploy do backend
- **Vercel:** Deploy do frontend

## 🐛 Solução de Problemas

### Backend não inicia
- Verifique os logs no Railway
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique se o `DATABASE_URL` está correto

### Frontend não conecta à API
- Verifique se a variável `API_URL` no Vercel está correta
- Confirme que o backend está rodando (teste `/health`)
- Verifique o CORS no backend (deve incluir a URL do Vercel)

### Erro de CORS
- No Railway, verifique se `FRONTEND_URL` está configurada corretamente
- Deve incluir a URL completa do Vercel (com `https://`)

### Erro 404 no Frontend
- Verifique se o `vercel.json` está na raiz do projeto
- Confirme que os arquivos HTML estão na raiz

## 📞 Próximos Passos

1. Configure domínio customizado (opcional):
   - Vercel: Settings → Domains
   - Railway: Settings → Networking → Custom Domain

2. Configure SSL (já vem incluído nas duas plataformas)

3. Configure backups do banco de dados no Railway

4. Configure monitoramento e logs

---

**Sucesso! 🎉** Seu sistema está no ar!

