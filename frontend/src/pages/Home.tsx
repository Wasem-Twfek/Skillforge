import { useState, useEffect } from 'react';
import EnhancedHero from '../components/home/EnhancedHero';
import PopularSkills from '../components/home/PopularSkills';
import AIRecommendation from '../components/home/AIRecommendation';
import DailyStreak from '../components/home/DailyStreak';
import Testimonials from '../components/home/Testimonials';
import WhyItWorks from '../components/home/WhyItWorks';
import GetStarted from '../components/home/GetStarted';
import SearchBar from '../components/home/SearchBar';
import FeaturedCourse from '../components/home/FeaturedCourse';
import LearningPaths from '../components/home/LearningPaths';

const Home = () => {
  // For animation purposes, stagger the rendering of components
  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    setShowComponents(true);
  }, []);

  return (
    <main className="text-gray-900 dark:text-white overflow-hidden">
      <EnhancedHero />
      
      {/* Search bar overlay */}
      <div className="relative z-10 -mt-16 mb-12">
        <SearchBar />
      </div>
      
      {showComponents && (
        <>
          <PopularSkills />
          
          {/* Featured Course Section */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
                  Featured Course of the Week
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Take a deeper look at our most popular course and start learning today
                </p>
              </div>
              
              <FeaturedCourse />
            </div>
          </section>
          
          <LearningPaths />
          <AIRecommendation />
          <DailyStreak />
          <WhyItWorks />
          <Testimonials />
          <GetStarted />
        </>
      )}
    </main>
  );
};

export default Home;