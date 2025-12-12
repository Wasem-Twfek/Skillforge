import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
  };
});

// Mock Redis
jest.mock('ioredis', () => {
  const Redis = jest.fn();
  Redis.prototype.get = jest.fn();
  Redis.prototype.set = jest.fn();
  Redis.prototype.del = jest.fn();
  Redis.prototype.connect = jest.fn();
  Redis.prototype.disconnect = jest.fn();
  return Redis;
});

// Reset all mocks before each test
beforeEach(() => {
  const prisma = new PrismaClient();
  mockReset(prisma);
});

// Set environment variables for testing
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

// Mock console.error to avoid polluting test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

// Restore console.error after tests
afterAll(() => {
  console.error = originalConsoleError;
}); 