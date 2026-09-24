import express from 'express';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';
import { toPublicQuestions } from '../lib/quiz';

const router = express.Router();

router.get('/', authenticate, async (_req, res) => {
  try {
    const lessons = await prisma.lesson.findMany();
    res.json(lessons);
  } catch (error) {
    console.error(
      'Error fetching lessons:',
      error instanceof Error ? error.message : 'unknown error',
    );
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

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

    res.json({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      courseId: lesson.courseId,
      order: lesson.order,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      quiz: lesson.quiz
        ? {
            id: lesson.quiz.id,
            title: lesson.quiz.title,
            lessonId: lesson.quiz.lessonId,
            questions: toPublicQuestions(lesson.quiz.questions),
          }
        : null,
    });
  } catch (error) {
    console.error(
      'Error fetching lesson:',
      error instanceof Error ? error.message : 'unknown error',
    );
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, description, courseId, order } = req.body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      typeof content !== 'string' ||
      typeof description !== 'string' ||
      typeof courseId !== 'string' ||
      !Number.isInteger(order)
    ) {
      return res.status(400).json({
        error: 'title, content, description, courseId, and integer order are required',
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== req.user!.id) {
      return res.status(403).json({
        error: 'Only the course instructor can create lessons',
      });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        content,
        description,
        courseId,
        order,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error(
      'Error creating lesson:',
      error instanceof Error ? error.message : 'unknown error',
    );
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

export default router;
