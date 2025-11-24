import prisma from '../config/database.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { slugify } from '../utils/slugify.js';

class TratamentosService {
  async findAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      ativo,
      search,
      orderBy = 'criadoEm',
      order = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    if (search) {
      // SQLite doesn't support mode: 'insensitive', so we search case-sensitively
      where.OR = [
        { nome: { contains: search } },
        { descricao: { contains: search } },
      ];
    }

    const [tratamentos, total] = await Promise.all([
      prisma.tratamento.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
      }),
      prisma.tratamento.count({ where }),
    ]);

    return {
      data: tratamentos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { slug },
    });

    if (!tratamento) {
      throw new NotFoundError('Tratamento');
    }

    return tratamento;
  }

  async findById(id) {
    if (!id || id === 'undefined' || id === 'null') {
      throw new NotFoundError('Tratamento - ID inválido');
    }

    const tratamento = await prisma.tratamento.findUnique({
      where: { id },
    });

    if (!tratamento) {
      throw new NotFoundError('Tratamento');
    }

    return tratamento;
  }

  async create(data) {
    const slug = data.slug || slugify(data.nome);

    // Verificar se slug já existe
    const existing = await prisma.tratamento.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictError(`Tratamento with slug "${slug}" already exists`);
    }

    return prisma.tratamento.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async update(id, data) {
    console.log('=== UPDATE TRATAMENTO ===');
    console.log('ID recebido:', id);
    console.log('Tipo do ID:', typeof id);
    console.log('Data recebida:', data);
    
    if (!id || id === 'undefined' || id === 'null' || id === '') {
      console.error('ID inválido:', id);
      throw new NotFoundError('Tratamento - ID inválido para atualização');
    }

    // Verificar se o tratamento existe
    const existing = await this.findById(id);
    if (!existing) {
      console.error('Tratamento não encontrado com ID:', id);
      throw new NotFoundError('Tratamento não encontrado');
    }

    console.log('Tratamento encontrado:', existing.id);

    if (data.nome && !data.slug) {
      data.slug = slugify(data.nome);
    }

    if (data.slug) {
      const slugExisting = await prisma.tratamento.findUnique({
        where: { slug: data.slug },
      });

      if (slugExisting && slugExisting.id !== id) {
        throw new ConflictError(`Slug "${data.slug}" already exists`);
      }
    }

    console.log('Atualizando tratamento com ID:', id);
    const updated = await prisma.tratamento.update({
      where: { id },
      data,
    });
    console.log('Tratamento atualizado com sucesso:', updated.id);
    console.log('======================');
    
    return updated;
  }

  async delete(id) {
    if (!id || id === 'undefined' || id === 'null') {
      throw new NotFoundError('Tratamento - ID inválido para exclusão');
    }

    await this.findById(id);
    return prisma.tratamento.delete({
      where: { id },
    });
  }
}

export default new TratamentosService();


