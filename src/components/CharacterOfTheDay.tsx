'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCharacters } from '@/lib/hamieverse/characters';
import { ArrowRightIcon } from './Icons';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export default function CharacterOfTheDay() {
  const [character, setCharacter] = useState<ReturnType<typeof getAllCharacters>[0] | null>(null);
  const [dateString, setDateString] = useState<string>('');
  const { items, isLoaded } = useRecentlyViewed();
  const allCharacters = getAllCharacters();
  // Only use characters that have a GIF/PNG image
  const characters = allCharacters.filter(c => c.gifFile || c.pngFile);

  useEffect(() => {
    if (characters.length === 0) return;
    // Use the date to consistently pick the same character all day
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % characters.length;
    setCharacter(characters[index]);
    setDateString(today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }));
  }, []);

  if (!character) return null;

  const recentItems = items.slice(0, 5);

  return (
    <div className="cotd-container">
      <div className="cotd-header">
        <span className="cotd-badge">Character of the Day</span>
        <span className="cotd-date">{dateString}</span>
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
