import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import { authenticate } from './middleware/auth';
import userRoutes from './routes/users';
import lessonRoutes from './routes/lessons';
import quizRoutes from './routes/quizzes';
import healthRoutes from './routes/health';
import { config } from './config/config';

if (!process.env.DOCKER) {
  dotenv.config();
}

const app = express();
const port = Number(config.PORT);

// Middleware
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route - API overview
app.get('/', (_req, res) => {
  res.json({
    name: 'SkillForge API',
    version: '1.0.0',
    description: 'API for the SkillForge learning platform',
    endpoints: {
      auth: {
        google: 'GET /auth/google',
        callback: 'GET /auth/google/callback',
        me: 'GET /auth/me (requires authentication)'
      },
      courses: {
        list: 'GET /api/courses',
        user: 'GET /api/courses/user (requires authentication)',
        detail: 'GET /api/courses/:id',
        enroll: 'POST /api/courses/:id/enroll (requires authentication)',
        progress: 'POST /api/courses/:id/progress (requires authentication)'
      },
      users: 'GET /api/users (requires authentication)',
      lessons: 'GET /api/lessons (requires authentication)',
      quizzes: 'GET /api/quizzes (requires authentication)'
    },
    health: 'GET /health'
  });
});

// Routes
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/lessons', authenticate, lessonRoutes);
app.use('/api/quizzes', authenticate, quizRoutes);

app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`SkillForge API listening on port ${port}`);
});
