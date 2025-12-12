import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Password strength indicator component
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: 'None', color: 'bg-gray-300 dark:bg-gray-600' };
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthMap = [
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-orange-500' },
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-green-500' },
      { label: 'Very Strong', color: 'bg-green-600' }
    ];
    
    return { 
      strength, 
      label: strengthMap[Math.min(strength, 4)].label, 
      color: strengthMap[Math.min(strength, 4)].color 
    };
  };
  
  const { strength, label, color } = getStrength(password);
  const percentage = (strength / 5) * 100;
  
  return (
    <div className="mt-1">
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300 ease-in-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
        Password strength: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
};

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

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

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    // Validate name
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Validate email
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    // Validate password
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogleSignIn = () => {
    clearError();
    setFormError(null);
    // Using the existing Google Sign-In functionality
    window.location.href = `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:3001'}/auth/google`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await register({ 
        name, 
        email, 
        password 
      });
      
      if (success) {
        navigate('/courses');
      }
    } catch (err) {
      console.error('Registration error:', err);
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
          <p className="text-xl md:text-2xl text-center font-light mb-10 max-w-md">Join our community of learners today</p>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-6 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 shadow-lg transform transition hover:scale-105">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <h3 className="text-lg font-semibold">Secure Account</h3>
              </div>
              <p className="text-sm text-white/80">Your data is protected with industry-standard encryption</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 shadow-lg transform transition hover:scale-105">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <h3 className="text-lg font-semibold">Free Trial Access</h3>
              </div>
              <p className="text-sm text-white/80">Get access to premium courses with your new account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
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
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign in
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
          
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${
                    validationErrors.name ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'
                  } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-blue-500`}
                  placeholder="John Doe"
                  aria-label="Full name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${
                    validationErrors.email ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'
                  } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-blue-500`}
                  placeholder="you@example.com"
                  aria-label="Email address"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${
                      validationErrors.password ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'
                    } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-blue-500`}
                    placeholder="••••••••"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                )}
                {password && <PasswordStrengthIndicator password={password} />}
              </div>
              
              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ${
                    validationErrors.confirmPassword ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'
                  } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-blue-500`}
                  placeholder="••••••••"
                  aria-label="Confirm password"
                />
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3.5 px-4 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:from-blue-600 dark:to-indigo-700 dark:focus:ring-offset-gray-900 disabled:opacity-70 transition-all duration-200 ease-in-out"
                aria-label="Create account"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-400 group-hover:text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                </span>
                {isLoading ? 'Creating Account...' : 'Create Account'}
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
            aria-label="Sign up with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>
          
          {/* Terms & Privacy */}
          <p className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
