'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hamieverse-color-mode';

type ColorMode = 'dark' | 'light' | 'system';

export function useDarkMode() {
  const [mode, setMode] = useState<ColorMode>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ColorMode;
      if (stored && ['dark', 'light', 'system'].includes(stored)) {
        setMode(stored);
      }
    } catch (e) {
      console.error('Failed to load color mode:', e);
    }
    setIsLoaded(true);
  }, []);

  // Apply mode to document
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;

    let effectiveMode = mode;
    if (mode === 'system') {
      effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (effectiveMode === 'light') {
      root.setAttribute('data-color-mode', 'light');
    } else {
      root.removeAttribute('data-color-mode');
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, isLoaded]);

  // Listen for system theme changes
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.removeAttribute('data-color-mode');
      } else {
        root.setAttribute('data-color-mode', 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const setColorMode = useCallback((newMode: ColorMode) => {
    setMode(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : true));

  return {
    mode,
    isDark,
    isLoaded,
    setColorMode,
    toggleMode,
  };
}
