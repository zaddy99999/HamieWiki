'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCharacters } from '@/lib/hamieverse/characters';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export default function CharacterOfTheDay() {
  const [character, setCharacter] = useState<ReturnType<typeof getAllCharacters>[0] | null>(null);
  const [dateString, setDateString] = useState<string>('');
  const [dayOffset, setDayOffset] = useState(0);
  const { items, isLoaded } = useRecentlyViewed();
  const allCharacters = getAllCharacters();
  // Only use characters that have a GIF/PNG image
  const characters = allCharacters.filter(c => c.gifFile || c.pngFile);

  const getCharacterForDay = (offset: number) => {
    if (characters.length === 0) return null;
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offset);

    const dayOfYear = Math.floor(
      (targetDate.getTime() - new Date(targetDate.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = ((dayOfYear % characters.length) + characters.length) % characters.length;
    return {
      character: characters[index],
      dateStr: targetDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    };
  };

  useEffect(() => {
    const result = getCharacterForDay(dayOffset);
    if (result) {
      setCharacter(result.character);
      setDateString(result.dateStr);
    }
  }, [dayOffset]);

  const goToPrevious = () => {
    setDayOffset(prev => prev - 1);
  };

  const goToNext = () => {
    if (dayOffset < 0) {
      setDayOffset(prev => prev + 1);
    }
  };

  if (!character) return null;

  const recentItems = items.slice(0, 5);
  const isToday = dayOffset === 0;

  return (
    <div className="cotd-container">
      <div className="cotd-header">
        <button
          className="cotd-nav-btn"
          onClick={goToPrevious}
          title="Previous day"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ChevronLeftIcon size={20} />
        </button>
        <div className="cotd-header-center">
          <span className="cotd-badge">
            {isToday ? 'Character of the Day' : 'Past Character'}
          </span>
          <span className="cotd-date">{dateString}</span>
        </div>
        <button
          className="cotd-nav-btn"
          onClick={goToNext}
          disabled={isToday}
          title={isToday ? "You're on today" : "Next day"}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>

      <Link href={`/character/${character.id}`} className="cotd-card">
        <div className="cotd-glow" style={{ '--char-color': character.color } as React.CSSProperties} />

        <div className="cotd-avatar">
          {(character.gifFile || character.pngFile) ? (
            <Image
              src={character.gifFile ? `/images/${character.gifFile}` : `/images/${character.pngFile}`}
              alt={character.displayName}
              fill
              className="cotd-img"
              unoptimized={character.gifFile?.endsWith('.gif') || false}
            />
          ) : (
            <div className="cotd-placeholder" style={{ background: character.color }}>
              {character.displayName[0]}
            </div>
          )}
        </div>

        <div className="cotd-info">
          <h3 className="cotd-name">{character.displayName}</h3>
          <p className="cotd-role">
            {character.roles.slice(0, 2).map(r => r.replace(/_/g, ' ')).join(' · ')}
          </p>
          {character.species && (
            <span className="cotd-species">{character.species}</span>
          )}
        </div>

        <span className="cotd-cta">View Profile <ArrowRightIcon size={14} /></span>
      </Link>

      {/* Recently Viewed */}
      {isLoaded && recentItems.length > 0 && (
        <div className="cotd-recent">
          <span className="cotd-recent-label">Recent:</span>
          <div className="cotd-recent-items">
            {recentItems.map((item, i) => (
              <Link
                key={`${item.type}-${item.id}-${i}`}
                href={item.path}
                className="cotd-recent-item"
                title={item.name}
                style={{ minWidth: '60px', minHeight: '60px', padding: '8px' }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="cotd-recent-avatar"
                    unoptimized={item.image.endsWith('.gif')}
                  />
                ) : (
                  <span className="cotd-recent-placeholder">{item.name.charAt(0)}</span>
                )}
                <span className="cotd-recent-name">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
