# ⚠️ URL INTERNA vs URL PÚBLICA

## ❌ URL INTERNA (Não use esta!)

```
clinica_numero-7.railway.internal
```

Esta é uma URL **INTERNA** do Railway, só funciona entre serviços dentro da mesma rede Railway.

**NÃO funciona de fora do Railway!**

---

## ✅ URL PÚBLICA (Use esta no Vercel!)

A URL pública geralmente tem este formato:

```
https://clinica-numero-7-production-xxxx.up.railway.app
```

ou

```
https://[seu-servico]-[hash].up.railway.app
```

---

## 🔍 ONDE ENCONTRAR A URL PÚBLICA:

### OPÇÃO 1: Settings → Networking

1. No serviço `clinica_numero-7`
2. Vá em **"Settings"**
3. Role até **"Networking"** ou **"Domain"**
4. Procure por **"Public Domain"** ou **"Generated Domain"**
5. Deve mostrar algo como: `https://clinica-numero-7-production-xxxx.up.railway.app`

### OPÇÃO 2: Gerar Domínio Público

Se não aparecer nenhum domínio público:

1. No serviço `clinica_numero-7`
2. Vá em **"Settings"**
3. Na seção **"Networking"** ou **"Domain"**
4. Clique em **"Generate Domain"** ou **"Add Domain"**
5. O Railway gerará automaticamente uma URL pública

### OPÇÃO 3: Variáveis de Ambiente

1. Vá em **"Variables"**
2. Procure por:
   - `RAILWAY_PUBLIC_DOMAIN`
   - `RAILWAY_STATIC_URL`
   - `PUBLIC_URL`

### OPÇÃO 4: Deployments

1. Vá em **"Deployments"**
2. Clique no deployment mais recente
3. Veja os logs ou detalhes - pode mostrar a URL pública

---

## 🎯 O QUE FAZER:

1. **Encontre a URL PÚBLICA** (não a `.railway.internal`)
2. A URL pública sempre começa com `https://`
3. A URL pública termina com `.up.railway.app`
4. **Para o Vercel, adicione `/api` no final:**
   - URL: `https://clinica-numero-7-production-xxxx.up.railway.app/api`

---

## ⚠️ SE NÃO ENCONTRAR NENHUMA URL PÚBLICA:

O Railway pode não ter gerado automaticamente. Você precisa:

1. Ir em **Settings** → **Networking**
2. Procurar por **"Generate Domain"** ou **"Add Domain"**
3. Clique para gerar um domínio público

OU o serviço pode estar configurado como "Private" - nesse caso, precisa tornar público.

---

**Resumo:** A URL `.railway.internal` é interna. Precisamos da URL que começa com `https://` e termina com `.up.railway.app`!





