'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hamieverse-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (e) {
        console.error('Failed to save favorites:', e);
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((characterId: string) => {
    setFavorites(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else {
        return [...prev, characterId];
      }
    });
  }, []);

  const isFavorite = useCallback((characterId: string) => {
    return favorites.includes(characterId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
  };
}
