# Instalação do PostgreSQL no Windows

## Opção 1: Instalação Manual (Recomendado)

1. **Baixar PostgreSQL:**
   - Acesse: https://www.postgresql.org/download/windows/
   - Baixe o instalador para Windows (versão 15 ou superior)

2. **Instalar:**
   - Execute o instalador
   - Durante a instalação, defina a senha do usuário `postgres` (anote essa senha!)
   - Porta padrão: 5432 (mantenha)
   - Deixe marcado para instalar o pgAdmin (ferramenta gráfica)

3. **Verificar instalação:**
   - Abra o "SQL Shell (psql)" ou o pgAdmin
   - Teste a conexão

## Opção 2: Usando Chocolatey (Rápido)

Se você tem Chocolatey instalado:

```powershell
choco install postgresql15
```

## Após Instalar

1. **Criar o banco de dados:**
   - Abra o pgAdmin ou SQL Shell
   - Execute:
   ```sql
   CREATE DATABASE clinica_odonto;
   ```

2. **Atualizar o arquivo `.env` no backend:**
   ```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/clinica_odonto?schema=public"
   ```
   Substitua `SUA_SENHA` pela senha que você definiu durante a instalação.

3. **Rodar as migrations:**
   ```bash
   cd backend
   npm run migrate
   ```

4. **Popular dados iniciais:**
   ```bash
   npm run seed
   ```

5. **Iniciar o servidor:**
   ```bash
   npm run dev
   ```

## Alternativa: Usar PostgreSQL Online (Não requer instalação)

Se não quiser instalar PostgreSQL localmente, pode usar serviços gratuitos:

- **Supabase:** https://supabase.com (PostgreSQL gratuito)
- **ElephantSQL:** https://www.elephantsql.com (PostgreSQL gratuito)
- **Railway:** https://railway.app (PostgreSQL gratuito)

Basta criar uma conta, criar um banco PostgreSQL e copiar a URL de conexão para o `.env`.


