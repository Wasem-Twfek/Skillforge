"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the PrismaClient from the standard location
const client_1 = require("@prisma/client");
const config_1 = require("../config/config");
// Create a singleton instance of PrismaClient with explicit connection URL
const prisma = global.prisma || new client_1.PrismaClient({
    datasources: {
        db: {
            url: config_1.config.DATABASE_URL,
        },
    },
    log: ['query', 'info', 'warn', 'error'],
});
// Save prisma client to global in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production')
    global.prisma = prisma;
console.log('Prisma initialized with database connection');
exports.default = prisma;
