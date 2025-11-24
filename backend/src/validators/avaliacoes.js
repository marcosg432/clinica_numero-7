import { z } from 'zod';

export const createAvaliacaoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200),
  avatar: z.string().optional(),
  nota: z.number().int().min(1, 'Nota deve ser entre 1 e 5').max(5, 'Nota deve ser entre 1 e 5'),
  texto: z.string().min(10, 'Texto deve ter no mínimo 10 caracteres').max(1000),
  dataAvaliacao: z.coerce.date().optional(),
  aprovado: z.boolean().optional(), // Permitir que admin defina aprovação na criação
});

export const updateAvaliacaoSchema = createAvaliacaoSchema.partial();

export const listAvaliacoesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  aprovado: z.coerce.boolean().optional(),
  nota: z.coerce.number().int().min(1).max(5).optional(),
  orderBy: z.enum(['dataAvaliacao', 'nota', 'criadoEm']).default('dataAvaliacao'),
  order: z.enum(['asc', 'desc']).default('desc'),
});


