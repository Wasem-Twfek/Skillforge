const API_URL = 'http://localhost:3001';

export interface UserProgress {
  completedLessons: number;
  quizScores: {
    lessonTitle: string;
    score: number;
    date: string;
  }[];
  timeSpentMinutes: number;
}

export const userService = {
  getUserProgress: async (userId: string, token: string): Promise<UserProgress> => {
    const response = await fetch(`${API_URL}/users/${userId}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user progress');
    }
    return response.json();
  },
}; 