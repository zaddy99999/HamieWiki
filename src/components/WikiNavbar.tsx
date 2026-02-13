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
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Character GIF mappings
  const characterGifs: Record<string, string> = {
    hamie: 'HamieCharacter.gif',
    sam: 'SamCharacter.gif',
    lira: 'LiraCharacter.gif',
    silas: 'SilasCharacter.gif',
    ace: 'AceCharacter.gif',
    hikari: 'HikariCharacter.gif',
    kael: 'KaelCharacter.gif',
    orrien: 'OrrienCharacter.gif',
  };

  const characters = getAllCharacters();
  const factions = getFactions();
  const glossary = getGlossary();

  // Build search index with images
  const allSearchItems: SearchResult[] = [
    ...characters.map(c => ({
      type: 'character' as const,
      id: c.id,
      name: c.displayName,
      subtitle: c.roles[0]?.replace(/_/g, ' ') || c.species || '',
      image: characterGifs[c.id.toLowerCase()] ? `/images/${characterGifs[c.id.toLowerCase()]}` : undefined,
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
    { href: '/locations', label: 'Locations', id: 'locations' },
    { href: '/timeline', label: 'Timeline', id: 'timeline' },
    { href: '/chapters', label: 'Chapters', id: 'chapters' },
    { href: '/quotes', label: 'Quotes', id: 'quotes' },
    { href: '/quiz', label: 'Quiz', id: 'quiz' },
    { href: '/badges', label: 'Badges', id: 'badges' },
    { href: '/gallery', label: 'Gallery', id: 'gallery' },
    { href: '/fanart', label: 'Fan Art', id: 'fanart' },
    { href: '/theories', label: 'Theories', id: 'theories' },
    { href: '/forum', label: 'Forum', id: 'forum' },
  ];

  return (
    <>
      <nav className="wiki-topbar">
        <div className="wiki-topbar-inner">
          <Link href="/" className="wiki-topbar-brand">
            <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-topbar-logo" />
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
                    {result.type === 'character' && result.image ? (
                      <img
                        src={result.image}
                        alt={result.name}
                        className="wiki-search-result-img"
                      />
                    ) : (
                      <span className={`wiki-search-type wiki-search-type-${result.type}`}>
                        {result.type === 'character' ? '👤' : result.type === 'faction' ? '⚔️' : '📖'}
                      </span>
                    )}
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
