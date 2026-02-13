'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAllCharacters, getFactions, getGlossary, getLogline, getThemes } from '@/lib/hamieverse/characters';
import TriviaCard from '@/components/TriviaCard';
import LoreLinks from '@/components/LoreLinks';
import RelationshipsMap from '@/components/RelationshipsMap';
import RelationshipWeb from '@/components/RelationshipWeb';
import FavoriteButton from '@/components/FavoriteButton';
import CharacterOfTheDay from '@/components/CharacterOfTheDay';
import QuizTeaser from '@/components/QuizTeaser';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';

interface SearchResult {
  type: 'character' | 'faction' | 'glossary';
  id: string;
  name: string;
  subtitle?: string;
}

export default function WikiHome() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard navigation
  useKeyboardNav({
    searchInputRef,
    onEscape: () => {
      setShowSearchResults(false);
      setMobileMenuOpen(false);
    }
  });

  const characters = getAllCharacters();
  const factions = getFactions();
  const glossary = getGlossary();
  const logline = getLogline();
  const themes = getThemes();

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
    ...Object.keys(glossary).map(term => ({
      type: 'glossary' as const,
      id: term,
      name: term,
      subtitle: glossary[term].slice(0, 50) + (glossary[term].length > 50 ? '...' : ''),
    })),
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = allSearchItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.subtitle?.toLowerCase().includes(query)
    ).slice(0, 8);
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery('');
    setShowSearchResults(false);
    if (result.type === 'character') {
      router.push(`/character/${result.id}`);
    } else if (result.type === 'faction') {
      document.getElementById('factions')?.scrollIntoView({ behavior: 'smooth' });
    } else if (result.type === 'glossary') {
      document.getElementById('glossary')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToRandomCharacter = () => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    router.push(`/character/${randomChar.id}`);
  };

  const mainCharacters = characters.filter(c =>
    ['hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien'].includes(c.id)
  );

  const supportingCharacters = characters.filter(c =>
    !['hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien', 'simba_digital_identity', 'homeless_man_under_overpass', 'dog_simba', '479c', 'veynar_mother'].includes(c.id.toLowerCase())
  );

  const factionCount = Object.keys(factions).length;
  const glossaryCount = Object.keys(glossary).length;

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
            <a href="#characters" className="wiki-topbar-link active">Characters</a>
            <Link href="/factions" className="wiki-topbar-link">Factions</Link>
            <Link href="/locations" className="wiki-topbar-link">Locations</Link>
            <Link href="/timeline" className="wiki-topbar-link">Timeline</Link>
            <Link href="/chapters" className="wiki-topbar-link">Chapters</Link>
            <Link href="/quotes" className="wiki-topbar-link">Quotes</Link>
            <Link href="/quiz" className="wiki-topbar-link">Quiz</Link>
            <Link href="/gallery" className="wiki-topbar-link">Gallery</Link>
          </div>

          <div className="wiki-search-box" ref={searchRef}>
            <span className="wiki-search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="wiki-search-input"
              placeholder="Search... (press /)"
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

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
      <div className={`wiki-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="wiki-mobile-menu-content">
          <a href="#characters" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Characters</a>
          <a href="#factions" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Factions</a>
          <Link href="/locations" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Locations</Link>
          <Link href="/timeline" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Timeline</Link>
          <Link href="/chapters" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Chapters</Link>
          <Link href="/quotes" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Quotes</Link>
          <Link href="/quiz" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Quiz</Link>
          <Link href="/gallery" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
          <button className="wiki-mobile-random" onClick={() => { goToRandomCharacter(); setMobileMenuOpen(false); }}>
            Random Character
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="wiki-hero">
        <div className="wiki-hero-bg" />
        <div className="wiki-hero-content">
          <div className="wiki-hero-text">
            <h1>The <span>Hamieverse</span> Wiki</h1>
            <p className="wiki-hero-subtitle">{logline}</p>

            <div className="wiki-hero-stats">
              <div className="wiki-stat">
                <div className="wiki-stat-value">{characters.length}</div>
                <div className="wiki-stat-label">Characters</div>
              </div>
              <div className="wiki-stat">
                <div className="wiki-stat-value">{factionCount}</div>
                <div className="wiki-stat-label">Factions</div>
              </div>
              <div className="wiki-stat">
                <div className="wiki-stat-value">{glossaryCount}</div>
                <div className="wiki-stat-label">Terms</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content */}
      <main className="wiki-main" id="main-content" role="main">
        {/* Character of the Day & Trivia */}
        <section className="wiki-section wiki-intro-section">
          <div className="wiki-intro-grid-4">
            <CharacterOfTheDay />
            <TriviaCard />
            <QuizTeaser />
            <LoreLinks />
          </div>
        </section>

        {/* Main Characters */}
        <section id="characters" className="wiki-section">
          <div className="wiki-section-header">
            <h2 className="wiki-section-title">
              Main Characters
              <span className="wiki-section-count">({mainCharacters.length})</span>
            </h2>
          </div>
          <div className="wiki-character-grid">
            {mainCharacters.map((char) => (
              <Link
                key={char.id}
                href={`/character/${char.id}`}
                className="wiki-character-card"
                style={{ '--char-color': char.color } as React.CSSProperties}
              >
                <div className="wiki-character-favorite">
                  <FavoriteButton characterId={char.id} size="sm" />
                </div>
                <div className="wiki-character-avatar">
                  {char.gifFile ? (
                    <img
                      src={`/images/${char.gifFile}`}
                      alt={char.displayName}
                      className="wiki-character-gif"
                    />
                  ) : (
                    <div className="wiki-character-placeholder">
                      {char.displayName[0]}
                    </div>
                  )}
                </div>
                <div className="wiki-character-info">
                  <h3 className="wiki-character-name">{char.displayName}</h3>
                  <div className="wiki-character-meta">
                    {char.species && <span className="wiki-character-species">{char.species}</span>}
                    <span className="wiki-character-role">
                      {char.roles.slice(0, 2).join(' · ')}
                    </span>
                  </div>
                </div>
                <span className="wiki-character-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Supporting Characters */}
        <section id="supporting" className="wiki-section">
          <div className="wiki-section-header">
            <h2 className="wiki-section-title">
              Supporting Characters
              <span className="wiki-section-count">({supportingCharacters.length})</span>
            </h2>
          </div>
          <div className="wiki-supporting-grid">
            {supportingCharacters.map((char) => (
              <Link
                key={char.id}
                href={`/character/${char.id}`}
                className="wiki-supporting-card"
                style={{ '--char-color': char.color } as React.CSSProperties}
              >
                <div className="wiki-supporting-avatar">
                  {char.gifFile ? (
                    <img
                      src={`/images/${char.gifFile}`}
                      alt={char.displayName}
                      className="wiki-supporting-img"
                    />
                  ) : (
                    <div className="wiki-supporting-placeholder">
                      {char.displayName[0]}
                    </div>
                  )}
                </div>
                <div className="wiki-supporting-info">
                  <span className="wiki-supporting-name">{char.displayName}</span>
                  <span className="wiki-supporting-role">
                    {char.roles[0]?.replace(/_/g, ' ') || char.symbolicRole || char.species || 'Character'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Factions */}
        <section id="factions" className="wiki-section">
          <div className="wiki-section-header">
            <h2 className="wiki-section-title">
              Factions & Organizations
              <span className="wiki-section-count">({factionCount})</span>
            </h2>
          </div>
          <div className="wiki-faction-grid">
            {Object.entries(factions).map(([key, faction]) => (
              <div key={key} className="wiki-faction-card">
                <div className="wiki-faction-header">
                  <h3 className="wiki-faction-name">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                  </h3>
                  <span className="wiki-faction-type">{faction.type}</span>
                </div>
                {faction.notes && <p className="wiki-faction-desc">{faction.notes}</p>}
                {faction.goals && (
                  <div className="wiki-faction-goals">
                    {faction.goals.slice(0, 3).map((goal, i) => (
                      <span key={i} className="wiki-goal-chip">{goal.replace(/_/g, ' ')}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Glossary */}
        <section id="glossary" className="wiki-section">
          <div className="wiki-section-header">
            <h2 className="wiki-section-title">
              Glossary
              <span className="wiki-section-count">({glossaryCount})</span>
            </h2>
          </div>
          <div className="wiki-glossary-grid">
            {Object.entries(glossary).slice(0, 12).map(([term, definition]) => (
              <div key={term} className="wiki-glossary-item">
                <dt className="wiki-glossary-term">{term}</dt>
                <dd className="wiki-glossary-def">{definition}</dd>
              </div>
            ))}
          </div>
        </section>

        {/* Relationships Map */}
        <section id="relationships" className="wiki-section">
          <RelationshipsMap />
        </section>

        {/* Interactive Relationship Web */}
        <section id="relationship-web" className="wiki-section">
          <RelationshipWeb />
        </section>

        {/* Themes */}
        <section id="themes" className="wiki-section">
          <div className="wiki-section-header">
            <h2 className="wiki-section-title">
              Core Themes
              <span className="wiki-section-count">({themes.length})</span>
            </h2>
          </div>
          <div className="wiki-themes-grid">
            {themes.map((theme, i) => (
              <div key={i} className="wiki-theme-card">
                {theme.replace(/_/g, ' ').replace(/vs/g, ' vs ')}
              </div>
            ))}
          </div>
        </section>
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

      {/* Back to Top Button */}
      <button
        className={`wiki-back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <span>↑</span>
      </button>

    </div>
  );
}
