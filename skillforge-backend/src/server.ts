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

// In Docker, environment variables are passed directly, no need for dotenv
// Load .env file only if we're not in Docker
if (!process.env.DOCKER) {
  try {
    require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
    console.log('Successfully loaded .env file');
  } catch (error) {
    console.warn('Error loading .env file:', error);
  }
}

// Fallback environment variables
process.env.PORT = process.env.PORT || '3001';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key-goes-here';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
process.env.GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

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

// Middleware
app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('  Headers:', req.headers);
  console.log('  User:', (req as any).user);
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
        enroll: 'POST /api/courses/:id/enroll - Enroll in a course (requires authentication)',
        progress: 'POST /api/courses/:id/progress - Update course progress (requires authentication)'
      },
      users: {
        base: 'GET /api/users - Get all users (requires authentication)',
        profile: 'GET /api/users/:id - Get user profile (requires authentication)'
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

// API routes with authentication
app.use('/api', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] API Request: ${req.method} ${req.originalUrl}`);
  next();
});

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all route for unhandled routes
app.use('*', (req, res) => {
  console.error(`[${new Date().toISOString()}] Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 