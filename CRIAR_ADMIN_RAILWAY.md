# 🔐 Como Criar/Verificar Admin no Railway

## Verificar se Admin Existe

### Opção 1: Via Terminal do Railway

1. No Railway, vá no serviço `clinica_numero-7`
2. Clique em **"Deployments"**
3. Clique nos **três pontos** (⋯) do deployment mais recente
4. Selecione **"Open Terminal"** ou **"View Logs"**
5. Se tiver terminal, execute:
   ```bash
   npm run seed
   ```

### Opção 2: Verificar Logs

1. No Railway, vá em **"Deployments"**
2. Clique no deployment mais recente
3. Veja os logs
4. Procure por mensagens como:
   - `✅ Admin user created: admin@clinicaodontoazul.com.br`
   - `🌱 Starting seed...`

---

## Se o Admin Não Existir - Criar Manualmente

### Via Terminal do Railway:

1. **Abrir Terminal:**
   - Railway → `clinica_numero-7` → Deployments → três pontos → "Open Terminal"

2. **Executar Seed:**
   ```bash
   npm run seed
   ```

3. **Ou criar admin diretamente:**
   ```bash
   node criar-admin-rapido.js
   ```

---

## Configurar Credenciais

### No Railway → Variables:

Adicione (se ainda não tiver):
- **Key:** `ADMIN_PASSWORD`
- **Value:** `Admin123!@#` (ou sua senha escolhida)
- **Key:** `ADMIN_EMAIL` (opcional, já tem padrão)
- **Value:** `admin@clinicaodontoazul.com.br`

---

## Credenciais Padrão

Se não configurar `ADMIN_PASSWORD`:
- **Email:** `admin@clinicaodontoazul.com.br`
- **Senha:** `ChangeMe123!@#` (padrão)

---

## Testar Login

Depois de criar o admin:
1. Acesse: `https://clinica-numero-7.vercel.app/admin.html`
2. Email: `admin@clinicaodontoazul.com.br`
3. Senha: (a que você configurou ou `ChangeMe123!@#`)

---

**O seed cria o admin automaticamente se as variáveis estiverem configuradas!**




