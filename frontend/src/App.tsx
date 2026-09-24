import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trackRouteChange } from './utils/performanceMonitor';

// Layout components
import MainLayout from './layouts/MainLayout';

// Lazy-loaded components
import PageLoader from './components/PageLoader';
import ProtectedRoute from './components/ProtectedRoute';

// Performance optimized query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false
      // suspense option removed as it's not needed
    },
  },
});

import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const LessonDetail = lazy(() => import('./pages/LessonDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Quizzes = lazy(() => import('./pages/Quizzes'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Courses = lazy(() => import('./pages/Courses'));
const Offline = lazy(() => import('./pages/Offline'));

// Components
import PWAUpdatePrompt from './components/PWAUpdatePrompt';

// Route change tracker component
const RouteChangeTracker: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    const startTime = performance.now();
    // Track route change performance
    trackRouteChange(location.pathname, startTime);
  }, [location]);
  
  return null;
};

// AnimatedRoutes component to handle route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main layout with shared header/footer */}
        <Route element={<MainLayout />}>
          {/* Public routes - use fade animation for home and about */}
          <Route path="/" element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition type="fade"><Home /></PageTransition>
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition type="fade"><About /></PageTransition>
            </Suspense>
          } />
          
          {/* Semi-protected routes - use scale animation for courses and lessons */}
          <Route path="/lessons/:id" element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition type="scale"><LessonDetail /></PageTransition>
            </Suspense>
          } />
          <Route path="/quizzes" element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition type="scale"><Quizzes /></PageTransition>
            </Suspense>
          } />
          <Route path="/courses" element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition type="scale"><Courses /></PageTransition>
            </Suspense>
          } />
          <Route path="/courses/:id" element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition type="scale"><CourseDetail /></PageTransition>
            </Suspense>
          } />
          <Route path="/offline" element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition type="fade"><Offline /></PageTransition>
            </Suspense>
          } />
          
          {/* Protected routes - use slide animation for user-specific pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition type="slide"><Profile /></PageTransition>
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition type="slide"><Dashboard /></PageTransition>
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        
        {/* Standalone pages without the main layout - use rotate and flip for auth pages */}
        <Route path="/login" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition type="rotate"><Login /></PageTransition>
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition type="flip"><Signup /></PageTransition>
          </Suspense>
        } />
        <Route path="/auth/callback" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition type="fade"><AuthCallback /></PageTransition>
          </Suspense>
        } />
        {/* Additional test route */}
        <Route path="/auth-test" element={<Navigate to="/auth-test.html" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <RouteChangeTracker />
            <PWAUpdatePrompt />
            <AnimatedRoutes />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
