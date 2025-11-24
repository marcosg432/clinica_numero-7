import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import emailService from './emailService.js';

class AgendamentosService {
  async findAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      tratamentoId,
      dataInicio,
      dataFim,
      search,
      orderBy = 'dataEnvio',
      order = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (tratamentoId) {
      where.tratamentoId = tratamentoId;
    }

    if (dataInicio || dataFim) {
      where.dataEnvio = {};
      if (dataInicio) {
        where.dataEnvio.gte = dataInicio;
      }
      if (dataFim) {
        where.dataEnvio.lte = dataFim;
      }
    }

    if (search) {
      // SQLite doesn't support mode: 'insensitive', so we search case-sensitively
      where.OR = [
        { nome: { contains: search } },
        { email: { contains: search } },
        { telefone: { contains: search } },
      ];
    }

    const [agendamentos, total] = await Promise.all([
      prisma.agendamento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
        include: {
          tratamento: {
            select: {
              id: true,
              nome: true,
              slug: true,
            },
          },
        },
      }),
      prisma.agendamento.count({ where }),
    ]);

    return {
      data: agendamentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: {
        tratamento: true,
      },
    });

    if (!agendamento) {
      throw new NotFoundError('Agendamento');
    }

    return agendamento;
  }

  async create(data) {
    // Verificar se tratamento existe
    const tratamento = await prisma.tratamento.findUnique({
      where: { id: data.tratamentoId },
    });

    if (!tratamento) {
      throw new NotFoundError('Tratamento');
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        tratamentoId: data.tratamentoId,
        dataAgendada: data.dataAgendada,
        notas: data.notas,
        status: 'PENDENTE',
      },
      include: {
        tratamento: true,
      },
    });

    // Enviar email de notificação (não bloqueia a resposta)
    emailService.sendAgendamentoNotification(agendamento, tratamento)
      .catch((error) => {
        console.error('Failed to send notification email:', error);
      });

    return agendamento;
  }

  async update(id, data) {
    await this.findById(id);

    return prisma.agendamento.update({
      where: { id },
      data,
      include: {
        tratamento: true,
      },
    });
  }

  async delete(id) {
    await this.findById(id);
    return prisma.agendamento.delete({
      where: { id },
    });
  }
}

export default new AgendamentosService();


