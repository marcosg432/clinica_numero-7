import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { Request, Response } from 'express';

export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: {
      message: 'Muitas requisições. Tente novamente mais tarde.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Muitas requisições. Tente novamente mais tarde.',
      },
    });
  },
});

export const agendamentoRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_AGENDAMENTO_WINDOW_MS,
  max: env.RATE_LIMIT_AGENDAMENTO_MAX_REQUESTS,
  message: {
    success: false,
    error: {
      message: 'Limite de agendamentos excedido. Tente novamente mais tarde.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Limitar por IP + email se disponível
    return req.body?.email ? `${req.ip}-${req.body.email}` : req.ip;
  },
});

