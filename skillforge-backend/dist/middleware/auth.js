"use strict";
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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config/config");
// Create Prisma client instance
const prisma = new client_1.PrismaClient();
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('Auth middleware - Headers:', req.headers);
    console.log('Auth middleware - Token:', (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    try {
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        console.log('Auth middleware - Decoded token:', decoded);
        const user = yield prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                picture: true,
                bio: true,
                createdAt: true,
                updatedAt: true
            },
        });
        console.log('Auth middleware - Found user:', user);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});
exports.authenticate = authenticate;
