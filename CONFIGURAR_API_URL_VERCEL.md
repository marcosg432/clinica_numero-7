# 🔧 Configurar API_URL no Vercel - URGENTE!

## ⚠️ Problema

O admin está tentando acessar:
```
https://seu-backend.up.railway.app/api/auth/login
```

Mas deveria ser:
```
https://clinicanumero-7-production.up.railway.app/api/auth/login
```

**Causa:** A variável `API_URL` não está configurada no Vercel!

---

## ✅ SOLUÇÃO: Configurar API_URL no Vercel

### Passo 1: Acessar as Variáveis de Ambiente do Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login
3. Clique no projeto **`clinica-numero-7`**
4. No menu superior, clique em **"Settings"**
5. No menu lateral esquerdo, clique em **"Environment Variables"**

### Passo 2: Adicionar a Variável API_URL

1. Clique no botão **"+ Add New"** ou **"+"**
2. Preencha:
   - **Key (Nome):** `API_URL`
   - **Value (Valor):** `https://clinicanumero-7-production.up.railway.app/api`
   - **Environments:** Marque todas:
     - ✅ **Production**
     - ✅ **Preview**
     - ✅ **Development**
3. Clique em **"Save"** ou **"Add"**

### Passo 3: Fazer Redeploy

1. Volte para a página principal do projeto
2. Vá em **"Deployments"**
3. Clique nos **três pontos** (⋯) do deployment mais recente
4. Selecione **"Redeploy"**
5. Confirme clicando em **"Redeploy"** novamente

**OU**

O Vercel pode fazer redeploy automático após adicionar a variável.

---

## ✅ Verificar se Funcionou

1. Após o redeploy, aguarde alguns segundos
2. Recarregue a página do admin: `https://clinica-numero-7.vercel.app/admin.html`
3. Abra o Console (F12)
4. Verifique se aparece:
   - `🔧 Admin - API URL configurada: https://clinicanumero-7-production.up.railway.app/api`
5. Tente fazer login novamente

---

## 📝 Resumo da Configuração

**No Vercel:**
- Key: `API_URL`
- Value: `https://clinicanumero-7-production.up.railway.app/api`
- ✅ Production, Preview, Development

**No Railway:**
- Key: `FRONTEND_URL`
- Value: `https://clinica-numero-7.vercel.app`
- ✅ Já configurado!

---

**Após configurar, os erros devem desaparecer!** ✅




