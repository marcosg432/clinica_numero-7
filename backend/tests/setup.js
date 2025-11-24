import { beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/clinica_odonto_test?schema=public',
    },
  },
});

beforeAll(async () => {
  // Executar migrations de teste se necessário
});

afterAll(async () => {
  await prisma.$disconnect();
});


