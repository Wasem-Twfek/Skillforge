import 'dotenv/config';

function optional(value: string | undefined): string {
  return value ?? '';
}

function requiredInProduction(name: string, value: string): string {
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable ${name} in production`);
  }
  return value;
}

const JWT_SECRET = requiredInProduction('JWT_SECRET', process.env.JWT_SECRET);

export const config = {
  PORT: process.env.PORT || '3001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_SECRET,
  DATABASE_URL: optional(process.env.DATABASE_URL),
  REDIS_URL: optional(process.env.REDIS_URL),
  GOOGLE_CLIENT_ID: optional(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: optional(process.env.GOOGLE_CLIENT_SECRET),
  GOOGLE_REDIRECT_URI:
    process.env.GOOGLE_REDIRECT_URI ||
    'http://localhost:3001/auth/google/callback',
};

export type AppConfig = typeof config;
