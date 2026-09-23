import express from 'express';
import bcrypt from 'bcrypt';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// Get all users
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update own profile (used by the profile UI)
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { name, bio, avatar } = req.body;
    if (name === undefined && bio === undefined && avatar === undefined) {
      return res.status(400).json({ error: 'Nothing to update' });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        picture: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user (password is always hashed with bcrypt before storage)
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router; 