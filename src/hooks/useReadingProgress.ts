'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hamieverse-reading-progress';

interface ReadingProgress {
  completedChapters: number[];
  currentChapter: number | null;
  lastReadAt: number | null;
  totalReadTime: number; // in minutes
}

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress>({
    completedChapters: [],
    currentChapter: null,
    lastReadAt: null,
    totalReadTime: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load reading progress:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (e) {
        console.error('Failed to save reading progress:', e);
      }
    }
  }, [progress, isLoaded]);

  // Mark a chapter as completed
  const markChapterComplete = useCallback((chapterNum: number) => {
    setProgress(prev => {
      if (prev.completedChapters.includes(chapterNum)) {
        return prev;
      }
      return {
        ...prev,
        completedChapters: [...prev.completedChapters, chapterNum].sort((a, b) => a - b),
        lastReadAt: Date.now(),
      };
    });
  }, []);

  // Unmark a chapter as completed
  const unmarkChapterComplete = useCallback((chapterNum: number) => {
    setProgress(prev => ({
      ...prev,
      completedChapters: prev.completedChapters.filter(c => c !== chapterNum),
    }));
  }, []);

  // Toggle chapter completion
  const toggleChapterComplete = useCallback((chapterNum: number) => {
    if (progress.completedChapters.includes(chapterNum)) {
      unmarkChapterComplete(chapterNum);
    } else {
      markChapterComplete(chapterNum);
    }
  }, [progress.completedChapters, markChapterComplete, unmarkChapterComplete]);

  // Set current chapter being read
  const setCurrentChapter = useCallback((chapterNum: number | null) => {
    setProgress(prev => ({
      ...prev,
      currentChapter: chapterNum,
      lastReadAt: Date.now(),
    }));
  }, []);

  // Add reading time
  const addReadingTime = useCallback((minutes: number) => {
    setProgress(prev => ({
      ...prev,
      totalReadTime: prev.totalReadTime + minutes,
    }));
  }, []);

  // Check if chapter is completed
  const isChapterComplete = useCallback((chapterNum: number) => {
    return progress.completedChapters.includes(chapterNum);
  }, [progress.completedChapters]);

  // Get progress percentage
  const getProgressPercentage = useCallback((totalChapters: number) => {
    if (totalChapters === 0) return 0;
    return Math.round((progress.completedChapters.length / totalChapters) * 100);
  }, [progress.completedChapters]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    setProgress({
      completedChapters: [],
      currentChapter: null,
      lastReadAt: null,
      totalReadTime: 0,
    });
  }, []);

  return {
    progress,
    isLoaded,
    markChapterComplete,
    unmarkChapterComplete,
    toggleChapterComplete,
    setCurrentChapter,
    addReadingTime,
    isChapterComplete,
    getProgressPercentage,
    resetProgress,
  };
}
