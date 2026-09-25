import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { fetchUserProfile } = useAuth();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log('AuthCallback: Processing authentication...');
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const errorParam = params.get('error');
        const message = params.get('message');

        if (token) {
          console.log('AuthCallback: Token received, length:', token.length);
          // Store token in localStorage immediately
          localStorage.setItem('token', token);
          setStatus('Authentication successful! Redirecting...');
          
          // Fetch user profile with the new token
          console.log('AuthCallback: Fetching user profile...');
          const success = await fetchUserProfile(token);
          
          if (success) {
            console.log('AuthCallback: Profile fetched successfully, redirecting to courses');
            // Immediate redirect for better UX
            navigate('/courses', { replace: true });
          } else {
            console.error('AuthCallback: Failed to fetch user profile');
            throw new Error('Failed to fetch user profile');
          }
        } else if (errorParam) {
          console.error('AuthCallback: Error from OAuth provider:', errorParam);
          setError(message || errorParam);
          setStatus('Authentication failed.');
        } else {
          console.error('AuthCallback: No token or error received');
          setError('No authentication data received.');
          setStatus('Authentication failed.');
        }
      } catch (err: unknown) {
        console.error('AuthCallback: Error during authentication:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('Authentication failed.');
      }
    };
    
    handleAuth();
  }, [navigate, fetchUserProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{status}</h1>
        {error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>
        ) : (
          <div className="flex justify-center my-6">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        {error && (
          <button onClick={() => window.location.href = '/login'} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Return to Login</button>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 