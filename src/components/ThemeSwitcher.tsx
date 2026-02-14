'use client';

import { useState, useEffect } from 'react';

const themes = [
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖' },
  { id: 'matrix', name: 'Matrix', icon: '💚' },
  { id: 'brutalist', name: 'Brutal', icon: '🔲' },
  { id: 'arcade', name: 'Arcade', icon: '👾' },
  { id: 'volcanic', name: 'Volcanic', icon: '🌋' },
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
              {currentTheme === theme.id && <span className="theme-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
