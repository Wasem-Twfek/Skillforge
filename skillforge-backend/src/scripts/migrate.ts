import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  try {
    // Run Prisma migrations
    console.log('Running Prisma migrations...');
    await execAsync('npx prisma migrate deploy');
    console.log('Migrations completed successfully');
    
    // Create Prisma client to verify connection
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('Database connection verified');
    
    // Close the connection
    await prisma.$disconnect();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 