import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Development-only demo seed. The credentials below are local-dev
  // placeholders (never production secrets); the password is bcrypt-hashed
  // before storage, exactly like the live registration path.
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

  // Idempotent course seed: Course has no unique field to upsert on, so
  // re-running the seed reuses the existing demo course instead of
  // duplicating it.
  let course = await prisma.course.findFirst({
    where: {
      instructorId: instructor.id,
      title: 'Introduction to Web Development',
    },
  });
  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'Introduction to Web Development',
        description: 'Learn the basics of web development including HTML, CSS, and JavaScript',
        thumbnail: 'https://example.com/thumbnail.jpg',
        category: 'Web Development',
        level: 'Beginner',
        instructorId: instructor.id,
      },
    });
  }

  // Idempotent lessons seed: only create the demo lessons when the course
  // has none, so re-runs do not duplicate them.
  const existingLessons = await prisma.lesson.count({
    where: { courseId: course.id },
  });
  if (existingLessons === 0) {
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
  }

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