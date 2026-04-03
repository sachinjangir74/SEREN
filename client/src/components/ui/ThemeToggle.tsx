import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const { theme, toggleTheme, setTheme } = useAppStore();

  useEffect(() => {
    // initialize on first load if not done
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
};