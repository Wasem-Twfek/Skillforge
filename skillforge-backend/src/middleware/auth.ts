import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config';

// Create Prisma client instance
const prisma = new PrismaClient();

// Define the shape of the user we attach to the request (matches the select below)
type AuthenticatedUser = {
	id: string;
	email: string;
	name: string;
	picture: string | null;
	bio: string | null;
	createdAt: Date;
	updatedAt: Date;
};

// Extend Express Request type to include the user property
declare global {
	namespace Express {
		interface Request {
			user?: AuthenticatedUser;
		}
	}
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	console.log('Auth middleware - Headers:', req.headers);
	console.log('Auth middleware - Token:', req.headers.authorization?.split(' ')[1]);
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
		console.log('Auth middleware - Decoded token:', decoded);
		
		const user = await prisma.user.findUnique({
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

		req.user = user as AuthenticatedUser;
		next();
	} catch (error) {
		console.error('Authentication error:', error);
		res.status(401).json({ error: 'Invalid token' });
	}
};