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

export const useCourse = (id: string) => {
  return useQuery<Course | undefined>({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id
  });
};

export const useLessonsByCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => courseService.getLessonsByCourseId(courseId),
    enabled: !!courseId
  });
};