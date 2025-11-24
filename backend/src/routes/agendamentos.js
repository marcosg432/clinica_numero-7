import express from 'express';
import {
  listAgendamentos,
  getAgendamentoById,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento,
} from '../controllers/agendamentosController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { agendamentoLimiter } from '../middleware/rateLimiter.js';
import {
  createAgendamentoSchema,
  updateAgendamentoSchema,
  listAgendamentosSchema,
} from '../validators/agendamentos.js';

const router = express.Router();

// Público - criar agendamento
router.post(
  '/',
  agendamentoLimiter,
  validate(createAgendamentoSchema),
  createAgendamento
);

// Admin routes
router.get(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(listAgendamentosSchema),
  listAgendamentos
);

router.get('/:id', authenticate, requireRole('ADMIN'), getAgendamentoById);

router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(updateAgendamentoSchema),
  updateAgendamento
);

router.delete('/:id', authenticate, requireRole('ADMIN'), deleteAgendamento);

export default router;


