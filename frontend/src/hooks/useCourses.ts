import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';

// Type for user's enrolled courses with progress tracking
export interface CourseState extends Course {
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

export const useUserCourses = () => {
  const { token } = useAuth();
  return useQuery<CourseState[]>({
    queryKey: ['userCourses'],
    queryFn: () => courseService.getUserCourses() as Promise<CourseState[]>,
    enabled: !!token,
    retry: false
  });
};

// React Query hooks for course catalog
export const useCourses = () => {
  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: courseService.getAllCourses
  });
};

export const useCourse = (id: string) => {
  return useQuery<Course | undefined>({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id
  });
};

export const useCoursesByCategory = (category: string) => {
  return useQuery<Course[]>({
    queryKey: ['courses', 'category', category],
    queryFn: () => courseService.getCoursesByCategory(category),
    enabled: !!category
  });
};

export const useCoursesByLevel = (level: string) => {
  return useQuery<Course[]>({
    queryKey: ['courses', 'level', level],
    queryFn: () => courseService.getCoursesByLevel(level),
    enabled: !!level
  });
};

export const useSearchCourses = (query: string) => {
  return useQuery<Course[]>({
    queryKey: ['courses', 'search', query],
    queryFn: () => courseService.searchCourses(query),
    enabled: !!query
  });
};

export const useLesson = (courseId: string, lessonId: string) => {
  return useQuery<any>({
    queryKey: ['lesson', courseId, lessonId],
    queryFn: () => courseService.getLesson(courseId, lessonId),
    enabled: !!courseId && !!lessonId
  });
};

export const useLessonsByCourse = (courseId: string) => {
  return useQuery<any[]>({
    queryKey: ['lessons', courseId],
    queryFn: () => courseService.getLessonsByCourseId(courseId),
    enabled: !!courseId
  });
};

export const useTopRatedCourses = (limit: number = 5) => {
  return useQuery<Course[]>({
    queryKey: ['courses', 'top-rated', limit],
    queryFn: () => courseService.getTopRatedCourses(limit)
  });
};

export const usePopularCourses = (limit: number = 5) => {
  return useQuery<Course[]>({
    queryKey: ['courses', 'popular', limit],
    queryFn: () => courseService.getPopularCourses(limit)
  });
};