export interface Lesson {
  id: string;
  title: string;
  description: string;
  // The backend Lesson has no duration column; the API never returns it.
  // Present only in local mock/demo data.
  duration?: number; // in minutes
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
  // The backend stores category/level as free text (e.g. "Web Development",
  // "Beginner"), not as a closed union.
  category: string;
  level: string;
  instructor: {
    id: string;
    name: string;
    // Nullable in the backend (User.avatar / User.bio are optional columns).
    avatar: string | null;
    bio: string | null;
  };
  // The backend Course has none of these commerce/engagement columns; the
  // API never returns them. Present only in local mock/demo data, so every
  // API-fed reader must handle their absence (no invented defaults).
  rating?: number;
  reviews?: number;
  students?: number;
  price?: number;
  lessons: Lesson[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
} 