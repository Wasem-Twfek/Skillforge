import React from 'react';
import { Link } from 'react-router-dom';
import { CourseState } from '../hooks/useCourses';

// Define the CourseCard props type
type CourseCardProps = {
  course: CourseState;
};

// Memoized CourseCard component
const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Extract instructor name if available
  const instructorName = course.instructor?.name || 'Unknown Instructor';
  
  return (
    <Link
      to={`/courses/${course.id}`}
      className="block border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium text-gray-800 dark:text-white">{course.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{instructorName}</p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{course.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
        <div
          className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full"
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
    </Link>
  );
};

// Use React.memo to prevent unnecessary re-renders
// Only re-render when the course ID or progress changes
export default React.memo(CourseCard, (prevProps, nextProps) => {
  return (
    prevProps.course.id === nextProps.course.id && 
    prevProps.course.progress === nextProps.course.progress
  );
});
