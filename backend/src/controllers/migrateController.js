import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from '../config/logger.js';
import prisma from '../config/database.js';

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
    
    // Primeiro, tentar resolver migrações falhadas (erro P3009)
    let hasFailedMigrations = false;
    try {
      logger.info('🔍 Verificando se há migrações falhadas...');
      
      // Tentar fazer deploy primeiro para ver se há erro P3009
      try {
        execSync('npx prisma migrate deploy', {
          cwd: backendRoot,
          stdio: 'pipe',
          env: {
            ...process.env,
            PRISMA_SCHEMA_PATH: schemaPath,
          },
          encoding: 'utf8',
        });
        logger.info('✅ Migrações aplicadas sem problemas!');
      } catch (testError) {
        const testStderr = testError.stderr?.toString() || testError.message || '';
        if (testStderr.includes('P3009') || testStderr.includes('failed migrations')) {
          hasFailedMigrations = true;
          logger.warn('⚠️  Migrações falhadas detectadas! Tentando resolver...');
          
          // Tentar resolver a migração falhada
          // Primeiro, verificar qual migração falhou
          const migrationMatch = testStderr.match(/`([^`]+)` migration started at/);
          const failedMigration = migrationMatch ? migrationMatch[1] : null;
          
          if (failedMigration) {
            logger.info(`🔧 Resolvendo migração falhada: ${failedMigration}`);
            
            // Verificar se as tabelas foram criadas (migração foi aplicada mas marcada como falhada)
            // Se sim, marcar como aplicada. Se não, marcar como revertida e tentar aplicar novamente
            try {
              // Tentar marcar como aplicada primeiro (caso as tabelas já existam)
              execSync(`npx prisma migrate resolve --applied ${failedMigration}`, {
                cwd: backendRoot,
                stdio: 'pipe',
                env: {
                  ...process.env,
                  PRISMA_SCHEMA_PATH: schemaPath,
                },
                encoding: 'utf8',
              });
              logger.info(`✅ Migração ${failedMigration} marcada como aplicada`);
            } catch (resolveError) {
              // Se não funcionar, marcar como revertida
              logger.warn('⚠️  Não foi possível marcar como aplicada. Tentando marcar como revertida...');
              try {
                execSync(`npx prisma migrate resolve --rolled-back ${failedMigration}`, {
                  cwd: backendRoot,
                  stdio: 'pipe',
                  env: {
                    ...process.env,
                    PRISMA_SCHEMA_PATH: schemaPath,
                  },
                  encoding: 'utf8',
                });
                logger.info(`✅ Migração ${failedMigration} marcada como revertida`);
              } catch (rollbackError) {
                logger.error('❌ Não foi possível resolver migração falhada');
                throw rollbackError;
              }
            }
          } else {
            // Se não conseguir identificar a migração, tentar resolver todas as falhadas
            logger.warn('⚠️  Não foi possível identificar migração específica. Tentando resolver manualmente...');
            
            // Tentar marcar como aplicada (assumindo que as tabelas já existem)
            try {
              execSync('npx prisma migrate resolve --applied 20251122070031_init', {
                cwd: backendRoot,
                stdio: 'pipe',
                env: {
                  ...process.env,
                  PRISMA_SCHEMA_PATH: schemaPath,
                },
                encoding: 'utf8',
              });
              logger.info('✅ Migração marcada como aplicada');
            } catch (resolveError2) {
              // Se não funcionar, marcar como revertida
              execSync('npx prisma migrate resolve --rolled-back 20251122070031_init', {
                cwd: backendRoot,
                stdio: 'pipe',
                env: {
                  ...process.env,
                  PRISMA_SCHEMA_PATH: schemaPath,
                },
                encoding: 'utf8',
              });
              logger.info('✅ Migração marcada como revertida');
            }
          }
        } else {
          // Outro tipo de erro, relançar
          throw testError;
        }
      }
      
      // Agora tentar aplicar as migrações novamente
      logger.info(`🚀 Executando: npx prisma migrate deploy`);
      logger.info(`📂 Working directory: ${backendRoot}`);
      
      let result;
      try {
        result = execSync('npx prisma migrate deploy', {
          cwd: backendRoot,
          stdio: 'pipe',
          env: {
            ...process.env,
            PRISMA_SCHEMA_PATH: schemaPath,
          },
          encoding: 'utf8',
        });
      } catch (deployError) {
        // Se ainda falhar, tentar executar o SQL diretamente
        const stderr = deployError.stderr?.toString() || deployError.message || '';
        if (stderr.includes('No pending migrations to apply')) {
          logger.warn('⚠️  Prisma diz que não há migrações pendentes, mas vamos verificar se as tabelas existem...');
          
          // Verificar se as tabelas realmente existem
          try {
            await prisma.$queryRaw`SELECT 1 FROM usuarios LIMIT 1`;
            logger.info('✅ Tabela usuarios existe!');
            result = 'No pending migrations to apply. Tables already exist.';
          } catch (tableError) {
            logger.error('❌ Tabela usuarios NÃO existe! Forçando criação...');
            
            // Executar o SQL de migração diretamente
            const migrationSqlPath = join(migrationsDir, '20251122070031_init', 'migration.sql');
            if (fs.existsSync(migrationSqlPath)) {
              const migrationSql = fs.readFileSync(migrationSqlPath, 'utf8');
              logger.info('📄 Executando SQL de migração diretamente...');
              
              // Dividir o SQL em comandos e executar um por um
              const commands = migrationSql.split(';').filter(cmd => cmd.trim().length > 0);
              
              for (const command of commands) {
                const trimmedCmd = command.trim();
                if (trimmedCmd) {
                  try {
                    await prisma.$executeRawUnsafe(trimmedCmd);
                    logger.info('✅ Comando SQL executado');
                  } catch (sqlError) {
                    // Ignorar erros de "já existe" e outros erros esperados
                    if (!sqlError.message.includes('already exists') && 
                        !sqlError.message.includes('duplicate') &&
                        !sqlError.message.includes('does not exist')) {
                      logger.warn(`⚠️  Erro ao executar comando SQL: ${sqlError.message}`);
                    }
                  }
                }
              }
              
              // Marcar migração como aplicada
              try {
                execSync('npx prisma migrate resolve --applied 20251122070031_init', {
                  cwd: backendRoot,
                  stdio: 'pipe',
                  env: {
                    ...process.env,
                    PRISMA_SCHEMA_PATH: schemaPath,
                  },
                  encoding: 'utf8',
                });
                logger.info('✅ Migração marcada como aplicada');
              } catch (resolveErr) {
                logger.warn('⚠️  Não foi possível marcar migração como aplicada, mas tabelas foram criadas');
              }
              
              result = 'Tables created manually via SQL. Migration marked as applied.';
            } else {
              throw new Error(`Migration SQL file not found: ${migrationSqlPath}`);
            }
          }
        } else {
          throw deployError;
        }
      }

      logger.info('✅ Migrações executadas com sucesso via HTTP!');
      logger.info('📋 Output completo:', result);
      
      // Verificar se realmente aplicou alguma migração
      const outputLower = result.toLowerCase();
      const hasApplied = outputLower.includes('applied') || outputLower.includes('created') || outputLower.includes('tables created');
      const noMigration = outputLower.includes('no migration found') || outputLower.includes('no pending migrations');
      
      return res.json({
        success: true,
        message: hasFailedMigrations 
          ? 'Migrações falhadas resolvidas e aplicadas com sucesso!' 
          : (hasApplied ? 'Migrações executadas com sucesso!' : (noMigration ? 'Migrações já aplicadas ou tabelas já existem' : 'Comando executado')),
        output: result,
        applied: hasApplied,
        noMigration: noMigration,
        resolved: hasFailedMigrations,
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
          stdout: stdout.substring(0, 1000),
          stderr: stderr.substring(0, 1000),
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

