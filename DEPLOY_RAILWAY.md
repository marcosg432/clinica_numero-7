# 🚂 Guia Completo: Deploy no Railway

## Passo 1: Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize o Railway a acessar seu GitHub
5. Selecione o repositório: `marcosg432/clinica_numero-7`

## Passo 2: Configurar o Serviço Backend

⚠️ **IMPORTANTE:** Configure o Root Directory!

1. No projeto criado, você verá o serviço `clinica_numero-7`
2. Clique no serviço
3. Vá em **Settings** (ícone de engrenagem)
4. Na seção **Service**, encontre **Root Directory**
5. **Configure como:** `backend` (sem aspas, apenas `backend`)
6. Clique em **Save**

## Passo 3: Adicionar Banco de Dados PostgreSQL

1. No mesmo projeto Railway, clique em **"New"**
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. O Railway criará automaticamente o banco
5. A variável `DATABASE_URL` será criada automaticamente

## Passo 4: Configurar Build e Deploy

No serviço backend, em **Settings**:

### Build Settings:
- **Build Command:** Deixe vazio (ou `npm install && npx prisma generate`)
- O Railway detecta automaticamente Node.js e executa `npm install`

### Deploy Settings:
- **Start Command:** `npm start`
- **Restart Policy:** ON_FAILURE (padrão)

## Passo 5: Configurar Variáveis de Ambiente

No serviço backend, vá em **Variables** e adicione:

### Variáveis Obrigatórias:

```env
NODE_ENV=production
PORT=3000
```

### JWT Secrets (GERE VALORES ÚNICOS!):

```env
JWT_SECRET=sua-chave-secreta-super-segura-minimo-32-caracteres-aqui
JWT_REFRESH_SECRET=outra-chave-secreta-diferente-minimo-32-caracteres
```

**Para gerar secrets seguros:**
```bash
# No terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend URL:

```env
FRONTEND_URL=https://seu-site.vercel.app
```
(Atualize depois que fizer deploy no Vercel)

### Admin:

```env
ADMIN_EMAIL=admin@clinicaodontoazul.com.br
ADMIN_PASSWORD=SuaSenhaSegura123!@#
```

### Email (Opcional):

```env
SENDGRID_API_KEY=sua-chave-sendgrid
EMAIL_FROM=noreply@clinicaodontoazul.com.br
```

### Database:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```
(Esta variável é criada automaticamente quando você adiciona o PostgreSQL - não precisa adicionar manualmente)

## Passo 6: Executar Migrations

Após o primeiro deploy bem-sucedido:

### Opção 1: Via Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Linkar ao projeto
railway link

# Executar migrations
railway run npx prisma migrate deploy
```

### Opção 2: Via Settings do Railway

1. Vá em **Settings** do serviço backend
2. Em **Deploy**, configure:
   - **Post Deploy Command:** `npx prisma migrate deploy`

### Opção 3: Manual (via terminal do Railway)

1. Clique no serviço
2. Vá em **Deployments**
3. Clique nos três pontos do deployment mais recente
4. Selecione **"Open Shell"**
5. Execute: `npx prisma migrate deploy`

## Passo 7: Verificar Deploy

1. Após o deploy, aguarde alguns segundos
2. No Railway, copie a URL do serviço (ex: `https://xxx.up.railway.app`)
3. Teste o endpoint de health:
   ```
   https://xxx.up.railway.app/health
   ```
4. Deve retornar:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "environment": "production"
   }
   ```

## Passo 8: Criar Usuário Admin

Após as migrations, crie o admin:

### Opção 1: Via Railway Shell

1. Abra o shell do Railway (ver passo 6, opção 3)
2. Execute: `npm run seed:admin`

### Opção 2: Via Script

1. No Railway Shell, execute:
   ```bash
   node criar-admin-rapido.js
   ```

## ✅ Checklist de Verificação

- [ ] Root Directory configurado como `backend`
- [ ] PostgreSQL adicionado e conectado
- [ ] Variável `DATABASE_URL` criada automaticamente
- [ ] `JWT_SECRET` configurado
- [ ] `JWT_REFRESH_SECRET` configurado
- [ ] `FRONTEND_URL` configurado (atualizar depois)
- [ ] Migrations executadas
- [ ] Health check retornando `ok`
- [ ] Usuário admin criado

## 🐛 Problemas Comuns

### Erro: "Error creating build plan"
- **Solução:** Verifique se o Root Directory está configurado como `backend`

### Erro: "Cannot find module"
- **Solução:** Certifique-se que o Root Directory está correto

### Erro: "Prisma Client not generated"
- **Solução:** Verifique se `postinstall` está no package.json (já está configurado)

### Erro de conexão com banco
- **Solução:** Verifique se a variável `DATABASE_URL` está configurada corretamente

### Erro de CORS
- **Solução:** Configure `FRONTEND_URL` com a URL completa do Vercel (ex: `https://xxx.vercel.app`)

## 📞 Próximos Passos

Após o backend estar funcionando:

1. Copie a URL da API do Railway
2. Use essa URL para configurar o `API_URL` no Vercel
3. Faça o deploy do frontend (veja `DEPLOY.md`)

---

**Dica:** Sempre verifique os logs no Railway para ver o que está acontecendo durante o build e deploy!

