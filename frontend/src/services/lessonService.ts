import axiosInstance from '../lib/axios';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string | null;
  courseId: string;
  order: number;
  progress?: number;
  imageUrl?: string;
  quiz?: Quiz | null;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  lessonId: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
}

const lessonService = {
  async getAllLessons(): Promise<Lesson[]> {
    const response = await axiosInstance.get('/api/lessons');
    return response.data;
  },

  async getLesson(id: string): Promise<Lesson> {
    const response = await axiosInstance.get('/api/lessons/' + id);
    return response.data;
  },
};

export default lessonService;
