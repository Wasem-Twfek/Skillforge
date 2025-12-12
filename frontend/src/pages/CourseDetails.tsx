import React, { useMemo, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOptimizedItemQuery } from '../hooks/useOptimizedQuery';
import { courseService } from '../services/courseService';
import { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

// Lazy-loaded components
const PageLoader = React.lazy(() => import('../components/PageLoader'));

// Memoized component for instructor info
const InstructorCard: React.FC<{ instructor: Course['instructor'] }> = React.memo(({ instructor }) => (
  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
      <img 
        src={instructor.avatar} 
        alt={instructor.name} 
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <h3 className="font-medium text-gray-900 dark:text-white">{instructor.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{instructor.bio}</p>
    </div>
  </div>
));

// Memoized component for lesson list
const LessonList: React.FC<{ lessons: Course['lessons'], courseId: string }> = React.memo(({ lessons, courseId }) => (
  <div className="mt-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Content</h2>
    <div className="space-y-2">
      {lessons.map((lesson, index) => (
        <Link 
          key={lesson.id} 
          to={`/courses/${courseId}/lessons/${lesson.id}`}
          className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Lesson {index + 1}</span>
              <h3 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{lesson.description}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500 dark:text-gray-400">{lesson.duration} min</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
));

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  
  // State for enrollment
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  
  // Optimized query for course details
  const { 
    data: course, 
    isLoading, 
    error 
  } = useOptimizedItemQuery<Course, Error>(
    ['course', courseId as string],
    // Ensure the function always returns a Course object, not undefined
    async () => {
      const result = await courseService.getCourseById(courseId as string);
      if (!result) throw new Error('Course not found');
      return result;
    },
    courseId as string,
    {
      enabled: !!courseId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
  
  // Memoized values to prevent unnecessary calculations
  const { isEnrolled, formattedDate, courseLevel } = useMemo(() => {
    // Check if user is enrolled
    const enrolled = false; // This would be determined by your actual enrollment logic
    
    // Format the date
    const date = course?.createdAt 
      ? new Date(course.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';
      
    // Get formatted level
    const level = course?.level 
      ? course.level.charAt(0).toUpperCase() + course.level.slice(1)
      : '';
      
    return { isEnrolled: enrolled, formattedDate: date, courseLevel: level };
  }, [course]);
  
  // Memoized callback for enrollment
  const handleEnroll = useCallback(async () => {
    if (!user || !courseId) return;
    
    try {
      setIsEnrolling(true);
      setEnrollmentError(null);
      
      // Call enrollment service
      // await enrollmentService.enrollInCourse(courseId);
      
      // Refresh the course data
      // queryClient.invalidateQueries(['course', courseId]);
      
    } catch (err) {
      setEnrollmentError('Failed to enroll in this course. Please try again.');
      console.error('Enrollment error:', err);
    } finally {
      setIsEnrolling(false);
    }
  }, [courseId, user]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageLoader />
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Course
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error?.message || 'Course not found'}
          </p>
          <Link
            to="/courses"
            className="inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
              {course.title}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                {course.category}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                {courseLevel}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {course.description}
          </p>
        </div>
        
        {/* Course Image */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-md">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Students</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{course.students}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Rating</h3>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-2">{course.rating}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(course.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  ({course.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Created</h3>
            <p className="text-gray-600 dark:text-gray-300">{formattedDate}</p>
          </div>
        </div>
        
        {/* Instructor Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Instructor</h2>
          <InstructorCard instructor={course.instructor} />
        </div>
        
        {/* Enrollment Button */}
        {!isEnrolled && (
          <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to start learning?
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Enroll now to access all course materials and track your progress.
                </p>
                {enrollmentError && (
                  <p className="text-red-600 dark:text-red-400 mt-2">{enrollmentError}</p>
                )}
              </div>
              <button
                onClick={handleEnroll}
                disabled={isEnrolling || !user}
                className={`mt-4 md:mt-0 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 ${
                  isEnrolling ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
            {!user && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                  log in
                </Link>{' '}
                to enroll in this course.
              </p>
            )}
          </div>
        )}
        
        {/* Lesson List */}
        <LessonList lessons={course.lessons} courseId={course.id} />
      </div>
    </motion.div>
  );
};

export default CourseDetails;
