import express from 'express';
import tratamentosRouter from './tratamentos.js';
import agendamentosRouter from './agendamentos.js';
import avaliacoesRouter from './avaliacoes.js';
import authRouter from './auth.js';
import setupRouter from './setup.js';

const router = express.Router();

router.use('/tratamentos', tratamentosRouter);
router.use('/agendamento', agendamentosRouter);
router.use('/avaliacoes', avaliacoesRouter);
router.use('/auth', authRouter);
router.use('/setup', setupRouter);

export default router;


