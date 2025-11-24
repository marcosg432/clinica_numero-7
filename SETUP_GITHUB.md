# 📦 Guia Rápido: Configurar e Subir para GitHub

## Passo 1: Inicializar o Git (se ainda não foi feito)

Abra o terminal na pasta do projeto e execute:

```bash
git init
```

## Passo 2: Adicionar todos os arquivos

```bash
git add .
```

## Passo 3: Fazer o primeiro commit

```bash
git commit -m "Initial commit - Clínica Odonto Azul preparado para deploy"
```

## Passo 4: Conectar ao repositório do GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/clinica_numero-7.git
```

**Substitua `SEU_USUARIO` pelo seu username do GitHub!**

## Passo 5: Renomear branch para main (se necessário)

```bash
git branch -M main
```

## Passo 6: Fazer push para o GitHub

```bash
git push -u origin main
```

Se pedir credenciais:
- Use seu **Personal Access Token** do GitHub (não sua senha)
- Para criar um token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token

---

## ✅ Próximos Passos

Após fazer o push para o GitHub:

1. **Configure o deploy no Railway** (backend)
   - Veja o arquivo `DEPLOY.md` para instruções detalhadas

2. **Configure o deploy no Vercel** (frontend)
   - Veja o arquivo `DEPLOY.md` para instruções detalhadas

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças, faça:

```bash
git add .
git commit -m "Sua mensagem descrevendo as mudanças"
git push origin main
```

Isso fará deploy automático nas duas plataformas!

---

**Dica:** Se você já tem um repositório no GitHub, pode cloná-lo primeiro:

```bash
git clone https://github.com/SEU_USUARIO/clinica_numero-7.git
cd clinica_numero-7
# Copie seus arquivos aqui
git add .
git commit -m "Initial commit"
git push -u origin main
```

