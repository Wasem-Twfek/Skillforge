export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  content: string;
  videoUrl?: string;
  resources?: {
    title: string;
    url: string;
    type: 'pdf' | 'link' | 'code';
  }[];
  quiz?: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'programming' | 'design' | 'business' | 'marketing' | 'language';
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  rating: number;
  reviews: number;
  students: number;
  price: number;
  lessons: Lesson[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
} 