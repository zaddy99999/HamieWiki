'use client';

import { useDarkMode } from '@/hooks/useDarkMode';

export default function DarkModeToggle() {
  const { mode, toggleMode, isLoaded } = useDarkMode();

  if (!isLoaded) return null;

  const getModeIcon = () => {
    switch (mode) {
      case 'dark': return '🌙';
      case 'light': return '☀️';
      case 'system': return '💻';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'dark': return 'Dark';
      case 'light': return 'Light';
      case 'system': return 'System';
    }
  };

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleMode}
      title={`Color Mode: ${getModeLabel()} (tap to change)`}
      style={{ minHeight: '44px', padding: '10px 16px' }}
    >
      <span className="dark-mode-icon">{getModeIcon()}</span>
      <span className="dark-mode-label">{getModeLabel()}</span>
    </button>
  );
}
