# 🔧 Como Configurar o Root Directory no Railway

## 📍 Passo a Passo Visual:

### 1️⃣ Entre no Railway
- Acesse: https://railway.app
- Faça login

### 2️⃣ Selecione o Projeto
- Clique no projeto que contém o serviço `clinica_numero-7`

### 3️⃣ Clique no Serviço
- Clique no card do serviço **clinica_numero-7** no meio da tela

### 4️⃣ Vá em Settings (Configurações)
- No topo da página, clique na aba **"Settings"**
- Ou procure o ícone de **engrenagem ⚙️**

### 5️⃣ Encontre a Seção "Service"
- Role a página para baixo
- Procure por **"Service"** ou **"Deploy"**

### 6️⃣ Configure o Root Directory
- Encontre o campo **"Root Directory"** ou **"Working Directory"**
- Digite exatamente: `backend` (sem aspas, sem barra, apenas a palavra backend)
- Clique em **"Save"** ou **"Update"**

---

## ✅ Resultado Esperado:

Após salvar:
1. O Railway fará um novo deploy automaticamente
2. Os logs mostrarão que está lendo arquivos da pasta `backend`
3. O comando `npm start` será encontrado

---

## 🔍 Se não encontrar o campo:

### Alternativa 1: Vá em "Variables"
- Settings → Variables
- Procure por variáveis relacionadas a diretório
- Mas geralmente não fica aqui

### Alternativa 2: Procure no Menu Lateral
- Às vezes o Root Directory fica em:
  - **Settings → General**
  - **Settings → Deploy**
  - **Settings → Build**

### Alternativa 3: Tela de Deploy
- No painel do serviço, clique em **"Deployments"**
- Clique no último deploy (que falhou)
- Veja se há opção de configuração ali

---

## 📸 Onde geralmente aparece:

```
Railway Dashboard
├── Settings (aba no topo)
    ├── General
    ├── Service ⬅️ AQUI!
    │   ├── Root Directory: [backend_______]
    │   └── Start Command: [npm start_______]
    ├── Variables
    └── Deploy
```

---

## ⚠️ IMPORTANTE:

- O valor deve ser apenas: `backend` (sem `/` no início)
- NÃO use: `/backend` ou `./backend` ou `backend/`
- Apenas: `backend`

---

## 🆘 Se ainda não encontrar:

1. Tente clicar em **"View Logs"** do deploy que falhou
2. Procure por links de configuração nos logs
3. Ou tente criar um novo serviço e configure desde o início

---

**Depois de configurar, o Railway fará deploy automático! 🚀**






