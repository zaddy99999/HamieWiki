'use client';

import { useState } from 'react';
import Link from 'next/link';
import WikiNavbar from '@/components/WikiNavbar';
import { getAllCharacters, getFactions } from '@/lib/hamieverse/characters';

const factionColors: Record<string, string> = {
  aetherion: '#EF4444',
  ironpaws: '#1F2937',
  section_9: '#DC2626',
  undercode: '#00D9A5',
  respeculators: '#9333EA',
};

const factionIcons: Record<string, string> = {
  aetherion: '🏛️',
  ironpaws: '🛡️',
  section_9: '🔴',
  undercode: '💻',
  respeculators: '🎭',
};

export default function FactionsPage() {
  const [expandedFaction, setExpandedFaction] = useState<string | null>(null);

  const characters = getAllCharacters();
  const factions = getFactions();

  // Group characters by faction
  const charactersByFaction: Record<string, typeof characters> = {};
  characters.forEach(char => {
    if (char.faction) {
      const factionKey = char.faction.toLowerCase().replace(/ /g, '_');
      if (!charactersByFaction[factionKey]) {
        charactersByFaction[factionKey] = [];
      }
      charactersByFaction[factionKey].push(char);
    }
  });

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="factions" />

      {/* Header */}
      <header className="factions-header">
        <div className="factions-header-content">
          <h1>Factions & Organizations</h1>
          <p>The powers that shape the Hamieverse</p>
        </div>
      </header>

      {/* Factions Grid */}
      <main className="factions-main">
        <div className="factions-grid">
          {Object.entries(factions).map(([key, faction]) => {
            const members = charactersByFaction[key] || [];
            const isExpanded = expandedFaction === key;
            const color = factionColors[key] || '#888888';
            const icon = factionIcons[key] || '⚔️';

            return (
              <div
                key={key}
                id={key}
                className={`faction-card ${isExpanded ? 'expanded' : ''}`}
                style={{ '--faction-color': color } as React.CSSProperties}
              >
                <button
                  className="faction-header"
                  onClick={() => setExpandedFaction(isExpanded ? null : key)}
                >
                  <div className="faction-icon">{icon}</div>
                  <div className="faction-title-area">
                    <h2 className="faction-name">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                    </h2>
                    <span className="faction-type">{faction.type?.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="faction-toggle">{isExpanded ? '−' : '+'}</span>
                </button>

                <div className="faction-body">
                  {faction.notes && (
                    <p className="faction-desc">{faction.notes}</p>
                  )}

                  {faction.goals && faction.goals.length > 0 && (
                    <div className="faction-section">
                      <h3>Goals</h3>
                      <ul className="faction-list">
                        {faction.goals.map((goal, i) => (
                          <li key={i}>{goal.replace(/_/g, ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {faction.doctrine && faction.doctrine.length > 0 && (
                    <div className="faction-section">
                      <h3>Doctrine</h3>
                      <div className="faction-quotes">
                        {faction.doctrine.map((line, i) => (
                          <p key={i} className="faction-quote">"{line}"</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {faction.capabilities && faction.capabilities.length > 0 && (
                    <div className="faction-section">
                      <h3>Capabilities</h3>
                      <div className="faction-tags">
                        {faction.capabilities.map((cap, i) => (
                          <span key={i} className="faction-tag">{cap.replace(/_/g, ' ')}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {members.length > 0 && (
                    <div className="faction-section">
                      <h3>Known Members ({members.length})</h3>
                      <div className="faction-members">
                        {members.map(char => (
                          <Link
                            key={char.id}
                            href={`/character/${char.id}`}
                            className="faction-member"
                          >
                            <div className="faction-member-avatar">
                              {char.gifFile ? (
                                <img src={`/images/${char.gifFile}`} alt={char.displayName} />
                              ) : (
                                <span>{char.displayName[0]}</span>
                              )}
                            </div>
                            <div className="faction-member-info">
                              <span className="faction-member-name">{char.displayName}</span>
                              <span className="faction-member-role">
                                {char.roles[0]?.replace(/_/g, ' ') || 'Member'}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">© 2024 Hamieverse Wiki</p>
          <div className="wiki-footer-links">
            <a href="https://x.com/hamieverse" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://discord.gg/XpheMErdk6" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
