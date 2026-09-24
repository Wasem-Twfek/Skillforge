import React, { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import { quizService, QuizAttemptResult } from '../../services/quizService';

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuizProps {
  quizId: string;
  questions: Question[];
}

const Quiz: React.FC<QuizProps> = ({ quizId, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [attempt, setAttempt] = useState<QuizAttemptResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAnswer = async (answerIndex: number) => {
    if (isSubmitting) {
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setSubmitError(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((value) => value + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await quizService.submitAttempt(quizId, newAnswers);
      setAttempt(result);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit the quiz. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const retry = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setAttempt(null);
    setSubmitError(null);
  };

  if (questions.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">
          This quiz does not contain any questions.
        </p>
      </div>
    );
  }

  if (attempt) {
    return (
      <QuizResults
        questions={questions}
        answers={attempt.results}
        score={attempt.score}
        total={attempt.total}
        onRetry={retry}
      />
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Progress: {Math.round(progress)}%
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: progress + '%' }}
          />
        </div>
      </div>

      <QuizQuestion
        question={question}
        onAnswer={(index) => void handleAnswer(index)}
        selectedAnswer={answers[currentQuestion]}
        disabled={isSubmitting}
      />

      {submitError && (
        <div
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {submitError}
        </div>
      )}

      {isSubmitting && (
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Submitting your answers...
        </p>
      )}
    </div>
  );
};

export default Quiz;
