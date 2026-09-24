import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error instanceof Error ? error.message : 'unknown error');
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed'
    });
  }
});

export default router;
