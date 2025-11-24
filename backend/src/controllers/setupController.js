import prisma from '../config/database.js';
import bcrypt from 'bcrypt';
import config from '../config/env.js';
import logger from '../config/logger.js';

/**
 * Rota temporária para criar o admin
 * Protegida por uma secret key configurada via SETUP_SECRET
 */
export async function createAdmin(req, res, next) {
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

    // Verificar se admin já existe
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: config.admin.email },
    });

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
    logger.error({ err: error }, 'Erro ao criar admin via setup route');
    next(error);
  }
}

