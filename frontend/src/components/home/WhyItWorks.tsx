import { motion } from 'framer-motion';
import { Clock, Lightbulb, Zap, BarChart3, Users, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <Clock className="w-6 h-6" />,
    color: "from-blue-400 to-blue-600",
    title: "Microlearning Format",
    description: "Short, focused 5-minute sessions that fit into your busy schedule, making consistent learning achievable."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-purple-400 to-purple-600",
    title: "AI Personalization",
    description: "Adaptive learning paths tailored to your skill level, learning style, and career goals."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    color: "from-amber-400 to-amber-600",
    title: "Active Learning",
    description: "Hands-on exercises and real-world projects that reinforce concepts immediately after learning them."
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    color: "from-emerald-400 to-emerald-600", 
    title: "Spaced Repetition",
    description: "Science-backed review system that helps move concepts from short-term to long-term memory."
  },
  {
    icon: <Users className="w-6 h-6" />,
    color: "from-rose-400 to-rose-600",
    title: "Community Learning",
    description: "Engage with a community of peers and experts to enhance your understanding through collaboration."
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    color: "from-cyan-400 to-cyan-600",
    title: "Progress Tracking",
    description: "Visualize your growth with detailed analytics and celebrate achievements to stay motivated."
  }
];

const WhyItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-primary-50 to-white dark:from-dark-bg-tertiary dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Why SkillForge Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our approach is based on cognitive science and learning psychology to help you learn faster and retain more
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group border border-gray-100 dark:border-gray-700"
            >
              {/* Background gradient decoration */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-gradient-to-r opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-sm" 
                style={{ 
                  background: `linear-gradient(to right, var(--tw-gradient-stops))`, 
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`, 
                  ['--tw-gradient-from' as string]: `rgba(${feature.color.includes('blue') ? '59, 130, 246' : feature.color.includes('purple') ? '139, 92, 246' : feature.color.includes('amber') ? '251, 191, 36' : feature.color.includes('emerald') ? '52, 211, 153' : feature.color.includes('rose') ? '251, 113, 133' : '6, 182, 212'}, 1)`,
                  ['--tw-gradient-to' as string]: `rgba(${feature.color.includes('blue') ? '37, 99, 235' : feature.color.includes('purple') ? '124, 58, 237' : feature.color.includes('amber') ? '245, 158, 11' : feature.color.includes('emerald') ? '16, 185, 129' : feature.color.includes('rose') ? '244, 63, 94' : '8, 145, 178'}, 1)`
                }}
              />
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} text-white flex items-center justify-center mb-6 shadow-md`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Stats */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Stat value="94%" label="Student satisfaction" />
          <Stat value="89%" label="Completion rate" />
          <Stat value="3-5x" label="Faster learning" />
          <Stat value="71%" label="Career advancement" />
        </motion.div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md border border-gray-100 dark:border-gray-700">
    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
      {value}
    </div>
    <div className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
      {label}
    </div>
  </div>
);

export default WhyItWorks; 