import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const missingVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.error(`⚠️  Railway deployment will fail without these variables!`);
  // Não sair imediatamente em produção - deixar o Railway mostrar o erro
  if (process.env.NODE_ENV === 'production') {
    console.error(`⚠️  Continuing anyway, but the app may crash...`);
  } else {
    process.exit(1);
  }
}

export default {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  
  database: {
    url: process.env.DATABASE_URL,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  email: {
    provider: process.env.SENDGRID_API_KEY ? 'sendgrid' : 'smtp',
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@clinicaodontoazul.com.br',
    name: process.env.EMAIL_NAME || 'Clínica Odonto Azul',
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      secure: process.env.SMTP_SECURE === 'true',
    },
  },
  
  storage: {
    type: process.env.STORAGE_TYPE || 'local',
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_BUCKET,
      endpoint: process.env.AWS_ENDPOINT,
    },
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    sessionSecret: process.env.SESSION_SECRET,
  },
  
  recaptcha: {
    enabled: process.env.RECAPTCHA_ENABLED === 'true',
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
  },
  
  sentry: {
    enabled: process.env.SENTRY_ENABLED === 'true',
    dsn: process.env.SENTRY_DSN,
  },
  
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@clinicaodontoazul.com.br',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!@#',
    name: process.env.ADMIN_NAME || 'Administrador',
  },
};


