import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      error = new AppError('Registro duplicado', 409);
    } else if (err.code === 'P2025') {
      error = new AppError('Registro não encontrado', 404);
    } else {
      error = new AppError('Erro no banco de dados', 500);
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    error = new AppError('Dados inválidos', 400);
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    error = new AppError('Dados de validação inválidos', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Token inválido', 401);
  } else if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expirado', 401);
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error.message || 'Erro interno do servidor';

  // Log error
  if (statusCode >= 500) {
    logger.error({
      message: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn({
      message: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
};

