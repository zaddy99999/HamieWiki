'use client';

import { useState, useEffect } from 'react';
import { BrutalistIcon, ArcadeIcon } from './Icons';

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('brutalist');

  useEffect(() => {
    const saved = localStorage.getItem('wiki-theme');
    if (saved && (saved === 'brutalist' || saved === 'arcade')) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'brutalist');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'brutalist' ? 'arcade' : 'brutalist';
    setCurrentTheme(newTheme);
    localStorage.setItem('wiki-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Switch to ${currentTheme === 'brutalist' ? 'Arcade' : 'Brutal'} theme`}
      style={{ minWidth: '44px', minHeight: '44px' }}
    >
      {currentTheme === 'brutalist' ? <BrutalistIcon size={22} /> : <ArcadeIcon size={22} />}
    </button>
  );
}
