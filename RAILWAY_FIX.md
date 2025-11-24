# 🔧 Correção do Erro no Railway

O erro "Error creating build plan with Railpack" acontece porque o Railway precisa ser configurado corretamente.

## ✅ Solução

### 1. No Railway, configure o Root Directory:

1. Vá no serviço que está falhando
2. Clique em **Settings** (ou Configurações)
3. Na seção **Service**, encontre **Root Directory**
4. Configure como: `backend`
5. Salve as alterações

### 2. Verifique as configurações de Build:

No Railway, em **Settings** → **Build**:

- **Build Command:** Deixe vazio (o Railway usa automaticamente)
- OU configure: `npm install && npx prisma generate`

### 3. Verifique as configurações de Deploy:

No Railway, em **Settings** → **Deploy**:

- **Start Command:** `npm start`
- **Healthcheck Path:** `/health` (opcional)

### 4. Variáveis de Ambiente Obrigatórias:

Certifique-se de ter estas variáveis configuradas:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=sua-chave-secreta-aqui
JWT_REFRESH_SECRET=sua-refresh-secret-aqui
FRONTEND_URL=https://seu-site.vercel.app
```

### 5. Se ainda não funcionar:

1. Delete o serviço atual no Railway
2. Crie um novo serviço
3. Ao selecionar o repositório, escolha:
   - **Repository:** `marcosg432/clinica_numero-7`
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ IMPORTANTE!
4. Adicione o PostgreSQL como banco de dados
5. Configure as variáveis de ambiente
6. Faça o deploy novamente

## 🎯 Configuração Correta Esperada

```
Railway Project
├── Service: clinica_numero-7
│   ├── Root Directory: backend
│   ├── Build Command: (vazio ou npm install && npx prisma generate)
│   ├── Start Command: npm start
│   └── Variables:
│       ├── DATABASE_URL (automático do Postgres)
│       ├── JWT_SECRET
│       ├── JWT_REFRESH_SECRET
│       └── FRONTEND_URL
└── Database: Postgres (criado automaticamente)
```

## 🔄 Após corrigir:

1. O Railway irá redeployar automaticamente
2. Ou você pode forçar um novo deploy clicando em "Redeploy"

