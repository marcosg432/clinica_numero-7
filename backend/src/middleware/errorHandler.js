import logger from '../config/logger.js';
import { AppError } from '../utils/errors.js';
import { Prisma } from '@prisma/client';

export function errorHandler(err, req, res, next) {
  // Log erro
  logger.error({
    err: {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code,
    },
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // AppError personalizado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || null,
      },
    });
  }

  // Erros de validação Zod
  if (err.name === 'ZodError' && err.issues) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  // Erros do Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Violação de constraint único
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: `This ${field} already exists`,
          details: 'A record with this value already exists',
        },
      });
    }
    if (err.code === 'P2025') {
      // Registro não encontrado
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found',
        },
      });
    }
    if (err.code === 'P2003') {
      // Foreign key constraint failed
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REFERENCE',
          message: 'Invalid reference to related record',
        },
      });
    }
    // Outros erros do Prisma
    return res.status(400).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        ...(process.env.NODE_ENV !== 'production' && { details: err.message }),
      },
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid data format',
        ...(process.env.NODE_ENV !== 'production' && { details: err.message }),
      },
    });
  }

  // Erros JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Token expired',
      },
    });
  }

  // Erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Invalid JSON format',
      },
    });
  }

  // Erro padrão
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV !== 'production' && { 
        stack: err.stack,
        details: err.message,
      }),
    },
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}


