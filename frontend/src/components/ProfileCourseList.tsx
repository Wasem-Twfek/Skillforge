import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { CourseState } from '../hooks/useCourses';

interface ProfileCourseListProps {
  title: string;
  courses: CourseState[];
  type: 'in-progress' | 'completed' | 'not-started';
}

// Memoized component for rendering course lists in the profile
const ProfileCourseList: React.FC<ProfileCourseListProps> = memo(({ title, courses, type }) => {
  if (courses.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{course.title}</h3>
              
              {type === 'in-progress' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{course.progress}% complete</p>
                </div>
              )}
              
              {type === 'completed' && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Completed on {new Date(course.completedAt || '').toLocaleDateString()}
                </p>
              )}
              
              {type === 'not-started' && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enrolled on {new Date(course.enrolledAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

ProfileCourseList.displayName = 'ProfileCourseList';

export default ProfileCourseList;
