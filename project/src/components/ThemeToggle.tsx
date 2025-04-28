import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './ui/Button';
import { useThemeStore } from '../store/themeStore';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="w-9 h-9 p-0"
      >
        {theme === 'light' && <Sun size={20} />}
        {theme === 'dark' && <Moon size={20} />}
        {theme === 'system' && <Monitor size={20} />}
      </Button>
    </motion.div>
  );
};