import { useState } from 'react';
import { Code2, Palette, TrendingUp, Cpu, Languages, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'programming',
    name: 'Programming',
    icon: <Code2 className="h-5 w-5" />,
    description: 'Frontend, backend, and general programming topics.',
    courses: ['JavaScript', 'React', 'Python'],
  },
  {
    id: 'design',
    name: 'Design',
    icon: <Palette className="h-5 w-5" />,
    description: 'UI, UX, and visual design fundamentals.',
    courses: ['UI/UX Basics', 'Figma', 'Design Thinking'],
  },
  {
    id: 'business',
    name: 'Business',
    icon: <TrendingUp className="h-5 w-5" />,
    description: 'Practical skills for business and analytics.',
    courses: ['Marketing', 'Leadership', 'Business Analytics'],
  },
  {
    id: 'ai',
    name: 'AI & ML',
    icon: <Cpu className="h-5 w-5" />,
    description: 'Machine learning and applied AI topics.',
    courses: ['Machine Learning', 'Applied AI', 'Data Science'],
  },
  {
    id: 'language',
    name: 'Languages',
    icon: <Languages className="h-5 w-5" />,
    description: 'Language learning for study and work.',
    courses: ['English', 'Spanish', 'Japanese'],
  },
];

const SkillRecommendations = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
            Explore by skill
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Find a topic to learn
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            Browse the main areas covered by the current course library.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <div className="rounded-2xl bg-white p-2 shadow-sm dark:bg-gray-800">
            {categories.map((category) => {
              const active = activeCategory.id === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={'flex w-full items-center rounded-xl px-4 py-3 text-left transition-colors ' +
                    (active
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700')}
                >
                  {category.icon}
                  <span className="ml-3 font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">{activeCategory.name}</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">{activeCategory.description}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {activeCategory.courses.map((course) => (
                <Link
                  key={course}
                  to={'/courses?category=' + activeCategory.id}
                  className="group rounded-xl border border-gray-200 p-5 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-gray-700"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{course}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary-500" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Browse related courses</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillRecommendations;
