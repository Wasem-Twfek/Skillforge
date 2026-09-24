import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Import API URL from environment (nullish keeps a production empty string
// relative; only undefined/null fall back to dev). The fallback is relative
// so profile updates stay same-origin through the dev proxy, matching every
// other API call (an absolute fallback would bypass the proxy and fail CORS
// on non-default origins).
const API_URL = import.meta.env?.VITE_API_URL ?? '';

// Auth calls use relative /api/auth/* paths so they resolve through the dev
// proxy and the production nginx rewrite in the same way. Absolute /auth/*
// URLs bypass both and break behind nginx, so they are not used here.

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

// Login credentials interface
interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data interface
interface RegistrationData {
  email: string;
  password: string;
  name: string;
}

// Context interface
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  fetchUserProfile: (token: string) => Promise<boolean>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => {},
  clearError: () => {},
  fetchUserProfile: async () => false,
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount and token changes
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!token) {
        console.log('AuthContext: No token found, setting user to null');
        if (isMounted) {
          setUser(null);
        }
        return;
      }

      try {
        console.log('AuthContext: Checking auth with token:', token?.substring(0, 10) + '...');
        if (isMounted) {
          setIsLoading(true);
        }
        
        // Make a real API call to get user profile
        const response = await fetch(`/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        console.log('AuthContext: Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('AuthContext: Auth check failed with status:', response.status, 'Response:', errorText);
          throw new Error('Failed to get user profile');
        }
        
        const userData = await response.json();
        console.log('AuthContext: User data received:', userData);
        
        // Ensure we have valid user data
        if (!userData || !userData.id) {
          console.error('AuthContext: Invalid user data received:', userData);
          throw new Error('Invalid user data');
        }
        
        if (isMounted) {
          setUser(userData);
          console.log('AuthContext: User authenticated successfully');
        }
      } catch (err) {
        console.error('AuthContext: Auth check failed:', err);
        if (isMounted) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setError('Session expired. Please log in again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    console.log('AuthContext: Token changed, checking auth...');
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [token]);

  const loginWithGoogle = async () => {
    window.location.href = `/api/auth/google`;
  };

  const loginWithEmail = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      return true;
    } catch (err: unknown) {
      console.error('Email login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (data: RegistrationData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const responseData = await response.json();
      
      // Store token and user data
      localStorage.setItem('token', responseData.token);
      setToken(responseData.token);
      setUser(responseData.user);
      
      return true;
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user || !token) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        credentials: 'include' // Include cookies for sessions
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setUser({ ...user, ...updatedUser });
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Fetch user profile with a specific token
  const fetchUserProfile = async (newToken: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Fetching user profile with token:', newToken.substring(0, 10) + '...');
      
      const response = await fetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error('Failed to get user profile - Response status:', response.status);
        throw new Error('Failed to get user profile');
      }
      
      const userData = await response.json();
      console.log('User data received:', userData);
      
      // Ensure we have valid user data
      if (!userData || !userData.id) {
        console.error('Invalid user data received:', userData);
        throw new Error('Invalid user data');
      }
      
      // Update state with user data and token
      setUser(userData);
      setToken(newToken);
      
      // Ensure token is stored in localStorage
      localStorage.setItem('token', newToken);
      
      return true;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const authValue: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    loginWithGoogle,
    loginWithEmail,
    register,
    logout,
    updateProfile,
    clearError,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};