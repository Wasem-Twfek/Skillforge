import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or default to 'system'
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'system';
  });

  // Track the resolved theme (actual light/dark value)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Toggle between light and dark (or system and light if in system mode)
  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'dark';
      // If system, switch to the opposite of the current resolved theme
      return resolvedTheme === 'dark' ? 'light' : 'dark';
    });
  };

  // Effect to handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Initial setup
    if (theme === 'system') {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Effect to apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the appropriate class
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update color-scheme for browser UI elements
    root.style.colorScheme = resolvedTheme;
  }, [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
