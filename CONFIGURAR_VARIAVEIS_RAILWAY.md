# 🔧 CONFIGURAR VARIÁVEIS NO RAILWAY

## ❌ Erro Atual:
```
Missing required environment variables: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
```

## ✅ Solução Passo a Passo:

### PASSO 1: Criar Banco PostgreSQL

1. No Railway, no seu projeto (não no serviço), clique em **"New"** ou **"+"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. O Railway criará automaticamente um banco PostgreSQL
4. Copie a **DATABASE_URL** que aparecer (ou será criada automaticamente)

### PASSO 2: Adicionar Variáveis no Serviço

1. Clique no serviço **clinica_numero-7**
2. Clique na aba **"Variables"** (ao lado de Deployments, Metrics, Settings)
3. Você verá uma lista de variáveis ou um botão **"New Variable"**

### PASSO 3: Adicionar JWT_SECRET

1. Clique em **"New Variable"** ou **"+"** ou **"Add Variable"**
2. **Key (Nome):** `JWT_SECRET`
3. **Value (Valor):** Digite uma string aleatória longa e segura, por exemplo:
   ```
   minha-chave-jwt-super-secreta-12345-abcdef-67890
   ```
   Ou gere uma aleatória (use qualquer string longa, pode ser simples por enquanto)
4. Clique em **"Add"** ou **"Save"**

### PASSO 4: Adicionar JWT_REFRESH_SECRET

1. Clique em **"New Variable"** novamente
2. **Key (Nome):** `JWT_REFRESH_SECRET`
3. **Value (Valor):** Digite uma string DIFERENTE da anterior, por exemplo:
   ```
   minha-chave-refresh-diferente-xyz-98765
   ```
4. Clique em **"Add"** ou **"Save"**

### PASSO 5: Verificar DATABASE_URL

1. Se você criou o PostgreSQL (PASSO 1), a variável `DATABASE_URL` deve aparecer automaticamente
2. Se não aparecer:
   - No serviço PostgreSQL que você criou, procure por **"Connect"** ou **"Variables"**
   - Copie o valor de `DATABASE_URL`
   - Vá no serviço **clinica_numero-7** → **Variables**
   - Adicione manualmente:
     - **Key:** `DATABASE_URL`
     - **Value:** Cole o valor que copiou

### PASSO 6: Conectar PostgreSQL ao Serviço

1. No serviço **clinica_numero-7**, vá em **Settings**
2. Procure por **"Connected Services"** ou **"Dependencies"**
3. Se não tiver, a `DATABASE_URL` já deve estar disponível automaticamente via variável de ambiente

### PASSO 7: Aguardar Redeploy

Após adicionar as variáveis:
- O Railway fará **redeploy automático**
- Aguarde alguns minutos
- Veja os logs para verificar se funcionou

---

## 📋 Checklist Final:

- [ ] PostgreSQL criado no projeto Railway
- [ ] `DATABASE_URL` aparece nas variáveis (automático ou manual)
- [ ] `JWT_SECRET` adicionado manualmente
- [ ] `JWT_REFRESH_SECRET` adicionado manualmente
- [ ] Redeploy iniciado automaticamente

---

## 🎯 Valores de Exemplo (Use valores únicos e seguros!)

```
JWT_SECRET=clinica-odonto-azul-jwt-secret-2025-xyz-123
JWT_REFRESH_SECRET=clinica-odonto-azul-refresh-secret-2025-abc-456
DATABASE_URL=postgresql://postgres:senha@host:5432/banco (automático do Railway)
```

---

**Após configurar, o Railway fará redeploy e deve funcionar! 🚀**






