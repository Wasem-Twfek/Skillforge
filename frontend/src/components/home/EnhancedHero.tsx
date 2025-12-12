import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Star, Zap, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Skills for the typing effect
const skills = [
  'JavaScript',
  'Python',
  'React',
  'UI/UX Design',
  'Data Science',
  'AI & ML'
];

const EnhancedHero = () => {
  const [currentSkill, setCurrentSkill] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const { user } = useAuth();
  
  // Typing effect
  useEffect(() => {
    const skill = skills[currentSkill];
    const timeout = setTimeout(() => {
      // If deleting
      if (isDeleting) {
        setText(skill.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setCurrentSkill((prev) => (prev + 1) % skills.length);
        }
      } else {
        // If typing
        setText(skill.substring(0, text.length + 1));
        if (text.length === skill.length) {
          // Pause at the end
          setTimeout(() => {
            setIsDeleting(true);
          }, 1500);
        }
      }
    }, isDeleting ? 50 : text.length === skills[currentSkill].length ? 1000 : 100);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentSkill]);

  // Display counter effect
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number;
    const duration = 2000;
    const endValue = 50000;
    
    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newCount = Math.floor(progress * endValue);
      setDisplayCount(newCount);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateCounter);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white,transparent_80%)] -z-10"></div>
      
      {/* Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
          {/* Left Content (3/5) */}
          <motion.div 
            className="lg:col-span-3 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center mb-6 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Learn in just 5 minutes a day
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Master
              <span className="relative ml-3 mr-3">
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {text || 'JavaScript'}
                </span>
                <span className="absolute -right-1 top-0 h-full w-0.5 bg-blue-600 animate-blink"></span>
              </span>
              <br className="hidden sm:block" />
              <span className="sm:ml-0">faster with AI</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
              Personalized micro-learning experiences that fit perfectly into your busy schedule. 
              Build valuable skills in just 5 minutes a day.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/courses"
                className="flex items-center justify-center px-6 py-3.5 font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/20 dark:shadow-blue-800/30 transition-all duration-200"
              >
                <span>Start Learning Now</span>
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="flex items-center justify-center px-6 py-3.5 font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all duration-200"
                >
                  <LogIn className="mr-2 w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
              <Link
                to="/quiz/assessment"
                className="flex items-center justify-center px-6 py-3.5 font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all duration-200"
              >
                <Clock className="mr-2 w-4 h-4" />
                <span>Take Skill Assessment</span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
              <div className="pr-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Star className="w-4 h-4 text-amber-500" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User Rating</p>
              </div>
              <div className="px-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">200+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expert Courses</p>
              </div>
              <div className="pl-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">{displayCount.toLocaleString()}+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Learners</p>
              </div>
            </div>
          </motion.div>
          
          {/* Right Content (2/5) */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Progress bar */}
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 h-1.5"></div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Learning Path</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Personalized</div>
                </div>
                
                {/* Course progress items */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs">JS</div>
                        <span className="font-medium text-gray-900 dark:text-white">JavaScript</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">70%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-1.5">
                      <div className="bg-blue-500 h-2 rounded-full w-[70%]"></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Next: Arrow Functions (5 min)
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs">PY</div>
                        <span className="font-medium text-gray-900 dark:text-white">Python</span>
                      </div>
                      <span className="text-sm font-medium text-violet-600 dark:text-violet-400">45%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-1.5">
                      <div className="bg-violet-500 h-2 rounded-full w-[45%]"></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Next: List Comprehensions (5 min)
                    </div>
                  </div>
                </div>
                
                {/* Day streak indicator */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">1</div>
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">2</div>
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs">3</div>
                        <div className="w-6 h-6 rounded-full bg-violet-700 flex items-center justify-center text-white text-xs">4</div>
                        <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">5</div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">5-Day Streak!</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Keep it going</p>
                      </div>
                    </div>
                    <Link 
                      to="/courses" 
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
                    >
                      <span>Continue</span>
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills tags */}
            <div className="flex flex-wrap justify-center mt-6 gap-2 opacity-80">
              {skills.map((skill) => (
                <div 
                  key={skill}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-gray-800/80 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 backdrop-blur-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-xs text-gray-400 dark:text-gray-500 mb-2">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 animate-scroll-down" />
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero; 