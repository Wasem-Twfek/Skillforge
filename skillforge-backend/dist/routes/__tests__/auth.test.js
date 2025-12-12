"use strict";
/// <reference types="jest" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mock Express request and response
const mockRequest = () => {
    const req = {};
    req.body = {};
    req.params = {};
    req.query = {};
    return req;
};
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};
// Mock PrismaClient methods
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
            },
            $connect: jest.fn(),
            $disconnect: jest.fn(),
        })),
    };
});
// Example test suite
describe('Auth Controller', () => {
    let req;
    let prisma;
    beforeEach(() => {
        req = mockRequest();
        prisma = new client_1.PrismaClient();
        // Add any setup code here
    });
    // Example test case
    it('should authenticate a user with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock a user in the database
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            password: 'hashedPassword',
        };
        // Setup mock implementation
        prisma.user.findUnique.mockResolvedValue(mockUser);
        // Mock JWT sign
        jest.spyOn(jsonwebtoken_1.default, 'sign').mockImplementation(() => 'test-token');
        // Setup request
        req.body = {
            email: 'test@example.com',
            password: 'password123',
        };
        // Call the login function (adjust based on your actual controller)
        // await authController.login(req, res);
        // Example assertions
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith(
        //   expect.objectContaining({
        //     token: 'test-token',
        //     user: expect.objectContaining({ id: '1', email: 'test@example.com' }),
        //   })
        // );
    }));
});
