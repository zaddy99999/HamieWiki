'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAllCharacters } from '@/lib/hamieverse/characters';

interface ShortcutOptions {
  enableNavigation?: boolean;
  enableCharacterNav?: boolean;
  onHelp?: () => void;
}

export function useKeyboardShortcuts(options: ShortcutOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { enableNavigation = true, enableCharacterNav = true, onHelp } = options;

  const characters = getAllCharacters();
  const characterIds = characters.map(c => c.id.toLowerCase());

  const getCurrentCharacterIndex = useCallback(() => {
    if (!pathname.startsWith('/character/')) return -1;
    const currentId = pathname.split('/')[2]?.toLowerCase();
    return characterIds.indexOf(currentId);
  }, [pathname, characterIds]);

  const navigateToCharacter = useCallback((direction: 'next' | 'prev') => {
    const currentIndex = getCurrentCharacterIndex();
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % characterIds.length;
    } else {
      newIndex = (currentIndex - 1 + characterIds.length) % characterIds.length;
    }

    router.push(`/character/${characterIds[newIndex]}`);
  }, [getCurrentCharacterIndex, characterIds, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tagName = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) return;
      if ((e.target as HTMLElement).contentEditable === 'true') return;

      // Don't override browser shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        // Character navigation with j/k
        case 'j':
          if (enableCharacterNav && pathname.startsWith('/character/')) {
            e.preventDefault();
            navigateToCharacter('next');
          }
          break;
        case 'k':
          if (enableCharacterNav && pathname.startsWith('/character/')) {
            e.preventDefault();
            navigateToCharacter('prev');
          }
          break;

        // Quick navigation
        case 'h':
          if (enableNavigation) {
            e.preventDefault();
            router.push('/');
          }
          break;
        case 'c':
          if (enableNavigation) {
            e.preventDefault();
            router.push('/chapters');
          }
          break;
        case 'q':
          if (enableNavigation) {
            e.preventDefault();
            router.push('/quotes');
          }
          break;
        case 't':
          if (enableNavigation) {
            e.preventDefault();
            router.push('/timeline');
          }
          break;
        case 'f':
          if (enableNavigation) {
            e.preventDefault();
            router.push('/factions');
          }
          break;

        // Random character
        case 'r':
          if (enableNavigation) {
            e.preventDefault();
            const randomIndex = Math.floor(Math.random() * characterIds.length);
            router.push(`/character/${characterIds[randomIndex]}`);
          }
          break;

        // Help - show shortcuts
        case '?':
          if (onHelp) {
            e.preventDefault();
            onHelp();
          }
          break;

        // Go back
        case 'escape':
          e.preventDefault();
          router.back();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableNavigation, enableCharacterNav, pathname, navigateToCharacter, router, characterIds, onHelp]);

  return {
    shortcuts: [
      { key: 'j', description: 'Next character', enabled: enableCharacterNav },
      { key: 'k', description: 'Previous character', enabled: enableCharacterNav },
      { key: 'h', description: 'Home', enabled: enableNavigation },
      { key: 'c', description: 'Chapters', enabled: enableNavigation },
      { key: 'q', description: 'Quotes', enabled: enableNavigation },
      { key: 't', description: 'Timeline', enabled: enableNavigation },
      { key: 'f', description: 'Factions', enabled: enableNavigation },
      { key: 'r', description: 'Random character', enabled: enableNavigation },
      { key: '/', description: 'Focus search', enabled: true },
      { key: 'Esc', description: 'Go back', enabled: true },
      { key: '?', description: 'Show help', enabled: !!onHelp },
    ],
  };
}
