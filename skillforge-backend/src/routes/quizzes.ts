import express from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';
import { QuizQuestion, toPublicQuestions } from '../lib/quiz';

const router = express.Router();

router.get('/', authenticate, async (_req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        lessonId: true,
        questions: true,
      },
    });

    res.json(
      quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        lessonId: quiz.lessonId,
        questions: toPublicQuestions(quiz.questions),
      })),
    );
  } catch (error) {
    console.error(
      'Error fetching quizzes:',
      error instanceof Error ? error.message : 'unknown error',
    );
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      id: quiz.id,
      title: quiz.title,
      lessonId: quiz.lessonId,
      questions: toPublicQuestions(quiz.questions),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });
  } catch (error) {
    console.error(
      'Error fetching quiz:',
      error instanceof Error ? error.message : 'unknown error',
    );
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, questions, lessonId } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof lessonId !== 'string' ||
      !lessonId ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        error: 'title, lessonId, and a non-empty questions array are required',
      });
    }

    const validQuestions = questions.every((question: unknown) => {
      if (typeof question !== 'object' || question === null) {
        return false;
      }

      const item = question as QuizQuestion;
      return (
        typeof item.question === 'string' &&
        Array.isArray(item.options) &&
        item.options.length > 0 &&
        typeof item.correctAnswer === 'number' &&
        Number.isInteger(item.correctAnswer) &&
        item.correctAnswer >= 0 &&
        item.correctAnswer < item.options.length
      );
    });

    if (!validQuestions) {
      return res.status(400).json({
        error: 'Each question must contain text, options, and a valid correctAnswer',
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
      return res.status(403).json({
        error: 'Only the course instructor can create quizzes',
      });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: title.trim(),
        questions,
        lessonId,
      },
    });

    res.status(201).json({
      id: quiz.id,
      title: quiz.title,
      lessonId: quiz.lessonId,
      questions: toPublicQuestions(quiz.questions),
    });
  } catch (error) {
    console.error(
      'Error creating quiz:',
      error instanceof Error ? error.message : 'unknown error',
    );
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
      ? (quiz.questions as QuizQuestion[])
      : [];

    if (answers.length !== questions.length) {
      return res.status(400).json({ error: 'Answer count does not match quiz questions' });
    }

    const results = questions.map((question, index) => ({
      selectedAnswer: answers[index],
      correctAnswer: question.correctAnswer ?? -1,
      isCorrect: answers[index] === question.correctAnswer,
    }));

    const score = results.reduce(
      (total, result) => total + (result.isCorrect ? 1 : 0),
      0,
    );

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
      score,
      total: questions.length,
      results,
      createdAt: attempt.createdAt,
    });
  } catch (error) {
    console.error(
      'Error submitting quiz attempt:',
      error instanceof Error ? error.message : 'unknown error',
    );
    res.status(500).json({ error: 'Failed to submit quiz attempt' });
  }
});

export default router;
