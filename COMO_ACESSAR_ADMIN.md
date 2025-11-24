# 🔐 Como Acessar o Painel Administrativo

## 🌐 Em Produção (Vercel)

### URL do Painel Admin:
```
https://clinica-numero-7.vercel.app/admin.html
```

**OU a URL completa do seu site no Vercel:**
```
https://[sua-url-do-vercel].vercel.app/admin.html
```

---

## 💻 Em Desenvolvimento Local

### URL do Painel Admin:
```
http://localhost:8080/admin.html
```

*(Se você estiver usando outro servidor local, ajuste a porta)*

---

## 🔑 Credenciais de Acesso

### Email:
```
admin@clinicaodontoazul.com.br
```

### Senha:
A senha padrão é definida pela variável `ADMIN_PASSWORD` no Railway.

**Se não tiver configurado, pode ser:**
```
ChangeMe123!@#
```

**OU verificar no Railway:**
1. Acesse o Railway
2. Vá no serviço `clinica_numero-7`
3. Clique em **"Variables"**
4. Procure por **`ADMIN_PASSWORD`**
5. Use a senha que está configurada lá

---

## ⚠️ Se o Admin Não Foi Criado

Se você receber erro "Invalid credentials" ou "User not found", o usuário admin precisa ser criado:

### Opção 1: Via Seed (Automático)
O seed cria o admin automaticamente se você tiver executado durante o deploy.

### Opção 2: Via Railway Terminal
1. No Railway, vá no serviço `clinica_numero-7`
2. Clique em **"Deployments"**
3. Clique nos **três pontos** do deployment mais recente
4. Selecione **"Open Terminal"** ou **"View Logs"**
5. Execute:
   ```bash
   npm run seed
   ```

### Opção 3: Criar Manualmente
Execute no terminal do Railway:
```bash
cd backend
node criar-admin-rapido.js
```

---

## 📝 Passo a Passo para Fazer Login

1. **Acesse a URL do admin:**
   - Produção: `https://clinica-numero-7.vercel.app/admin.html`
   - Local: `http://localhost:8080/admin.html`

2. **Preencha as credenciais:**
   - Email: `admin@clinicaodontoazul.com.br`
   - Senha: (verificar no Railway)

3. **Clique em "Entrar"**

4. **Se funcionar:**
   - Você verá o painel administrativo
   - Poderá gerenciar Tratamentos, Agendamentos e Avaliações

5. **Se não funcionar:**
   - Verifique se o backend está online
   - Verifique as credenciais no Railway
   - Execute o seed para criar o admin

---

## 🔍 Verificar se o Backend Está Online

Teste se o backend está respondendo:

**Produção:**
```
https://clinicanumero-7-production.up.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...,
  "environment": "production"
}
```

---

## 🐛 Problemas Comuns

### Erro: "Erro de conexão"
- **Causa:** Backend offline ou URL da API incorreta
- **Solução:** Verificar se o backend está rodando no Railway

### Erro: "Invalid credentials"
- **Causa:** Admin não foi criado ou senha errada
- **Solução:** Executar o seed ou verificar `ADMIN_PASSWORD` no Railway

### Erro: CORS
- **Causa:** `FRONTEND_URL` não configurada no Railway
- **Solução:** Adicionar URL do Vercel em `FRONTEND_URL` no Railway

---

## ✅ Checklist

- [ ] Backend está online (teste `/health`)
- [ ] URL do admin acessível (`/admin.html`)
- [ ] Credenciais corretas (email e senha)
- [ ] `FRONTEND_URL` configurada no Railway
- [ ] `API_URL` configurada no Vercel

---

**URL do Admin:** `https://clinica-numero-7.vercel.app/admin.html` 🔐




