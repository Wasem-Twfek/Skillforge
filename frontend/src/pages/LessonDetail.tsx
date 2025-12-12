import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import lessonService from '../services/lessonService';
import { useAuth } from '../contexts/AuthContext';

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonService.getLesson(id!),
    enabled: !!id && !!token,
  });

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded">
          Please log in to view lessons
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          Error loading lesson
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{lesson?.title}</h1>
      <div className="prose max-w-none dark:prose-invert">
        {lesson?.content}
      </div>
    </div>
  );
};

export default LessonDetail; 