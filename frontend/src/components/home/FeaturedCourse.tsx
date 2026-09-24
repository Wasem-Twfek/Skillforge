import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ChevronRight, Play, BookOpen, Award } from 'lucide-react';
import { Course } from '../../types/course';
import { mockCourses } from '../../data/mockCourses';

const FeaturedCourse = () => {
  const [featuredCourse, setFeaturedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to get the featured course
    // For now, we'll just get the highest-rated course from our mock data
    const topRatedCourse = [...mockCourses]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .shift();
    
    // Simulate API loading
    setTimeout(() => {
      setFeaturedCourse(topRatedCourse || null);
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
      </div>
    );
  }

  if (!featuredCourse) {
    return null;
  }

  // Calculate total course duration
  const totalDuration = featuredCourse.lessons.reduce((total, lesson) => total + (lesson.duration ?? 0), 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Course Banner/Header */}
      <div className="relative h-60 sm:h-72 bg-gradient-to-r from-primary-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={featuredCourse.thumbnail} 
            alt={featuredCourse.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/1200x600/4338ca/ffffff?text=${featuredCourse.title}`;
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        {/* Course badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium">
          Featured Course
        </div>
        
        {/* Play button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        
        {/* Course title and metrics */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {featuredCourse.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-amber-400 mr-1 fill-amber-400" />
              <span>{featuredCourse.rating} ({featuredCourse.reviews} reviews)</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{(featuredCourse.students ?? 0).toLocaleString()} students</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{hours > 0 ? `${hours}h ` : ''}{minutes}m total</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course details */}
      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-6">{featuredCourse.description}</p>
        
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Learning objectives */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
              What you&apos;ll learn
            </h4>
            <ul className="space-y-2">
              {['Master key concepts through bite-sized lessons', 
                'Practice with real-world examples', 
                'Build professional-grade projects',
                'Earn a completion certificate'].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Course highlights */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Award className="w-5 h-5 mr-2 text-primary-500" />
              Course includes
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Lessons', value: featuredCourse.lessons.length },
                { label: 'Exercises', value: Math.round(featuredCourse.lessons.length * 1.5) },
                { label: 'Quizzes', value: Math.round(featuredCourse.lessons.length * 0.7) },
                { label: 'Certificate', value: 'Yes' }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Preview lessons */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview Lessons</h4>
          <div className="space-y-3">
            {featuredCourse.lessons.slice(0, 3).map((lesson, index) => (
              <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-medium text-gray-900 dark:text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h5>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{lesson.duration} minutes</div>
                </div>
                {index === 0 ? (
                  <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium">
                    Free Preview
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Button */}
        <Link
          to={`/courses/${featuredCourse.id}`}
          className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <span>Explore This Course</span>
          <ChevronRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
};

// Placeholder for missing Lucide icon
const Lock = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default FeaturedCourse; 