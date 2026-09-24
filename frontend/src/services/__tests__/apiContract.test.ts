import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosInstance from '../../lib/axios';
import { courseService } from '../courseService';
import lessonService from '../lessonService';
import { quizService } from '../quizService';

// Contract regression tests: frontend service calls must match the backend
// routes exactly (Phase 4), use the singular `quiz` shape (Phase 7 / ADR-006),
// and stay same-origin relative (Phase 7 runtime recovery).
describe('API contract', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('uses a relative same-origin baseURL so requests go through the proxy', () => {
    expect(axiosInstance.defaults.baseURL ?? '').toBe('');
  });

  it('fetches the course list from /api/courses with object instructors', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValue({
      data: [
        {
          id: 'c1',
          title: 'Course',
          instructor: { id: 'i1', name: 'Instructor', avatar: null, bio: null },
        },
      ],
    });
    const courses = await courseService.getAllCourses();
    expect(getSpy).toHaveBeenCalledWith('/api/courses');
    expect(typeof courses[0].instructor).toBe('object');
  });

  it('fetches user courses from /api/courses/user', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: [] });
    await courseService.getUserCourses();
    expect(getSpy).toHaveBeenCalledWith('/api/courses/user');
  });

  it('fetches lessons by course from /api/courses/:id/lessons', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValue({ data: [] });
    await courseService.getLessonsByCourseId('course-1');
    expect(getSpy).toHaveBeenCalledWith('/api/courses/course-1/lessons');
  });

  it('enrolls via POST /api/courses/:id/enroll', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValue({ data: {} });
    await courseService.enrollInCourse('course-1');
    expect(postSpy).toHaveBeenCalledWith('/api/courses/course-1/enroll');
  });

  it('updates progress via POST /api/courses/:id/progress and never yields NaN', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValue({ data: { progress: 0 } });
    const result = await courseService.updateProgress('course-1', 'lesson-1', true);
    expect(postSpy).toHaveBeenCalledWith('/api/courses/course-1/progress', {
      lessonId: 'lesson-1',
      completed: true,
    });
    expect(result.progress).toBe(0);
    expect(Number.isNaN(result.progress)).toBe(false);
  });

  it('submits quiz answers without sending a client-supplied score or user id', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValue({
      data: {
        id: 'attempt-1',
        quizId: 'quiz-1',
        score: 2,
        total: 2,
        results: [
          { selectedAnswer: 1, correctAnswer: 1, isCorrect: true },
          { selectedAnswer: 0, correctAnswer: 0, isCorrect: true },
        ],
        createdAt: '2026-09-24T12:00:00Z',
      },
    });

    const result = await quizService.submitAttempt('quiz-1', [1, 0]);

    expect(postSpy).toHaveBeenCalledWith('/api/quizzes/quiz-1/attempt', {
      answers: [1, 0],
    });
    expect(result.score).toBe(2);
    expect(result.total).toBe(2);
  });

  it('reads the singular quiz shape on lessons (no quizzes array)', async () => {
    vi.spyOn(axiosInstance, 'get').mockResolvedValue({
      data: {
        id: 'lesson-1',
        title: 'Lesson',
        quiz: { id: 'quiz-1', title: 'Quiz', questions: [], lessonId: 'lesson-1' },
      },
    });
    const lesson = await lessonService.getLesson('lesson-1');
    expect(lesson.quiz).toBeDefined();
    expect(lesson.quiz?.id).toBe('quiz-1');
    expect('quizzes' in lesson).toBe(false);
  });
});
