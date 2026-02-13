'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  getCharacter,
  getCharacterRelationships,
  getAllCharacters,
  getPlotOutline,
  getGlossary,
} from '@/lib/hamieverse/characters';

export default function CharacterPage() {
  const params = useParams();
  const characterId = params.id as string;
  const character = getCharacter(characterId);
  const relationships = getCharacterRelationships(characterId);
  const allCharacters = getAllCharacters();
  const plotOutline = getPlotOutline();
  const glossary = getGlossary();

  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.wiki-article-section');
      let current = 'overview';
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!character) {
    return (
      <div className="wiki-container">
        <div className="wiki-not-found">
          <h1>Character Not Found</h1>
          <p>The character "{characterId}" was not found.</p>
          <Link href="/" className="wiki-back-link">Back to Wiki</Link>
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

  const tocItems = [
    { id: 'overview', label: 'Overview' },
    character.traits.length > 0 && { id: 'personality', label: 'Personality & Traits' },
    (character.coreConflicts?.length || 0) > 0 && { id: 'motivations', label: 'Motivations' },
    character.arc && { id: 'story-arc', label: 'Story Arc' },
    (character.notableActions?.length || 0) > 0 && { id: 'notable-actions', label: 'Notable Actions' },
    (character.doctrine?.length || 0) > 0 && { id: 'doctrine', label: 'Philosophy' },
    relationships.length > 0 && { id: 'relationships', label: 'Relationships' },
    characterAppearances.length > 0 && { id: 'appearances', label: 'Appearances' },
    relatedTerms.length > 0 && { id: 'trivia', label: 'Trivia' },
  ].filter(Boolean) as { id: string; label: string }[];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="wiki-container">
      <header className="wiki-header-bar">
        <div className="wiki-header-tabs">
          <Link href="/" className="wiki-tab active">article</Link>
          <span className="wiki-tab disabled">discussion</span>
          <span className="wiki-tab disabled">edit</span>
          <span className="wiki-tab disabled">history</span>
        </div>
        <div className="wiki-header-nav">
          <Link href="/">Main Page</Link>
          <span>|</span>
          <Link href="/#characters">Characters</Link>
          <span>|</span>
          <Link href="/#factions">Factions</Link>
          <span>|</span>
          <Link href="/#glossary">Glossary</Link>
        </div>
      </header>

      <div className="wiki-article-layout">
        <aside className="wiki-toc">
          <div className="wiki-toc-header">Contents</div>
          <nav className="wiki-toc-nav">
            {tocItems.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`wiki-toc-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
              >
                <span className="wiki-toc-num">{index + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="wiki-article-main">
          <h1 className="wiki-article-title">{character.displayName}</h1>

          <div className="wiki-article-body">
            <aside className="wiki-infobox-float" style={{ '--char-color': character.color } as React.CSSProperties}>
              <div className="wiki-infobox-title">{character.displayName}</div>

              {character.gifFile && (
                <div className="wiki-infobox-image">
                  <img src={`/images/${character.gifFile}`} alt={character.displayName} />
                  <span className="wiki-infobox-caption">Character artwork</span>
                </div>
              )}

              {character.roles.length > 0 && (
                <div className="wiki-infobox-badges">
                  {character.roles.slice(0, 3).map((role, i) => (
                    <span key={i} className="wiki-badge">{role.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              )}

              <table className="wiki-infobox-stats">
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
                        <span className={`wiki-status-badge ${character.status.toLowerCase().replace(/\//g, '-')}`}>
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
                  <div className="wiki-trait-badges">
                    {character.traits.slice(0, 4).map((trait, i) => (
                      <span key={i} className="wiki-trait-badge">{trait.replace(/_/g, ' ')}</span>
                    ))}
                  </div>
                </div>
              )}

              {character.inventory && character.inventory.length > 0 && (
                <div className="wiki-infobox-section">
                  <div className="wiki-infobox-section-title">Inventory</div>
                  <ul className="wiki-infobox-list">
                    {character.inventory.map((item, i) => (
                      <li key={i}>{item.replace(/_/g, ' ')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {characterAppearances.length > 0 && (
                <div className="wiki-infobox-section">
                  <div className="wiki-infobox-section-title">First Appearance</div>
                  <div className="wiki-first-appearance">
                    Chapter {characterAppearances[0].number}: {characterAppearances[0].title}
                  </div>
                </div>
              )}
            </aside>

            <section id="overview" className="wiki-article-section">
              <h2>Overview</h2>
              <p>
                <strong>{character.displayName}</strong>
                {character.species && ` is a ${character.species}`}
                {character.roles.length > 0 && ` who serves as ${character.roles[0].replace(/_/g, ' ')}`}
                {character.origin && ` originally from ${character.origin}`}.
                {character.symbolicRole && ` ${character.symbolicRole}.`}
              </p>
              {character.notes && <p>{character.notes}</p>}
              {character.notableInfo && <p>{character.notableInfo}</p>}
              {character.speciesNote && <p><em>Species note: {character.speciesNote}</em></p>}
            </section>

            {character.traits.length > 0 && (
              <section id="personality" className="wiki-article-section">
                <h2>Personality & Traits</h2>
                <p>{character.displayName} is characterized by the following traits:</p>
                <ul className="wiki-bullet-list">
                  {character.traits.map((trait, i) => (
                    <li key={i}><strong>{trait.replace(/_/g, ' ')}</strong></li>
                  ))}
                </ul>
              </section>
            )}

            {character.coreConflicts && character.coreConflicts.length > 0 && (
              <section id="motivations" className="wiki-article-section">
                <h2>Motivations & Conflicts</h2>
                <p>{character.displayName} is driven by internal conflicts and external pressures:</p>
                <ul className="wiki-bullet-list">
                  {character.coreConflicts.map((conflict, i) => (
                    <li key={i}>{conflict.replace(/_/g, ' ').replace(/vs/g, ' versus ')}</li>
                  ))}
                </ul>
              </section>
            )}

            {character.arc && (
              <section id="story-arc" className="wiki-article-section">
                <h2>Story Arc</h2>
                <div className="wiki-story-arc">
                  <p>{character.arc}</p>
                </div>
              </section>
            )}

            {character.notableActions && character.notableActions.length > 0 && (
              <section id="notable-actions" className="wiki-article-section">
                <h2>Notable Actions</h2>
                <ul className="wiki-bullet-list">
                  {character.notableActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </section>
            )}

            {character.doctrine && character.doctrine.length > 0 && (
              <section id="doctrine" className="wiki-article-section">
                <h2>Philosophy & Doctrine</h2>
                <blockquote className="wiki-blockquote">
                  {character.doctrine.map((line, i) => (
                    <p key={i}>"{line}"</p>
                  ))}
                </blockquote>
                {character.interest && <p className="wiki-note">{character.interest}</p>}
                {character.privateContext && <p className="wiki-note"><em>{character.privateContext}</em></p>}
              </section>
            )}

            {character.notableLineSummary && (
              <section className="wiki-article-section">
                <h2>Notable Quote</h2>
                <blockquote className="wiki-blockquote wiki-quote-highlight">
                  <p>"{character.notableLineSummary}"</p>
                  <cite>— {character.displayName}</cite>
                </blockquote>
              </section>
            )}

            {relationships.length > 0 && (
              <section id="relationships" className="wiki-article-section">
                <h2>Relationships</h2>
                <div className="wiki-relationship-grid">
                  {relationships.map((rel, i) => {
                    const otherId = rel.a === characterId || rel.a.toLowerCase() === characterId.toLowerCase() ? rel.b : rel.a;
                    const otherChar = allCharacters.find(c => c.id === otherId || c.id.toLowerCase() === otherId.toLowerCase());
                    return (
                      <div key={i} className="wiki-relationship-entry">
                        <Link href={`/character/${otherId.toLowerCase()}`} className="wiki-rel-char">
                          {otherChar?.displayName || otherId}
                        </Link>
                        <div className="wiki-rel-details">
                          <span className="wiki-rel-type-badge">{rel.type.replace(/_/g, ' ')}</span>
                          <span className="wiki-rel-valence-text">{rel.valence.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {character.dynamics && <p className="wiki-dynamics-text">{character.dynamics}</p>}
                {character.relationship && <p className="wiki-relationship-note">{character.relationship}</p>}
              </section>
            )}

            {characterAppearances.length > 0 && (
              <section id="appearances" className="wiki-article-section">
                <h2>Appearances</h2>
                <table className="wiki-appearances-table">
                  <thead>
                    <tr><th>Chapter</th><th>Title</th><th>Role</th></tr>
                  </thead>
                  <tbody>
                    {characterAppearances.map((ch: any, i: number) => (
                      <tr key={i}>
                        <td>{ch.number}</td>
                        <td>{ch.title}</td>
                        <td>Introduced</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {character.symbols && character.symbols.length > 0 && (
              <section className="wiki-article-section">
                <h2>Associated Symbols</h2>
                <ul className="wiki-bullet-list">
                  {character.symbols.map((symbol, i) => (
                    <li key={i}>{symbol.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </section>
            )}

            {relatedTerms.length > 0 && (
              <section id="trivia" className="wiki-article-section">
                <h2>Trivia</h2>
                <ul className="wiki-bullet-list">
                  {relatedTerms.map(([term, definition]) => (
                    <li key={term}><strong>{term}</strong>: {definition}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="wiki-article-section wiki-see-also-section">
              <h2>See Also</h2>
              <div className="wiki-see-also-grid">
                {relatedCharacters.slice(0, 6).map((char: any) => (
                  <Link key={char.id} href={`/character/${char.id}`} className="wiki-see-also-item">
                    {char.displayName}
                  </Link>
                ))}
                <Link href="/" className="wiki-see-also-item wiki-see-also-main">
                  Main Page
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
