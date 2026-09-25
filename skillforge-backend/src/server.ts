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
import prisma from './lib/prisma';

// In Docker, environment variables are passed directly, no need for dotenv
// Load .env file only if we're not in Docker
if (!process.env.DOCKER) {
  try {
    require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
    console.log('Successfully loaded .env file');
  } catch (error) {
    console.warn('Error loading .env file:', error instanceof Error ? error.message : 'unknown error');
  }
}

// Default environment variables (non-secret only).
// Secrets must come from the environment — no hardcoded credential fallbacks.
process.env.PORT = process.env.PORT || '3001';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
process.env.GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

// Fail fast when the JWT secret is missing in production. In development the
// auth middleware/config layer enforces the same requirement; no dev-secret
// fallback is provided on purpose so production can never silently use one.
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('Missing required environment variable JWT_SECRET in production');
}
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Authentication will fail until it is configured.');
}

console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'Not set'
});

const app = express();
const port = process.env.PORT || 3001;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Do not advertise the framework in responses.
// Baseline security headers without extra dependencies. No Content-Security-Policy:
// GET /auth/callback serves inline-script HTML (see src/routes/auth.ts), which a
// CSP without 'unsafe-inline' would break; CSP belongs to the Phase 5 auth work.
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  next();
});

// Middleware
app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Explicit body limit. The backend accepts only small JSON payloads (auth,
// lesson/quiz content, quiz answers) and serves no file uploads (no
// multer/multipart anywhere in src), so the 100kb Express default is locked in
// explicitly rather than inherited silently.
app.use(express.json({ limit: '100kb' }));

// Minimal request log — never log headers, tokens, or user objects.
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'SkillForge API',
    version: '1.0.0',
    description: 'API for the SkillForge learning platform',
    endpoints: {
      auth: {
        google: 'GET /auth/google - Initiate Google OAuth login',
        callback: 'GET /auth/google/callback - Handle Google OAuth callback',
        me: 'GET /auth/me - Get current user (requires authentication)'
      },
      courses: {
        list: 'GET /api/courses - Get all courses',
        user: 'GET /api/courses/user - Get user\'s enrolled courses (requires authentication)',
        detail: 'GET /api/courses/:id - Get course details',
        courseLessons: 'GET /api/courses/:id/lessons - Get all lessons for a course',
        enroll: 'POST /api/courses/:id/enroll - Enroll in a course (requires authentication)',
        progress: 'POST /api/courses/:id/progress - Update course progress (requires authentication)'
      },
      users: {
        base: 'GET /api/users - Get all users (requires authentication)',
        profile: 'GET /api/users/:id - Get user profile (requires authentication)',
        updateProfile: 'PUT /api/users/profile - Update own profile (requires authentication)'
      },
      lessons: {
        list: 'GET /api/lessons - Get all lessons (requires authentication)',
        detail: 'GET /api/lessons/:id - Get lesson details (requires authentication)'
      },
      quizzes: {
        list: 'GET /api/quizzes - Get all quizzes (requires authentication)',
        detail: 'GET /api/quizzes/:id - Get quiz details (requires authentication)',
        attempt: 'POST /api/quizzes/:id/attempt - Submit quiz attempt (requires authentication)'
      }
    },
    health: 'GET /health - Check API health status'
  });
});

// Routes
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
// Serve the same auth router under the /api/auth prefix: /api/auth/* is the
// canonical frontend-facing auth prefix (nginx rewrites it to /auth/* in
// production), so the backend accepts it directly in every environment
// (ADR-002). No route logic differs between the two mounts.
app.use('/api/auth', authRoutes);

// Public routes
app.use('/api/courses', courseRoutes);

// Protected routes
app.use('/api/users', authenticate, userRoutes);
app.use('/api/lessons', authenticate, lessonRoutes);
app.use('/api/quizzes', authenticate, quizRoutes);

// Protected route example
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Catch-all route for unhandled routes (must precede the error handler so
// errors thrown here still reach it)
app.use('*', (req, res) => {
  console.error(`[${new Date().toISOString()}] Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (last). Client responses stay generic; details go
// to server logs only.
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown so containers (SIGTERM) and local stops (SIGINT) close the
// HTTP server and release Prisma connections instead of hanging open.
function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    prisma.$disconnect().then(() => {
      console.log('Prisma disconnected, shutdown complete');
      process.exit(0);
    }).catch((error) => {
      console.error('Error disconnecting Prisma:', error instanceof Error ? error.message : 'unknown error');
      process.exit(1);
    });
  });
  // Force exit if connections do not drain (e.g. long-lived keep-alive).
  setTimeout(() => {
    console.error('Shutdown timed out, forcing exit');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));