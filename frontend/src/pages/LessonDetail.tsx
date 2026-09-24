import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import lessonService from '../services/lessonService';
import { useAuth } from '../contexts/AuthContext';
import { useUserCourses } from '../hooks/useCourses';
import { courseService } from '../services/courseService';
import Quiz from '../components/quiz/Quiz';

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const queryClient = useQueryClient();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonService.getLesson(id as string),
    enabled: Boolean(id && token),
    retry: false,
  });

  const { data: userCourses } = useUserCourses();
  const isEnrolled = Boolean(
    lesson && userCourses?.some((course) => course.id === lesson.courseId),
  );

  const handleComplete = async () => {
    if (!lesson || !isEnrolled || isCompleting || isCompleted) {
      return;
    }

    setIsCompleting(true);
    setProgressError(null);

    try {
      await courseService.updateProgress(lesson.courseId, lesson.id, true);
      setIsCompleted(true);
      await queryClient.invalidateQueries({ queryKey: ['userCourses'] });
    } catch (err: unknown) {
      setProgressError(
        err instanceof Error
          ? err.message
          : 'Failed to update lesson progress.',
      );
    } finally {
      setIsCompleting(false);
    }
  };

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

        <div className="prose max-w-none whitespace-pre-wrap dark:prose-invert">
          {lesson.content}
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Lesson progress
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {!isEnrolled
                  ? 'Enroll in this course to track your progress.'
                  : isCompleted
                    ? 'This lesson is marked as complete.'
                    : 'Mark this lesson as complete when you finish it.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleComplete()}
              disabled={!isEnrolled || isCompleting || isCompleted}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCompleted
                ? 'Completed'
                : isCompleting
                  ? 'Saving...'
                  : 'Mark complete'}
            </button>
          </div>

          {progressError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">
              {progressError}
            </p>
          )}
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
