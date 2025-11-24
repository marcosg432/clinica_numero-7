/**
 * ⚠️ ROTA TEMPORÁRIA DE SETUP - REMOVER APÓS CRIAR O ADMIN ⚠️
 * 
 * Esta rota deve ser DESATIVADA ou REMOVIDA após criar o admin pela primeira vez.
 * 
 * Para desativar: Defina DISABLE_SETUP_ROUTE=true no Railway
 * Para remover: Delete este arquivo e remova do routes/index.js
 */

import express from 'express';
import { createAdmin } from '../controllers/setupController.js';
import { runMigrations } from '../controllers/migrateController.js';

const router = express.Router();

// Rota temporária para executar migrações
// Protegida por secret key via header X-Setup-Secret
router.post('/migrate', runMigrations);

// Rota temporária para criar admin
// Protegida por secret key via header X-Setup-Secret ou query ?secret=
router.post('/admin', createAdmin);

export default router;


