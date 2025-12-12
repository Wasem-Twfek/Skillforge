import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create an instructor
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      email: 'instructor@example.com',
      name: 'John Doe',
      password: await bcrypt.hash('password123', 10),
    },
  });

  // Create a course
  const course = await prisma.course.create({
    data: {
      title: 'Introduction to Web Development',
      description: 'Learn the basics of web development including HTML, CSS, and JavaScript',
      thumbnail: 'https://example.com/thumbnail.jpg',
      category: 'Web Development',
      level: 'Beginner',
      instructorId: instructor.id,
    },
  });

  // Create lessons for the course
  await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'HTML Basics',
        description: 'Learn the fundamentals of HTML',
        content: 'HTML is the standard markup language for creating web pages...',
        courseId: course.id,
        order: 1,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'CSS Fundamentals',
        description: 'Learn how to style web pages with CSS',
        content: 'CSS is a style sheet language used for describing the presentation...',
        courseId: course.id,
        order: 2,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'JavaScript Introduction',
        description: 'Get started with JavaScript programming',
        content: 'JavaScript is a programming language that enables interactive web pages...',
        courseId: course.id,
        order: 3,
      },
    }),
  ]);

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 