'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getCharacter,
  getCharacterRelationships,
  getAllCharacters,
  getPlotOutline,
  getGlossary,
  getFactions,
} from '@/lib/hamieverse/characters';

interface SearchResult {
  type: 'character' | 'faction' | 'glossary';
  id: string;
  name: string;
  subtitle?: string;
}

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const character = getCharacter(characterId);
  const relationships = getCharacterRelationships(characterId);
  const allCharacters = getAllCharacters();
  const plotOutline = getPlotOutline();
  const glossary = getGlossary();
  const factions = getFactions();

  // Build search index
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
      router.push('/#factions');
    } else if (result.type === 'glossary') {
      router.push('/#glossary');
    }
  };

  const goToRandomCharacter = () => {
    const otherCharacters = allCharacters.filter(c => c.id !== characterId);
    const randomChar = otherCharacters[Math.floor(Math.random() * otherCharacters.length)];
    router.push(`/character/${randomChar.id}`);
  };

  if (!character) {
    return (
      <div className="wiki-container">
        <nav className="wiki-topbar">
          <div className="wiki-topbar-inner">
            <Link href="/" className="wiki-topbar-brand">
              <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-topbar-logo" />
              <span className="wiki-topbar-title">Hamieverse</span>
            </Link>
          </div>
        </nav>
        <div className="wiki-not-found">
          <h1>Character Not Found</h1>
          <p>The character "{characterId}" doesn't exist in the Hamieverse.</p>
          <Link href="/" className="wiki-not-found-btn">← Back to Wiki</Link>
        </div>
      </div>
    );
  }

  const characterAppearances = plotOutline.chapters?.filter((ch: any) =>
    ch.introduces?.some((name: string) =>
      name.toLowerCase().includes(characterId.toLowerCase()) ||
      name.toLowerCase().includes(character.displayName.toLowerCase())
    )
  ) || [];

  const relatedCharacters = relationships.map(r => {
    const otherId = r.a === characterId || r.a.toLowerCase() === characterId.toLowerCase() ? r.b : r.a;
    return allCharacters.find(c => c.id === otherId || c.id.toLowerCase() === otherId.toLowerCase());
  }).filter(Boolean);

  const relatedTerms = Object.entries(glossary).filter(([term]) =>
    term.toLowerCase().includes(characterId.toLowerCase()) ||
    term.toLowerCase().includes(character.displayName.toLowerCase())
  );

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
            <a href="/#characters" className="wiki-topbar-link">Main Characters</a>
            <a href="/#supporting" className="wiki-topbar-link">Supporting</a>
            <a href="/#factions" className="wiki-topbar-link">Factions</a>
            <a href="/#glossary" className="wiki-topbar-link">Glossary</a>
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
          <a href="/#characters" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Main Characters</a>
          <a href="/#supporting" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Supporting</a>
          <a href="/#factions" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Factions</a>
          <a href="/#glossary" className="wiki-mobile-link" onClick={() => setMobileMenuOpen(false)}>Glossary</a>
          <button className="wiki-mobile-random" onClick={() => { goToRandomCharacter(); setMobileMenuOpen(false); }}>
            🎲 Random Character
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="wiki-article">
        {/* Breadcrumb */}
        <header className="wiki-article-header">
          <div className="wiki-breadcrumb">
            <Link href="/">Wiki</Link>
            <span className="wiki-breadcrumb-sep">/</span>
            <Link href="/#characters">Characters</Link>
            <span className="wiki-breadcrumb-sep">/</span>
            <span>{character.displayName}</span>
          </div>
          <h1 className="wiki-article-title">{character.displayName}</h1>
          {character.symbolicRole && (
            <p className="wiki-article-subtitle">{character.symbolicRole}</p>
          )}
        </header>

        {/* Two Column Layout */}
        <div className="wiki-article-layout">
          {/* Main Content */}
          <div className="wiki-article-content">
            {/* Overview */}
            <section className="wiki-article-section">
              <h2>Overview</h2>
              {character.summary ? (
                <p>{character.summary}</p>
              ) : (
                <p>
                  <strong>{character.displayName}</strong>
                  {character.species && ` is a ${character.species}`}
                  {character.roles.length > 0 && ` who serves as ${character.roles[0].replace(/_/g, ' ')}`}
                  {character.origin && ` originally from ${character.origin}`}.
                </p>
              )}
              {!character.summary && character.notes && <p>{character.notes}</p>}
              {!character.summary && character.notableInfo && <p>{character.notableInfo}</p>}
              {character.speciesNote && <p><em>Species note: {character.speciesNote}</em></p>}
            </section>

            {/* Personality & Traits */}
            {character.traits.length > 0 && (
              <section className="wiki-article-section">
                <h2>Personality & Traits</h2>
                <div className="wiki-traits-grid">
                  {character.traits.map((trait, i) => (
                    <span key={i} className="wiki-trait-badge">{trait.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Motivations & Conflicts */}
            {character.coreConflicts && character.coreConflicts.length > 0 && (
              <section className="wiki-article-section">
                <h2>Motivations & Conflicts</h2>
                <div className="wiki-traits-grid">
                  {character.coreConflicts.map((conflict, i) => (
                    <span key={i} className="wiki-conflict-badge">{conflict.replace(/_/g, ' ').replace(/vs/g, ' vs ')}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Story Arc */}
            {character.arc && (
              <section className="wiki-article-section">
                <h2>Story Arc</h2>
                <p>{character.arc}</p>
              </section>
            )}

            {/* Notable Actions */}
            {character.notableActions && character.notableActions.length > 0 && (
              <section className="wiki-article-section">
                <h2>Notable Actions</h2>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                  {character.notableActions.map((action, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{action}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Philosophy & Doctrine */}
            {character.doctrine && character.doctrine.length > 0 && (
              <section className="wiki-article-section">
                <h2>Philosophy</h2>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderLeft: '3px solid var(--brand-primary)',
                  borderRadius: '0 8px 8px 0',
                  padding: '1.5rem'
                }}>
                  {character.doctrine.map((line, i) => (
                    <p key={i} style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>"{line}"</p>
                  ))}
                </div>
              </section>
            )}

            {/* Notable Quote */}
            {character.notableLineSummary && (
              <section className="wiki-article-section">
                <h2>Notable Quote</h2>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderLeft: '3px solid var(--brand-secondary)',
                  borderRadius: '0 8px 8px 0',
                  padding: '1.5rem'
                }}>
                  <p style={{ fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    "{character.notableLineSummary}"
                  </p>
                  <p style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>— {character.displayName}</p>
                </div>
              </section>
            )}

            {/* Relationships */}
            {relationships.length > 0 && (
              <section className="wiki-article-section">
                <h2>Relationships</h2>
                <div className="wiki-relationship-grid">
                  {relationships.map((rel, i) => {
                    const otherId = rel.a === characterId || rel.a.toLowerCase() === characterId.toLowerCase() ? rel.b : rel.a;
                    const otherChar = allCharacters.find(c => c.id === otherId || c.id.toLowerCase() === otherId.toLowerCase());
                    return (
                      <Link
                        key={i}
                        href={`/character/${otherId.toLowerCase()}`}
                        className="wiki-relationship-card"
                      >
                        <div className="wiki-relationship-name">
                          {otherChar?.displayName || otherId}
                        </div>
                        <span className="wiki-relationship-type">{rel.type.replace(/_/g, ' ')}</span>
                      </Link>
                    );
                  })}
                </div>
                {character.dynamics && (
                  <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    {character.dynamics}
                  </p>
                )}
              </section>
            )}

            {/* Appearances */}
            {characterAppearances.length > 0 && (
              <section className="wiki-article-section">
                <h2>Appearances</h2>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-elevated)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chapter</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {characterAppearances.map((ch: any, i: number) => (
                        <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{ch.number}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{ch.title}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Introduced</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Associated Symbols */}
            {character.symbols && character.symbols.length > 0 && (
              <section className="wiki-article-section">
                <h2>Associated Symbols</h2>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                  {character.symbols.map((symbol, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{symbol.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Trivia */}
            {relatedTerms.length > 0 && (
              <section className="wiki-article-section">
                <h2>Trivia</h2>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                  {relatedTerms.map(([term, definition]) => (
                    <li key={term} style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{term}</strong>: {definition}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* See Also */}
            <div className="wiki-see-also">
              <h3>See Also</h3>
              <div className="wiki-see-also-grid">
                {relatedCharacters.slice(0, 6).map((char: any) => (
                  <Link key={char.id} href={`/character/${char.id}`} className="wiki-see-also-link">
                    {char.displayName}
                  </Link>
                ))}
                <Link href="/" className="wiki-see-also-link">
                  ← Main Page
                </Link>
              </div>
            </div>
          </div>

          {/* Infobox Sidebar */}
          <aside className="wiki-infobox" style={{ '--char-color': character.color } as React.CSSProperties}>
            <div className="wiki-infobox-header">{character.displayName}</div>

            {character.gifFile && (
              <div className="wiki-infobox-image">
                <img src={`/images/${character.gifFile}`} alt={character.displayName} />
              </div>
            )}

            {character.roles.length > 0 && (
              <div className="wiki-infobox-badges">
                {character.roles.slice(0, 3).map((role, i) => (
                  <span key={i} className="wiki-infobox-badge">{role.replace(/_/g, ' ')}</span>
                ))}
              </div>
            )}

            <table className="wiki-infobox-table">
              <tbody>
                {character.species && (
                  <tr><th>Species</th><td>{character.species}</td></tr>
                )}
                {character.origin && (
                  <tr><th>Origin</th><td>{character.origin}</td></tr>
                )}
                {character.home && (
                  <tr><th>Residence</th><td>{character.home}</td></tr>
                )}
                {character.location && (
                  <tr><th>Location</th><td>{character.location}</td></tr>
                )}
                {character.status && (
                  <tr>
                    <th>Status</th>
                    <td>
                      <span className={`wiki-status ${character.status.toLowerCase().replace(/\//g, '-')}`}>
                        {character.status}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {character.traits.length > 0 && (
              <div className="wiki-infobox-section">
                <div className="wiki-infobox-section-title">Key Traits</div>
                <div className="wiki-traits-grid">
                  {character.traits.slice(0, 4).map((trait, i) => (
                    <span key={i} className="wiki-trait-badge" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                      {trait.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {character.inventory && character.inventory.length > 0 && (
              <div className="wiki-infobox-section">
                <div className="wiki-infobox-section-title">Inventory</div>
                <ul style={{ listStyle: 'none', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {character.inventory.map((item, i) => (
                    <li key={i} style={{ padding: '4px 0' }}>• {item.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </div>
            )}

            {characterAppearances.length > 0 && (
              <div className="wiki-infobox-section">
                <div className="wiki-infobox-section-title">First Appearance</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--brand-secondary)' }}>
                  Chapter {characterAppearances[0].number}: {characterAppearances[0].title}
                </p>
              </div>
            )}
          </aside>
        </div>
      </article>

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

      {/* Back to Top Button */}
      <button
        className={`wiki-back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <span>↑</span>
      </button>
    </div>
  );
}
