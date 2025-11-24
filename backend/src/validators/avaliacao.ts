import { z } from 'zod';

export const createAvaliacaoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(255),
  avatar: z.string().max(10).optional(),
  nota: z.number().int().min(1).max(5),
  texto: z.string().min(10, 'Texto deve ter no mínimo 10 caracteres').max(1000),
  dataAvaliacao: z.string().datetime().optional(),
});

export const queryAvaliacaoSchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  order: z.enum(['asc', 'desc']).default('desc'),
  aprovada: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
});

