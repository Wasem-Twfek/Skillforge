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
  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    if (!initialCheckComplete) {
      setInitialCheckComplete(true);
    }
  }, [initialCheckComplete]);

  if (isLoading || (!initialCheckComplete && token)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent dark:border-blue-500" />
        <p className="text-lg text-gray-600 dark:text-gray-300">Checking your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const from = location.pathname !== '/login'
      ? location.pathname + location.search
      : '/';

    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
