// Type definitions for Express
import { User } from '@prisma/client';

declare global {
  namespace Express {
    // Extend Express.User with our User properties
    interface User {
      id: string;
      email: string;
      name: string;
    }
  }
} 