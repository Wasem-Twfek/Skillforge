import express from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// Get all quizzes
router.get('/', authenticate, async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quiz by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
    });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create quiz
router.post('/', async (req, res) => {
  try {
    const { title, questions, lessonId } = req.body;
    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions,
        lessonId,
      },
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Submit quiz attempt
router.post('/:id/attempt', async (req, res) => {
  try {
    const { userId, answers, score } = req.body;
    const attempt = await prisma.attempt.create({
      data: {
        userId,
        quizId: req.params.id,
        answers,
        score,
      },
    });
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quiz attempt' });
  }
});

export default router; 