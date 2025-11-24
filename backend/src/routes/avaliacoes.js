import express from 'express';
import {
  listAvaliacoes,
  getAvaliacaoById,
  createAvaliacao,
  updateAvaliacao,
  deleteAvaliacao,
} from '../controllers/avaliacoesController.js';
import { authenticate, requireRole, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { generalLimiter } from '../middleware/rateLimiter.js';
import {
  createAvaliacaoSchema,
  updateAvaliacaoSchema,
  listAvaliacoesSchema,
} from '../validators/avaliacoes.js';

const router = express.Router();

router.get(
  '/',
  optionalAuth,
  validate(listAvaliacoesSchema),
  listAvaliacoes
);

router.post(
  '/',
  generalLimiter,
  (req, res, next) => {
    console.log('=== POST /avaliacoes ===');
    console.log('Body recebido:', req.body);
    console.log('Headers:', req.headers);
    next();
  },
  validate(createAvaliacaoSchema),
  createAvaliacao
);

// Admin routes
router.get('/:id', authenticate, requireRole('ADMIN'), getAvaliacaoById);

router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(updateAvaliacaoSchema),
  updateAvaliacao
);

router.delete('/:id', authenticate, requireRole('ADMIN'), deleteAvaliacao);

export default router;


