import { BookOpen, Code2, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Interactive Learning',
    description: 'Engage with hands-on exercises and real-world projects that reinforce your understanding.',
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    title: 'Expert-Led Content',
    description: 'Learn from industry professionals with years of practical experience in their fields.',
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed progress tracking and achievement badges.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Community Learning',
    description: 'Join a vibrant community of learners and share your knowledge with peers.',
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300" role="region" aria-label="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Why Choose SkillForge?
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            {`Learn at your own pace with SkillForge's flexible courses and hands-on projects.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-200" />
              <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition duration-200">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4"
                  data-testid="feature-icon"
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;