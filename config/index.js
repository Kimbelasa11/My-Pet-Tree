const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  db: {
    path: path.resolve(__dirname, '..', process.env.DB_PATH || 'data/mypettree.db'),
  },

  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
  },

  payment: {
    gateway: process.env.PAYMENT_GATEWAY || 'mock',
    currency: process.env.CURRENCY || 'PHP',
    currencySymbol: process.env.CURRENCY_SYMBOL || '₱',
    paymongo: {
      secretKey: process.env.PAYMONGO_SECRET_KEY || '',
      publicKey: process.env.PAYMONGO_PUBLIC_KEY || '',
      webhookSecret: process.env.PAYMONGO_WEBHOOK_SECRET || '',
    },
    xendit: {
      secretKey: process.env.XENDIT_SECRET_KEY || '',
      webhookToken: process.env.XENDIT_WEBHOOK_TOKEN || '',
    },
  },

  uploads: {
    directory: path.resolve(__dirname, '..', 'public', 'uploads', 'images'),
    maxFileSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  },

  session: {
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'session-secret',
  },
};

module.exports = config;
