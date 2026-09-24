import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import { authenticate } from './middleware/auth';
import userRoutes from './routes/users';
import lessonRoutes from './routes/lessons';
import quizRoutes from './routes/quizzes';
import healthRoutes from './routes/health';
import prisma from './lib/prisma';
import { config } from './config/config';

const app = express();
const port = Number(config.PORT);

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  next();
});

app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '100kb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'SkillForge API',
    version: '1.0.0',
    description: 'API for the SkillForge learning platform',
    endpoints: {
      auth: {
        google: 'GET /auth/google',
        callback: 'GET /auth/google/callback',
        me: 'GET /auth/me (requires authentication)',
      },
      courses: {
        list: 'GET /api/courses',
        user: 'GET /api/courses/user (requires authentication)',
        detail: 'GET /api/courses/:id',
        courseLessons: 'GET /api/courses/:id/lessons',
        enroll: 'POST /api/courses/:id/enroll (requires authentication)',
        progress: 'POST /api/courses/:id/progress (requires authentication)',
      },
      users: {
        base: 'GET /api/users (requires authentication)',
        profile: 'GET /api/users/:id (requires authentication)',
        updateProfile: 'PUT /api/users/profile (requires authentication)',
      },
      lessons: {
        list: 'GET /api/lessons (requires authentication)',
        detail: 'GET /api/lessons/:id (requires authentication)',
      },
      quizzes: {
        list: 'GET /api/quizzes (requires authentication)',
        detail: 'GET /api/quizzes/:id (requires authentication)',
        attempt: 'POST /api/quizzes/:id/attempt (requires authentication)',
      },
    },
    health: 'GET /health',
  });
});

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/lessons', authenticate, lessonRoutes);
app.use('/api/quizzes', authenticate, quizRoutes);

app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

const server = app.listen(port, () => {
  console.log(`SkillForge API listening on port ${port}`);
});

function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully...`);

  server.close(() => {
    prisma.$disconnect()
      .then(() => {
        console.log('Prisma disconnected, shutdown complete');
        process.exit(0);
      })
      .catch((error) => {
        console.error(
          'Error disconnecting Prisma:',
          error instanceof Error ? error.message : 'unknown error',
        );
        process.exit(1);
      });
  });

  setTimeout(() => {
    console.error('Shutdown timed out, forcing exit');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
