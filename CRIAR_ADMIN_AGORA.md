# 🚀 Criar Admin no Railway - GUIA RÁPIDO

## ⚠️ Erro Atual

```
Database operation failed
```

**Causa:** O usuário admin não existe no banco de dados!

---

## ✅ SOLUÇÃO EM 3 PASSOS

### 1️⃣ Configurar ADMIN_PASSWORD (Se não tiver)

No Railway → **"Variables"**:
- Clique em **"+ New Variable"**
- **Key:** `ADMIN_PASSWORD`
- **Value:** `Admin123!@#` (ou sua senha)
- Clique em **"Add"**

---

### 2️⃣ Criar o Admin no Banco

**No Railway:**

1. Vá no serviço **`clinica_numero-7`**
2. Clique em **"Deployments"** (menu superior)
3. Clique no **deployment mais recente**
4. Clique nos **três pontos** (⋯) no canto superior direito
5. Selecione **"Open Terminal"** ou **"View Logs"**

**Se aparecer o terminal, execute:**

```bash
npm run seed:admin
```

**Aguarde aparecer:**
```
✅ Usuário admin criado/atualizado!
```

---

### 3️⃣ Testar Login

1. Acesse: `https://clinica-numero-7.vercel.app/admin.html`
2. **Email:** `admin@clinicaodontoazul.com.br`
3. **Senha:** `Admin123!@#` (ou a que você configurou)

---

## 🆘 Se Não Tiver Terminal no Railway

**Alternativa - Fazer Redeploy:**

1. Railway → **"Deployments"**
2. Três pontos (⋯) → **"Redeploy"**
3. Aguarde o deploy terminar
4. Verifique os logs - deve aparecer mensagens do seed (se configurado)

**Ou execute via SSH (se disponível):**

Entre no terminal via SSH e execute:
```bash
npm run seed:admin
```

---

## ✅ Depois de Criar

O login deve funcionar! Se não funcionar, verifique:
- ✅ `ADMIN_PASSWORD` está configurada no Railway?
- ✅ O seed foi executado com sucesso?
- ✅ Os logs mostram "Admin user created"?

---

**Execute o seed e tente fazer login novamente!** 🚀

