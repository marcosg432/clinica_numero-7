import { z } from 'zod';

export const createTratamentoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  descricao: z.string().optional(),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  imagem: z.string().url().optional().or(z.literal('')),
  ativo: z.boolean().default(true),
});

export const updateTratamentoSchema = createTratamentoSchema.partial();

export const queryTratamentoSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  ativo: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  search: z.string().optional(),
  orderBy: z.enum(['nome', 'criadoEm', 'atualizadoEm']).default('nome'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

