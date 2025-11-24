# 🔧 COMO COLOCAR A URL NO VERCEL

## 📍 ONDE CONFIGURAR:

### PASSO 1: Acesse seu Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login
3. Clique no seu projeto (ou crie um novo se ainda não tiver)

### PASSO 2: Vá em Settings

1. No topo da página do projeto, clique na aba **"Settings"**
2. No menu lateral esquerdo, clique em **"Environment Variables"**

### PASSO 3: Adicionar a Variável

1. Clique no botão **"Add New"** ou **"+"** (geralmente no canto superior direito)
2. Preencha os campos:
   - **Key (Nome):** `API_URL`
   - **Value (Valor):** Cole a URL do Railway + `/api`
     - Exemplo: `https://clinica-numero-7-production-xxxx.up.railway.app/api`
   - Marque as opções:
     - ✅ **Production**
     - ✅ **Preview**  
     - ✅ **Development**
3. Clique em **"Save"** ou **"Add"**

### PASSO 4: Redeploy (se já tiver deployado)

Se o projeto já foi deployado:
- O Vercel fará redeploy automático após adicionar a variável
- Ou você pode clicar manualmente em **"Redeploy"** no último deployment

---

## 🎯 EXEMPLO COMPLETO:

### URL do Railway:
```
https://clinica-numero-7-production-abc123.up.railway.app
```

### Valor para colocar no Vercel (com /api):
```
https://clinica-numero-7-production-abc123.up.railway.app/api
```

### Configuração no Vercel:
```
Key: API_URL
Value: https://clinica-numero-7-production-abc123.up.railway.app/api
✅ Production
✅ Preview
✅ Development
```

---

## 🆕 SE AINDA NÃO CRIOU O PROJETO NO VERCEL:

### Durante a criação do projeto:

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Importe o repositório `clinica_numero-7`
4. **ANTES de clicar em "Deploy"**, clique em **"Environment Variables"**
5. Adicione:
   - **Key:** `API_URL`
   - **Value:** `https://sua-url-do-railway.up.railway.app/api`
   - Marque: ✅ Production, ✅ Preview, ✅ Development
6. Depois clique em **"Deploy"**

---

## 📍 CAMINHO COMPLETO NO VERCEL:

```
Vercel Dashboard
  └── Seu Projeto (clinica_numero-7)
      └── Settings (aba no topo)
          └── Environment Variables (menu lateral esquerdo)
              └── Add New / +
                  └── Key: API_URL
                  └── Value: https://sua-url.up.railway.app/api
                  └── ✅ Production, Preview, Development
                  └── Save
```

---

## ⚠️ IMPORTANTE:

- ✅ **Sempre adicione `/api` no final** da URL do Railway
- ✅ A URL deve começar com `https://`
- ✅ Marque todas as opções (Production, Preview, Development)
- ✅ Após salvar, o Vercel fará redeploy automaticamente

---

## ✅ VERIFICAÇÃO:

Depois de configurar:

1. Vá em **"Deployments"** no Vercel
2. Aguarde o deploy terminar
3. Clique no deployment
4. Veja os logs - não deve ter erros relacionados à API

**Pronto!** Agora o frontend vai usar a URL do backend automaticamente! 🚀





