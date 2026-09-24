import React from 'react';
import { QuizAnswerResult } from '../../services/quizService';

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuizResultsProps {
  questions: Question[];
  answers: QuizAnswerResult[];
  score: number;
  total: number;
  onRetry: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  answers,
  score,
  total,
  onRetry,
}) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Quiz Results
        </h2>

        <div className="mb-2 text-4xl font-bold text-blue-600">
          {percentage}%
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          You scored {score} out of {total} questions correctly.
        </p>
      </div>

      <div className="mb-8 space-y-6">
        {questions.map((question, index) => {
          const result = answers[index];
          const isCorrect = result?.isCorrect ?? false;
          const selectedAnswer = result?.selectedAnswer;
          const correctAnswer = result?.correctAnswer;

          return (
            <div
              key={question.id}
              className={
                'rounded-lg border p-4 ' +
                (isCorrect
                  ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20'
                  : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20')
              }
            >
              <div className="flex items-start">
                <div
                  className={
                    'mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ' +
                    (isCorrect ? 'bg-green-500' : 'bg-red-500')
                  }
                  aria-hidden="true"
                >
                  {isCorrect ? '✓' : '×'}
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {question.question}
                  </p>

                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Your answer:{' '}
                    {typeof selectedAnswer === 'number' &&
                    question.options[selectedAnswer] !== undefined
                      ? question.options[selectedAnswer]
                      : 'No answer'}
                  </p>

                  {!isCorrect && typeof correctAnswer === 'number' && (
                    <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                      Correct answer:{' '}
                      {question.options[correctAnswer] ?? 'Unavailable'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
