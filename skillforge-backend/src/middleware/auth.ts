import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { config } from '../config/config';

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
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
		
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
		
		if (!user) {
			return res.status(401).json({ error: 'User not found' });
		}

		req.user = user as AuthenticatedUser;
		next();
	} catch (error) {
		console.error('Authentication error:', error instanceof Error ? error.message : 'unknown error');
		res.status(401).json({ error: 'Invalid token' });
	}
};