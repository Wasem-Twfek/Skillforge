import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Briefcase, Code, Brush, PieChart, Globe } from 'lucide-react';

// Learning paths data for demonstration
const learningPaths = [
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Become a full-stack web developer with expertise in modern frameworks.',
    icon: <Code className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    coursesCount: 12,
    estimatedTime: '3 months',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB']
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Master data analysis, visualization, and machine learning algorithms.',
    icon: <PieChart className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-500',
    coursesCount: 10,
    estimatedTime: '4 months',
    skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization']
  },
  {
    id: 'ux-design',
    title: 'UX/UI Design',
    description: 'Learn to create beautiful and functional user interfaces.',
    icon: <Brush className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-500',
    coursesCount: 8,
    estimatedTime: '2.5 months',
    skills: ['UI Design', 'Wireframing', 'Prototyping', 'User Research', 'Figma']
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Master SEO, social media marketing, and campaign optimization.',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    coursesCount: 9,
    estimatedTime: '3 months',
    skills: ['SEO', 'Content Marketing', 'Google Analytics', 'Social Media', 'Email Marketing']
  },
  {
    id: 'business',
    title: 'Business Management',
    description: 'Develop leadership and management skills for business success.',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500',
    coursesCount: 7,
    estimatedTime: '2 months',
    skills: ['Leadership', 'Project Management', 'Finance', 'Strategy', 'Marketing']
  }
];

const LearningPaths = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-1.5 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 font-medium text-sm">
            <Code className="w-4 h-4 mr-2" />
            Structured Learning
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Learning Paths to Accelerate Your Career
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow expertly curated learning paths designed to take you from beginner to professional
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Path header */}
              <div className={`bg-gradient-to-r ${path.color} p-6 relative`}>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-4">
                  {path.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{path.title}</h3>
                <p className="text-white/80 text-sm">{path.description}</p>
                
                {/* Badge */}
                <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                  {path.coursesCount} courses
                </div>
              </div>
              
              {/* Path details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated time to complete:</div>
                  <div className="text-gray-900 dark:text-white font-medium">{path.estimatedTime}</div>
                </div>
                
                {/* Skills tags */}
                <div className="mb-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Skills you'll learn:</div>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, i) => (
                      <span 
                        key={i}
                        className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Link
                    to={`/learning-paths/${path.id}`}
                    className={`w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r ${path.color} hover:opacity-95 transition-all duration-200`}
                  >
                    <span>Explore Path</span>
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View All button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            to="/learning-paths"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <span>View All Learning Paths</span>
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPaths; 