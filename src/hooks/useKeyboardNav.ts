'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseKeyboardNavOptions {
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onEscape?: () => void;
}

export function useKeyboardNav({ searchInputRef, onEscape }: UseKeyboardNavOptions = {}) {
  const router = useRouter();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input/textarea
    const target = e.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    // Escape key - close modals, blur inputs
    if (e.key === 'Escape') {
      if (isTyping) {
        (target as HTMLInputElement).blur();
      }
      onEscape?.();
      return;
    }

    // Don't handle shortcuts when typing
    if (isTyping) return;

    // "/" - Focus search
    if (e.key === '/' || e.key === 's') {
      e.preventDefault();
      searchInputRef?.current?.focus();
      return;
    }

    // "g" + key navigation
    if (e.key === 'g') {
      // Wait for next key
      const handleNextKey = (e2: KeyboardEvent) => {
        switch (e2.key) {
          case 'h':
            e2.preventDefault();
            router.push('/');
            break;
          case 't':
            e2.preventDefault();
            router.push('/timeline');
            break;
          case 'q':
            e2.preventDefault();
            router.push('/quiz');
            break;
          case 'c':
            e2.preventDefault();
            router.push('/compare');
            break;
          case 'g':
            e2.preventDefault();
            router.push('/gallery');
            break;
        }
        document.removeEventListener('keydown', handleNextKey);
      };
      document.addEventListener('keydown', handleNextKey, { once: true });
      // Clear listener after 1 second if no second key pressed
      setTimeout(() => {
        document.removeEventListener('keydown', handleNextKey);
      }, 1000);
      return;
    }

    // "?" - Show keyboard shortcuts (could trigger a modal)
    if (e.key === '?') {
      // Could emit an event or set state for shortcuts modal
      console.log('Keyboard shortcuts: / or s = search, g+h = home, g+t = timeline, g+q = quiz, g+c = compare, g+g = gallery');
    }
  }, [router, searchInputRef, onEscape]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
