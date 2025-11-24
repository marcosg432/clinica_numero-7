import prisma from '../config/database.js';
import bcrypt from 'bcrypt';
import config from '../config/env.js';
import logger from '../config/logger.js';

/**
 * ⚠️ ROTA TEMPORÁRIA DE SETUP - REMOVER APÓS CRIAR O ADMIN ⚠️
 * 
 * Esta rota deve ser DESATIVADA ou REMOVIDA após criar o admin pela primeira vez.
 * 
 * Para desativar: Defina DISABLE_SETUP_ROUTE=true no Railway
 * Para remover: Delete os arquivos setup.js e setupController.js e remova do routes/index.js
 */
export async function createAdmin(req, res, next) {
  // Verificar se a rota foi desativada via variável de ambiente
  if (process.env.DISABLE_SETUP_ROUTE === 'true') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Setup route has been disabled',
      },
    });
  }

  try {
    // Verificar secret key
    const setupSecret = process.env.SETUP_SECRET || 'temporary-setup-key-change-in-production';
    const providedSecret = req.headers['x-setup-secret'] || req.query.secret;
    
    if (!providedSecret || providedSecret !== setupSecret) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid setup secret',
        },
      });
    }

    logger.info('🔧 Setup route called - Verificando configurações...');
    logger.info(`   Admin Email: ${config.admin.email}`);
    logger.info(`   Admin Name: ${config.admin.name}`);
    logger.info(`   Admin Password está configurado: ${config.admin.password ? 'Sim' : 'Não'}`);

    // Testar conexão com o banco primeiro
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info('✅ Conexão com banco de dados OK');
    } catch (dbError) {
      logger.error({ err: dbError }, '❌ Erro ao conectar com banco de dados');
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_CONNECTION_ERROR',
          message: 'Não foi possível conectar ao banco de dados',
          details: dbError.message,
        },
      });
    }

    // Verificar se a tabela usuarios existe
    try {
      await prisma.$queryRaw`SELECT 1 FROM usuarios LIMIT 1`;
      logger.info('✅ Tabela usuarios existe');
    } catch (tableError) {
      logger.error({ err: tableError }, '❌ Tabela usuarios não existe!');
      return res.status(500).json({
        success: false,
        error: {
          code: 'TABLE_NOT_FOUND',
          message: 'A tabela usuarios não existe no banco de dados. Execute as migrações primeiro.',
          details: 'Por favor, clique no botão amarelo "Executar Migrações" antes de criar o admin.',
        },
      });
    }

    // Verificar se admin já existe
    logger.info(`🔍 Procurando admin existente: ${config.admin.email}`);
    let existingAdmin;
    try {
      existingAdmin = await prisma.usuario.findUnique({
        where: { email: config.admin.email },
      });
    } catch (prismaError) {
      logger.error({ err: prismaError }, '❌ Erro ao buscar admin existente');
      
      // Se o erro for de tabela não encontrada, sugerir regenerar Prisma Client
      if (prismaError.code === 'P2021' || prismaError.message.includes('does not exist')) {
        return res.status(500).json({
          success: false,
          error: {
            code: 'PRISMA_CLIENT_OUT_OF_SYNC',
            message: 'Prisma Client não está sincronizado com o banco. Aguarde alguns segundos e tente novamente.',
            details: 'As tabelas foram criadas, mas o Prisma Client precisa ser regenerado. Isso acontece automaticamente em alguns segundos.',
          },
        });
      }
      
      throw prismaError;
    }

    if (existingAdmin) {
      logger.info(`Admin já existe: ${existingAdmin.email}`);
      
      // Atualizar senha mesmo assim
      const senhaHash = await bcrypt.hash(config.admin.password, 12);
      await prisma.usuario.update({
        where: { email: config.admin.email },
        data: {
          senhaHash,
          nome: config.admin.name,
          role: 'ADMIN',
          ativo: true,
          failedAttempts: 0,
          lockedUntil: null,
        },
      });

      return res.json({
        success: true,
        message: 'Admin atualizado com sucesso!',
        data: {
          email: config.admin.email,
          name: config.admin.name,
          action: 'updated',
        },
      });
    }

    // Criar admin
    const senhaHash = await bcrypt.hash(config.admin.password, 12);
    const admin = await prisma.usuario.create({
      data: {
        nome: config.admin.name,
        email: config.admin.email,
        senhaHash,
        role: 'ADMIN',
        ativo: true,
      },
    });

    logger.info(`✅ Admin criado via setup route: ${admin.email}`);

    res.json({
      success: true,
      message: 'Admin criado com sucesso!',
      data: {
        email: admin.email,
        name: admin.nome,
        action: 'created',
      },
    });
  } catch (error) {
    logger.error({ 
      err: error,
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    }, '❌ Erro ao criar admin via setup route');
    
    // Retornar erro mais detalhado para debug
    return res.status(500).json({
      success: false,
      error: {
        code: error.code || 'DATABASE_ERROR',
        message: error.message || 'Database operation failed',
        details: error.meta || error.stack?.substring(0, 200),
      },
    });
  }
}


