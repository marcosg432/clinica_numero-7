# 🔗 COMO OBTER O DATABASE_URL NO RAILWAY

## 📍 O QUE É DATABASE_URL?

É a string de conexão com o banco PostgreSQL. Tem este formato:
```
postgresql://usuario:senha@host:porta/nome_do_banco?schema=public
```

## ✅ OPÇÃO 1: Usar Variável Compartilhada (MAIS FÁCIL)

Se você já tem um serviço PostgreSQL no Railway:

1. **No serviço PostgreSQL:**
   - Clique no serviço PostgreSQL (não no clinica_numero-7)
   - Vá na aba **"Variables"**
   - Procure por `DATABASE_URL` ou `POSTGRES_URL`
   - **NÃO COPIE O VALOR!** Apenas anote o nome da variável

2. **No serviço clinica_numero-7:**
   - Vá em **"Variables"**
   - Clique em **"Shared Variable"** ou **"Reference Variable"**
   - Selecione o serviço PostgreSQL
   - Selecione a variável `DATABASE_URL`
   - Salve

**Pronto!** O Railway conecta automaticamente.

---

## ✅ OPÇÃO 2: Copiar o Valor Manualmente

Se a opção 1 não funcionar:

1. **No serviço PostgreSQL:**
   - Clique no serviço PostgreSQL
   - Vá em **"Variables"** ou **"Connect"**
   - Procure por `DATABASE_URL` ou `POSTGRES_URL`
   - Clique no ícone de **"olho"** 👁️ para revelar o valor
   - Clique no ícone de **"copiar"** 📋 para copiar

2. **No serviço clinica_numero-7:**
   - Vá em **"Variables"**
   - Clique nos três pontos (...) ao lado de `DATABASE_URL`
   - Clique em **"Edit"**
   - Cole o valor que copiou
   - Salve

---

## ✅ OPÇÃO 3: Criar PostgreSQL Novo (Se não tiver)

Se você **NÃO TEM** um serviço PostgreSQL ainda:

1. **No projeto Railway:**
   - Clique em **"New"** ou **"+"** (no topo ou na lateral)
   - Selecione **"Database"**
   - Escolha **"Add PostgreSQL"**
   - O Railway criará automaticamente

2. **A DATABASE_URL será criada automaticamente:**
   - O Railway cria a variável `DATABASE_URL` automaticamente
   - Ela fica disponível para todos os serviços do projeto
   - No serviço `clinica_numero-7`, use a **OPÇÃO 1** acima para referenciar

---

## 🎯 FORMATO ESPERADO DO DATABASE_URL

O valor deve ser algo assim:
```
postgresql://postgres:senha@containers-us-west-xxx.railway.app:5432/railway?schema=public
```

**NÃO EDITE MANUALMENTE!** Use sempre o valor que o Railway fornece.

---

## ⚠️ IMPORTANTE

- **NUNCA** compartilhe o `DATABASE_URL` publicamente (contém senha!)
- **NUNCA** edite manualmente (deixe o Railway gerenciar)
- Use **variáveis compartilhadas** quando possível (mais seguro)

---

## 🔍 ONDE ENCONTRAR NO RAILWAY?

### Se você TEM PostgreSQL:
1. No projeto Railway, você verá um card com nome tipo "Postgres" ou "PostgreSQL"
2. Clique nele
3. Vá em **"Variables"**
4. Procure `DATABASE_URL`

### Se você NÃO TEM PostgreSQL:
1. Crie um novo (OPÇÃO 3 acima)
2. Depois use OPÇÃO 1 ou 2

---

## ✅ CHECKLIST

- [ ] Tenho um serviço PostgreSQL no Railway?
  - [ ] SIM → Use OPÇÃO 1 ou 2
  - [ ] NÃO → Use OPÇÃO 3 primeiro
- [ ] `DATABASE_URL` está preenchida no serviço `clinica_numero-7`?
- [ ] O valor não está vazio?
- [ ] Salvei as alterações?

---

**Depois de configurar, o Railway fará redeploy automaticamente! 🚀**






