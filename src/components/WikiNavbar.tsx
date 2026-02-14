'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAllCharacters, getFactions, getGlossary } from '@/lib/hamieverse/characters';

interface SearchResult {
  type: 'character' | 'faction' | 'glossary';
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
}

interface WikiNavbarProps {
  currentPage?: string;
}

export default function WikiNavbar({ currentPage }: WikiNavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Load character data once using useMemo (data from centralized characters.ts)
  const characters = useMemo(() => getAllCharacters(), []);
  const factions = useMemo(() => getFactions(), []);
  const glossary = useMemo(() => getGlossary(), []);

  // Build search index with images (using gifFile from character data)
  const allSearchItems: SearchResult[] = useMemo(() => [
    ...characters.map(c => ({
      type: 'character' as const,
      id: c.id,
      name: c.displayName,
      subtitle: c.roles[0]?.replace(/_/g, ' ') || c.species || '',
      image: c.gifFile ? `/images/${c.gifFile}` : undefined,
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
  ], [characters, factions, glossary]);

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

  // Reset selected index when results change
  useEffect(() => {
    setSelectedResultIndex(-1);
  }, [searchResults]);

  // Keyboard navigation for search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0 && searchResults[selectedResultIndex]) {
          handleSearchSelect(searchResults[selectedResultIndex]);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
        break;
    }
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSearchResults(false);
        setMobileMenuOpen(false);
        setSelectedResultIndex(-1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery('');
    setShowSearchResults(false);
    if (result.type === 'character') {
      router.push(`/character/${result.id}`);
    } else if (result.type === 'faction') {
      router.push('/factions');
    } else if (result.type === 'glossary') {
      router.push('/#glossary');
    }
  };

  const goToRandomCharacter = () => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    router.push(`/character/${randomChar.id}`);
  };

  const navLinks = [
    { href: '/', label: 'Home', id: 'home' },
    { href: '/factions', label: 'Factions', id: 'factions' },
    { href: '/timeline', label: 'Timeline', id: 'timeline' },
    { href: '/chapters', label: 'Chapters', id: 'chapters' },
  ];

  return (
    <>
      <nav className="wiki-topbar">
        <div className="wiki-topbar-inner">
          <Link href="/" className="wiki-topbar-brand">
            <Image src="/images/hamiepfp.png" alt="Hamie" width={32} height={32} className="wiki-topbar-logo" />
            <span className="wiki-topbar-title">Hamieverse</span>
          </Link>

          <div className="wiki-topbar-nav">
            {navLinks.map(link => (
              <Link
                key={link.id}
                href={link.href}
                className={`wiki-topbar-link ${currentPage === link.id ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="wiki-search-box" ref={searchRef} role="combobox" aria-expanded={showSearchResults} aria-haspopup="listbox">
            <span className="wiki-search-icon" aria-hidden="true">&#x1F50D;</span>
            <input
              ref={searchInputRef}
              type="text"
              className="wiki-search-input"
              placeholder="Search... (press /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search the wiki"
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-activedescendant={selectedResultIndex >= 0 ? `search-result-${selectedResultIndex}` : undefined}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div className="wiki-search-dropdown" id="search-results" role="listbox" aria-label="Search results">
                {searchResults.map((result, i) => (
                  <button
                    key={`${result.type}-${result.id}-${i}`}
                    id={`search-result-${i}`}
                    ref={el => { resultRefs.current[i] = el; }}
                    className={`wiki-search-result ${selectedResultIndex === i ? 'selected' : ''}`}
                    onClick={() => handleSearchSelect(result)}
                    role="option"
                    aria-selected={selectedResultIndex === i}
                  >
                    {result.type === 'character' && result.image ? (
                      <Image
                        src={result.image}
                        alt=""
                        width={32}
                        height={32}
                        className="wiki-search-result-img"
                        aria-hidden="true"
                        unoptimized={result.image.endsWith('.gif')}
                      />
                    ) : (
                      <span className={`wiki-search-type wiki-search-type-${result.type}`} aria-hidden="true">
                        {result.type === 'character' ? '\uD83D\uDC64' : result.type === 'faction' ? '\u2694\uFE0F' : '\uD83D\uDCD6'}
                      </span>
                    )}
                    <div className="wiki-search-result-text">
                      <span className="wiki-search-result-name">{result.name}</span>
                      {result.subtitle && (
                        <span className="wiki-search-result-subtitle">{result.subtitle}</span>
                      )}
                    </div>
                    <span className="wiki-search-result-type-badge">{result.type}</span>
                  </button>
                ))}
                <div className="wiki-search-hint" aria-live="polite">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} - Use arrow keys to navigate
                </div>
              </div>
            )}
            {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="wiki-search-dropdown wiki-search-no-results" role="status">
                <p>No results found for "{searchQuery}"</p>
                <p className="wiki-search-no-results-hint">Try different keywords or browse the wiki</p>
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
          {navLinks.map(link => (
            <Link
              key={link.id}
              href={link.href}
              className="wiki-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button className="wiki-mobile-random" onClick={() => { goToRandomCharacter(); setMobileMenuOpen(false); }}>
            🎲 Random Character
          </button>
        </div>
      </div>
    </>
  );
}
