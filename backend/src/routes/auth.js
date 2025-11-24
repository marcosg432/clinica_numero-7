import express from 'express';
import { login, refreshToken, logout, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.js';

const router = express.Router();

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refreshToken);
router.post('/logout', logout);
router.get('/profile', authenticate, getProfile);

export default router;


