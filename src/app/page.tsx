'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAllCharacters, getGlossary, getLogline, getThemes } from '@/lib/hamieverse/characters';
import { ArrowUpIcon } from '@/components/Icons';
import LoreLinks from '@/components/LoreLinks';
import RelationshipWeb from '@/components/RelationshipWeb';
import CharacterOfTheDay from '@/components/CharacterOfTheDay';
import MiniQuiz from '@/components/MiniQuiz';

export default function WikiHome() {
  const router = useRouter();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const characters = getAllCharacters();
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
    router.push(`/character/${randomChar.id}`);
  };

  const mainCharacters = characters.filter(c =>
    ['hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien'].includes(c.id)
  );

  const supportingCharacters = characters.filter(c =>
    !['hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien', 'simba_digital_identity', 'homeless_man_under_overpass', 'dog_simba', '479c', 'veynar_mother'].includes(c.id.toLowerCase())
  );

  const glossaryCount = Object.keys(glossary).length;

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
            <h1>The <span>Hamieverse</span> Wiki</h1>
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
                <div className="wiki-character-avatar">
                  <Image
                    src={char.gifFile ? `/images/${char.gifFile}` : '/images/hamiepfp.png'}
                    alt={char.displayName}
                    fill
                    className="wiki-character-gif"
                    unoptimized={char.gifFile?.endsWith('.gif')}
                  />
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
                  <Image
                    src={char.gifFile ? `/images/${char.gifFile}` : '/images/hamiepfp.png'}
                    alt={char.displayName}
                    fill
                    className="wiki-supporting-img"
                    unoptimized={char.gifFile?.endsWith('.gif')}
                  />
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

    </div>
  );
}
