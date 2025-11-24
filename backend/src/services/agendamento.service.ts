import prisma from '../database/prisma';
import { NotFoundError } from '../utils/errors';
import { CreateAgendamentoDto, UpdateAgendamentoDto } from '../types/agendamento';
import { logger } from '../config/logger';
import { emailService } from './email.service';
import { env } from '../config/env';

class AgendamentoService {
  async findAll(query: {
    page: number;
    limit: number;
    status?: string;
    dataInicio?: string;
    dataFim?: string;
    email?: string;
  }) {
    const { page, limit, status, dataInicio, dataFim, email } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (email) {
      where.email = email;
    }
    if (dataInicio || dataFim) {
      where.dataEnvio = {};
      if (dataInicio) {
        where.dataEnvio.gte = new Date(dataInicio);
      }
      if (dataFim) {
        where.dataEnvio.lte = new Date(dataFim);
      }
    }

    const [data, total] = await Promise.all([
      prisma.agendamento.findMany({
        where,
        skip,
        take: limit,
        include: {
          tratamento: {
            select: {
              id: true,
              nome: true,
              slug: true,
            },
          },
        },
        orderBy: {
          dataEnvio: 'desc',
        },
      }),
      prisma.agendamento.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
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

  async create(data: CreateAgendamentoDto) {
    const agendamento = await prisma.agendamento.create({
      data: {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        tratamentoId: data.tratamentoId || null,
        dataAgendada: data.dataAgendada ? new Date(data.dataAgendada) : null,
        notas: data.notas || null,
        status: 'PENDENTE',
      },
      include: {
        tratamento: true,
      },
    });

    logger.info(`Agendamento criado: ${agendamento.id}`);

    // Enviar emails
    try {
      await emailService.sendAgendamentoConfirmacao(
        agendamento.email,
        agendamento.nome,
        agendamento.tratamento?.nome
      );

      await emailService.sendAgendamentoNotificacaoAdmin(
        env.ADMIN_EMAIL,
        {
          nome: agendamento.nome,
          email: agendamento.email,
          telefone: agendamento.telefone,
          tratamento: agendamento.tratamento?.nome,
        }
      );
    } catch (error) {
      logger.error('Erro ao enviar emails de agendamento:', error);
      // Não falhar o agendamento se email falhar
    }

    return agendamento;
  }

  async update(id: string, data: UpdateAgendamentoDto) {
    await this.findById(id); // Verifica se existe

    const updateData: any = {};
    if (data.status) {
      updateData.status = data.status;
    }
    if (data.dataAgendada !== undefined) {
      updateData.dataAgendada = data.dataAgendada ? new Date(data.dataAgendada) : null;
    }
    if (data.notas !== undefined) {
      updateData.notas = data.notas;
    }

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: updateData,
      include: {
        tratamento: true,
      },
    });

    logger.info(`Agendamento atualizado: ${id}`);
    return agendamento;
  }

  async delete(id: string) {
    await this.findById(id); // Verifica se existe

    await prisma.agendamento.delete({
      where: { id },
    });

    logger.info(`Agendamento deletado: ${id}`);
    return { success: true };
  }
}

export const agendamentoService = new AgendamentoService();
export default agendamentoService;

