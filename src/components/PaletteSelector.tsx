'use client';

import { useEffect } from 'react';

const CLEAN_LIGHT = {
  primary: '#E53935',
  secondary: '#1E88E5',
  accent: '#FFC107',
  text: '#212121',
  textMuted: '#616161',
  bg: '#FAFAFA',
  card: '#FFFFFF',
  border: '#212121'
};

export default function PaletteSelector() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--palette-primary', CLEAN_LIGHT.primary);
    root.style.setProperty('--palette-secondary', CLEAN_LIGHT.secondary);
    root.style.setProperty('--palette-accent', CLEAN_LIGHT.accent);
    root.style.setProperty('--palette-text', CLEAN_LIGHT.text);
    root.style.setProperty('--palette-text-muted', CLEAN_LIGHT.textMuted);
    root.style.setProperty('--palette-bg', CLEAN_LIGHT.bg);
    root.style.setProperty('--palette-card', CLEAN_LIGHT.card);
    root.style.setProperty('--palette-border', CLEAN_LIGHT.border);
  }, []);

  return null;
}
