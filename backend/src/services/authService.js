import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import config from '../config/env.js';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '../utils/errors.js';

class AuthService {
  async login(email, password) {
    const user = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.ativo) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenError('Account is locked. Please try again later.');
    }

    const isValidPassword = await bcrypt.compare(password, user.senhaHash);

    if (!isValidPassword) {
      // Incrementar tentativas falhadas
      const failedAttempts = user.failedAttempts + 1;
      const maxAttempts = 5;
      
      await prisma.usuario.update({
        where: { id: user.id },
        data: {
          failedAttempts,
          ...(failedAttempts >= maxAttempts && {
            lockedUntil: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
          }),
        },
      });

      throw new UnauthorizedError('Invalid credentials');
    }

    // Reset tentativas e atualizar last login
    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.ativo) {
        throw new UnauthorizedError();
      }

      const newAccessToken = this.generateAccessToken(user.id);
      const newRefreshToken = this.generateRefreshToken(user.id);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  generateAccessToken(userId) {
    return jwt.sign(
      { userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  generateRefreshToken(userId) {
    return jwt.sign(
      { userId },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }

  async hashPassword(password) {
    return bcrypt.hash(password, config.security.bcryptSaltRounds);
  }
}

export default new AuthService();


