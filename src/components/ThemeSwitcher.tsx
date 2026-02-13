'use client';

import { useState, useEffect } from 'react';

const themes = [
  { id: 'default', name: 'Default', icon: '🎮' },
  { id: 'neon', name: 'Neon', icon: '💜' },
  { id: 'glass', name: 'Glass', icon: '✨' },
  { id: 'brutalist', name: 'Brutal', icon: '🔲' },
  { id: 'arcade', name: 'Arcade', icon: '👾' },
  { id: 'minimal', name: 'Minimal', icon: '◽' },
  { id: 'retro', name: 'Retro', icon: '🌴' },
  { id: 'matrix', name: 'Matrix', icon: '💚' },
  { id: 'sunset', name: 'Sunset', icon: '🌅' },
  { id: 'ocean', name: 'Ocean', icon: '🌊' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖' },
  { id: 'forest', name: 'Forest', icon: '🌲' },
  { id: 'midnight', name: 'Midnight', icon: '🌙' },
  { id: 'cherry', name: 'Cherry', icon: '🌸' },
  { id: 'steampunk', name: 'Steampunk', icon: '⚙️' },
  { id: 'ice', name: 'Ice', icon: '❄️' },
  { id: 'volcanic', name: 'Volcanic', icon: '🌋' },
  { id: 'noir', name: 'Noir', icon: '🎬' },
  { id: 'candy', name: 'Candy', icon: '🍬' },
  { id: 'hacker', name: 'Hacker', icon: '💻' },
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('default');
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
