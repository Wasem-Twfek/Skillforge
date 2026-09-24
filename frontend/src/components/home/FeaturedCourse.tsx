import { Link } from 'react-router-dom';
import { Award, BookOpen, ChevronRight, Clock, LockKeyhole } from 'lucide-react';
import { Course } from '../../types/course';
import { mockCourses } from '../../data/mockCourses';

const FeaturedCourse = () => {
  const featuredCourse: Course | undefined = [...mockCourses]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];

  if (!featuredCourse) {
    return null;
  }

  const totalDuration = featuredCourse.lessons.reduce(
    (total, lesson) => total + (lesson.duration ?? 0),
    0
  );
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="relative h-60 overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 sm:h-72">
        <img
          src={featuredCourse.thumbnail}
          alt={featuredCourse.title}
          className="h-full w-full object-cover opacity-30"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            {featuredCourse.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/90">
            <span className="inline-flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {hours > 0 ? hours + 'h ' : ''}{minutes}m
            </span>
            <span className="inline-flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              {featuredCourse.lessons.length} lessons
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="mb-8 text-gray-700 dark:text-gray-300">
          {featuredCourse.description}
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <BookOpen className="mr-2 h-5 w-5 text-primary-500" />
              Course content
            </h4>
            <div className="space-y-3">
              {featuredCourse.lessons.slice(0, 3).map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium dark:bg-gray-700">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-white">
                      {lesson.title}
                    </p>
                    {lesson.duration !== undefined && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lesson.duration} minutes
                      </p>
                    )}
                  </div>
                  {index > 0 && <LockKeyhole className="h-4 w-4 text-gray-400" />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Award className="mr-2 h-5 w-5 text-primary-500" />
              Included
            </h4>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>Course progress tracking</li>
              <li>Quizzes where available</li>
              <li>Responsive web interface</li>
            </ul>
          </div>
        </div>

        <Link
          to={'/courses/' + featuredCourse.id}
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-6 py-3.5 font-medium text-white transition hover:bg-primary-700"
        >
          Open Course
          <ChevronRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </article>
  );
};

export default FeaturedCourse;
