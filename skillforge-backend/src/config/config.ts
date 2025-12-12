// Direct configuration values - bypass .env file issues
export const config = {
  PORT: process.env.PORT || '3001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secure-jwt-secret',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/skillforge',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '746106499332-j5s5ecd56gohlup1acg1lvor7ggeo01j.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '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',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback',
};

console.log('Config loaded:', {
  PORT: config.PORT,
  NODE_ENV: config.NODE_ENV,
  FRONTEND_URL: config.FRONTEND_URL,
  DATABASE_URL: config.DATABASE_URL,
  GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
  GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
  GOOGLE_REDIRECT_URI: config.GOOGLE_REDIRECT_URI
}); 