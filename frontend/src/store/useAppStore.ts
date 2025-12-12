import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CourseState } from '../hooks/useCourses';

// Define the app state interface
interface AppState {
  // UI state
  isDarkMode: boolean;
  isMenuOpen: boolean;
  isOffline: boolean;
  
  // App settings
  preferredLanguage: string;
  notifications: boolean;
  
  // Performance optimizations
  cachedCourses: Record<string, CourseState>;
  lastFetchTimestamp: number | null;
  
  // Actions
  setDarkMode: (isDark: boolean) => void;
  toggleMenu: () => void;
  setOfflineStatus: (isOffline: boolean) => void;
  setPreferredLanguage: (lang: string) => void;
  toggleNotifications: () => void;
  cacheCourse: (courseId: string, course: CourseState) => void;
  cacheCourses: (courses: CourseState[]) => void;
  clearCache: () => void;
}

// Create the store with persistence and dev tools
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        isMenuOpen: false,
        isOffline: !navigator.onLine,
        preferredLanguage: 'en',
        notifications: true,
        cachedCourses: {},
        lastFetchTimestamp: null,
        
        // Actions
        setDarkMode: (isDark) => set({ isDarkMode: isDark }),
        
        toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
        
        setOfflineStatus: (isOffline) => set({ isOffline }),
        
        setPreferredLanguage: (lang) => set({ preferredLanguage: lang }),
        
        toggleNotifications: () => set((state) => ({ 
          notifications: !state.notifications 
        })),
        
        // Cache a single course
        cacheCourse: (courseId, course) => set((state) => ({
          cachedCourses: {
            ...state.cachedCourses,
            [courseId]: course
          },
          lastFetchTimestamp: Date.now()
        })),
        
        // Cache multiple courses
        cacheCourses: (courses) => set((state) => {
          const newCache = { ...state.cachedCourses };
          courses.forEach(course => {
            newCache[course.id] = course;
          });
          
          return {
            cachedCourses: newCache,
            lastFetchTimestamp: Date.now()
          };
        }),
        
        // Clear the cache
        clearCache: () => set({ 
          cachedCourses: {},
          lastFetchTimestamp: null
        })
      }),
      {
        name: 'skillforge-storage',
        // Only persist certain parts of the state
        partialize: (state) => ({
          isDarkMode: state.isDarkMode,
          preferredLanguage: state.preferredLanguage,
          notifications: state.notifications
        })
      }
    )
  )
);

// Selector hooks for optimized component rendering
export const useDarkMode = () => useAppStore((state) => state.isDarkMode);
export const useOfflineStatus = () => useAppStore((state) => state.isOffline);
export const useMenuState = () => useAppStore((state) => state.isMenuOpen);

// Selector for cached courses
export const useCachedCourse = (courseId: string) => 
  useAppStore((state) => state.cachedCourses[courseId]);

// Selector for all cached courses
export const useCachedCourses = () => 
  useAppStore((state) => Object.values(state.cachedCourses));
