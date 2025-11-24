# 🔍 VERIFICAR VARIÁVEIS NO RAILWAY (SOLUÇÃO DO CRASH)

## ❌ PROBLEMA:
O deploy está crashando porque faltam variáveis de ambiente obrigatórias.

## ✅ CHECKLIST COMPLETO:

### PASSO 1: Verificar se PostgreSQL está Criado e Conectado

1. No Railway, você vê **DOIS serviços** na tela?
   - ✅ `clinica_numero-7` (backend)
   - ✅ `Postgres` ou `PostgreSQL` (banco de dados)

**Se não tiver PostgreSQL:**
- Clique em **"+ Create"** → **"Database"** → **"Add PostgreSQL"**

---

### PASSO 2: Verificar Variáveis no Serviço `clinica_numero-7`

1. Clique no serviço **`clinica_numero-7`**
2. Vá na aba **"Variables"**
3. Verifique se TODAS estas variáveis existem:

#### ✅ OBRIGATÓRIAS:

| Variável | Status | O que fazer se faltar |
|----------|--------|----------------------|
| `DATABASE_URL` | ⬜ | Pegar do serviço PostgreSQL (ver PASSO 3) |
| `JWT_SECRET` | ⬜ | Criar manualmente (ver PASSO 4) |
| `JWT_REFRESH_SECRET` | ⬜ | Criar manualmente (ver PASSO 4) |

**⚠️ IMPORTANTE:**
- `DATABASE_URL` **NÃO pode estar vazia!**
- `JWT_SECRET` **NÃO pode estar vazia!**
- `JWT_REFRESH_SECRET` **NÃO pode estar vazia!**

---

### PASSO 3: Pegar DATABASE_URL do PostgreSQL

**OPÇÃO A: Variável Compartilhada (MAIS FÁCIL)**

1. No serviço `clinica_numero-7` → **"Variables"**
2. Clique em **"Shared Variable"** ou **"Reference Variable"**
3. Selecione o serviço **PostgreSQL**
4. Selecione a variável **`DATABASE_URL`**
5. Salve

**OPÇÃO B: Copiar Manualmente**

1. Clique no serviço **PostgreSQL**
2. Vá em **"Variables"**
3. Procure por **`DATABASE_URL`** ou **`POSTGRES_URL`**
4. Clique no ícone de **olho** 👁️ para revelar
5. Clique no ícone de **copiar** 📋
6. Volte ao serviço `clinica_numero-7` → **"Variables"**
7. Se `DATABASE_URL` não existir, clique em **"+ New Variable"**
8. **Key:** `DATABASE_URL`
9. **Value:** Cole o valor que copiou
10. Salve

---

### PASSO 4: Criar JWT_SECRET e JWT_REFRESH_SECRET

**Se essas variáveis não existirem ou estiverem vazias:**

1. No serviço `clinica_numero-7` → **"Variables"**
2. Clique em **"+ New Variable"**

#### Para JWT_SECRET:

- **Key:** `JWT_SECRET`
- **Value:** Digite uma string aleatória longa, por exemplo:
  ```
  clinica-odonto-azul-jwt-secret-2025-xyz-abc-123456789-abcdefgh
  ```
  (Use qualquer string longa e única - mínimo 32 caracteres)
- Clique em **"Save"**

#### Para JWT_REFRESH_SECRET:

- **Key:** `JWT_REFRESH_SECRET` (⚠️ COM "J" no início!)
- **Value:** Digite uma string **DIFERENTE** da anterior, por exemplo:
  ```
  clinica-odonto-azul-refresh-secret-2025-xyz-def-987654321-ijklmnop
  ```
  (Use qualquer string longa e única - mínimo 32 caracteres)
- Clique em **"Save"**

---

### PASSO 5: Verificar Nomes Corretos

**⚠️ ERRO COMUM:** Variável com nome errado!

Verifique se o nome está **EXATAMENTE** assim:
- ✅ `DATABASE_URL` (não `DATABASE` ou `DB_URL`)
- ✅ `JWT_SECRET` (não `WT_SECRET` ou `JWT`)
- ✅ `JWT_REFRESH_SECRET` (não `WT_REFRESH_SECRET` ou `JWT_REFRESH`)

**Se tiver nomes errados:**
1. Delete a variável com nome errado
2. Crie uma nova com o nome correto

---

### PASSO 6: Verificar Valores Não Vazios

Todas as 3 variáveis obrigatórias devem ter valores:

1. `DATABASE_URL` → deve começar com `postgresql://`
2. `JWT_SECRET` → deve ter pelo menos 32 caracteres
3. `JWT_REFRESH_SECRET` → deve ter pelo menos 32 caracteres

**Se alguma estiver vazia:**
- `DATABASE_URL` vazia → Veja PASSO 3
- `JWT_SECRET` vazia → Veja PASSO 4
- `JWT_REFRESH_SECRET` vazia → Veja PASSO 4

---

### PASSO 7: Aguardar Redeploy

Após configurar todas as variáveis:

1. O Railway fará **redeploy automático** em alguns segundos
2. Vá em **"Deployments"** para ver o progresso
3. Aguarde alguns minutos
4. Clique no deployment mais recente
5. Vá em **"Deploy Logs"**
6. Verifique se não há mais erros

---

## 🎯 RESUMO RÁPIDO:

### Variáveis OBRIGATÓRIAS no Railway:

```
✅ DATABASE_URL = postgresql://... (do serviço PostgreSQL)
✅ JWT_SECRET = sua-chave-secreta-longa-aqui
✅ JWT_REFRESH_SECRET = outra-chave-secreta-diferente-aqui
```

### Checklist Final:

- [ ] PostgreSQL criado no Railway?
- [ ] `DATABASE_URL` existe e não está vazia?
- [ ] `JWT_SECRET` existe e não está vazia?
- [ ] `JWT_REFRESH_SECRET` existe e não está vazia?
- [ ] Todos os nomes estão corretos (sem erros de digitação)?
- [ ] Redeploy iniciado?

---

## 🆘 AINDA ESTÁ CRASHANDO?

Envie:
1. Screenshot da aba **"Variables"** do serviço `clinica_numero-7`
2. Últimas linhas dos **"Deploy Logs"** (role até o final e copie o erro)

Assim posso identificar o problema específico! 🔧





