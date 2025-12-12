import React from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answerIndex: number) => void;
  selectedAnswer?: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer, selectedAnswer }) => {
  return (
    <div className="quiz-question">
      <h3 className="text-lg font-medium mb-4">{question.question}</h3>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswer(index)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;