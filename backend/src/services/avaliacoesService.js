import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

class AvaliacoesService {
  async findAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      aprovado,
      nota,
      orderBy = 'dataAvaliacao',
      order = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const where = {};

    if (aprovado !== undefined) {
      where.aprovado = aprovado;
    }

    if (nota) {
      where.nota = nota;
    }

    const [avaliacoes, total] = await Promise.all([
      prisma.avaliacao.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
      }),
      prisma.avaliacao.count({ where }),
    ]);

    return {
      data: avaliacoes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id },
    });

    if (!avaliacao) {
      throw new NotFoundError('Avaliacao');
    }

    return avaliacao;
  }

  async create(data) {
    // Gerar avatar se não fornecido
    const avatar = data.avatar || this.generateAvatar(data.nome);

    return prisma.avaliacao.create({
      data: {
        nome: data.nome,
        avatar,
        nota: data.nota,
        texto: data.texto,
        dataAvaliacao: data.dataAvaliacao || new Date(),
        aprovado: data.aprovado !== undefined ? data.aprovado : false, // Se admin definir, usar; senão false
      },
    });
  }

  async update(id, data) {
    await this.findById(id);

    return prisma.avaliacao.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    await this.findById(id);
    return prisma.avaliacao.delete({
      where: { id },
    });
  }

  generateAvatar(nome) {
    const palavras = nome.trim().split(' ');
    if (palavras.length >= 2) {
      return (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }
}

export default new AvaliacoesService();


