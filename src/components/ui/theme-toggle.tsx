"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme } from "@/lib/theme-utils";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    setThemeState(getInitialTheme());
    
    // Listen for theme changes from other components
    const handleThemeChange = () => {
      setThemeState(getInitialTheme());
    };
    
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    setThemeState(newTheme);
  };

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-300"
        aria-label="Toggle theme"
        type="button"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700"
        disabled
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
