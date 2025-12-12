import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CourseSearch from '../components/courses/CourseSearch';
import { useUserCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';
import lessonService, { Lesson } from '../services/lessonService';
import LessonCard from '../components/LessonCard';

// Sample difficulty data to enhance the UI - in a real app, this would come from the backend
const getDifficultyForTitle = (title: string): 'beginner' | 'intermediate' | 'advanced' => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('introduction') || lowerTitle.includes('basics')) {
    return 'beginner';
  } else if (lowerTitle.includes('advanced')) {
    return 'advanced';
  }
  return 'intermediate';
};

// Sample duration data - in a real app, this would come from the backend
const getDurationForTitle = (title: string): number => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('introduction')) {
    return 25;
  } else if (lowerTitle.includes('fundamentals')) {
    return 45;
  } else if (lowerTitle.includes('advanced')) {
    return 60;
  }
  return 35; // Default duration
};

const Courses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Fetch lessons
  const { data: lessons, isLoading: isLoadingLessons } = useQuery<Lesson[], Error>({
    queryKey: ['lessons'],
    queryFn: () => lessonService.getAllLessons(),
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  }, [searchQuery, setSearchParams]);



  // Filter lessons based on search query
  const getFilteredLessons = () => {
    if (!lessons) return [];
    
    if (searchQuery) {
      return lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return lessons;
  };

  const filteredLessons = getFilteredLessons();

  // Get authentication state and user's enrolled courses
  const { user } = useAuth();
  const { data: userCourses } = useUserCourses();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero section with welcome message */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-12">
          {user ? (
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
                <p className="text-blue-100 text-lg max-w-2xl">Continue your learning journey or explore new courses to expand your skills.</p>
              </div>
              <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-3xl font-bold mb-2">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-white font-medium">{userCourses?.length || 0} Courses Enrolled</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-white mb-4">Discover Your Next Skill</h1>
              <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-8">Explore our wide range of courses designed to help you master new skills and advance your career.</p>
              <Link to="/login" className="inline-block bg-white text-blue-700 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors">
                Sign In to Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User's enrolled courses section */}
        {user && userCourses && userCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Continue Learning</h2>
              <Link to="/my-courses" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userCourses.slice(0, 4).map(course => (
                <Link 
                  key={course.id} 
                  to={`/courses/${course.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold truncate">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 text-right">
                      <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded">
                        {course.progress < 100 ? 'Continue' : 'Completed'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Lessons title */}
            <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm px-6 py-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lessons</h2>
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  {filteredLessons.length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CourseSearch
                onSearch={setSearchQuery}
                initialQuery={searchQuery}
              />
            </div>
          </div>

          {/* No filters section needed */}

          {/* Lessons content */}
          <div className="bg-white dark:bg-gray-800 rounded-b-xl rounded-tr-xl shadow-md p-6">
            {/* Lessons header with count */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                All Lessons
                <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  {filteredLessons.length}
                </span>
              </h2>
              {searchQuery && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Search results for: <span className="font-medium text-gray-700 dark:text-gray-300">"{searchQuery}"</span>
                </div>
              )}
            </div>
              
              {/* Lessons grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingLessons ? (
                  // Loading skeletons for lessons
                  Array(6).fill(0).map((_, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700">
                      <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                      <div className="p-5">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : filteredLessons.length === 0 ? (
                  <div className="col-span-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Lessons Found</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {searchQuery ? 
                        `We couldn't find any lessons matching "${searchQuery}".` : 
                        "There are no lessons available at the moment."}
                    </p>
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  filteredLessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      id={lesson.id}
                      title={lesson.title}
                      description={lesson.description}
                      difficulty={getDifficultyForTitle(lesson.title)}
                      duration={getDurationForTitle(lesson.title)}
                      progress={lesson.progress || 0}
                      imageUrl={lesson.imageUrl}
                    />
                  ))
                )}
              </div>
              
              {/* Pagination placeholder - can be implemented in the future */}
              {filteredLessons.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/30 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                      1
                    </a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      2
                    </a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Courses; 