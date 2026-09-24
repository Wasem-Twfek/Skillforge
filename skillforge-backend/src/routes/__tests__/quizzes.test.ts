/// <reference types="jest" />

import express from 'express';
import quizzesRouter from '../quizzes';
import prisma from '../../lib/prisma';

jest.mock('../../middleware/auth', () => ({
  authenticate: (req: { user?: unknown }, _res: unknown, next: () => void) => {
    req.user = {
      id: 'user-1',
      email: 'student@example.com',
      name: 'Test Student',
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
    quiz: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
    },
    attempt: {
      create: jest.fn(),
    },
    lesson: {
      findUnique: jest.fn(),
    },
  },
}));

const mocked = prisma as unknown as {
  quiz: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
  };
  enrollment: {
    findUnique: jest.Mock;
  };
  attempt: {
    create: jest.Mock;
  };
  lesson: {
    findUnique: jest.Mock;
  };
};

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/quizzes', quizzesRouter);
  return app;
};

describe('quiz API', () => {
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
    mocked.enrollment.findUnique.mockResolvedValue({ id: 'enrollment-1' });
    mocked.attempt.create.mockResolvedValue({
      id: 'attempt-1',
      quizId: 'quiz-1',
      score: 1,
      answers: [1, 0],
      createdAt: new Date('2026-09-24T12:00:00Z'),
    });
  });

  it('does not expose correct answers in quiz listings', async () => {
    mocked.quiz.findMany.mockResolvedValue([
      {
        id: 'quiz-1',
        title: 'JavaScript Basics',
        lessonId: 'lesson-1',
        questions: [
          {
            id: 'q1',
            question: 'What is JavaScript?',
            options: ['Markup', 'Programming language'],
            correctAnswer: 1,
          },
        ],
      },
    ]);

    const res = await fetch(`${baseUrl}/api/quizzes`);
    expect(res.status).toBe(200);

    const body = (await res.json()) as Array<{ questions: Array<Record<string, unknown>> }>;
    expect(body[0].questions[0]).toEqual({
      id: 'q1',
      question: 'What is JavaScript?',
      options: ['Markup', 'Programming language'],
    });
  });

  it('calculates the score on the server and ignores client score/userId', async () => {
    mocked.quiz.findUnique.mockResolvedValue({
      id: 'quiz-1',
      questions: [
        {
          id: 'q1',
          question: 'Question 1',
          options: ['A', 'B'],
          correctAnswer: 1,
        },
        {
          id: 'q2',
          question: 'Question 2',
          options: ['A', 'B'],
          correctAnswer: 0,
        },
      ],
      lesson: {
        courseId: 'course-1',
      },
    });

    const res = await fetch(`${baseUrl}/api/quizzes/quiz-1/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'different-user',
        score: 999,
        answers: [1, 0],
      }),
    });

    expect(res.status).toBe(201);

    const body = (await res.json()) as {
      score: number;
      total: number;
      results: Array<{ isCorrect: boolean }>;
    };

    expect(body.score).toBe(2);
    expect(body.total).toBe(2);
    expect(body.results.map((result) => result.isCorrect)).toEqual([true, true]);

    expect(mocked.attempt.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        quizId: 'quiz-1',
        answers: [1, 0],
        score: 2,
      },
    });
  });

  it('rejects attempts from users who are not enrolled', async () => {
    mocked.quiz.findUnique.mockResolvedValue({
      id: 'quiz-1',
      questions: [
        {
          id: 'q1',
          question: 'Question 1',
          options: ['A', 'B'],
          correctAnswer: 0,
        },
      ],
      lesson: {
        courseId: 'course-1',
      },
    });
    mocked.enrollment.findUnique.mockResolvedValue(null);

    const res = await fetch(`${baseUrl}/api/quizzes/quiz-1/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: [0] }),
    });

    expect(res.status).toBe(403);
    expect(mocked.attempt.create).not.toHaveBeenCalled();
  });
});
