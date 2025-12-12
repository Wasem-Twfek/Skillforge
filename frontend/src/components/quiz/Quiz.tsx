import React, { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const score = newAnswers.reduce((total, answer, index) => {
        return total + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      onComplete(score, questions.length);
    }
  };

  if (showResults) {
    return (
      <QuizResults
        questions={questions}
        answers={answers}
        onRetry={() => {
          setCurrentQuestion(0);
          setAnswers([]);
          setShowResults(false);
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Question {currentQuestion + 1} of {questions.length}</h2>
          <div className="text-sm text-gray-500">
            Progress: {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <QuizQuestion
        question={questions[currentQuestion]}
        onAnswer={handleAnswer}
        selectedAnswer={answers[currentQuestion]}
      />
    </div>
  );
};

export default Quiz; 