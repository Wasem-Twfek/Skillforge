"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jest_mock_extended_1 = require("jest-mock-extended");
// Mock Prisma Client
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => (0, jest_mock_extended_1.mockDeep)()),
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
    const prisma = new client_1.PrismaClient();
    (0, jest_mock_extended_1.mockReset)(prisma);
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
