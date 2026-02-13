'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllCharacters, getFactions, getGlossary } from '@/lib/hamieverse/characters';

interface SearchResult {
  type: 'character' | 'faction' | 'glossary';
  id: string;
  name: string;
  subtitle?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  era: string;
  characters?: string[];
  type: 'origin' | 'discovery' | 'conflict' | 'transformation' | 'mystery';
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 'origins',
    era: 'Before the City',
    title: 'Life in Virella',
    description: 'Hamie lives in the Beyond with his grandmother. Memories of grass, woodsmoke, and roasted crickets.',
    characters: ['hamie', 'grandma'],
    type: 'origin',
  },
  {
    id: 'veynar-prologue',
    era: 'Before the City',
    title: 'The Veynar Legacy',
    description: 'Alistair Veynar punishes emotion as weakness. Silas watches silently. A butterfly symbolizes fleeting freedom.',
    characters: ['silas'],
    type: 'origin',
  },
  {
    id: 'arrival',
    era: 'City Life',
    title: 'Worker #146B',
    description: 'Hamie becomes a numbered factory worker in Aetherion\'s motion-mandated surveillance city.',
    characters: ['hamie'],
    type: 'transformation',
  },
  {
    id: 'overpass',
    era: 'City Life',
    title: 'The Overpass Encounter',
    description: 'A homeless man and his dog Simba live beneath the overpass. Hamie receives a cracked pendant containing secrets.',
    characters: ['hamie'],
    type: 'discovery',
  },
  {
    id: 'usb-discovery',
    era: 'The Awakening',
    title: 'The USB Discovery',
    description: 'The pendant reveals a hidden bridge chip and USB drive—contraband that could shatter Aetherion\'s control.',
    characters: ['hamie'],
    type: 'discovery',
  },
  {
    id: 'section-9',
    era: 'The Awakening',
    title: 'Section 9 Cleanup',
    description: 'IronPaw enforcers escalate. The homeless man disappears. Workers are interrogated about Subject #101B.',
    type: 'conflict',
  },
  {
    id: '257a-intervention',
    era: 'The Awakening',
    title: '#257A Intervenes',
    description: 'Hamie attempts self-dismissal. Senior worker #257A invokes Protocol Four-Seven-Grey to save him.',
    characters: ['hamie'],
    type: 'transformation',
  },
  {
    id: 'undercode-entry',
    era: 'The Undercode',
    title: 'Welcome to Undercode',
    description: 'Hamie accesses the shadow digital ecosystem. Echo raids, viral loops, and echoloops that can tank markets.',
    characters: ['hamie'],
    type: 'discovery',
  },
  {
    id: 'simba-windfall',
    era: 'The Undercode',
    title: '+13,000,000 AC',
    description: 'A single click during the Aethercreed operation. Hamie becomes wealthy. The alias "Simba" is born.',
    characters: ['hamie'],
    type: 'transformation',
  },
  {
    id: 'doppel-protocol',
    era: 'The Undercode',
    title: 'Doppel Protocol',
    description: 'Hamie deploys the forbidden mimic-script. The Red Eye in his ceiling flickers and goes dark.',
    characters: ['hamie'],
    type: 'discovery',
  },
  {
    id: 'respeculators',
    era: 'The Conspiracy',
    title: 'The Respeculators',
    description: 'Sam and Lira run an elite shadow coalition. Rebellion as mask. They see Simba as a dangerous new asset.',
    characters: ['sam', 'lira'],
    type: 'mystery',
  },
  {
    id: 'neon-spire',
    era: 'The Conspiracy',
    title: 'Neon Spire Invitation',
    description: 'A coded message with an ancient emblem arrives. Rendezvous at midnight. The game has just begun.',
    characters: ['hamie'],
    type: 'mystery',
  },
];

export default function TimelinePage() {
  const router = useRouter();
  const allCharacters = getAllCharacters();
  const factions = getFactions();
  const glossary = getGlossary();
  const timelineRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const allSearchItems: SearchResult[] = [
    ...allCharacters.map(c => ({
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
    ...Object.keys(glossary).map(term => ({
      type: 'glossary' as const,
      id: term,
      name: term,
      subtitle: glossary[term].slice(0, 50) + '...',
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
    } else {
      router.push('/');
    }
  };

  const goToRandomCharacter = () => {
    const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];
    router.push(`/character/${randomChar.id}`);
  };

  // Group events by era
  const eras = Array.from(new Set(timelineEvents.map(e => e.era)));

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'origin': return 'var(--brand-secondary)';
      case 'discovery': return 'var(--brand-primary)';
      case 'conflict': return 'var(--brand-danger)';
      case 'transformation': return 'var(--brand-purple)';
      case 'mystery': return 'var(--brand-accent)';
      default: return 'var(--brand-primary)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'origin': return '🌱';
      case 'discovery': return '💡';
      case 'conflict': return '⚔️';
      case 'transformation': return '✨';
      case 'mystery': return '❓';
      default: return '📍';
    }
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
            <Link href="/#characters" className="wiki-topbar-link">Main Characters</Link>
            <Link href="/#supporting" className="wiki-topbar-link">Supporting</Link>
            <Link href="/#factions" className="wiki-topbar-link">Factions</Link>
            <Link href="/timeline" className="wiki-topbar-link active">Timeline</Link>
            <Link href="/quiz" className="wiki-topbar-link">Quiz</Link>
          </div>

          <div className="wiki-search-box" ref={searchRef}>
            <span className="wiki-search-icon">🔍</span>
            <input
              type="text"
              className="wiki-search-input"
              placeholder="Search the wiki..."
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
                      {result.type === 'character' ? '👤' : result.type === 'faction' ? '⚔️' : '📖'}
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
          <Link href="/#characters" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Main Characters</Link>
          <Link href="/#supporting" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Supporting</Link>
          <Link href="/#factions" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Factions</Link>
          <Link href="/timeline" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Timeline</Link>
          <Link href="/quiz" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Quiz</Link>
        </div>
      </div>

      {/* Timeline Header */}
      <header className="timeline-header">
        <div className="timeline-header-content">
          <h1>Story Timeline</h1>
          <p>Major events in the Hamieverse saga</p>
          <div className="timeline-legend">
            <span className="timeline-legend-item" style={{ '--legend-color': 'var(--brand-secondary)' } as React.CSSProperties}>
              <span className="timeline-legend-dot"></span> Origin
            </span>
            <span className="timeline-legend-item" style={{ '--legend-color': 'var(--brand-primary)' } as React.CSSProperties}>
              <span className="timeline-legend-dot"></span> Discovery
            </span>
            <span className="timeline-legend-item" style={{ '--legend-color': 'var(--brand-danger)' } as React.CSSProperties}>
              <span className="timeline-legend-dot"></span> Conflict
            </span>
            <span className="timeline-legend-item" style={{ '--legend-color': 'var(--brand-purple)' } as React.CSSProperties}>
              <span className="timeline-legend-dot"></span> Transformation
            </span>
            <span className="timeline-legend-item" style={{ '--legend-color': 'var(--brand-accent)' } as React.CSSProperties}>
              <span className="timeline-legend-dot"></span> Mystery
            </span>
          </div>
        </div>
      </header>

      {/* Horizontal Timeline */}
      <main className="htimeline-main">
        <div className="htimeline-scroll" ref={timelineRef}>
          <div className="htimeline-track">
            <div className="htimeline-line" />

            {/* Era markers on the line */}
            {eras.map((era, eraIndex) => {
              const eraStartIndex = timelineEvents.findIndex(e => e.era === era);
              return (
                <div
                  key={`era-${era}`}
                  className="htimeline-era-marker"
                  style={{ '--era-offset': `${eraStartIndex * 300 + 140}px` } as React.CSSProperties}
                >
                  <span className="htimeline-era-label">{era}</span>
                </div>
              );
            })}

            {/* All events laid out horizontally */}
            {timelineEvents.map((event, globalIndex) => {
              const isAbove = globalIndex % 2 === 0;

              return (
                <div
                  key={event.id}
                  className={`htimeline-event ${activeEvent === event.id ? 'active' : ''} ${isAbove ? 'htimeline-above' : 'htimeline-below'}`}
                  style={{
                    '--event-color': getTypeColor(event.type),
                    left: `${globalIndex * 300 + 50}px`,
                  } as React.CSSProperties}
                  onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
                >
                  <div className="htimeline-connector" />
                  <div className="htimeline-event-inner">
                    <div className="htimeline-marker">
                      <span>{getTypeIcon(event.type)}</span>
                    </div>
                    <div className="htimeline-content">
                      <h3 className="htimeline-title">{event.title}</h3>
                      <p className="htimeline-desc">{event.description}</p>
                      {event.characters && event.characters.length > 0 && (
                        <div className="htimeline-characters">
                          {event.characters.map(charId => {
                            const char = allCharacters.find(c => c.id === charId);
                            return char ? (
                              <Link
                                key={charId}
                                href={`/character/${charId}`}
                                className="htimeline-char-chip"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {char.displayName}
                              </Link>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* To Be Continued */}
            <div
              className="htimeline-event htimeline-tbc htimeline-above"
              style={{
                '--event-color': 'var(--brand-purple)',
                left: `${timelineEvents.length * 300 + 50}px`,
              } as React.CSSProperties}
            >
              <div className="htimeline-connector" />
              <div className="htimeline-event-inner">
                <div className="htimeline-marker">
                  <span>🔮</span>
                </div>
                <div className="htimeline-content">
                  <h3 className="htimeline-title">To Be Continued...</h3>
                  <p className="htimeline-desc">The story continues in future chapters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="htimeline-scroll-hint">
          <span>← Scroll to explore the timeline →</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">© 2024 Hamieverse Wiki — Part of the Hamie Saga</p>
          <div className="wiki-footer-links">
            <a href="https://x.com/hamieverse" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://discord.gg/XpheMErdk6" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
