import React, { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return <>{children}</>;
};