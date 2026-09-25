// Import the PrismaClient from the standard location
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';

// Declare global variable for PrismaClient to avoid multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient with explicit connection URL
// Query/info logging is restricted to development: query logs are verbose and
// can carry row data, so production and test run error-only.
const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: config.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

// Save prisma client to global in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

console.log('Prisma initialized with database connection');

export default prisma;