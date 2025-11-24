-- CreateTable
CREATE TABLE "tratamentos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "slug" TEXT NOT NULL,
    "imagem" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tratamento_id" TEXT NOT NULL,
    "data_agendada" DATETIME,
    "data_envio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "notas" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "agendamentos_tratamento_id_fkey" FOREIGN KEY ("tratamento_id") REFERENCES "tratamentos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "avatar" TEXT DEFAULT '',
    "nota" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "data_avaliacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    "aprovado" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "last_login" DATETIME,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" DATETIME,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidade_id" TEXT,
    "dados_antigos" JSONB,
    "dados_novos" JSONB,
    "ip" TEXT,
    "user_agent" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "tratamentos_slug_key" ON "tratamentos"("slug");

-- CreateIndex
CREATE INDEX "tratamentos_slug_idx" ON "tratamentos"("slug");

-- CreateIndex
CREATE INDEX "tratamentos_ativo_idx" ON "tratamentos"("ativo");

-- CreateIndex
CREATE INDEX "agendamentos_status_idx" ON "agendamentos"("status");

-- CreateIndex
CREATE INDEX "agendamentos_tratamento_id_idx" ON "agendamentos"("tratamento_id");

-- CreateIndex
CREATE INDEX "agendamentos_data_envio_idx" ON "agendamentos"("data_envio");

-- CreateIndex
CREATE INDEX "avaliacoes_aprovado_idx" ON "avaliacoes"("aprovado");

-- CreateIndex
CREATE INDEX "avaliacoes_data_avaliacao_idx" ON "avaliacoes"("data_avaliacao");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_role_idx" ON "usuarios"("role");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entidade_entidade_id_idx" ON "audit_logs"("entidade", "entidade_id");

-- CreateIndex
CREATE INDEX "audit_logs_criado_em_idx" ON "audit_logs"("criado_em");
