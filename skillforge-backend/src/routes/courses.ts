import express from 'express';
import prisma from '../lib/prisma';
import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        lessons: true,
      },
    });

    const updatedCourses = courses.map(course => {
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        instructor: {
          id: course.instructor.id,
          name: course.instructor.name,
          avatar: course.instructor.avatar,
          bio: course.instructor.bio,
        },
        category: course.category,
        level: course.level,
        lessons: course.lessons,
      };
    });

    res.json(updatedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get user's enrolled courses
router.get('/user', authenticate, async (req: Request, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      console.error('[/api/courses/user] No user ID found in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true,
                bio: true,
              },
            },
            lessons: true,
          },
        },
        progress: true,
      },
    });

    const userCourses = enrollments.map(enrollment => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.progress.length;
      const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        thumbnail: enrollment.course.thumbnail,
        instructor: {
          id: enrollment.course.instructor.id,
          name: enrollment.course.instructor.name,
          avatar: enrollment.course.instructor.avatar,
          bio: enrollment.course.instructor.bio,
        },
        progress: Math.round(progress),
        enrolledAt: enrollment.enrolledAt,
        category: enrollment.course.category,
        level: enrollment.course.level,
      };
    });

    res.json(userCourses);
  } catch (error) {
    console.error('Error fetching user courses:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to fetch user courses' });
  }
});

// Get all lessons for a course (used by the course detail UI)
router.get('/:id/lessons', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId: req.params.id },
      orderBy: { order: 'asc' },
      include: { quiz: true },
    });

    res.json(lessons);
  } catch (error) {
    console.error(
      'Error fetching course lessons:',
      error instanceof Error ? error.message : 'unknown error',
    );
    res.status(500).json({ error: 'Failed to fetch course lessons' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Enroll in a course
router.post('/:id/enroll', authenticate, async (req: Request, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user!.id;

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        enrolledAt: new Date(),
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
            lessons: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error) {
    console.error('Error enrolling in course:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Update course progress
router.post('/:id/progress', authenticate, async (req: Request, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user!.id;
    const { lessonId, completed } = req.body;

    // Check enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }

    if (!lessonId || typeof completed !== 'boolean') {
      return res.status(400).json({
        error: 'lessonId and completed are required',
      });
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        courseId,
      },
      select: { id: true },
    });

    if (!lesson) {
      return res.status(400).json({
        error: 'Lesson does not belong to this course',
      });
    }

    if (completed) {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        update: {
          completedAt: new Date(),
          enrollmentId: enrollment.id,
        },
        create: {
          userId,
          lessonId,
          enrollmentId: enrollment.id,
          completedAt: new Date(),
        },
      });
    } else {
      await prisma.lessonProgress.deleteMany({
        where: {
          userId,
          lessonId,
          enrollmentId: enrollment.id,
        },
      });
    }

    // Calculate new progress
    const totalLessons = await prisma.lesson.count({
      where: { courseId },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        lesson: {
          courseId,
        },
      },
    });

    // Guard against division by zero: a course with no lessons would
    // otherwise yield NaN (0/0), which serializes to null in JSON.
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({ progress });
  } catch (error) {
    console.error('Error updating course progress:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({ error: 'Failed to update course progress' });
  }
});

export default router; 