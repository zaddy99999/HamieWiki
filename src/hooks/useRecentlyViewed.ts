'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hamieverse-recently-viewed';
const MAX_ITEMS = 10;

export interface RecentItem {
  type: 'character' | 'location' | 'page';
  id: string;
  name: string;
  path: string;
  image?: string;
  viewedAt: number;
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recently viewed:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save recently viewed:', e);
      }
    }
  }, [items, isLoaded]);

  // Add an item to recently viewed
  const addItem = useCallback((item: Omit<RecentItem, 'viewedAt'>) => {
    setItems(prev => {
      // Remove existing entry for same item
      const filtered = prev.filter(i => !(i.type === item.type && i.id === item.id));

      // Add new item at the start
      const newItem: RecentItem = {
        ...item,
        viewedAt: Date.now(),
      };

      // Keep only MAX_ITEMS
      return [newItem, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  // Clear all items
  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  // Get items excluding a specific one (useful when viewing a character page)
  const getItemsExcluding = useCallback((type: string, id: string) => {
    return items.filter(i => !(i.type === type && i.id === id));
  }, [items]);

  return {
    items,
    isLoaded,
    addItem,
    clearAll,
    getItemsExcluding,
  };
}
