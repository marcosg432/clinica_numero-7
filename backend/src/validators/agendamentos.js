import { z } from 'zod';

const phoneRegex = /^[\d\s\(\)\-\+]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createAgendamentoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(200),
  telefone: z.string().regex(phoneRegex, 'Telefone inválido').min(10).max(20),
  email: z.string().email('Email inválido').toLowerCase(),
  tratamentoId: z.string().uuid('ID de tratamento inválido'),
  dataAgendada: z.coerce.date().optional(),
  notas: z.string().max(1000).optional(),
  recaptchaToken: z.string().optional(),
});

export const updateAgendamentoSchema = z.object({
  nome: z.string().min(3).max(200).optional(),
  telefone: z.string().regex(phoneRegex).min(10).max(20).optional(),
  email: z.string().email().toLowerCase().optional(),
  tratamentoId: z.string().uuid().optional(),
  dataAgendada: z.coerce.date().optional(),
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO']).optional(),
  notas: z.string().max(1000).optional(),
});

export const listAgendamentosSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['PENDENTE', 'CONFIRMADO', 'CANCELADO']).optional(),
  tratamentoId: z.string().uuid().optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
  search: z.string().optional(),
  orderBy: z.enum(['dataEnvio', 'dataAgendada', 'criadoEm']).default('dataEnvio'),
  order: z.enum(['asc', 'desc']).default('desc'),
});


