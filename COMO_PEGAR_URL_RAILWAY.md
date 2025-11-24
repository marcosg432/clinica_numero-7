# 🔗 COMO PEGAR A URL DO BACKEND NO RAILWAY PARA O VERCEL

## 📍 ONDE ENCONTRAR A URL DO BACKEND:

### PASSO 1: Acesse o Serviço no Railway

1. No Railway, clique no serviço **`clinica_numero-7`** (seu backend)

### PASSO 2: Vá em "Settings"

1. Clique na aba **"Settings"** (ou ícone de engrenagem ⚙️)
2. Role a página até encontrar a seção **"Networking"** ou **"Domain"**

### PASSO 3: Encontre a URL

Você verá algo como:

```
Domain
┌────────────────────────────────────────────────────┐
│ https://clinica-numero-7-production-xxxx.up.railway.app │
│ [🔗 Copy] [Generate Domain]                        │
└────────────────────────────────────────────────────┘
```

**OU** pode estar na aba **"Variables"**:
- Procure por uma variável chamada `RAILWAY_PUBLIC_DOMAIN` ou `RAILWAY_STATIC_URL`

### PASSO 4: Copiar a URL

1. **Clique no botão "Copy"** ou selecione e copie o domínio completo
2. A URL será algo como: `https://clinica-numero-7-production-xxxx.up.railway.app`
3. **IMPORTANTE:** Adicione `/api` no final! Ficará: `https://clinica-numero-7-production-xxxx.up.railway.app/api`

---

## ✅ COMO CONFIGURAR NO VERCEL:

### OPÇÃO 1: Durante o Deploy (Primeira Vez)

1. No Vercel, quando estiver configurando o projeto
2. Antes de clicar em **"Deploy"**, clique em **"Environment Variables"**
3. Adicione:
   - **Key:** `API_URL`
   - **Value:** `https://clinica-numero-7-production-xxxx.up.railway.app/api` (sua URL do Railway + `/api`)
   - Marque: ✅ Production, ✅ Preview, ✅ Development
4. Clique em **"Add"**
5. Depois clique em **"Deploy"**

### OPÇÃO 2: Depois do Deploy (Já tem projeto)

1. No Vercel, vá no seu projeto
2. Clique em **"Settings"** (no topo)
3. Clique em **"Environment Variables"** (menu lateral esquerdo)
4. Clique em **"Add New"** ou **"+"**
5. Preencha:
   - **Key:** `API_URL`
   - **Value:** `https://clinica-numero-7-production-xxxx.up.railway.app/api`
   - Marque: ✅ Production, ✅ Preview, ✅ Development
6. Clique em **"Save"**
7. O Vercel fará redeploy automaticamente

---

## 🎯 RESUMO:

### URL do Railway:
```
https://clinica-numero-7-production-xxxx.up.railway.app
```

### URL para colocar no Vercel (com /api):
```
https://clinica-numero-7-production-xxxx.up.railway.app/api
```

---

## 📍 ONDE ENCONTRAR A URL (Outras opções):

### Se não encontrar em "Settings":

1. **Na aba "Deployments":**
   - Clique na aba "Deployments"
   - Veja se há uma URL visível nos logs ou cards

2. **No card do serviço:**
   - Na tela principal do projeto
   - O card do serviço pode mostrar a URL

3. **Na aba "Variables":**
   - Vá em "Variables"
   - Procure por `RAILWAY_PUBLIC_DOMAIN` ou similar

4. **Gerar Domínio Personalizado:**
   - Se não tiver domínio, o Railway pode gerar automaticamente
   - Em "Settings" → "Networking", clique em "Generate Domain"

---

## ⚠️ IMPORTANTE:

- ✅ **Sempre adicione `/api` no final** da URL do Railway
- ✅ A URL deve começar com `https://`
- ✅ Não esqueça de configurar a variável `API_URL` no Vercel
- ✅ Após configurar, o Vercel fará redeploy automático

---

## 🔍 EXEMPLO COMPLETO:

**1. Railway:**
```
Domínio: https://clinica-numero-7-production-abc123.up.railway.app
```

**2. Vercel - Environment Variable:**
```
Key: API_URL
Value: https://clinica-numero-7-production-abc123.up.railway.app/api
```

**3. No código:**
O frontend usará essa URL automaticamente via `window.API_URL` ou através do `vercel-build.js`.

---

**Dica:** Depois de configurar, teste acessando `https://seu-backend.up.railway.app/health` no navegador para confirmar que está funcionando! 🚀





