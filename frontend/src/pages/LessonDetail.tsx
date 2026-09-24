import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import lessonService from '../services/lessonService';
import { useAuth } from '../contexts/AuthContext';
import Quiz from '../components/quiz/Quiz';

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonService.getLesson(id as string),
    enabled: Boolean(id && token),
    retry: false,
  });

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">
          Please log in to view lessons.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-48 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Unable to load lesson
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {error instanceof Error ? error.message : 'Lesson not found.'}
        </p>
        <Link
          to="/courses"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Return to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link
        to={'/courses/' + lesson.courseId}
        className="mb-6 inline-flex text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to course
      </Link>

      <article className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800 sm:p-8">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
          {lesson.title}
        </h1>

        <p className="mb-8 text-gray-600 dark:text-gray-300">
          {lesson.description}
        </p>

        {lesson.videoUrl && (
          <video
            className="mb-8 w-full rounded-lg"
            controls
            preload="metadata"
            src={lesson.videoUrl}
          />
        )}

        <div className="prose max-w-none dark:prose-invert whitespace-pre-wrap">
          {lesson.content}
        </div>

        {lesson.quiz && (
          <section className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {lesson.quiz.title}
            </h2>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Complete the quiz to check your understanding.
            </p>

            <Quiz
              quizId={lesson.quiz.id}
              questions={lesson.quiz.questions}
            />
          </section>
        )}
      </article>
    </div>
  );
};

export default LessonDetail;
