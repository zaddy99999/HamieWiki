'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCharacters } from '@/lib/hamieverse/characters';

export default function CharacterOfTheDay() {
  const [character, setCharacter] = useState<ReturnType<typeof getAllCharacters>[0] | null>(null);
  const allCharacters = getAllCharacters();
  // Only use characters that have a GIF/image
  const characters = allCharacters.filter(c => c.gifFile);

  useEffect(() => {
    if (characters.length === 0) return;
    // Use the date to consistently pick the same character all day
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % characters.length;
    setCharacter(characters[index]);
  }, []);

  if (!character) return null;

  return (
    <div className="cotd-container">
      <div className="cotd-header">
        <span className="cotd-badge">Character of the Day</span>
        <span className="cotd-date">{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        })}</span>
      </div>

      <Link href={`/character/${character.id}`} className="cotd-card">
        <div className="cotd-glow" style={{ '--char-color': character.color } as React.CSSProperties} />

        <div className="cotd-avatar">
          {character.gifFile ? (
            <img
              src={`/images/${character.gifFile}`}
              alt={character.displayName}
              className="cotd-img"
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

        <span className="cotd-cta">View Profile →</span>
      </Link>
    </div>
  );
}
