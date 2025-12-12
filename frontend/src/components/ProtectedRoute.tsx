import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token, isLoading } = useAuth();
  const location = useLocation();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const isAuthenticated = !!token && !!user;

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute: Authentication state', { 
      path: location.pathname,
      hasToken: !!token, 
      hasUser: !!user, 
      isAuthenticated, 
      isLoading,
      initialCheckComplete
    });

    // Mark initial check as complete after first render
    if (!initialCheckComplete) {
      setInitialCheckComplete(true);
    }
  }, [token, user, isAuthenticated, isLoading, location.pathname, initialCheckComplete]);

  // Show loading state while checking authentication
  if (isLoading || (!initialCheckComplete && token)) {
    console.log('ProtectedRoute: Loading state - waiting for auth verification');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Verifying your authentication...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please wait while we check your session.</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login', { 
      path: location.pathname,
      hasToken: !!token,
      hasUser: !!user,
      initialCheckComplete
    });
    
    // Store the attempted URL for redirecting after login
    const from = location.pathname !== '/login' ? location.pathname + location.search : '/';
    return <Navigate to="/login" state={{ from }} replace />;
  }

  // Render children if authenticated
  console.log('ProtectedRoute: User authenticated, rendering protected content', { 
    path: location.pathname,
    userId: user?.id,
    userName: user?.name
  });
  
  return <>{children}</>;
};

export default ProtectedRoute;
