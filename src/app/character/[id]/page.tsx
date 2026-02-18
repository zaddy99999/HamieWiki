'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getCharacter,
  getCharacterRelationships,
  getAllCharacters,
  getPlotOutline,
  getGlossary,
} from '@/lib/hamieverse/characters';
import CharacterRating from '@/components/CharacterRating';
import Breadcrumb from '@/components/Breadcrumb';
import FavoriteButton from '@/components/FavoriteButton';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { CheckIcon, CopyIcon, ArrowUpIcon } from '@/components/Icons';

export default function CharacterPage() {
  const params = useParams();
  const characterId = params.id as string;
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { addItem } = useRecentlyViewed();

  const character = getCharacter(characterId);
  const relationships = getCharacterRelationships(characterId);
  const allCharacters = getAllCharacters();
  const plotOutline = getPlotOutline();
  const glossary = getGlossary();

  // Track page view
  useEffect(() => {
    if (character) {
      addItem({
        type: 'character',
        id: characterId,
        name: character.displayName,
        path: `/character/${characterId}`,
        image: character.gifFile ? `/images/${character.gifFile}` : character.pngFile ? `/images/${character.pngFile}` : undefined,
      });
    }
  }, [characterId, character, addItem]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  const copyQuote = (quote: string) => {
    const textToCopy = `"${quote}" - ${character?.displayName}, Hamieverse`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuote(quote);
    setTimeout(() => setCopiedQuote(null), 2000);
  };

  const shareOnTwitter = () => {
    const text = `Check out ${character?.displayName} from the Hamieverse! ${character?.roles[0]?.replace(/_/g, ' ') || ''}`;
    const url = `https://hamiewiki.vercel.app/character/${characterId}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://hamiewiki.vercel.app/character/${characterId}`);
    alert('Link copied to clipboard!');
  };

  if (!character) {
    return (
      <div className="wiki-container">
        <div className="wiki-not-found">
          <h1>Character Not Found</h1>
          <p>The character "{characterId}" doesn't exist in the Hamieverse.</p>
          <Link href="/" className="wiki-not-found-btn">Back to Wiki</Link>
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
    const charIdLower = characterId.toLowerCase();
    const otherId = r.a.toLowerCase() === charIdLower ? r.b : r.a;
    return allCharacters.find(c => c.id.toLowerCase() === otherId.toLowerCase());
  }).filter(Boolean);

  const relatedTerms = Object.entries(glossary).filter(([term]) =>
    term.toLowerCase().includes(characterId.toLowerCase()) ||
    term.toLowerCase().includes(character.displayName.toLowerCase())
  );

  // Find similar characters by faction or roles
  const similarCharacters = allCharacters
    .filter(c => c.id !== characterId)
    .map(c => {
      let score = 0;
      // Same faction = high relevance
      if (character.faction && c.faction && character.faction === c.faction) {
        score += 3;
      }
      // Overlapping roles
      if (character.roles && c.roles) {
        const overlap = character.roles.filter(r => c.roles.includes(r)).length;
        score += overlap;
      }
      // Overlapping traits
      if (character.traits && c.traits) {
        const overlap = character.traits.filter(t => c.traits.includes(t)).length;
        score += overlap * 0.5;
      }
      return { character: c, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.character);

  const breadcrumbItems = [
    { label: 'Wiki', href: '/' },
    { label: 'Characters', href: '/#characters' },
    { label: character.displayName },
  ];

  return (
    <div className="wiki-container">
      {/* Article Content */}
      <article className="wiki-article" id="main-content" role="main">
        {/* Breadcrumb */}
        <header className="wiki-article-header">
          <Breadcrumb items={breadcrumbItems} />
          <div className="wiki-article-title-row">
            <h1 className="wiki-article-title">{character.displayName}</h1>
          </div>
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
              {character.speciesNote && <p style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', background: 'none' }}>Species note: {character.speciesNote}</p>}
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

            {/* Quotes - Retro Chat Bubble */}
            {(character.quotes && character.quotes.length > 0) || character.notableLineSummary ? (
              <section className="wiki-article-section">
                <div className="wiki-section-header-with-link">
                  <h2>Quotes</h2>
                  <Link href="/quotes" className="wiki-section-link">View All Quotes</Link>
                </div>
                <div className="retro-chat-bubble">
                  <div className="retro-bubble-content">
                    {character.quotes?.map((quote, i) => (
                      <p key={i} className="retro-quote-line">"{quote}"</p>
                    ))}
                    {character.notableLineSummary && !character.quotes?.includes(character.notableLineSummary) && (
                      <p className="retro-quote-line">"{character.notableLineSummary}"</p>
                    )}
                  </div>
                  <div className="retro-bubble-footer">
                    <span className="retro-bubble-attr">— {character.displayName}</span>
                  </div>
                  <div className="retro-bubble-tail"></div>
                </div>
              </section>
            ) : null}

            {/* Relationships */}
            {relationships.length > 0 && (
              <section className="wiki-article-section">
                <h2>Relationships</h2>
                <div className="wiki-relationship-grid">
                  {relationships.map((rel, i) => {
                    const charIdLower = characterId.toLowerCase();
                    const otherId = rel.a.toLowerCase() === charIdLower ? rel.b : rel.a;
                    const otherChar = allCharacters.find(c => c.id.toLowerCase() === otherId.toLowerCase());
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

            {/* Related Characters */}
            {relatedCharacters.length > 0 && (
              <section className="wiki-article-section">
                <h2>Related Characters</h2>
                <div className="related-characters-grid">
                  {relatedCharacters.slice(0, 6).map((char: any) => (
                    <Link
                      key={char.id}
                      href={`/character/${char.id}`}
                      className="related-character-card"
                      style={{ '--char-color': char.color || 'var(--brand-primary)' } as React.CSSProperties}
                    >
                      <img
                        src={char.gifFile ? `/images/${char.gifFile}` : char.pngFile ? `/images/${char.pngFile}` : '/images/hamiepfp.png'}
                        alt={char.displayName}
                        className="related-character-avatar"
                      />
                      <div className="related-character-info">
                        <span className="related-character-name">{char.displayName}</span>
                        {char.roles[0] && (
                          <span className="related-character-role">
                            {char.roles[0].replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* See Also */}
            <div className="wiki-see-also">
              <h3>See Also</h3>
              <div className="wiki-see-also-grid">
                <Link href="/compare" className="wiki-see-also-link">
                  Compare Characters
                </Link>
                <Link href="/quotes" className="wiki-see-also-link">
                  Quotes
                </Link>
                <Link href="/" className="wiki-see-also-link">
                  Main Page
                </Link>
              </div>
            </div>
          </div>

          {/* Infobox Sidebar */}
          <aside className="wiki-infobox" style={{ '--char-color': character.color } as React.CSSProperties}>
            <div className="wiki-infobox-header">
              <span className="wiki-infobox-name">{character.displayName}</span>
              <div className="wiki-infobox-actions">
                <FavoriteButton characterId={characterId} size="sm" />
                <button
                  className="wiki-infobox-share-btn"
                  onClick={() => setShowShareModal(true)}
                  title="Share character"
                >
                  📤
                </button>
              </div>
            </div>

            <div className="wiki-infobox-image">
              <img src={character.gifFile ? `/images/${character.gifFile}` : character.pngFile ? `/images/${character.pngFile}` : '/images/hamiepfp.png'} alt={character.displayName} />
            </div>

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

            {/* Character Rating */}
            <CharacterRating characterId={characterId} characterName={character.displayName} />

            {/* Similar Characters */}
            {similarCharacters.length > 0 && (
              <div className="wiki-infobox-section">
                <h3 className="wiki-infobox-heading">Similar Characters</h3>
                <div className="wiki-similar-characters">
                  {similarCharacters.map(c => (
                    <Link key={c.id} href={`/character/${c.id}`} className="wiki-similar-character">
                      {c.gifFile ? (
                        <Image
                          src={`/images/${c.gifFile}`}
                          alt={c.displayName}
                          width={40}
                          height={40}
                          className="wiki-similar-avatar"
                          unoptimized={c.gifFile?.endsWith('.gif')}
                        />
                      ) : (
                        <Image
                          src="/images/hamiepfp.png"
                          alt={c.displayName}
                          width={40}
                          height={40}
                          className="wiki-similar-avatar"
                        />
                      )}
                      <span className="wiki-similar-name">{c.displayName}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">© 2026 Hamieverse Wiki — Part of the Hamie Saga</p>
          <div className="wiki-footer-links">
            <a href="https://x.com/hamieverse" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://discord.gg/XpheMErdk6" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h3>Share Character</h3>
              <button className="share-modal-close" onClick={() => setShowShareModal(false)}>×</button>
            </div>

            <div className="share-card-preview">
              <img src={character.gifFile ? `/images/${character.gifFile}` : character.pngFile ? `/images/${character.pngFile}` : '/images/hamiepfp.png'} alt={character.displayName} />
              <h4>{character.displayName}</h4>
              <p>{character.roles[0]?.replace(/_/g, ' ') || character.symbolicRole || 'Character'}</p>
              {character.traits.length > 0 && (
                <div className="share-traits">
                  {character.traits.slice(0, 3).map((trait, i) => (
                    <span key={i} className="share-trait">{trait.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="share-actions">
              <button className="share-action-btn" onClick={shareOnTwitter}>
                <span>🐦</span>
                <span>Twitter</span>
              </button>
              <button className="share-action-btn" onClick={copyLink}>
                <span>🔗</span>
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
