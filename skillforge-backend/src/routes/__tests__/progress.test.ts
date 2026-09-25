/// <reference types="jest" />

// Regression coverage for the Phase 6 NaN-progress fix in
// `POST /api/courses/:id/progress` (src/routes/courses.ts).
// The guard `totalLessons > 0 ? ... : 0` prevents 0/0 = NaN (which JSON
// serializes as null) for courses with zero lessons. This test exercises
// the real route handler with mocked persistence and a stubbed auth gate.

import express from 'express';
import coursesRouter from '../courses';
import prisma from '../../lib/prisma';

jest.mock('../../middleware/auth', () => ({
  authenticate: (req: { user?: unknown }, _res: unknown, next: () => void) => {
    req.user = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      picture: null,
      bio: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    next();
  },
}));

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    course: { findMany: jest.fn(), findUnique: jest.fn() },
    enrollment: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
    lesson: { findMany: jest.fn(), count: jest.fn() },
    lessonProgress: { upsert: jest.fn(), count: jest.fn() },
  },
}));

type MockedPrisma = {
  enrollment: { findFirst: jest.Mock };
  lesson: { count: jest.Mock };
  lessonProgress: { upsert: jest.Mock; count: jest.Mock };
};

const mocked = prisma as unknown as MockedPrisma;

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/courses', coursesRouter);
  return app;
};

describe('POST /api/courses/:id/progress (NaN guard)', () => {
  let server: import('http').Server;
  let baseUrl: string;

  beforeAll((done) => {
    const app = buildApp();
    server = app.listen(0, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(() => done());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mocked.enrollment.findFirst.mockResolvedValue({ id: 'enroll-1' });
  });

  it('returns progress 0 (not NaN/null) for a course with zero lessons', async () => {
    mocked.lesson.count.mockResolvedValue(0);
    mocked.lessonProgress.count.mockResolvedValue(0);

    const res = await fetch(`${baseUrl}/api/courses/course-empty/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: 'lesson-1', completed: true }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as { progress: number };
    expect(body.progress).toBe(0);
    expect(Number.isNaN(body.progress)).toBe(false);
  });

  it('returns correctly rounded progress for a course with lessons', async () => {
    mocked.lesson.count.mockResolvedValue(3);
    mocked.lessonProgress.count.mockResolvedValue(2);

    const res = await fetch(`${baseUrl}/api/courses/course-1/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: 'lesson-2', completed: true }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as { progress: number };
    expect(body.progress).toBe(67);
  });

  it('returns 404 when the caller is not enrolled', async () => {
    mocked.enrollment.findFirst.mockResolvedValue(null);

    const res = await fetch(`${baseUrl}/api/courses/course-1/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: 'lesson-1', completed: true }),
    });

    expect(res.status).toBe(404);
  });
});
