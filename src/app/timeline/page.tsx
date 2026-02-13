'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPlotOutline, getAllCharacters, getFactions, getGlossary } from '@/lib/hamieverse/characters';

interface SearchResult {
  type: 'character' | 'faction' | 'glossary';
  id: string;
  name: string;
  subtitle?: string;
}

export default function TimelinePage() {
  const router = useRouter();
  const plotOutline = getPlotOutline();
  const allCharacters = getAllCharacters();
  const factions = getFactions();
  const glossary = getGlossary();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
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

  const chapters = plotOutline.chapters || [];
  const prologue = plotOutline.prologue;

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
          <p>Follow Hamie's journey from factory worker to Undercode player</p>
        </div>
      </header>

      {/* Timeline Content */}
      <main className="timeline-main">
        <div className="timeline-line" />

        {/* Prologue */}
        {prologue && (
          <div className="timeline-item timeline-item-prologue">
            <div className="timeline-marker">
              <span>P</span>
            </div>
            <div className="timeline-card">
              <div className="timeline-card-header">
                <span className="timeline-chapter-label">Prologue</span>
                <h2 className="timeline-chapter-title">{prologue.title}</h2>
              </div>
              <div className="timeline-beats">
                {prologue.beats?.map((beat: string, i: number) => (
                  <p key={i} className="timeline-beat">{beat}</p>
                ))}
              </div>
              {prologue.introduces && prologue.introduces.length > 0 && (
                <div className="timeline-introduces">
                  <span className="timeline-introduces-label">Introduces:</span>
                  <div className="timeline-introduces-list">
                    {prologue.introduces.map((name: string, i: number) => {
                      const char = allCharacters.find(c =>
                        c.displayName.toLowerCase() === name.toLowerCase() ||
                        c.id.toLowerCase() === name.toLowerCase()
                      );
                      return char ? (
                        <Link key={i} href={`/character/${char.id}`} className="timeline-character-chip">
                          {name}
                        </Link>
                      ) : (
                        <span key={i} className="timeline-element-chip">{name}</span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chapters */}
        {chapters.map((chapter: any, index: number) => (
          <div key={chapter.number} className={`timeline-item ${index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'}`}>
            <div className="timeline-marker">
              <span>{chapter.number}</span>
            </div>
            <div className="timeline-card">
              <div className="timeline-card-header">
                <span className="timeline-chapter-label">Chapter {chapter.number}</span>
                <h2 className="timeline-chapter-title">{chapter.title}</h2>
              </div>
              <div className="timeline-beats">
                {chapter.beats?.map((beat: string, i: number) => (
                  <p key={i} className="timeline-beat">{beat}</p>
                ))}
              </div>
              {chapter.introduces && chapter.introduces.length > 0 && (
                <div className="timeline-introduces">
                  <span className="timeline-introduces-label">Introduces:</span>
                  <div className="timeline-introduces-list">
                    {chapter.introduces.map((name: string, i: number) => {
                      const char = allCharacters.find(c =>
                        c.displayName.toLowerCase().includes(name.toLowerCase()) ||
                        name.toLowerCase().includes(c.displayName.toLowerCase())
                      );
                      return char ? (
                        <Link key={i} href={`/character/${char.id}`} className="timeline-character-chip">
                          {name}
                        </Link>
                      ) : (
                        <span key={i} className="timeline-element-chip">{name}</span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* To Be Continued */}
        <div className="timeline-item timeline-item-end">
          <div className="timeline-marker timeline-marker-end">
            <span>?</span>
          </div>
          <div className="timeline-card timeline-card-tbc">
            <h2>To Be Continued...</h2>
            <p>The story continues as Hamie faces new challenges in the Undercode.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">© 2024 Hamieverse Wiki — Part of the Hamie Saga</p>
          <div className="wiki-footer-links">
            <a href="https://twitter.com/hamaborz" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" className="wiki-footer-link">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
