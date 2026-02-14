'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllCharacters } from '@/lib/hamieverse/characters';
import FavoriteButton from '@/components/FavoriteButton';

export default function ComparePage() {
  const characters = getAllCharacters();
  const [charA, setCharA] = useState<string>('');
  const [charB, setCharB] = useState<string>('');

  const characterA = characters.find(c => c.id.toLowerCase() === charA.toLowerCase());
  const characterB = characters.find(c => c.id.toLowerCase() === charB.toLowerCase());

  const renderCharacterColumn = (char: typeof characterA, side: 'left' | 'right') => {
    if (!char) {
      return (
        <div className="compare-placeholder">
          <div className="compare-placeholder-icon">?</div>
          <p>Select a character</p>
        </div>
      );
    }

    return (
      <div className="compare-character" style={{ '--char-color': char.color } as React.CSSProperties}>
        <div className="compare-header">
          <div className="compare-avatar">
            {char.gifFile ? (
              <img src={`/images/${char.gifFile}`} alt={char.displayName} />
            ) : (
              <div className="compare-avatar-placeholder">{char.displayName[0]}</div>
            )}
          </div>
          <h2 className="compare-name">{char.displayName}</h2>
          <FavoriteButton characterId={char.id} size="sm" />
        </div>

        <div className="compare-stats">
          {char.species && (
            <div className="compare-stat">
              <span className="compare-stat-label">Species</span>
              <span className="compare-stat-value">{char.species}</span>
            </div>
          )}
          {char.roles && char.roles.length > 0 && (
            <div className="compare-stat">
              <span className="compare-stat-label">Roles</span>
              <span className="compare-stat-value">{char.roles.slice(0, 2).join(', ')}</span>
            </div>
          )}
          {char.origin && (
            <div className="compare-stat">
              <span className="compare-stat-label">Origin</span>
              <span className="compare-stat-value">{char.origin}</span>
            </div>
          )}
          {char.home && (
            <div className="compare-stat">
              <span className="compare-stat-label">Home</span>
              <span className="compare-stat-value">{char.home}</span>
            </div>
          )}
          {char.symbolicRole && (
            <div className="compare-stat">
              <span className="compare-stat-label">Symbolic Role</span>
              <span className="compare-stat-value">{char.symbolicRole}</span>
            </div>
          )}
        </div>

        {char.traits && char.traits.length > 0 && (
          <div className="compare-section">
            <h3>Traits</h3>
            <div className="compare-chips">
              {char.traits.slice(0, 5).map((trait, i) => (
                <span key={i} className="compare-chip">{trait}</span>
              ))}
            </div>
          </div>
        )}

        {char.coreConflicts && char.coreConflicts.length > 0 && (
          <div className="compare-section">
            <h3>Core Conflicts</h3>
            <ul className="compare-list">
              {char.coreConflicts.slice(0, 3).map((conflict, i) => (
                <li key={i}>{conflict}</li>
              ))}
            </ul>
          </div>
        )}

        <Link href={`/character/${char.id}`} className="compare-link">
          View Full Profile →
        </Link>
      </div>
    );
  };

  return (
    <div className="wiki-container">
      <nav className="wiki-topbar">
        <div className="wiki-topbar-inner">
          <Link href="/" className="wiki-topbar-brand">
            <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-topbar-logo" />
            <span className="wiki-topbar-title">Hamieverse</span>
          </Link>
          <div className="wiki-topbar-nav">
            <Link href="/" className="wiki-topbar-link">Home</Link>
            <Link href="/timeline" className="wiki-topbar-link">Timeline</Link>
            <Link href="/compare" className="wiki-topbar-link active">Compare</Link>
          </div>
        </div>
      </nav>

      <main className="compare-main">
        <header className="compare-page-header">
          <h1>Compare Characters</h1>
          <p>Select two characters to compare side-by-side</p>
        </header>

        <div className="compare-selectors">
          <select
            value={charA}
            onChange={(e) => setCharA(e.target.value)}
            className="compare-select"
          >
            <option value="">Select character...</option>
            {characters.map(c => (
              <option key={c.id} value={c.id} disabled={c.id === charB}>
                {c.displayName}
              </option>
            ))}
          </select>

          <span className="compare-vs">VS</span>

          <select
            value={charB}
            onChange={(e) => setCharB(e.target.value)}
            className="compare-select"
          >
            <option value="">Select character...</option>
            {characters.map(c => (
              <option key={c.id} value={c.id} disabled={c.id === charA}>
                {c.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className="compare-grid">
          {renderCharacterColumn(characterA, 'left')}
          <div className="compare-divider"></div>
          {renderCharacterColumn(characterB, 'right')}
        </div>
      </main>

      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">© 2024 Hamieverse Wiki</p>
        </div>
      </footer>
    </div>
  );
}
