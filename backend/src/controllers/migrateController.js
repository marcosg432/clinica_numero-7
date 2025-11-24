import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * ⚠️ ROTA TEMPORÁRIA PARA EXECUTAR MIGRAÇÕES - REMOVER APÓS USO ⚠️
 * 
 * Esta rota executa as migrações do Prisma manualmente via HTTP.
 * Use apenas uma vez para criar as tabelas no banco.
 * 
 * URL: POST /api/setup/migrate
 * Header: X-Setup-Secret: temporary-setup-key-change-in-production
 */
export async function runMigrations(req, res) {
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

    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_URL_MISSING',
          message: 'DATABASE_URL não está configurada',
        },
      });
    }

    logger.info('🔄 Executando migrações via HTTP endpoint...');
    
    try {
      const result = execSync('npx prisma migrate deploy', {
        cwd: join(__dirname, '..', '..'),
        stdio: 'pipe',
        env: process.env,
        encoding: 'utf8',
      });

      logger.info('✅ Migrações executadas com sucesso via HTTP!');
      
      return res.json({
        success: true,
        message: 'Migrações executadas com sucesso!',
        output: result.substring(0, 1000), // Primeiros 1000 caracteres
      });
    } catch (error) {
      logger.error({ err: error }, '❌ Erro ao executar migrações via HTTP');
      
      const stdout = error.stdout?.toString() || '';
      const stderr = error.stderr?.toString() || '';
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'MIGRATION_ERROR',
          message: error.message || 'Erro ao executar migrações',
          stdout: stdout.substring(0, 500),
          stderr: stderr.substring(0, 500),
        },
      });
    }
  } catch (error) {
    logger.error({ err: error }, '❌ Erro geral na rota de migração');
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Erro interno',
      },
    });
  }
}

