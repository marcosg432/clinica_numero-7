# 🔧 CORRIGIR ERRO NO RAILWAY - PASSO A PASSO

## O Problema

O erro "Error creating build plan with Railpack" acontece porque o Railway está tentando fazer build da raiz do projeto ao invés da pasta `backend`.

## ✅ Solução Rápida

### Passo 1: Configurar Root Directory

1. No Railway, clique no serviço que está com erro (`clinica_numero-7`)
2. Clique em **Settings** (engrenagem no canto superior direito)
3. Procure a seção **"Service"**
4. Encontre o campo **"Root Directory"**
5. **Delete qualquer valor que estiver lá** e digite: `backend`
6. Clique em **Save**

### Passo 2: Aguardar Redeploy

O Railway vai fazer redeploy automaticamente. Aguarde 1-2 minutos.

### Passo 3: Verificar

Se ainda der erro:
1. Vá em **Deployments**
2. Clique nos três pontos do deployment mais recente
3. Selecione **"Redeploy"**

## 📸 Onde encontrar Root Directory

```
Railway Dashboard
└── Seu Projeto
    └── Serviço: clinica_numero-7
        └── Settings (ícone de engrenagem)
            └── Seção: "Service"
                └── Root Directory: [backend]  ← AQUI!
```

## ⚠️ IMPORTANTE

- O valor deve ser exatamente: `backend` (sem aspas, sem barra, sem ponto)
- Não pode ser: `./backend`, `/backend`, `backend/`, etc.
- Apenas: `backend`

## ✅ Se ainda não funcionar

### Opção 1: Recriar o Serviço

1. Delete o serviço atual (Settings → Delete Service)
2. Crie um novo serviço (New → GitHub Repo)
3. Ao selecionar o repositório, você verá uma opção para configurar o Root Directory
4. Configure como `backend` logo na criação

### Opção 2: Verificar Build Logs

1. Vá em **Deployments**
2. Clique no deployment que falhou
3. Abra a aba **"Build Logs"**
4. Veja qual é o erro exato
5. Me envie o erro para eu ajudar melhor

## 🎯 Configuração Correta

Após configurar o Root Directory como `backend`, o Railway deve:

1. ✅ Detectar Node.js automaticamente
2. ✅ Executar `npm install` na pasta `backend`
3. ✅ Executar `npm run postinstall` (que gera o Prisma Client)
4. ✅ Executar `npm start`

## 📝 Checklist

- [ ] Root Directory configurado como `backend`
- [ ] Salvou as alterações
- [ ] Aguardou o redeploy
- [ ] Verificou os Build Logs

---

**Dica:** Se você já tem um serviço funcionando, pode duplicá-lo e configurar o Root Directory corretamente na cópia.

