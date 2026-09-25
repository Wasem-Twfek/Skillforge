import { useState, useEffect } from 'react';
import EnhancedHero from '../components/home/EnhancedHero';
import PopularSkills from '../components/home/PopularSkills';
import SkillRecommendations from '../components/home/SkillRecommendations';
import WhyItWorks from '../components/home/WhyItWorks';
import GetStarted from '../components/home/GetStarted';
import SearchBar from '../components/home/SearchBar';
import FeaturedCourse from '../components/home/FeaturedCourse';
import LearningPaths from '../components/home/LearningPaths';

const Home = () => {
  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    setShowComponents(true);
  }, []);

  return (
    <main className="overflow-hidden text-gray-900 dark:text-white">
      <EnhancedHero />

      <div className="relative z-10 -mt-16 mb-12">
        <SearchBar />
      </div>

      {showComponents && (
        <>
          <PopularSkills />

          <section className="bg-white py-20 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Featured Course
                </h2>
                <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
                  A sample course from the current content library.
                </p>
              </div>
              <FeaturedCourse />
            </div>
          </section>

          <LearningPaths />
          <SkillRecommendations />
          <WhyItWorks />
          <GetStarted />
        </>
      )}
    </main>
  );
};

export default Home;
