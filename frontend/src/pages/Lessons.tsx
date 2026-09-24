import { useQuery } from '@tanstack/react-query';
import lessonService, { Lesson } from '../services/lessonService';
import LessonCard from '../components/LessonCard';

// Keep a consistent difficulty label until the API provides this field.
const getDifficultyForTitle = (title: string): 'beginner' | 'intermediate' | 'advanced' => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('introduction') || lowerTitle.includes('basics')) {
    return 'beginner';
  } else if (lowerTitle.includes('advanced')) {
    return 'advanced';
  }
  return 'intermediate';
};

// Keep a consistent duration label until the API provides this field.
const getDurationForTitle = (title: string): number => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('introduction')) {
    return 25;
  } else if (lowerTitle.includes('fundamentals')) {
    return 45;
  } else if (lowerTitle.includes('advanced')) {
    return 60;
  }
  return 35;
};

export default function Lessons() {
  const { data: lessons, isLoading, error } = useQuery<Lesson[], Error>({
    queryKey: ['lessons'],
    queryFn: () => lessonService.getAllLessons(),
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 transition-colors duration-300 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Lessons</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loading skeletons */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <div className="text-red-500 dark:text-red-400 text-lg font-semibold mb-4">Failed to load lessons</div>
          <div className="text-gray-600 dark:text-gray-300 mb-6">There was an error loading the lessons. Please try again later.</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Available Lessons</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Lessons Available</h2>
          <p className="text-gray-600 dark:text-gray-300">Check back later for new content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Available Lessons</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Browse the available lessons.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
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
        ))}
      </div>
    </div>
  );
}