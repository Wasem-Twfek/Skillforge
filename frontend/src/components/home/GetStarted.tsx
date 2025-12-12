import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    // In a real app, this would call an API endpoint to subscribe the user
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };
  
  return (
    <section className="py-24 bg-gradient-to-b from-primary-50 to-white dark:from-dark-bg-tertiary dark:to-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -right-40 top-20 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute -left-40 -bottom-20 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column: Newsletter signup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center text-primary-600 dark:text-primary-400 mb-4">
                <Mail className="w-5 h-5 mr-2" />
                <h3 className="text-lg font-medium">Stay Updated</h3>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Get weekly tips, insights, and learning resources
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join our newsletter for expert advice, learning hacks, and early access to new courses and features.
              </p>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 transition-all duration-200 ${loading ? 'opacity-70' : ''}`}
                  >
                    {loading ? (
                      <span className="animate-pulse">Subscribing...</span>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-6 bg-green-50 dark:bg-green-900/30 rounded-lg"
                >
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Thanks for subscribing!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Check your inbox for a confirmation email.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Right column: Final CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Ready to transform your 
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {" learning journey?"}
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              SkillForge makes learning fit into your life, not the other way around. Start your 5-minute learning habit today.
            </p>
            
            <div className="space-y-4 mb-8">
              {['Over 200 expert-led courses', 'Personalized AI learning paths', 'Learn on any device, anytime'].map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center lg:justify-start space-x-2"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white text-xs">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Learning for Free
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted; 