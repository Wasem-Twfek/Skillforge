import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const skills = ['JavaScript', 'Python', 'React', 'UI/UX Design', 'Data Science', 'AI & ML'];

const EnhancedHero = () => {
  const [currentSkill, setCurrentSkill] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const skill = skills[currentSkill];
    const delay = isDeleting ? 45 : text.length === skill.length ? 1200 : 90;

    const timer = window.setTimeout(() => {
      if (isDeleting) {
        const nextText = skill.slice(0, Math.max(0, text.length - 1));
        setText(nextText);

        if (nextText.length === 0) {
          setIsDeleting(false);
          setCurrentSkill((index) => (index + 1) % skills.length);
        }
        return;
      }

      const nextText = skill.slice(0, text.length + 1);
      setText(nextText);

      if (nextText.length === skill.length) {
        window.setTimeout(() => setIsDeleting(true), 1200);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [currentSkill, isDeleting, text]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Clock className="mr-2 h-4 w-4" />
              Short, focused learning sessions
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Build practical skills,
              <span className="block">one lesson at a time.</span>
              <span className="mt-2 block min-h-[1.2em] bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {text || 'JavaScript'}
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
              Browse focused lessons, practice with quizzes, and keep your progress in one place.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/courses" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-medium text-white transition hover:bg-blue-700">
                Browse Courses
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>

              {!user && (
                <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              )}

              <Link to="/lessons" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                <BookOpen className="mr-2 h-4 w-4" />
                View Lessons
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Example learning flow
            </p>
            <div className="space-y-5">
              {[
                ['01', 'Choose a course', 'Start with a topic that matches your current goal.'],
                ['02', 'Complete a lesson', 'Work through a focused lesson at your own pace.'],
                ['03', 'Check your progress', 'Use quizzes and progress tracking to see what is left.'],
              ].map(([step, title, description]) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{step}</div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;
