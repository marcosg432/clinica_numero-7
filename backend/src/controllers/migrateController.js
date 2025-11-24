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
    
    // Determinar o diretório raiz do backend (onde está o package.json)
    const backendRoot = join(__dirname, '..', '..');
    const migrationsDir = join(backendRoot, 'prisma', 'migrations');
    const schemaPath = join(backendRoot, 'prisma', 'schema.prisma');
    const fs = await import('fs');
    const path = await import('path');
    
    // Verificações detalhadas
    try {
      logger.info(`📁 Backend root: ${backendRoot}`);
      logger.info(`📁 Schema path: ${schemaPath}`);
      logger.info(`📁 Migrations dir: ${migrationsDir}`);
      
      const schemaExists = fs.existsSync(schemaPath);
      const migrationsExist = fs.existsSync(migrationsDir);
      
      logger.info(`📄 Schema existe: ${schemaExists}`);
      logger.info(`📁 Diretório de migrações existe: ${migrationsExist}`);
      
      if (migrationsExist) {
        const migrations = fs.readdirSync(migrationsDir);
        logger.info(`📋 Migrações encontradas: ${migrations.length}`);
        migrations.forEach(migration => {
          const migrationPath = join(migrationsDir, migration);
          const isDir = fs.statSync(migrationPath).isDirectory();
          logger.info(`   - ${migration} (${isDir ? 'diretório' : 'arquivo'})`);
          if (isDir) {
            const files = fs.readdirSync(migrationPath);
            logger.info(`     Arquivos: ${files.join(', ')}`);
          }
        });
      } else {
        logger.error('❌ Diretório de migrações NÃO encontrado!');
        // Listar o que existe em prisma/
        const prismaDir = join(backendRoot, 'prisma');
        if (fs.existsSync(prismaDir)) {
          const prismaContents = fs.readdirSync(prismaDir);
          logger.info(`📂 Conteúdo de prisma/: ${prismaContents.join(', ')}`);
        }
      }
    } catch (err) {
      logger.error({ err }, '❌ Erro ao verificar diretórios');
    }
    
    // Verificar se estamos no diretório correto
    const packageJsonPath = join(backendRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      logger.error(`❌ package.json não encontrado em: ${packageJsonPath}`);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INVALID_WORKING_DIRECTORY',
          message: `package.json não encontrado. Backend root: ${backendRoot}`,
        },
      });
    }
    
    try {
      logger.info(`🚀 Executando: npx prisma migrate deploy`);
      logger.info(`📂 Working directory: ${backendRoot}`);
      
      const result = execSync('npx prisma migrate deploy', {
        cwd: backendRoot,
        stdio: 'pipe',
        env: {
          ...process.env,
          PRISMA_SCHEMA_PATH: schemaPath, // Forçar caminho do schema
        },
        encoding: 'utf8',
      });

      logger.info('✅ Migrações executadas com sucesso via HTTP!');
      logger.info('📋 Output completo:', result);
      
      // Verificar se realmente aplicou alguma migração
      const outputLower = result.toLowerCase();
      const hasApplied = outputLower.includes('applied') || outputLower.includes('created');
      const noMigration = outputLower.includes('no migration found');
      
      return res.json({
        success: true,
        message: hasApplied ? 'Migrações executadas com sucesso!' : (noMigration ? 'Nenhuma migração encontrada para aplicar' : 'Comando executado'),
        output: result, // Output completo
        applied: hasApplied,
        noMigration: noMigration,
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

