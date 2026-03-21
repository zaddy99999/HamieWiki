'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getShownCharacters, getGlossary, getLogline, getThemes } from '@/lib/hamieverse/characters';
import { ArrowUpIcon } from '@/components/Icons';
import LoreLinks from '@/components/LoreLinks';
import RelationshipWeb from '@/components/RelationshipWeb';
import CharacterOfTheDay from '@/components/CharacterOfTheDay';
import MiniQuiz from '@/components/MiniQuiz';

export default function WikiHome() {
  const router = useRouter();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [glossaryExpanded, setGlossaryExpanded] = useState(false);
  const characters = getShownCharacters().filter(c => c.gifFile || c.pngFile);
  const glossary = getGlossary();
  const logline = getLogline();
  const themes = getThemes();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToRandomCharacter = () => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    if (randomChar) router.push(`/character/${randomChar.id}`);
  };

  const glossaryCount = Object.keys(glossary).length;

  const factionOrder = ['Liberators', 'Aetherion', 'Respeculators'];
  const getFactionGroup = (faction: string): string | undefined => {
    const f = faction.toLowerCase();
    if (f.includes('respeculat')) return 'Respeculators';
    if (f.includes('aetherion')) return 'Aetherion';
    if (f.includes('undercode') || f.includes('liberator')) return 'Liberators';
    return undefined;
  };
  const grouped: Record<string, typeof characters> = {};
  factionOrder.forEach(f => { grouped[f] = []; });
  characters.forEach(c => {
    const mapped = getFactionGroup(c.faction || '');
    if (mapped) grouped[mapped].push(c);
  });

  return (
    <div className="wiki-container">
      {/* Comic Book Decorations */}
      <div className="comic-decoration comic-home-1" aria-hidden="true">SAGA</div>
      <div className="comic-decoration comic-home-2" aria-hidden="true">★</div>
      <div className="comic-decoration comic-home-3" aria-hidden="true">ZAP!</div>

      {/* Hero Section */}
      <section className="wiki-hero">
        <div className="wiki-hero-bg" />
        <div className="wiki-hero-content">
          <div className="wiki-hero-text">
            <h1>The Hamieverse Wiki</h1>
            <p className="wiki-hero-subtitle" style={{ color: '#a1a1aa' }}>{logline}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="wiki-main" id="main-content" role="main">
        {/* Character of the Day, Quiz & Lore */}
        <section className="wiki-section wiki-intro-section">
          <div className="wiki-intro-grid-3">
            <CharacterOfTheDay />
            <MiniQuiz />
            <LoreLinks />
          </div>
        </section>

        {/* Characters — grouped by faction */}
        <section id="characters" className="wiki-section">
          <div className="wiki-section-header">
            <h2 className="wiki-section-title">
              Characters
              <span className="wiki-section-count">({characters.length})</span>
            </h2>
          </div>
          <div className="wiki-character-grid-grouped">
            {factionOrder.filter(f => grouped[f].length > 0).flatMap(faction => [
              <div key={`label-${faction}`} className="wiki-faction-inline-label">{faction}</div>,
              ...grouped[faction].map((char) => (
                <Link
                  key={char.id}
                  href={`/character/${char.id}`}
                  className="wiki-character-card"
                  style={{ '--char-color': char.color } as React.CSSProperties}
                >
                  <div className={`wiki-character-avatar${char.pngFile && char.gifFile ? ' has-hover-gif' : ''}`}>
                    {char.pngFile && (
                      <Image
                        src={`/images/${char.pngFile}`}
                        alt={char.displayName}
                        fill
                        className="wiki-character-gif wiki-char-static"
                        unoptimized
                      />
                    )}
                    {char.gifFile && (
                      <Image
                        src={`/images/${char.gifFile}`}
                        alt=""
                        fill
                        className="wiki-character-gif wiki-char-animated"
                        unoptimized
                        aria-hidden="true"
                      />
                    )}
                    {!char.pngFile && !char.gifFile && (
                      <Image
                        src="/images/hamiepfp.png"
                        alt={char.displayName}
                        fill
                        className="wiki-character-gif"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="wiki-character-info">
                    <h3 className="wiki-character-name">{char.displayName}</h3>
                    <div className="wiki-character-meta">
                      {char.species && <span className="wiki-character-species">{char.species}</span>}
                      <span className="wiki-character-role">
                        {char.roles.slice(0, 2).map(r => r.replace(/_/g, ' ')).join(' · ')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ])}
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
            {Object.entries(glossary).slice(0, glossaryExpanded ? 12 : 5).map(([term, definition]) => (
              <div key={term} className="wiki-glossary-item">
                <dt className="wiki-glossary-term">{term}</dt>
                <dd className="wiki-glossary-def">{definition}</dd>
              </div>
            ))}
          </div>
          {Object.keys(glossary).length > 5 && (
            <button className="wiki-glossary-toggle" onClick={() => setGlossaryExpanded(e => !e)}>
              {glossaryExpanded ? 'Show less' : `Show all ${Object.keys(glossary).length}`}
            </button>
          )}
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
          <p className="wiki-footer-text">© 2026 Hamieverse Wiki</p>
          <div className="wiki-footer-links">
            <a href="https://x.com/hamieverse" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://discord.gg/XpheMErdk6" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
