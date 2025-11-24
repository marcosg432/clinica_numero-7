import request from 'supertest';
import app from '../../src/server.js';
import prisma from '../../src/config/database.js';

describe('POST /api/agendamento', () => {
  let tratamentoId;

  beforeAll(async () => {
    // Criar tratamento de teste
    const tratamento = await prisma.tratamento.create({
      data: {
        nome: 'Teste Tratamento',
        slug: 'teste-tratamento',
        descricao: 'Descrição teste',
        ativo: true,
      },
    });
    tratamentoId = tratamento.id;
  });

  afterAll(async () => {
    await prisma.agendamento.deleteMany();
    await prisma.tratamento.deleteMany();
  });

  it('should create an agendamento successfully', async () => {
    const response = await request(app)
      .post('/api/agendamento')
      .send({
        nome: 'João Silva',
        telefone: '(67) 99999-9999',
        email: 'joao@test.com',
        tratamentoId,
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.nome).toBe('João Silva');
    expect(response.body.data.status).toBe('PENDENTE');
  });

  it('should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/agendamento')
      .send({
        nome: 'Jo',
        telefone: '123',
        email: 'invalid-email',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});


