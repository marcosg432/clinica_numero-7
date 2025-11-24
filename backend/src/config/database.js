import { PrismaClient } from '@prisma/client';
import logger from './logger.js';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error) => {
    logger.error({ error }, 'Failed to connect to database');
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  logger.info('Database connection closed');
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  logger.info('Database connection closed');
});

export default prisma;


