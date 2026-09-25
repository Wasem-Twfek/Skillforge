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
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const errorParam = params.get('error');
        const message = params.get('message');

        if (token) {
          localStorage.setItem('token', token);
          setStatus('Authentication successful. Redirecting...');

          const success = await fetchUserProfile(token);
          if (success) {
            navigate('/courses', { replace: true });
            return;
          }

          throw new Error('Failed to fetch your profile.');
        }

        if (errorParam) {
          setError(message || errorParam);
          setStatus('Authentication failed.');
          return;
        }

        setError('No authentication data received.');
        setStatus('Authentication failed.');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Authentication failed.');
        setStatus('Authentication failed.');
      }
    };

    handleAuth();
  }, [fetchUserProfile, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{status}</h1>
        {error ? (
          <>
            <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
            <button
              type="button"
              onClick={() => { window.location.href = '/login'; }}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Return to Login
            </button>
          </>
        ) : (
          <div className="my-6 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
