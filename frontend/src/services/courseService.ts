import { Course, Lesson } from '../types/course';
import axiosInstance from '../lib/axios';

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

  // Get courses by category
  getCoursesByCategory: async (category: string): Promise<Course[]> => {
    const response = await axiosInstance.get(`/api/courses?category=${category}`);
    return response.data;
  },

  // Get courses by level
  getCoursesByLevel: async (level: string): Promise<Course[]> => {
    const response = await axiosInstance.get(`/api/courses?level=${level}`);
    return response.data;
  },

  // Search courses by title or description
  searchCourses: async (query: string): Promise<Course[]> => {
    const response = await axiosInstance.get(`/api/courses?search=${query}`);
    return response.data;
  },

  // Get a lesson by course ID and lesson ID
  getLesson: async (courseId: string, lessonId: string): Promise<Lesson | undefined> => {
    const response = await axiosInstance.get(`/api/lessons/${lessonId}?courseId=${courseId}`);
    return response.data;
  },

  // Get all lessons for a course
  getLessonsByCourseId: async (courseId: string): Promise<Lesson[]> => {
    const response = await axiosInstance.get(`/api/courses/${courseId}/lessons`);
    return response.data;
  },

  // Get courses sorted by rating
  getTopRatedCourses: async (limit: number = 5): Promise<Course[]> => {
    const response = await axiosInstance.get(`/api/courses?sort=rating&limit=${limit}`);
    return response.data;
  },

  // Get courses sorted by number of students
  getPopularCourses: async (limit: number = 5): Promise<Course[]> => {
    const response = await axiosInstance.get(`/api/courses?sort=students&limit=${limit}`);
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