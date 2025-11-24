# 🚀 Deploy Manual no Vercel

## Método 1: Interface Web (Mais Fácil) ✅

### Redeploy do Último Deployment:
1. Acesse [vercel.com](https://vercel.com)
2. Faça login
3. Clique no projeto **`clinica-numero-7`**
4. Na seção do deployment mais recente:
   - Clique no botão **"Redeploy"** (ou nos três pontos **⋯** → **"Redeploy"**)
5. Confirme clicando em **"Redeploy"** novamente
6. Aguarde o processo (leva alguns segundos)

### Criar Novo Deployment:
1. No projeto, clique em **"Deployments"** no menu superior
2. Clique em **"Create Deployment"**
3. Selecione:
   - **Branch:** `main` (ou outra branch)
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build Command:** `node vercel-build.js`
   - **Output Directory:** `public`
4. Clique em **"Deploy"**

---

## Método 2: CLI do Vercel (Terminal)

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Passo 2: Fazer Login
```bash
vercel login
```
- Vai abrir o navegador para você fazer login
- Autorize o acesso

### Passo 3: Deploy Manual
```bash
cd "C:\Users\andre\OneDrive\Área de Trabalho\Cópia_de_numero_7"

# Deploy para Preview (não é produção)
vercel

# OU Deploy direto para Produção
vercel --prod
```

### Configurar Projeto (Primeira vez):
```bash
# Na primeira vez, ele vai perguntar:
# - Set up and deploy? → Y
# - Which scope? → Seu usuário (marcosg432)
# - Link to existing project? → Y (se já tiver projeto)
#   Project name: clinica-numero-7
# - Override settings? → N (deixa usar as configs do vercel.json)
```

---

## Método 3: Git Push (Automático) 🔄

### Quando você faz push no GitHub, o Vercel faz deploy automaticamente:

```bash
cd "C:\Users\andre\OneDrive\Área de Trabalho\Cópia_de_numero_7"

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Sua mensagem aqui"

# Push para GitHub (dispara deploy automático no Vercel)
git push origin main
```

**Vantagem:** Deploy automático sempre que você fizer push!

---

## ⚙️ Configurações Importantes

### Verificar Variáveis de Ambiente:
1. No Vercel, vá em **Settings** → **Environment Variables**
2. Verifique se `API_URL` está configurada:
   - **Key:** `API_URL`
   - **Value:** `https://clinicanumero-7-production.up.railway.app/api`
   - ✅ Marcar: Production, Preview, Development

### Verificar Build Settings:
1. **Settings** → **General**
2. Verificar:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build Command:** `node vercel-build.js`
   - **Output Directory:** `public`

---

## 🐛 Solução de Problemas

### Deploy Falhou:
1. Veja os **Build Logs** no Vercel
2. Procure por erros em vermelho
3. Corrija e faça push novamente

### Mudanças Não Aparecem:
1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Ou faça um **Redeploy** manual
3. Verifique se o commit foi enviado para o Git

### Erro "No Output Directory":
- Verifique se o `vercel-build.js` está criando a pasta `public`
- Veja os logs do build

---

## 📝 Resumo Rápido

**Para Redeploy Rápido:**
- Vercel Dashboard → Projeto → **Redeploy**

**Para Deploy com Mudanças:**
```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

**Para Deploy Manual via CLI:**
```bash
vercel --prod
```

---

## ✅ Verificar Deploy Bem-Sucedido

1. ✅ Status mostra **"Ready"** (verde)
2. ✅ Não há erros nos **Build Logs**
3. ✅ Site abre normalmente no navegador
4. ✅ Console do navegador não mostra erros críticos




