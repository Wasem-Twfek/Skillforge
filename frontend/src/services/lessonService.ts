import axios from 'axios';
import axiosInstance from '../lib/axios';

// Origin-only base (nullish keeps a production empty string relative);
// the /api prefix lives on the paths, matching src/lib/axios.ts.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  quizzes: Quiz[];
  progress?: number;
  imageUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  lessonId: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizAttempt {
  id: string;
  score: number;
  answers: string[];
}

const lessonService = {
  async getAllLessons(): Promise<Lesson[]> {
    const response = await axiosInstance.get('/api/lessons');
    return response.data;
  },

  async getLesson(id: string): Promise<Lesson> {
    const response = await axiosInstance.get(`/api/lessons/${id}`);
    return response.data;
  },

  async submitQuizAttempt(quizId: string, answers: string[], token: string): Promise<QuizAttempt> {
    const response = await axios.post(
      `${API_URL}/api/quizzes/${quizId}/attempt`,
      { answers },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
};

export default lessonService; 