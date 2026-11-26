require('dotenv').config();

const required = ['MONGO_URI', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key] && process.env.NODE_ENV !== 'test') {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'test-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  useTransactions: process.env.USE_TRANSACTIONS !== 'false',
  allowDevRoutes:
    process.env.ALLOW_DEV_ROUTES === 'true' && process.env.NODE_ENV !== 'production',
};
