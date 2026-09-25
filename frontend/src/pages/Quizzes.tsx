import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';

// Shape returned by GET /api/quizzes (Quiz model: singular 1-1 lesson
// relation; questions is an opaque JSON payload of unknown length).
interface QuizSummary {
  id: string;
  title: string;
  lessonId: string;
  questions?: unknown;
}

const fetchQuizzes = async (): Promise<QuizSummary[]> => {
  const response = await axiosInstance.get('/api/quizzes');
  return response.data;
};

const Quizzes: React.FC = () => {
  const { token } = useAuth();
  const { data: quizzes, isLoading, error } = useQuery<QuizSummary[], Error>({
    queryKey: ['quizzes'],
    queryFn: fetchQuizzes,
    // GET /api/quizzes requires authentication; do not fire anonymously.
    enabled: !!token,
    retry: false,
  });

  const renderBody = () => {
    if (!token) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in to view quizzes.</p>
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Go to Login
          </Link>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load quizzes</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{error.message}</p>
        </div>
      );
    }
    if (!quizzes || quizzes.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">There are no quizzes available at the moment.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
          return (
            <Link
              key={quiz.id}
              to={`/lessons/${quiz.lessonId}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {questionCount} {questionCount === 1 ? 'question' : 'questions'}
              </p>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Quizzes</h1>
      {renderBody()}
    </div>
  );
};

export default Quizzes;
