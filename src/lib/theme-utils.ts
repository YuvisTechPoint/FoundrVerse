'use client';

export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
}

export function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  const isDark = theme === 'dark';
  
  root.classList.remove(isDark ? 'light' : 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
  
  localStorage.setItem('theme', theme);
  window.dispatchEvent(new Event('theme-change'));
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
}
