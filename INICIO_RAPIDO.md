# 🚀 Início Rápido - Deploy Clínica Odonto Azul

## ✅ O que foi configurado

✅ Arquivos para GitHub criados
✅ Configuração para Vercel (Frontend)
✅ Configuração para Railway (Backend)
✅ Prisma atualizado para PostgreSQL
✅ Scripts de build configurados
✅ URLs dinâmicas da API configuradas

## 📝 Próximos Passos

### 1. Subir para GitHub (5 minutos)

```bash
git init
git add .
git commit -m "Initial commit - Clínica Odonto Azul"
git remote add origin https://github.com/SEU_USUARIO/clinica_numero-7.git
git branch -M main
git push -u origin main
```

**Veja:** `SETUP_GITHUB.md` para detalhes

### 2. Deploy Backend no Railway (10 minutos)

**⚠️ IMPORTANTE:** Se der erro "Error creating build plan", veja `CORRIGIR_RAILWAY.md`

1. Acesse [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Selecione `clinica_numero-7`
4. **CRÍTICO:** Configure Root Directory como `backend` (veja `CORRIGIR_RAILWAY.md`)
5. Adicione PostgreSQL database
6. Configure variáveis de ambiente (veja `DEPLOY_RAILWAY.md`)
7. **Copie a URL da API** (ex: `https://xxx.up.railway.app`)

**Veja:** `DEPLOY_RAILWAY.md` para guia completo passo a passo

### 3. Deploy Frontend no Vercel (5 minutos)

1. Acesse [vercel.com](https://vercel.com)
2. Add New Project → Import do GitHub
3. Selecione `clinica_numero-7`
4. Configure:
   - Framework: Other
   - Root Directory: `.`
5. Adicione variável de ambiente:
   - `API_URL` = URL do Railway (ex: `https://xxx.up.railway.app/api`)
6. Deploy!

**Veja:** `DEPLOY.md` seção "Passo 3" para detalhes completos

### 4. Atualizar FRONTEND_URL no Railway

No Railway, atualize a variável:
- `FRONTEND_URL` = URL do Vercel (ex: `https://xxx.vercel.app`)

## 📋 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub
- [ ] Backend deployado no Railway
- [ ] Frontend deployado no Vercel
- [ ] Variável `API_URL` configurada no Vercel
- [ ] Variável `FRONTEND_URL` configurada no Railway
- [ ] Testado `/health` no backend
- [ ] Testado site no frontend
- [ ] Testado login admin

## 🔑 Credenciais Admin Padrão

Após o deploy:
- **Email:** `admin@clinicaodontoazul.com.br`
- **Senha:** (a que você definiu em `ADMIN_PASSWORD` no Railway)

## 📚 Documentação Completa

- `DEPLOY.md` - Guia completo de deploy passo a passo
- `README.md` - Documentação geral do projeto
- `SETUP_GITHUB.md` - Como configurar o GitHub

## 🆘 Problemas?

1. Verifique os logs no Railway (backend)
2. Verifique os logs no Vercel (frontend)
3. Verifique as variáveis de ambiente
4. Teste o endpoint `/health` do backend

---

**Boa sorte com o deploy! 🎉**

