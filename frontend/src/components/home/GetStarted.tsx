import { ArrowRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const GetStarted = () => (
  <section className="bg-gray-50 py-20 dark:bg-gray-800/40">
    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">Get started</p>
      <h2 className="mb-5 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Start with one lesson</h2>
      <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
        Browse the available courses, create an account when you are ready, and keep your progress in one place.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/courses" className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white transition hover:bg-primary-700">
          Browse Courses
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        <Link to="/about" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
          About SkillForge
        </Link>
      </div>
      <div className="mt-8 inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Github className="mr-2 h-4 w-4" />
        Full-stack portfolio project
      </div>
    </div>
  </section>
);

export default GetStarted;
