# 🔐 Instruções para Fazer Login no Painel Admin

## Problema: Erro "Invalid credentials"

O erro ocorre porque o usuário admin ainda não foi criado no banco de dados.

## ✅ Solução

### Passo 1: Executar o Seed

Execute um dos arquivos abaixo para criar o usuário admin:

**Opção 1 (Recomendado):**
```
Duplo clique em: criar-admin.cmd
```

**Opção 2 (Manual):**
```bash
cd backend
npm run seed
```

### Passo 2: Verificar Credenciais

Depois de executar o seed, use estas credenciais:

- **Email:** `admin@clinicaodontoazul.com.br`
- **Senha:** `ChangeMe123!@#`

*(Ou a senha definida no arquivo `backend/.env` como `ADMIN_PASSWORD`)*

### Passo 3: Fazer Login

1. Abra o painel admin: http://localhost:5000/admin.html
2. As credenciais já devem estar preenchidas
3. Clique em "Entrar"

## 🔧 Se ainda não funcionar

### Verificar se o backend está rodando:
```bash
# Testar se o backend está respondendo
curl http://localhost:3000/health
```

### Verificar se o seed foi executado:
1. O seed deve mostrar mensagens como:
   - ✅ Admin user created: admin@clinicaodontoazul.com.br
   - ✅ Created 5 tratamentos
   - ✅ Created 5 avaliações

### Verificar a senha no .env:
1. Abra o arquivo: `backend/.env`
2. Procure por: `ADMIN_PASSWORD=`
3. Use essa senha se estiver diferente de `ChangeMe123!@#`

### Executar o seed novamente:
```bash
cd backend
npm run seed
```

## 📝 Nota

O seed limpa dados antigos em modo desenvolvimento e recria tudo do zero, então é seguro executar múltiplas vezes.


