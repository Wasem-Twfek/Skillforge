import { motion } from 'framer-motion';
import { Flame, Award, Calendar, Trophy, Target, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DailyStreak = () => {
  // In a real app, this would come from user data/state
  const mockUserData = {
    streak: 5,
    todayCompleted: true,
    weekProgress: [true, true, true, true, true, false, false], // Mon to Sun
    achievements: [
      { name: 'Fast Learner', description: 'Complete 5 lessons in one day', earned: true },
      { name: 'Knowledge Seeker', description: 'Complete courses in 3 different categories', earned: true },
      { name: 'Consistent Learner', description: 'Maintain a 7-day streak', earned: false },
    ],
    weeklyGoal: 75, // percent
    totalXP: 1250,
    nextMilestone: 'Gold Badge'
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-1.5 mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 font-medium text-sm">
            <Flame className="w-4 h-4 mr-2" />
            Gamified Learning
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Track Your Learning Momentum
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Build habits that stick with daily goals, streaks, and achievements
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily streak & calendar */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Flame className="w-5 h-5 mr-2 text-amber-500" />
                  Daily Streak
                </h3>
                <Link 
                  to="/profile"
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                >
                  View Details
                </Link>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                    {mockUserData.streak}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">Day Streak</div>
                    <div className="text-gray-500 dark:text-gray-400">Keep it going!</div>
                  </div>
                </div>
                
                <div className="text-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {mockUserData.todayCompleted ? 'Today Completed!' : 'Start Today\'s Lesson'}
                  </div>
                </div>
              </div>
              
              {/* Weekly calendar */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  This Week&apos;s Progress
                </div>
                <div className="flex justify-between">
                  {weekDays.map((day, index) => (
                    <div key={day + index} className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{day}</div>
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          mockUserData.weekProgress[index]
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : index < 5 
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-dashed border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {mockUserData.weekProgress[index] ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span>{index < 5 ? '✕' : ''}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Weekly goal progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Weekly Goal ({mockUserData.weeklyGoal}%)
                  </div>
                  <div className="text-sm text-primary-600 dark:text-primary-400">15/20 min</div>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${mockUserData.weeklyGoal}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Achievements & Milestones */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-500" />
                  Achievements
                </h3>
                <div className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                  {mockUserData.totalXP} XP
                </div>
              </div>
              
              {/* Achievements list */}
              <div className="space-y-4 mb-6">
                {mockUserData.achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    className={`p-4 rounded-xl flex items-center ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-purple-50 to-primary-50 dark:from-purple-900/20 dark:to-primary-900/20 border border-purple-100 dark:border-purple-900/30' 
                        : 'bg-gray-50 dark:bg-gray-700/30'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-purple-500 to-primary-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }`}>
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`font-medium ${
                        achievement.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {achievement.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Next milestone */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Next Milestone</div>
                    <div className="font-medium text-gray-900 dark:text-white">{mockUserData.nextMilestone}</div>
                  </div>
                  <Link
                    to="/profile/achievements"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 transition-colors"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Quick action button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link
            to="/courses"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Flame className="mr-2 w-5 h-5" />
            Continue Your Learning Journey
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyStreak; 