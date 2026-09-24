import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { loginWithEmail, loginWithGoogle, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Clear any auth errors when component mounts
    clearError();
  }, [clearError]);

  useEffect(() => {
    // Update form error when auth error changes
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const handleGoogleSignIn = () => {
    clearError();
    setFormError(null);
    loginWithGoogle();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    // Form validation
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }

    try {
      const success = await loginWithEmail({ email, password });

      if (success) {
        // Get the redirect path from the location state or default to '/courses'
        const from = location.state?.from?.pathname || '/courses';

        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to log in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Left Column - Abstract Geometric Design and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        {/* Abstract geometric shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-400 mix-blend-multiply"></div>
          <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-indigo-500 mix-blend-multiply"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-purple-500 mix-blend-multiply"></div>
          <div className="absolute -bottom-24 right-1/4 w-64 h-64 rounded-full bg-blue-300 mix-blend-multiply"></div>
          
          {/* Animated floating shapes */}
          <div className="absolute top-1/3 left-1/4 w-12 h-12 rounded-lg bg-white opacity-10 animate-pulse"></div>
          <div className="absolute top-2/3 right-1/3 w-8 h-8 rounded-full bg-white opacity-10 animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/2 w-16 h-16 rounded-lg bg-white opacity-10 animate-pulse"></div>
        </div>
        
        {/* Content */}
        <div className="relative flex flex-col justify-center items-center h-full text-white p-12 z-10">
          <div className="mb-8">
            <svg className="w-20 h-20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 4L59.7 20V44L32 60L4.3 44V20L32 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M32 22L44 29V43L32 50L20 43V29L32 22Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">SkillForge</h1>
          <p className="text-xl md:text-2xl text-center font-light mb-10 max-w-md">Forge your future with skills that matter</p>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-6 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 shadow-lg transform transition hover:scale-105">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <h3 className="text-lg font-semibold">Learn by Doing</h3>
              </div>
              <p className="text-sm text-white/80">Hands-on projects and interactive exercises to build real skills</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 shadow-lg transform transition hover:scale-105">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <h3 className="text-lg font-semibold">Expert Curriculum</h3>
              </div>
              <p className="text-sm text-white/80">Content designed by industry professionals and educators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <svg className="w-16 h-16 text-blue-600 dark:text-blue-400" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 4L59.7 20V44L32 60L4.3 44V20L32 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M32 22L44 29V43L32 50L20 43V29L32 22Z" fill="currentColor" />
            </svg>
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">SkillForge</h1>
          </div>
          
          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                create a new account
              </Link>
            </p>
          </div>
          
          {/* Error Message */}
          {formError && (
            <div className="p-4 mb-4 text-sm rounded-lg bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300" role="alert">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                {formError}
              </div>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleEmailAuth} className="mt-8 space-y-6">
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full rounded-t-md border-0 py-3.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
                  placeholder="Email address"
                  aria-label="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full rounded-b-md border-0 py-3.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-blue-500"
                  placeholder="Password"
                  aria-label="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3.5 px-4 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-600 dark:to-indigo-700 dark:focus:ring-offset-gray-900 disabled:opacity-70 transition-all duration-200 ease-in-out"
                aria-label="Sign in"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-400 group-hover:text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                </span>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="group relative flex w-full justify-center items-center gap-3 rounded-md bg-white dark:bg-gray-800 py-3.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-70 transition-all duration-200 ease-in-out"
            aria-label="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;