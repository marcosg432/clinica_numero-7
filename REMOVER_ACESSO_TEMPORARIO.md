# 🔒 Guia para Remover Acesso Temporário de Setup

Após criar o admin pela primeira vez, **você DEVE remover ou desativar** a rota temporária de setup por segurança.

## ⚠️ IMPORTANTE: Esta rota cria usuários admin e deve ser removida antes de vender/entregar o projeto!

---

## 📋 Opção 1: Desativar via Variável de Ambiente (Mais Rápido)

1. Acesse o **Railway** → Seu projeto → **Variables**
2. Adicione uma nova variável:
   - **Nome:** `DISABLE_SETUP_ROUTE`
   - **Valor:** `true`
3. Faça um **redeploy** no Railway (ou aguarde o próximo deploy automático)

✅ **Pronto!** A rota `/api/setup/admin` retornará 404.

---

## 📋 Opção 2: Remover Código Completamente (Mais Seguro)

### Passo 1: Remover arquivos de setup

Delete estes arquivos:
- `backend/src/routes/setup.js`
- `backend/src/controllers/setupController.js`

### Passo 2: Remover importação no router principal

Edite `backend/src/routes/index.js`:

```javascript
import express from 'express';
import tratamentosRouter from './tratamentos.js';
import agendamentosRouter from './agendamentos.js';
import avaliacoesRouter from './avaliacoes.js';
import authRouter from './auth.js';
// ❌ REMOVER ESTA LINHA:
// import setupRouter from './setup.js';

const router = express.Router();

router.use('/tratamentos', tratamentosRouter);
router.use('/agendamento', agendamentosRouter);
router.use('/avaliacoes', avaliacoesRouter);
router.use('/auth', authRouter);
// ❌ REMOVER ESTA LINHA:
// router.use('/setup', setupRouter);

export default router;
```

### Passo 3: Remover botão do admin.html

Edite `admin.html` e remova:

1. O botão "🔧 Criar Admin (Primeira Vez)"
2. A função `criarAdmin()` completa

### Passo 4: Fazer commit e push

```bash
git add .
git commit -m "Remover rota temporária de setup após criação do admin"
git push origin main
```

---

## ✅ Verificação

Após remover, teste que a rota não funciona mais:

```bash
curl -X POST https://seu-backend.up.railway.app/api/setup/admin \
  -H "Content-Type: application/json" \
  -H "X-Setup-Secret: qualquer-coisa"
```

Deve retornar **404** ou **401**.

---

## 🎯 Resumo

- ✅ **Opção 1 (Desativar):** Mais rápido, mas o código ainda existe
- ✅ **Opção 2 (Remover):** Mais seguro, código completamente removido

**Recomendação:** Use a **Opção 2** antes de vender/entregar o projeto para garantir máxima segurança.

