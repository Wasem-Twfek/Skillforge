import React from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answerIndex: number) => void;
  selectedAnswer?: number;
  disabled?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  selectedAnswer,
  disabled = false,
}) => {
  return (
    <div className="quiz-question">
      <h3 className="mb-4 text-lg font-medium">{question.question}</h3>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={
              'flex items-center rounded-lg border p-4 transition-colors ' +
              (disabled
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:border-blue-300') +
              (selectedAnswer === index
                ? ' border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : ' border-gray-200 dark:border-gray-700')
            }
          >
            <input
              type="radio"
              name={'question-' + question.id}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswer(index)}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-900 dark:text-gray-100">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
