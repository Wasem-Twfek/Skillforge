import React from 'react';
import { Link } from 'react-router-dom';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // URL for the lesson wallpaper/image
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in minutes
  progress?: number; // 0-100
}

// Get placeholder image related to the topic
const getPlaceholderImage = (title: string) => {
  const topics = {
    html: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=800&h=400&fit=crop',
    css: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?q=80&w=800&h=400&fit=crop',
    javascript: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&h=400&fit=crop',
    react: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=800&h=400&fit=crop',
    python: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?q=80&w=800&h=400&fit=crop',
    ai: 'https://images.unsplash.com/photo-1677442135330-4b55c98cb86b?q=80&w=800&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=800&h=400&fit=crop',
  };

  // Check if title contains any of the topic keywords
  const lowercaseTitle = title.toLowerCase();
  for (const [topic, url] of Object.entries(topics)) {
    if (lowercaseTitle.includes(topic)) {
      return url;
    }
  }
  
  return topics.default;
};

// Get appropriate color for difficulty level
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
};

const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  difficulty = 'beginner',
  duration = 30,
  progress = 0
}) => {
  // Use provided image or get a placeholder based on the lesson title
  const backgroundImage = imageUrl || getPlaceholderImage(title);
  const difficultyClass = getDifficultyColor(difficulty);
  
  // Format duration for display
  const formattedDuration = duration >= 60 
    ? `${Math.floor(duration / 60)}h ${duration % 60}m` 
    : `${duration} min`;

  return (
    <div className="relative group overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Image/Wallpaper with overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Difficulty badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${difficultyClass}`}>
          {difficulty}
        </div>
        
        {/* Duration indicator */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {formattedDuration}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
          {description}
        </p>
        
        {/* Progress bar (if applicable) */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-gray-700 dark:text-gray-300">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Button */}
        <Link
          to={`/lessons/${id}`}
          className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {progress > 0 ? (progress >= 100 ? 'Review Lesson' : 'Continue Lesson') : 'Start Lesson'}
        </Link>
      </div>
    </div>
  );
};

export default LessonCard; 