import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'change-me-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Email
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@clinicaodontoazul.com.br',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Clínica Odonto Azul',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',

  // Storage
  STORAGE_TYPE: process.env.STORAGE_TYPE || 'local',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),

  // AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
  AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT || '',

  // Security
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  RATE_LIMIT_AGENDAMENTO_WINDOW_MS: parseInt(process.env.RATE_LIMIT_AGENDAMENTO_WINDOW_MS || '3600000', 10),
  RATE_LIMIT_AGENDAMENTO_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_AGENDAMENTO_MAX_REQUESTS || '5', 10),

  // Recaptcha
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || '',

  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Admin
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@clinicaodontoazul.com.br',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'ChangeMe123!',

  // Retention
  RETENTION_DAYS: parseInt(process.env.RETENTION_DAYS || '90', 10),
};

// Validações
if (env.NODE_ENV === 'production') {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL é obrigatória em produção');
  }
  if (env.JWT_SECRET === 'change-me-in-production') {
    throw new Error('JWT_SECRET deve ser alterado em produção');
  }
}

