# 📋 COMANDOS PARA EXECUTAR NO TERMINAL

## ⚠️ IMPORTANTE:
Execute todos estes comandos **dentro do diretório do projeto**:
```
C:\Users\andre\OneDrive\Área de Trabalho\Cópia_de_numero_7
```

---

## 📝 COMANDOS (copie e cole um por vez):

### 1. Navegar para o diretório:
```cmd
cd "C:\Users\andre\OneDrive\Área de Trabalho\Cópia_de_numero_7"
```

### 2. Verificar se está no lugar certo:
```cmd
dir index.html
```
(Se mostrar o arquivo, está correto!)

### 3. Configurar Git:
```cmd
git init
git remote remove origin
git remote add origin https://github.com/marcosg432/clinica_numero-7.git
git branch -M main
```

### 4. Adicionar arquivos:
```cmd
git add .
```

### 5. Fazer commit:
```cmd
git commit -m "Fix: Corrigir configurações Railway e atualizar para PostgreSQL"
```

### 6. Fazer push:
```cmd
git push -u origin main
```

---

## ✅ Após o Push:

1. Vá no Railway
2. Certifique-se que o **Root Directory** está configurado como: `backend`
3. O Railway fará deploy automático

---

## 🔧 Se ainda der erro no Railway:

No Railway, vá em **Settings** do serviço e configure:
- **Root Directory:** `backend`
- **Start Command:** `npm start` (ou deixe vazio)

---

**Pronto! Execute os comandos acima e me avise se funcionou! 🚀**

