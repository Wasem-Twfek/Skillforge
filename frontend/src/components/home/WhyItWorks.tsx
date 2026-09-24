import { BookOpen, CheckCircle2, Clock3, LockKeyhole, BarChart3, Smartphone } from 'lucide-react';

const features = [
  { icon: Clock3, title: 'Focused lessons', description: 'Keep each study session small enough to fit around your day.' },
  { icon: BookOpen, title: 'Structured courses', description: 'Move through lessons in a clear course sequence.' },
  { icon: CheckCircle2, title: 'Quizzes', description: 'Check your understanding before moving on.' },
  { icon: BarChart3, title: 'Progress tracking', description: 'Track course progress and continue from where you stopped.' },
  { icon: LockKeyhole, title: 'Protected accounts', description: 'Account-specific learning data is protected behind authentication.' },
  { icon: Smartphone, title: 'Works across devices', description: 'The responsive interface and PWA support work across different screens.' },
];

const WhyItWorks = () => (
  <section className="bg-white py-20 dark:bg-gray-900">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">How it works</p>
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">A simple learning workflow</h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Choose a course, work through a lesson, practice, and keep track of your progress.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyItWorks;
