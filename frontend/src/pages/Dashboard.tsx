import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserCourses, CourseState } from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: userCourses, isLoading, error } = useUserCourses();

  const courses: CourseState[] = useMemo(
    () => (Array.isArray(userCourses) ? userCourses : []),
    [userCourses]
  );

  const { inProgressCourses, completedCourses, notStartedCourses, totalProgress } = useMemo(() => {
    const inProgress = courses.filter((course) => course.progress > 0 && course.progress < 100);
    const completed = courses.filter((course) => course.progress === 100);
    const notStarted = courses.filter((course) => course.progress === 0);
    const total = courses.length
      ? courses.reduce((acc, course) => acc + course.progress, 0) / courses.length
      : 0;

    return {
      inProgressCourses: inProgress,
      completedCourses: completed,
      notStartedCourses: notStarted,
      totalProgress: total,
    };
  }, [courses]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Continue your learning journey from where you left off.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Learning Progress</h2>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(totalProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">{inProgressCourses.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-500 dark:text-green-400">{completedCourses.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Not Started</h3>
              <p className="text-3xl font-bold text-gray-500 dark:text-gray-400">{notStartedCourses.length}</p>
            </div>
          </div>
        </div>

        {inProgressCourses.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Continue Learning</h2>
            <div className="space-y-4">
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
