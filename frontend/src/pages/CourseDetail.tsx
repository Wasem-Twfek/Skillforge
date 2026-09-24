import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourse, useLessonsByCourse } from '../hooks/useCourses';
import { courseService } from '../services/courseService';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const { data: course, isLoading: isLoadingCourse } = useCourse(id || '');
  const { data: lessons, isLoading: isLoadingLessons } = useLessonsByCourse(id || '');

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Course not found
        </h1>
        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="text-blue-500 hover:text-blue-600"
        >
          Return to Courses
        </button>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!id || isEnrolling || isEnrolled) {
      return;
    }

    setIsEnrolling(true);
    setEnrollError(null);

    try {
      await courseService.enrollInCourse(id);
      setIsEnrolled(true);
    } catch (err: unknown) {
      const response =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { status?: number; data?: { error?: string } } }).response
          : undefined;

      if (
        response?.status === 400 &&
        response.data?.error === 'Already enrolled in this course'
      ) {
        setIsEnrolled(true);
      } else {
        setEnrollError(
          response?.data?.error || 'Failed to enroll. Please try again.',
        );
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <main className="md:col-span-2">
          <h1 className="mb-4 text-3xl font-bold">{course.title}</h1>

          <div className="mb-6 flex items-center">
            {course.instructor.avatar ? (
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="mr-3 h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                {course.instructor.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium">{course.instructor.name}</p>
              {course.instructor.bio && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {course.instructor.bio}
                </p>
              )}
            </div>
          </div>

          <div className="prose mb-8 max-w-none dark:prose-invert">
            <p>{course.description}</p>
          </div>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Course Content</h2>

            {lessons && lessons.length > 0 ? (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => navigate('/lessons/' + lesson.id)}
                    className="block w-full rounded-lg border p-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Lesson {index + 1}
                        </div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {lesson.description}
                        </p>
                      </div>

                      {lesson.quiz && (
                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Quiz
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed p-6 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No lessons are available for this course yet.
              </p>
            )}
          </section>
        </main>

        <aside>
          <div className="sticky top-4 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            {course.price !== undefined && (
              <div className="mb-4">
                <div className="mb-2 text-3xl font-bold text-blue-600">
                  {'$' + course.price}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleEnroll}
              disabled={isEnrolling || isEnrolled}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:opacity-70"
            >
              {isEnrolled ? 'Enrolled' : isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>

            {enrollError && (
              <p className="mt-2 text-sm text-red-600">{enrollError}</p>
            )}

            <div className="mt-6">
              <h3 className="mb-3 font-medium">Course details</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>{lessons?.length ?? 0} lessons</li>
                <li>Progress tracking</li>
                <li>Quizzes where available</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
