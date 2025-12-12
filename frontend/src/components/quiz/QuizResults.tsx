import React from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResultsProps {
  questions: Question[];
  answers: number[];
  onRetry: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ questions, answers, onRetry }) => {
  const score = answers.reduce((total, answer, index) => {
    return total + (answer === questions[index].correctAnswer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
        <div className="text-4xl font-bold text-blue-600 mb-2">{percentage}%</div>
        <p className="text-gray-600">
          You scored {score} out of {questions.length} questions correctly
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((question, index) => {
          const isCorrect = answers[index] === question.correctAnswer;
          return (
            <div
              key={question.id}
              className={`p-4 rounded-lg border ${
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start mb-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {isCorrect ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium">{question.question}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Your answer: {question.options[answers[index]]}
                  </p>
                  {!isCorrect && (
                    <p className="text-sm text-green-600 mt-1">
                      Correct answer: {question.options[question.correctAnswer]}
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
          onClick={onRetry}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default QuizResults; 