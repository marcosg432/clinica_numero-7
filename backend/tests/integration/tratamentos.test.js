import request from 'supertest';
import app from '../../src/server.js';
import prisma from '../../src/config/database.js';
import authService from '../../src/services/authService.js';

describe('GET /api/tratamentos', () => {
  beforeAll(async () => {
    // Criar tratamentos de teste
    await prisma.tratamento.createMany({
      data: [
        {
          nome: 'Tratamento 1',
          slug: 'tratamento-1',
          ativo: true,
        },
        {
          nome: 'Tratamento 2',
          slug: 'tratamento-2',
          ativo: false,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.tratamento.deleteMany();
  });

  it('should list all active tratamentos', async () => {
    const response = await request(app)
      .get('/api/tratamentos?ativo=true')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
  });

  it('should get tratamento by slug', async () => {
    const response = await request(app)
      .get('/api/tratamentos/tratamento-1')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.slug).toBe('tratamento-1');
  });
});


