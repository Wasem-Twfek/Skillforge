import { Course, Lesson } from '../types/course';
import axiosInstance from '../lib/axios';

// Note: the backend ignores course list query filters/sorts, so this
// service only exposes the endpoints the backend actually implements
// (list, user courses, detail, lessons-by-course, enroll, progress).
export const courseService = {
  // Get all courses
  getAllCourses: async (): Promise<Course[]> => {
    const response = await axiosInstance.get('/api/courses');
    return response.data;
  },

  // Get user's enrolled courses
  getUserCourses: async (): Promise<Course[]> => {
    const response = await axiosInstance.get('/api/courses/user');
    return response.data;
  },

  // Get a single course by ID
  getCourseById: async (id: string): Promise<Course | undefined> => {
    const response = await axiosInstance.get(`/api/courses/${id}`);
    return response.data;
  },

  // Get all lessons for a course
  getLessonsByCourseId: async (courseId: string): Promise<Lesson[]> => {
    const response = await axiosInstance.get(`/api/courses/${courseId}/lessons`);
    return response.data;
  },

  // Enroll in a course
  enrollInCourse: async (courseId: string): Promise<void> => {
    await axiosInstance.post(`/api/courses/${courseId}/enroll`);
  },

  // Update course progress
  updateProgress: async (courseId: string, lessonId: string, completed: boolean): Promise<{ progress: number }> => {
    const response = await axiosInstance.post(`/api/courses/${courseId}/progress`, {
      lessonId,
      completed
    });
    return response.data;
  }
}; 