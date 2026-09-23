// Central backend configuration, backed exclusively by the environment.
// No hardcoded secrets or credential fallbacks (see ADR-001). Non-secret
// defaults below mirror `src/server.ts`. Secrets/credentials default to an
// empty string (feature disabled / must be configured); production refuses to
// boot without `JWT_SECRET` (fail fast, same rule as `src/server.ts`).
// Nothing here logs values — presence logging lives with the callers.

function requiredInProduction(name: string, value: string): string {
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable ${name} in production`);
  }
  return value;
}

const JWT_SECRET = requiredInProduction('JWT_SECRET', process.env.JWT_SECRET || '');

export const config = {
  PORT: process.env.PORT || '3001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
};

export type AppConfig = typeof config;
