import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course } from '../../types/course';

// Mock data for popular skills - in a real app, this would come from an API
import { mockCourses } from '../../data/mockCourses';

const PopularSkills = () => {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real app, we might fetch this from an API
    // For now, let's filter the top 8 courses by students count
    const topCourses = [...mockCourses]
      .sort((a, b) => (b.students ?? 0) - (a.students ?? 0))
      .slice(0, 8);
    
    setPopularCourses(topCourses);
  }, []);
  
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Popular Skills to Master
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the most in-demand skills being learned by thousands of professionals worldwide
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Navigation buttons */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          
          {/* Skills carousel */}
          <motion.div 
            className="overflow-x-auto hide-scrollbar"
            ref={carouselRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-6 py-8 min-w-full">
              {popularCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="min-w-[300px] max-w-[300px] flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <SkillCard course={course} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/courses" 
            className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300"
          >
            View all courses
            <ChevronRight className="ml-1 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Skill card component
const SkillCard = ({ course }: { course: Course }) => {
  return (
    <Link 
      to={`/courses/${course.id}`}
      className="block h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/400x200/4338ca/ffffff?text=${encodeURIComponent(course.category)}`;
          }}
        />
        <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-xs font-medium text-gray-800 dark:text-gray-200">
          {course.level}
        </div>
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center">
          <span className="text-yellow-500 mr-1">★</span> {course.rating}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
            {course.category}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{course.lessons.length} lessons</span>
        </div>
        
        <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white line-clamp-1">{course.title}</h3>
        
        <div className="flex items-center mt-4">
          <img
            src={course.instructor.avatar ?? undefined}
            alt={course.instructor.name}
            className="w-8 h-8 rounded-full mr-2"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/100/4338ca/ffffff?text=${course.instructor.name.charAt(0)}`;
            }}
          />
          <div className="text-sm">
            <span className="text-gray-900 dark:text-white font-medium">{course.instructor.name}</span>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <span>{(course.students ?? 0).toLocaleString()} students</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PopularSkills;

// CSS classes are defined in the global stylesheet 