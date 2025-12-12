import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        quizzes: true
      }
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Get a single lesson with its quizzes
router.get('/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        quizzes: true
      }
    });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Create a new lesson
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, content } = req.body;
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content
      }
    });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Create a quiz for a lesson
router.post('/:lessonId/quizzes', auth, async (req, res) => {
  try {
    const { title, questions } = req.body;
    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions,
        lessonId: req.params.lessonId
      }
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Submit quiz attempt
router.post('/quizzes/:quizId/attempt', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.quizId }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score (you might want to implement more sophisticated scoring)
    const score = calculateScore(answers, quiz.questions);

    const attempt = await prisma.attempt.create({
      data: {
        userId: req.user.id,
        quizId: req.params.quizId,
        score,
        answers
      }
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quiz attempt' });
  }
});

// Helper function to calculate quiz score
function calculateScore(userAnswers, quizQuestions) {
  // Implement your scoring logic here
  // This is a simple example that assumes each question is worth 1 point
  let score = 0;
  const questions = quizQuestions.questions;
  
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].correctAnswer) {
      score++;
    }
  }
  
  return score;
}

export default router;