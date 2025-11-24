# 🔍 Verificar se o Backend está Rodando no Railway

## ✅ Passo 1: Verificar Status do Deploy

1. No Railway, clique na aba **"Deployments"** (ao lado de "Variables")
2. Verifique o último deploy:
   - ✅ **"Active"** = Backend está rodando
   - ❌ **"Crashed"** = Backend parou (precisa verificar logs)
   - ⏳ **"Building"** = Ainda fazendo deploy

## ✅ Passo 2: Verificar Logs

1. No Railway, clique na aba **"Logs"** ou no último deploy
2. Procure por:
   - `🚀 Server running on...` = Backend iniciou com sucesso
   - `❌ Missing required environment variables` = Faltam variáveis
   - `Error:...` = Erro ao iniciar

## ✅ Passo 3: Testar Health Check Diretamente

Abra no navegador:
```
https://clinicanumero-7-production.up.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-24T...",
  "uptime": 123.45,
  "environment": "production"
}
```

**Se der erro:**
- `404 Not Found` = Backend não está rodando ou rota não existe
- `503 Service Unavailable` = Backend está rodando mas DB não conecta
- `CORS error` = Backend está rodando mas CORS não configurado

## ✅ Passo 4: Forçar Redeploy (se necessário)

Se o backend está "Crashed" ou não responde:

1. No Railway, vá em **"Settings"**
2. Role até **"Redeploy"** ou **"Deploy"**
3. Clique em **"Redeploy"** para fazer deploy novamente
4. Aguarde ~2 minutos

## 🎯 Checklist

- [ ] Deploy mostra status "Active"
- [ ] Logs mostram "Server running"
- [ ] Health check retorna `{"status": "ok"}`
- [ ] `FRONTEND_URL` está configurado no Railway


