import prisma from '../database/prisma';
import { NotFoundError, ValidationError } from '../utils/errors';
import { CreateTratamentoDto, UpdateTratamentoDto } from '../types/tratamento';
import { logger } from '../config/logger';

class TratamentoService {
  async findAll(query: {
    page: number;
    limit: number;
    ativo?: boolean;
    search?: string;
    orderBy: string;
    order: 'asc' | 'desc';
  }) {
    const { page, limit, ativo, search, orderBy, order } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (ativo !== undefined) {
      where.ativo = ativo;
    }
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.tratamento.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderBy]: order,
        },
      }),
      prisma.tratamento.count({ where }),
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

  async findBySlug(slug: string) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { slug },
    });

    if (!tratamento) {
      throw new NotFoundError('Tratamento');
    }

    return tratamento;
  }

  async findById(id: string) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { id },
    });

    if (!tratamento) {
      throw new NotFoundError('Tratamento');
    }

    return tratamento;
  }

  async create(data: CreateTratamentoDto) {
    // Verificar se slug já existe
    const existing = await prisma.tratamento.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ValidationError('Slug já existe');
    }

    const tratamento = await prisma.tratamento.create({
      data,
    });

    logger.info(`Tratamento criado: ${tratamento.id}`);
    return tratamento;
  }

  async update(id: string, data: UpdateTratamentoDto) {
    await this.findById(id); // Verifica se existe

    // Se estiver atualizando slug, verificar se não existe outro com mesmo slug
    if (data.slug) {
      const existing = await prisma.tratamento.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ValidationError('Slug já existe');
      }
    }

    const tratamento = await prisma.tratamento.update({
      where: { id },
      data,
    });

    logger.info(`Tratamento atualizado: ${id}`);
    return tratamento;
  }

  async delete(id: string) {
    await this.findById(id); // Verifica se existe

    // Soft delete: apenas desativar
    const tratamento = await prisma.tratamento.update({
      where: { id },
      data: { ativo: false },
    });

    logger.info(`Tratamento desativado: ${id}`);
    return tratamento;
  }
}

export const tratamentoService = new TratamentoService();
export default tratamentoService;

