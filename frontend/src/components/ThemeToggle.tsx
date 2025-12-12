import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      {/* Main toggle button - accessible with keyboard and screen readers */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        role="switch"
        aria-checked={resolvedTheme === 'dark'}
      >
        {resolvedTheme === 'dark' ? (
          <svg 
            className="h-5 w-5 text-yellow-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.03a1 1 0 011.42 1.42l-.71.7a1 1 0 01-1.41-1.41l.7-.71zm4.01 5.97a1 1 0 10-2 0 1 1 0 002 0zm-2.03 4.22a1 1 0 011.41 1.41l-.7.71a1 1 0 01-1.42-1.42l.71-.7zm-5.97 4.01a1 1 0 001 2 1 1 0 00-1-2zm-4.22-2.03a1 1 0 00-1.41 1.41l.7.71a1 1 0 001.42-1.42l-.71-.7zm-4.01-5.97a1 1 0 112 0 1 1 0 01-2 0zm2.03-4.22a1 1 0 00-1.41-1.41l-.7.71a1 1 0 001.41 1.41l.7-.71zM10 5a5 5 0 100 10A5 5 0 0010 5z" />
          </svg>
        ) : (
          <svg 
            className="h-5 w-5 text-gray-600 dark:text-gray-200" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707 8 8 0 1017.293 13.293z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
