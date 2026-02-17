'use client';

import { useEffect } from 'react';

const DARK_THEME = {
  primary: '#0446F1',
  secondary: '#AE4DAF',
  accent: '#AE4DAF',
  text: '#FFFFFF',
  textMuted: '#a0a0a0',
  bg: '#000000',
  card: '#0f0f1a',
  border: '#AE4DAF'
};

export default function PaletteSelector() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--palette-primary', DARK_THEME.primary);
    root.style.setProperty('--palette-secondary', DARK_THEME.secondary);
    root.style.setProperty('--palette-accent', DARK_THEME.accent);
    root.style.setProperty('--palette-text', DARK_THEME.text);
    root.style.setProperty('--palette-text-muted', DARK_THEME.textMuted);
    root.style.setProperty('--palette-bg', DARK_THEME.bg);
    root.style.setProperty('--palette-card', DARK_THEME.card);
    root.style.setProperty('--palette-border', DARK_THEME.border);
  }, []);

  return null;
}
