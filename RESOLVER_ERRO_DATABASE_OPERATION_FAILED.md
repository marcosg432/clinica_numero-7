# 🔧 Resolver Erro "Database operation failed"

## ⚠️ Problema

Ao tentar fazer login no admin, aparece o erro:
```
Database operation failed
```

**Causa:** O usuário admin provavelmente não existe no banco de dados do Railway!

---

## ✅ SOLUÇÃO: Criar o Usuário Admin

### Passo 1: Configurar Variáveis no Railway

1. No Railway, vá em **"Variables"** (a mesma tela que você estava)
2. Verifique se tem essas variáveis:
   - ✅ `DATABASE_URL` (já deve estar configurada)
   - ❓ `ADMIN_EMAIL` (opcional - padrão: `admin@clinicaodontoazul.com.br`)
   - ❓ `ADMIN_PASSWORD` (OBRIGATÓRIO - senha do admin)
   - ❓ `ADMIN_NAME` (opcional - padrão: `Administrador`)

3. **Se não tiver `ADMIN_PASSWORD`, adicione:**
   - Clique em **"+ New Variable"**
   - **Key:** `ADMIN_PASSWORD`
   - **Value:** Escolha uma senha segura (ex: `Admin123!@#`)
   - Clique em **"Add"**

### Passo 2: Criar o Admin no Banco de Dados

#### Opção A: Via Terminal do Railway (Recomendado)

1. No Railway, vá no serviço **`clinica_numero-7`**
2. Clique em **"Deployments"**
3. Clique nos **três pontos** (⋯) do deployment mais recente
4. Selecione **"Open Terminal"** ou **"View Logs"**
5. Se aparecer o terminal, execute:

```bash
npm run seed:admin
```

**OU:**

```bash
node criar-admin-rapido.js
```

**OU:**

```bash
npm run seed
```

---

#### Opção B: Via Logs do Railway (Verificar se já foi criado)

1. No Railway, vá em **"Deployments"**
2. Clique no deployment mais recente
3. Veja os logs
4. Procure por mensagens como:
   - `✅ Admin user created: admin@clinicaodontoazul.com.br`
   - `🌱 Starting seed...`

---

#### Opção C: Via Script de Build (Automático)

O script `postinstall` no `package.json` executa automaticamente:
```json
"postinstall": "prisma generate && prisma migrate deploy"
```

Mas ele **NÃO** executa o seed automaticamente. Você precisa executar manualmente!

---

### Passo 3: Verificar se Funcionou

Após executar o seed:

1. **Verifique os logs do Railway:**
   - Deve aparecer: `✅ Admin user created: admin@clinicaodontoazul.com.br`

2. **Tente fazer login:**
   - Acesse: `https://clinica-numero-7.vercel.app/admin.html`
   - Email: `admin@clinicaodontoazul.com.br`
   - Senha: (a que você configurou em `ADMIN_PASSWORD`, ou `ChangeMe123!@#` se não configurou)

---

## 🔍 Verificar Erro Específico nos Logs

Se o erro persistir, verifique os logs do Railway:

1. No Railway → **"Deployments"** → clique no deployment mais recente
2. Veja os logs em tempo real
3. Procure por erros relacionados a:
   - Prisma errors
   - Database connection
   - Authentication errors

**Erros comuns:**
- `P2002`: Email já existe (OK, o admin já existe!)
- `P2025`: Usuário não encontrado (precisa criar o admin)
- `Can't reach database server`: Problema de conexão (verificar `DATABASE_URL`)

---

## 📝 Resumo das Ações

1. ✅ Configurar `ADMIN_PASSWORD` no Railway (se não tiver)
2. ✅ Executar `npm run seed:admin` no terminal do Railway
3. ✅ Verificar logs: deve aparecer "Admin user created"
4. ✅ Tentar fazer login novamente

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique se o banco está conectado:**
   - Railway → **"Variables"** → verifique se `DATABASE_URL` está configurada corretamente
   
2. **Verifique os logs do Railway:**
   - Procure por erros específicos do Prisma

3. **Tente criar o admin manualmente via Prisma Studio:**
   - (Mais complexo, requer acesso ao banco diretamente)

---

**Após criar o admin, o login deve funcionar!** ✅



