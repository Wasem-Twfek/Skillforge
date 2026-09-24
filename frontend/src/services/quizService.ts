import axiosInstance from '../lib/axios';

export interface QuizAnswerResult {
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

export interface QuizAttemptResult {
  id: string;
  quizId: string;
  score: number;
  total: number;
  results: QuizAnswerResult[];
  createdAt: string;
}

export const quizService = {
  submitAttempt: async (
    quizId: string,
    answers: number[],
  ): Promise<QuizAttemptResult> => {
    const response = await axiosInstance.post(
      '/api/quizzes/' + quizId + '/attempt',
      { answers },
    );

    return response.data;
  },
};
