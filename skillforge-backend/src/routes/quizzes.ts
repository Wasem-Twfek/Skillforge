import express from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany();
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, questions, lessonId } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      !lessonId ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        error: 'title, lessonId, and a non-empty questions array are required',
      });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        course: {
          select: { instructorId: true },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (lesson.course.instructorId !== req.user!.id) {
      return res.status(403).json({ error: 'Only the course instructor can create quizzes' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: title.trim(),
        questions,
        lessonId,
      },
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

router.post('/:id/attempt', authenticate, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || !answers.every((answer) => Number.isInteger(answer))) {
      return res.status(400).json({ error: 'answers must be an array of integers' });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        questions: true,
        lesson: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user!.id,
          courseId: quiz.lesson.courseId,
        },
      },
      select: { id: true },
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled in this course' });
    }

    const questions = Array.isArray(quiz.questions)
      ? quiz.questions
      : [];

    if (answers.length !== questions.length) {
      return res.status(400).json({ error: 'Answer count does not match quiz questions' });
    }

    const score = questions.reduce((total, question, index) => {
      if (
        typeof question === 'object' &&
        question !== null &&
        'correctAnswer' in question &&
        typeof question.correctAnswer === 'number' &&
        answers[index] === question.correctAnswer
      ) {
        return total + 1;
      }
      return total;
    }, 0);

    const attempt = await prisma.attempt.create({
      data: {
        userId: req.user!.id,
        quizId: quiz.id,
        answers,
        score,
      },
    });

    res.status(201).json({
      id: attempt.id,
      quizId: attempt.quizId,
      score: attempt.score,
      total: questions.length,
      answers: attempt.answers,
      createdAt: attempt.createdAt,
    });
  } catch (error) {
    console.error('Error submitting quiz attempt:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to submit quiz attempt' });
  }
});

export default router;
