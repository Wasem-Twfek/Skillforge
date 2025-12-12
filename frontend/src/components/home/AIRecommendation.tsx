import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Palette, TrendingUp, Cpu, Languages, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// AI recommendation categories
const categories = [
  {
    id: 'programming',
    name: 'Programming',
    icon: <Code2 className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-400',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    courses: ['JavaScript Essentials', 'React Fundamentals', 'Python for Beginners']
  },
  {
    id: 'design',
    name: 'Design',
    icon: <Palette className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-400',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    courses: ['UI/UX Basics', 'Figma Masterclass', 'Design Thinking']
  },
  {
    id: 'business',
    name: 'Business',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-400',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    courses: ['Marketing Strategy', 'Leadership Skills', 'Business Analytics']
  },
  {
    id: 'ai',
    name: 'AI & ML',
    icon: <Cpu className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-400',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    courses: ['Machine Learning Basics', 'Practical AI Projects', 'Data Science Essentials']
  },
  {
    id: 'language',
    name: 'Languages',
    icon: <Languages className="w-5 h-5" />,
    color: 'from-red-500 to-rose-400',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    courses: ['Spanish for Beginners', 'Business English', 'Japanese Made Easy']
  }
];

const AIRecommendation = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-dark-bg-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-1.5 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 font-medium text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Recommendations
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            What will SkillForge recommend for you?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI analyzes learning patterns to suggest personalized skills that match your interests and career goals
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Sidebar navigation */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`flex items-center w-full py-3 px-4 rounded-xl mb-1 text-left ${
                    activeCategory.id === category.id 
                      ? `bg-gradient-to-r ${category.color} text-white` 
                      : `hover:bg-gray-50 dark:hover:bg-gray-700 ${category.textColor}`
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 transition-colors ${
                    activeCategory.id === category.id 
                      ? 'bg-white/20' 
                      : `${category.bgColor}`
                  }`}>
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Recommendation display */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            key={activeCategory.id}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r ${activeCategory.color} opacity-10 rounded-full filter blur-xl`}></div>
                <div className={`absolute bottom-10 -left-10 w-40 h-40 bg-gradient-to-r ${activeCategory.color} opacity-10 rounded-full filter blur-xl`}></div>
              </div>
              
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${activeCategory.color} text-white mr-4`}>
                    {activeCategory.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Recommended {activeCategory.name} Skills
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Based on your interests and learning patterns
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {activeCategory.courses.map((course, idx) => (
                    <motion.div 
                      key={course}
                      className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">{course}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs ${activeCategory.bgColor} ${activeCategory.textColor}`}>
                          98% match
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Perfect for your skill profile and career goals
                      </p>
                      <Link 
                        to={`/courses?category=${activeCategory.id}`}
                        className={`inline-flex items-center mt-3 text-sm font-medium ${activeCategory.textColor}`}
                      >
                        View course
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Pro tip:</strong> Complete the personality quiz to get better recommendations
                  </div>
                  <Link 
                    to="/quiz/assessment"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 transition-colors"
                  >
                    Take skill quiz
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendation; 