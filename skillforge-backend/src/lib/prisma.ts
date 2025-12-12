// Import the PrismaClient from the standard location
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';

// Declare global variable for PrismaClient to avoid multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient with explicit connection URL
const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: config.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Save prisma client to global in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

console.log('Prisma initialized with database connection');

export default prisma;