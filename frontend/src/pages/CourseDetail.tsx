import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse, useLessonsByCourse } from '../hooks/useCourses';
import { courseService } from '../services/courseService';
import Quiz from '../components/quiz/Quiz';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const { data: course, isLoading: isLoadingCourse } = useCourse(id || '');
  const { data: lessons, isLoading: isLoadingLessons } = useLessonsByCourse(id || '');

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h1>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-500 hover:text-blue-600"
          >
            Return to Courses
          </button>
        </div>
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
      // The backend answers 400 { error: 'Already enrolled in this course' }
      // when the enrollment exists; treat that as enrolled, not as failure.
      const backendError =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { status?: number; data?: { error?: string } } }).response
          : undefined;
      if (backendError?.status === 400 && backendError?.data?.error === 'Already enrolled in this course') {
        setIsEnrolled(true);
      } else {
        setEnrollError(backendError?.data?.error || 'Failed to enroll. Please try again.');
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`Quiz completed with score: ${score}/${total}`);
    setShowQuiz(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <div className="flex items-center mb-4">
            {course.instructor.avatar ? (
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-10 h-10 rounded-full mr-3"
              />
            ) : null}
            <div>
              <p className="font-medium">{course.instructor.name}</p>
              <p className="text-sm text-gray-500">{course.instructor.bio}</p>
            </div>
          </div>
          <div className="prose max-w-none mb-8">
            <p>{course.description}</p>
          </div>

          {showQuiz && selectedLesson && lessons?.find(l => l.id === selectedLesson)?.quiz && (
            <Quiz
              questions={lessons.find(l => l.id === selectedLesson)?.quiz?.questions || []}
              onComplete={handleQuizComplete}
            />
          )}

          {!showQuiz && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              {lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedLesson(lesson.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">{lesson.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {lesson.duration !== undefined ? `${lesson.duration} min` : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            {/* The API never returns commerce/engagement fields (price,
                rating, students); render them only when present so API-fed
                courses never show "$undefined" placeholders. */}
            {course.price !== undefined ? (
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${course.price}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  {course.rating !== undefined ? (
                    <span className="mr-4">★ {course.rating}</span>
                  ) : null}
                  {course.students !== undefined ? (
                    <span>{course.students} students</span>
                  ) : null}
                </div>
              </div>
            ) : null}

            <button
              onClick={handleEnroll}
              disabled={isEnrolling || isEnrolled}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isEnrolled ? 'Enrolled' : isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
            {enrollError ? (
              <p className="mt-2 text-sm text-red-600">{enrollError}</p>
            ) : null}

            <div className="mt-6">
              <h3 className="font-medium mb-2">This course includes:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {lessons?.length} lessons
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lifetime access
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Certificate of completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 