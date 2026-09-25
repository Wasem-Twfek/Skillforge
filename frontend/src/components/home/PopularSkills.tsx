import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course } from '../../types/course';
import { mockCourses } from '../../data/mockCourses';

const PopularSkills = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCourses(mockCourses.slice(0, 8));
  }, []);

  const scroll = (offset: number) => {
    carouselRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Browse the course library
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Explore the current course library and jump into a topic you want to study.
          </p>
        </motion.div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll(-320)}
            className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            onClick={() => scroll(320)}
            className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </button>

          <motion.div
            ref={carouselRef}
            className="hide-scrollbar overflow-x-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex min-w-full gap-6 py-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="min-w-[300px] max-w-[300px] flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={'/courses/' + course.id}
                    className="block h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            'https://placehold.co/400x200/4338ca/ffffff?text=' +
                            encodeURIComponent(course.category);
                        }}
                      />
                      <span className="absolute left-3 top-3 rounded-lg bg-white px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {course.level}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                          {course.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {course.lessons.length} lessons
                        </span>
                      </div>

                      <h3 className="line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                        {course.title}
                      </h3>

                      <div className="mt-4 flex items-center">
                        {course.instructor.avatar ? (
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="mr-2 h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                            {course.instructor.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.instructor.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all courses
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularSkills;
