'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllCharacters, getFactions, getGlossary } from '@/lib/hamieverse/characters';

interface SearchResult {
  type: 'character' | 'faction' | 'glossary';
  id: string;
  name: string;
  subtitle?: string;
}

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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaction, setExpandedFaction] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const characters = getAllCharacters();
  const factions = getFactions();
  const glossary = getGlossary();

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

  // Build search index
  const allSearchItems: SearchResult[] = [
    ...characters.map(c => ({
      type: 'character' as const,
      id: c.id,
      name: c.displayName,
      subtitle: c.roles[0]?.replace(/_/g, ' ') || c.species || '',
    })),
    ...Object.keys(factions).map(key => ({
      type: 'faction' as const,
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      subtitle: factions[key].type || 'Faction',
    })),
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = allSearchItems.filter(item =>
      item.name.toLowerCase().includes(query)
    ).slice(0, 8);
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery('');
    setShowSearchResults(false);
    if (result.type === 'character') {
      router.push(`/character/${result.id}`);
    } else if (result.type === 'faction') {
      setExpandedFaction(result.id);
      document.getElementById(result.id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToRandomCharacter = () => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    router.push(`/character/${randomChar.id}`);
  };

  return (
    <div className="wiki-container">
      {/* Top Navigation Bar */}
      <nav className="wiki-topbar">
        <div className="wiki-topbar-inner">
          <Link href="/" className="wiki-topbar-brand">
            <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-topbar-logo" />
            <span className="wiki-topbar-title">Hamieverse</span>
          </Link>

          <div className="wiki-topbar-nav">
            <Link href="/" className="wiki-topbar-link">Home</Link>
            <Link href="/factions" className="wiki-topbar-link active">Factions</Link>
            <Link href="/timeline" className="wiki-topbar-link">Timeline</Link>
            <Link href="/quiz" className="wiki-topbar-link">Quiz</Link>
          </div>

          <div className="wiki-search-box" ref={searchRef}>
            <span className="wiki-search-icon">🔍</span>
            <input
              type="text"
              className="wiki-search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="wiki-search-dropdown">
                {searchResults.map((result, i) => (
                  <button
                    key={`${result.type}-${result.id}-${i}`}
                    className="wiki-search-result"
                    onClick={() => handleSearchSelect(result)}
                  >
                    <span className={`wiki-search-type wiki-search-type-${result.type}`}>
                      {result.type === 'character' ? '👤' : '⚔️'}
                    </span>
                    <div className="wiki-search-result-text">
                      <span className="wiki-search-result-name">{result.name}</span>
                      {result.subtitle && (
                        <span className="wiki-search-result-subtitle">{result.subtitle}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="wiki-random-btn" onClick={goToRandomCharacter}>
            <span>🎲</span>
            <span>Random</span>
          </button>

          <button
            className="wiki-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`wiki-hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`wiki-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="wiki-mobile-menu-content">
          <Link href="/" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/factions" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Factions</Link>
          <Link href="/timeline" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Timeline</Link>
          <Link href="/quiz" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Quiz</Link>
        </div>
      </div>

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
