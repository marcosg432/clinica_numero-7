# 🚨 CORRIGIR CORS - URGENTE!

## ⚠️ Problema Identificado

O erro no console mostra:
```
Access to fetch at 'https://clinicanumero-7-production.up.railway.app/api/avaliacoes...' 
from origin 'https://clinica-numero-7-git-main-marcosg432s-projects.vercel.app' 
has been blocked by CORS policy
```

**Causa:** O backend não está permitindo requisições do frontend do Vercel!

---

## ✅ SOLUÇÃO: Configurar FRONTEND_URL no Railway

### Passo 1: Pegar a URL do Vercel

1. Acesse o Vercel
2. Vá no projeto `clinica-numero-7`
3. Na página do deployment, copie a **URL do domínio**:
   - Exemplo: `https://clinica-numero-7.vercel.app`
   - Ou: `https://clinica-numero-7-git-main-marcosg432s-projects.vercel.app`

### Passo 2: Adicionar no Railway

1. Acesse o **Railway**
2. Vá no serviço **`clinica_numero-7`** (backend)
3. Clique na aba **"Variables"**
4. Procure por **`FRONTEND_URL`**:
   - **Se NÃO existir:** Clique em **"+ New Variable"**
   - **Se existir:** Clique para editar

5. Configure assim:
   - **Key:** `FRONTEND_URL`
   - **Value:** Cole TODAS as URLs do Vercel separadas por vírgula:
     ```
     https://clinica-numero-7.vercel.app,https://clinica-numero-7-git-main-marcosg432s-projects.vercel.app
     ```
   
   **OU apenas a URL principal:**
   ```
   https://clinica-numero-7.vercel.app
   ```

6. Clique em **"Add"** ou **"Save"**

7. O Railway fará **redeploy automático** (aguarde ~30 segundos)

---

## ✅ Verificar se Funcionou

1. Após o redeploy do Railway, aguarde 30 segundos
2. Recarregue o site do Vercel
3. Abra o Console (F12)
4. Verifique se **NÃO aparecem mais erros de CORS**

---

## 📝 URLs que Precisam estar no FRONTEND_URL

Adicione todas essas URLs (separadas por vírgula):

```
https://clinica-numero-7.vercel.app,https://clinica-numero-7-git-main-marcosg432s-projects.vercel.app
```

**Ou apenas a principal:**
```
https://clinica-numero-7.vercel.app
```

---

## ⚠️ IMPORTANTE

- A URL deve começar com `https://`
- NÃO adicione `/api` ou barra no final
- Use vírgula para separar múltiplas URLs
- Após adicionar, aguarde o redeploy automático

---

**Após corrigir o CORS, os tratamentos e avaliações devem carregar normalmente!** ✅

