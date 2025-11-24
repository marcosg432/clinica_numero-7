import { z } from 'zod';

export const createTratamentoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200),
  descricao: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  imagem: z.string().optional().nullable().or(z.literal('')),
  ativo: z.boolean().optional().default(true),
});

export const updateTratamentoSchema = createTratamentoSchema.partial();

export const listTratamentosSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  ativo: z.coerce.boolean().optional(),
  search: z.string().optional(),
  orderBy: z.enum(['nome', 'criadoEm', 'atualizadoEm']).default('criadoEm'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

