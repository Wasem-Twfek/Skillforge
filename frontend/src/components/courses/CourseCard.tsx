import { Link } from 'react-router-dom';
import { Course } from '../../types/course';

const CourseCard = ({ course }: { course: Course }) => {
  // Function to determine gradient based on category
  const getCategoryGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case 'programming':
        return 'from-blue-500 to-purple-600';
      case 'design':
        return 'from-pink-500 to-rose-500';
      case 'business':
        return 'from-green-500 to-emerald-600';
      case 'marketing':
        return 'from-orange-400 to-amber-600';
      case 'language':
        return 'from-indigo-500 to-violet-600';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  // Function to get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="course-card group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <Link to={`/courses/${course.id}`} className="block h-full">
        {/* Course thumbnail with overlay gradient */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-br opacity-80 ${getCategoryGradient(course.category)}`}></div>
          
          {/* Course info overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
            <div className="flex justify-between items-start">
              <span className="category-badge px-3 py-1 rounded-full text-xs font-medium bg-black/30 backdrop-blur-sm">
                {course.category}
              </span>
              <span className={`${getLevelBadgeColor(course.level)} px-3 py-1 rounded-full text-xs font-medium`}>
                {course.level}
              </span>
            </div>
            <h3 className="text-xl font-bold mt-auto drop-shadow-md">{course.title}</h3>
          </div>
        </div>
        
        {/* Course details */}
        <div className="p-5">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 h-10">{course.description}</p>
          
          <div className="flex items-center justify-end mb-3">
            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">{course.rating}</span>
            </div>
          </div>
          
          {/* Action button */}
          <div className="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">View Details</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;