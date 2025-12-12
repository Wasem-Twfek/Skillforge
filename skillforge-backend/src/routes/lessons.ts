import express from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// Get all lessons
router.get('/', authenticate, async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Get lesson by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        quiz: true,
      },
    });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Create lesson
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, description, courseId, order } = req.body;
    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        description,
        courseId,
        order,
      },
    });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

export default router; 