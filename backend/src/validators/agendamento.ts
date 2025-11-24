import { z } from 'zod';

const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?(\d{4,5}[-.\s]?\d{4})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createAgendamentoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  telefone: z.string().regex(phoneRegex, 'Telefone inválido'),
  email: z.string().email('Email inválido').regex(emailRegex),
  tratamentoId: z.string().uuid('ID de tratamento inválido').optional().nullable(),
  dataAgendada: z.string().datetime().optional().nullable(),
  notas: z.string().max(1000).optional(),
  recaptchaToken: z.string().optional(),
});

export const updateAgendamentoSchema = z.object({
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO']).optional(),
  dataAgendada: z.string().datetime().optional().nullable(),
  notas: z.string().max(1000).optional(),
});

export const queryAgendamentoSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO']).optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  email: z.string().email().optional(),
});

