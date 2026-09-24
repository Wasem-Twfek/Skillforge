import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { trackRouteChange } from './utils/performanceMonitor';
import MainLayout from './layouts/MainLayout';
import PageLoader from './components/PageLoader';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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

const RouteChangeTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackRouteChange(location.pathname, performance.now());
  }, [location]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

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
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => (
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

export default App;
