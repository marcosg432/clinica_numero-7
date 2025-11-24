import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env.js';
import logger from './config/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import apiRoutes from './routes/index.js';

const app = express();

// Trust proxy (necessário para Railway e outros proxies reversos)
app.set('trust proxy', 1);

// Security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS - Configuração melhorada para produção
const allowedOrigins = config.frontendUrl 
  ? config.frontendUrl.split(',').map(url => url.trim())
  : ['http://localhost:8080', 'http://localhost:3000'];

logger.info(`🌐 CORS configurado. Origens permitidas: ${allowedOrigins.join(', ')}`);

// Função para verificar se a origem é permitida (suporta wildcards do Vercel)
function isOriginAllowed(origin) {
  if (!origin) return true; // Permitir requisições sem origem (curl, mobile apps)
  
  // Verificar se está na lista exata
  if (allowedOrigins.includes(origin)) {
    logger.info(`✅ CORS permitido (match exato): ${origin}`);
    return true;
  }
  
  // Verificar padrões do Vercel (*.vercel.app)
  if (origin.includes('.vercel.app')) {
    // Se qualquer URL do Vercel estiver configurada, permitir todos os subdomínios
    const hasVercelUrl = allowedOrigins.some(url => url.includes('.vercel.app'));
    if (hasVercelUrl) {
      logger.info(`✅ CORS permitido (Vercel): ${origin}`);
      return true;
    }
  }
  
  logger.warn(`❌ CORS bloqueado: ${origin}`);
  logger.info(`📋 Origens permitidas: ${allowedOrigins.join(', ')}`);
  return false;
}

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origem não permitida: ${origin}. Configure FRONTEND_URL no Railway.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Setup-Secret', 'Accept'],
  exposedHeaders: ['Authorization'],
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use((req, res, next) => {
  console.log('=== REQUISIÇÃO RECEBIDA ===');
  console.log('Method:', req.method);
  console.log('Original URL:', req.originalUrl);
  console.log('Path:', req.path);
  console.log('Base URL:', req.baseUrl);
  console.log('URL completa:', req.url);
  console.log('===========================');
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});

// Rate limiting
app.use(generalLimiter);

// Health check
app.get('/health', async (req, res) => {
  try {
    // Testar conexão com DB
    const prisma = await import('./config/database.js').then(m => m.default);
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port || process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Railway precisa escutar em 0.0.0.0

const server = app.listen(PORT, HOST, () => {
  logger.info(`🚀 Server running on ${HOST}:${PORT} in ${config.env} mode`);
  logger.info(`📡 API available at http://${HOST}:${PORT}/api`);
  logger.info(`❤️  Health check at http://${HOST}:${PORT}/health`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, starting graceful shutdown`);
  
  server.close(() => {
    logger.info('HTTP server closed');
  });

  const prisma = await import('./config/database.js').then(m => m.default);
  await prisma.$disconnect();
  logger.info('Database connection closed');

  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    err: reason,
    promise,
  }, 'Unhandled Promise Rejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught Exception');
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default app;


