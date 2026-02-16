'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
  CyberpunkIcon,
  MatrixIcon,
  BrutalistIcon,
  ArcadeIcon,
  VolcanicIcon,
  CheckIcon,
  ThemeIcon
} from './Icons';

interface Theme {
  id: string;
  name: string;
  icon: ReactNode;
}

const themes: Theme[] = [
  { id: 'cyberpunk', name: 'Cyberpunk', icon: <CyberpunkIcon size={18} /> },
  { id: 'matrix', name: 'Matrix', icon: <MatrixIcon size={18} /> },
  { id: 'brutalist', name: 'Brutal', icon: <BrutalistIcon size={18} /> },
  { id: 'arcade', name: 'Arcade', icon: <ArcadeIcon size={18} /> },
  { id: 'volcanic', name: 'Volcanic', icon: <VolcanicIcon size={18} /> },
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('cyberpunk');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wiki-theme');
    if (saved) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('wiki-theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setIsOpen(false);
  };

  const current = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="theme-switcher">
      <button
        className="theme-switcher-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
      >
        <span className="theme-icon">{current.icon}</span>
        <span className="theme-label">Theme</span>
      </button>

      {isOpen && (
        <div className="theme-switcher-dropdown">
          {themes.map((theme, i) => (
            <button
              key={theme.id}
              className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
              onClick={() => changeTheme(theme.id)}
            >
              <span className="theme-option-num">{i + 1}</span>
              <span className="theme-option-icon">{theme.icon}</span>
              <span className="theme-option-name">{theme.name}</span>
              {currentTheme === theme.id && <span className="theme-check"><CheckIcon size={14} /></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
