import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Seeding the database...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error during database setup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 