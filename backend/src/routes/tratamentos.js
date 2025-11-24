import express from 'express';
import {
  listTratamentos,
  getTratamentoBySlug,
  getTratamentoById,
  createTratamento,
  updateTratamento,
  deleteTratamento,
} from '../controllers/tratamentosController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import {
  createTratamentoSchema,
  updateTratamentoSchema,
  listTratamentosSchema,
} from '../validators/tratamentos.js';

const router = express.Router();

// Rotas públicas - GET apenas
router.get('/', validate(listTratamentosSchema), listTratamentos);

// Rotas admin específicas - IMPORTANTE: rotas específicas DEVEM vir ANTES de rotas genéricas
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(createTratamentoSchema),
  createTratamento
);

// Rotas admin com ID/Slug - devem vir antes da rota genérica GET /:slug
router.get('/id/:id', authenticate, requireRole('ADMIN'), getTratamentoById);
router.put(
  '/:id',
  (req, res, next) => {
    console.log('=== ROTA PUT /tratamentos/:id CHAMADA ===');
    console.log('Method:', req.method);
    console.log('Original URL:', req.originalUrl);
    console.log('Path:', req.path);
    console.log('Params:', req.params);
    console.log('ID recebido:', req.params.id);
    console.log('========================================');
    next();
  },
  authenticate,
  requireRole('ADMIN'),
  validate(updateTratamentoSchema),
  updateTratamento
);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteTratamento);

// Rota genérica por slug - DEVE vir POR ÚLTIMO para não capturar outros padrões
router.get('/:slug', getTratamentoBySlug);

export default router;


