'use client';

import { useState, useEffect, useCallback } from 'react';

// Badge definitions
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_visit',
    name: 'First Visit',
    description: 'Welcome to the Hamieverse Wiki!',
    icon: '🌟',
    color: '#F7931A',
    condition: 'Visit the wiki for the first time',
  },
  {
    id: 'lore_scholar',
    name: 'Lore Scholar',
    description: 'A true student of Hamieverse history',
    icon: '📚',
    color: '#9333EA',
    condition: 'Read 5 character pages',
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Your knowledge is impressive!',
    icon: '🧠',
    color: '#00D9A5',
    condition: 'Score 5 correct answers in quiz',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'You have mapped the entire wiki',
    icon: '🗺️',
    color: '#627EEA',
    condition: 'Visit all main sections',
  },
  {
    id: 'faction_aligned',
    name: 'Faction Aligned',
    description: 'You have found your place in the Hamieverse',
    icon: '⚔️',
    color: '#EF4444',
    condition: 'Complete the faction quiz',
  },
  {
    id: 'quote_collector',
    name: 'Quote Collector',
    description: 'Preserving the words of the Hamieverse',
    icon: '💬',
    color: '#F472B6',
    condition: 'Copy 3 quotes',
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Here from the beginning',
    icon: '🚀',
    color: '#F59E0B',
    condition: 'Visit the wiki in 2024/2025',
  },
];

const STORAGE_KEY = 'hamieverse-badges';
const PROGRESS_KEY = 'hamieverse-badge-progress';

// Sections for explorer badge
const MAIN_SECTIONS = ['home', 'characters', 'factions', 'timeline', 'chapters', 'quotes', 'quiz', 'gallery', 'locations'];

interface BadgeProgress {
  characterPagesRead: string[];
  quizCorrectAnswers: number;
  sectionsVisited: string[];
  quotesCollected: number;
  factionQuizCompleted: boolean;
}

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [progress, setProgress] = useState<BadgeProgress>({
    characterPagesRead: [],
    quizCorrectAnswers: 0,
    sectionsVisited: [],
    quotesCollected: 0,
    factionQuizCompleted: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // Load badges and progress from localStorage
  useEffect(() => {
    try {
      const storedBadges = localStorage.getItem(STORAGE_KEY);
      if (storedBadges) {
        setBadges(JSON.parse(storedBadges));
      }

      const storedProgress = localStorage.getItem(PROGRESS_KEY);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
    } catch (e) {
      console.error('Failed to load badges:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever badges change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
      } catch (e) {
        console.error('Failed to save badges:', e);
      }
    }
  }, [badges, isLoaded]);

  // Save progress to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    }
  }, [progress, isLoaded]);

  // Check if a badge is unlocked
  const hasBadge = useCallback((badgeId: string) => {
    return badges.some(b => b.id === badgeId);
  }, [badges]);

  // Award a badge
  const awardBadge = useCallback((badgeId: string) => {
    if (hasBadge(badgeId)) return false;

    const definition = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (!definition) return false;

    const newBadgeObj: Badge = {
      id: definition.id,
      name: definition.name,
      description: definition.description,
      icon: definition.icon,
      color: definition.color,
      unlockedAt: Date.now(),
    };

    setBadges(prev => [...prev, newBadgeObj]);
    setNewBadge(newBadgeObj);

    return true;
  }, [hasBadge]);

  // Clear the new badge notification
  const clearNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  // Track first visit and early adopter
  const trackFirstVisit = useCallback(() => {
    if (!isLoaded) return;

    // First Visit badge
    if (!hasBadge('first_visit')) {
      awardBadge('first_visit');
    }

    // Early Adopter badge (2024 or 2025)
    const currentYear = new Date().getFullYear();
    if ((currentYear === 2024 || currentYear === 2025) && !hasBadge('early_adopter')) {
      awardBadge('early_adopter');
    }
  }, [isLoaded, hasBadge, awardBadge]);

  // Track character page reads
  const trackCharacterRead = useCallback((characterId: string) => {
    if (!isLoaded) return;

    setProgress(prev => {
      if (prev.characterPagesRead.includes(characterId)) {
        return prev;
      }

      const newCharacterPagesRead = [...prev.characterPagesRead, characterId];

      // Check for Lore Scholar badge (5 character pages)
      if (newCharacterPagesRead.length >= 5 && !hasBadge('lore_scholar')) {
        setTimeout(() => awardBadge('lore_scholar'), 500);
      }

      return {
        ...prev,
        characterPagesRead: newCharacterPagesRead,
      };
    });
  }, [isLoaded, hasBadge, awardBadge]);

  // Track quiz correct answers
  const trackQuizCorrect = useCallback(() => {
    if (!isLoaded) return;

    setProgress(prev => {
      const newCount = prev.quizCorrectAnswers + 1;

      // Check for Quiz Master badge (5 correct answers)
      if (newCount >= 5 && !hasBadge('quiz_master')) {
        setTimeout(() => awardBadge('quiz_master'), 500);
      }

      return {
        ...prev,
        quizCorrectAnswers: newCount,
      };
    });
  }, [isLoaded, hasBadge, awardBadge]);

  // Track section visits
  const trackSectionVisit = useCallback((sectionId: string) => {
    if (!isLoaded) return;

    setProgress(prev => {
      if (prev.sectionsVisited.includes(sectionId)) {
        return prev;
      }

      const newSectionsVisited = [...prev.sectionsVisited, sectionId];

      // Check for Explorer badge (all main sections)
      const allSectionsVisited = MAIN_SECTIONS.every(s => newSectionsVisited.includes(s));
      if (allSectionsVisited && !hasBadge('explorer')) {
        setTimeout(() => awardBadge('explorer'), 500);
      }

      return {
        ...prev,
        sectionsVisited: newSectionsVisited,
      };
    });
  }, [isLoaded, hasBadge, awardBadge]);

  // Track quote collection
  const trackQuoteCopy = useCallback(() => {
    if (!isLoaded) return;

    setProgress(prev => {
      const newCount = prev.quotesCollected + 1;

      // Check for Quote Collector badge (3 quotes)
      if (newCount >= 3 && !hasBadge('quote_collector')) {
        setTimeout(() => awardBadge('quote_collector'), 500);
      }

      return {
        ...prev,
        quotesCollected: newCount,
      };
    });
  }, [isLoaded, hasBadge, awardBadge]);

  // Track faction quiz completion
  const trackFactionQuizComplete = useCallback(() => {
    if (!isLoaded) return;

    if (!progress.factionQuizCompleted) {
      setProgress(prev => ({
        ...prev,
        factionQuizCompleted: true,
      }));

      if (!hasBadge('faction_aligned')) {
        awardBadge('faction_aligned');
      }
    }
  }, [isLoaded, progress.factionQuizCompleted, hasBadge, awardBadge]);

  // Get all badges with unlock status
  const getAllBadges = useCallback(() => {
    return BADGE_DEFINITIONS.map(def => {
      const earned = badges.find(b => b.id === def.id);
      return {
        ...def,
        unlocked: !!earned,
        unlockedAt: earned?.unlockedAt,
      };
    });
  }, [badges]);

  // Get progress for a specific badge
  const getBadgeProgress = useCallback((badgeId: string) => {
    switch (badgeId) {
      case 'lore_scholar':
        return { current: progress.characterPagesRead.length, required: 5 };
      case 'quiz_master':
        return { current: progress.quizCorrectAnswers, required: 5 };
      case 'explorer':
        return { current: progress.sectionsVisited.length, required: MAIN_SECTIONS.length };
      case 'quote_collector':
        return { current: progress.quotesCollected, required: 3 };
      default:
        return null;
    }
  }, [progress]);

  return {
    badges,
    progress,
    isLoaded,
    newBadge,
    hasBadge,
    awardBadge,
    clearNewBadge,
    trackFirstVisit,
    trackCharacterRead,
    trackQuizCorrect,
    trackSectionVisit,
    trackQuoteCopy,
    trackFactionQuizComplete,
    getAllBadges,
    getBadgeProgress,
  };
}
