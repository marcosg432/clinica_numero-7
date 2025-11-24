# 🔍 TESTE DA API - Diagnóstico

## Como testar se o backend está funcionando:

### 1. Teste de Health Check:
Abra no navegador:
```
https://clinicanumero-7-production.up.railway.app/health
```

**Esperado:** Deve retornar JSON:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...,
  "environment": "production"
}
```

### 2. Teste de Tratamentos:
Abra no navegador:
```
https://clinicanumero-7-production.up.railway.app/api/tratamentos?ativo=true&limit=10
```

**Esperado:** Deve retornar JSON com tratamentos:
```json
{
  "success": true,
  "data": [...],
  "total": ...
}
```

### 3. Verificar CORS:
Abra o Console do navegador (F12) no site do Vercel e execute:
```javascript
fetch('https://clinicanumero-7-production.up.railway.app/api/tratamentos?ativo=true&limit=10')
  .then(r => r.json())
  .then(d => console.log('✅ Sucesso:', d))
  .catch(e => console.error('❌ Erro:', e))
```

## Possíveis Problemas:

### ❌ Backend offline
- **Sintoma:** Erro "Failed to fetch" ou timeout
- **Solução:** Verificar logs do Railway

### ❌ CORS bloqueando
- **Sintoma:** Erro "CORS policy" no console
- **Solução:** Adicionar URL do Vercel no `FRONTEND_URL` do Railway

### ❌ URL da API errada
- **Sintoma:** Erro 404 ou "Not Found"
- **Solução:** Verificar se a URL no meta tag está correta

### ❌ Banco de dados vazio
- **Sintoma:** API retorna `{"success": true, "data": []}`
- **Solução:** Criar tratamentos no admin ou via seed

---

**Próximos passos:**
1. Teste a URL `/health` no navegador
2. Teste a URL `/api/tratamentos` no navegador  
3. Me diga o que apareceu!




