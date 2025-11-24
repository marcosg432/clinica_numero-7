import express from 'express';
import { createAdmin } from '../controllers/setupController.js';

const router = express.Router();

// Rota temporária para criar admin
// Protegida por secret key via header X-Setup-Secret ou query ?secret=
router.post('/admin', createAdmin);

export default router;

