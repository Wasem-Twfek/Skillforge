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

function normalizeUser(value: Record<string, unknown>): User {
  return {
    id: String(value.id ?? ''),
    name: String(value.name ?? ''),
    email: String(value.email ?? ''),
    bio: typeof value.bio === 'string' ? value.bio : undefined,
    avatar:
      typeof value.avatar === 'string'
        ? value.avatar
        : typeof value.picture === 'string'
          ? value.picture
          : undefined,
  };
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

        if (isMounted) {
          setUser(null);
        }
        return;
      }

      try {

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

        if (!response.ok) {
  
          throw new Error('Failed to get user profile');
        }
        
        const userData = await response.json();

        // Ensure we have valid user data
        if (!userData || !userData.id) {
          throw new Error('Invalid user data');
        }
        
        if (isMounted) {
          setUser(normalizeUser(userData));

        }
      } catch (err) {
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
      setUser(normalizeUser(data.user));
      
      return true;
    } catch (err: unknown) {
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
      setUser(normalizeUser(responseData.user));
      
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {

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
      const response = await fetch('/api/users/profile', {
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

      const response = await fetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }
      
      const userData = await response.json();

      // Ensure we have valid user data
      if (!userData || !userData.id) {
        throw new Error('Invalid user data');
      }
      
      // Update state with user data and token
      setUser(normalizeUser(userData));
      setToken(newToken);
      
      // Ensure token is stored in localStorage
      localStorage.setItem('token', newToken);
      
      return true;
    } catch (err) {
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