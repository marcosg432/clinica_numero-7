# 📋 Comandos Git - Execute Manualmente

## ⚠️ IMPORTANTE: Execute estes comandos no diretório do projeto!

Certifique-se de estar no diretório:
```
C:\Users\andre\OneDrive\Área de Trabalho\Cópia_de_numero_7
```

## 📝 Passo a Passo:

### 1. Navegar para o diretório:
```bash
cd "C:\Users\andre\OneDrive\Área de Trabalho\Cópia_de_numero_7"
```

### 2. Verificar se está no lugar certo:
```bash
dir index.html
```
(Deveria mostrar o arquivo)

### 3. Inicializar Git (se necessário):
```bash
git init
```

### 4. Configurar remote:
```bash
git remote remove origin
git remote add origin https://github.com/marcosg432/clinica_numero-7.git
```

### 5. Verificar remote:
```bash
git remote -v
```
(Deve mostrar o repositório correto)

### 6. Adicionar todos os arquivos:
```bash
git add .
```

### 7. Verificar o que será enviado:
```bash
git status
```

### 8. Fazer commit:
```bash
git commit -m "Fix: Corrigir configurações Railway e atualizar para PostgreSQL"
```

### 9. Renomear branch:
```bash
git branch -M main
```

### 10. Fazer push:
```bash
git push -u origin main
```

---

**Se pedir credenciais:**
- Use seu **Personal Access Token** do GitHub
- Não use sua senha do GitHub

---

Após o push, o Railway detectará as mudanças automaticamente! 🚀

