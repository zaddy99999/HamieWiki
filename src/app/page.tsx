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
import { HamieCharacter } from '@/lib/hamieverse/types';

function normStr(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getSheetPfp(char: HamieCharacter, pfpMap: Record<string, string>): string | undefined {
  for (const [name, file] of Object.entries(pfpMap)) {
    const nameNorm = normStr(name);
    const firstWord = normStr(name.split(' ')[0]);
    if (
      nameNorm === normStr(char.id) ||
      nameNorm === normStr(char.displayName) ||
      firstWord === normStr(char.displayName) ||
      normStr(char.id).startsWith(firstWord)
    ) {
      return file;
    }
  }
  return undefined;
}

function isShown(char: HamieCharacter, shownNames: string[]): boolean {
  const idNorm = normStr(char.id);
  const displayNorm = normStr(char.displayName);
  return shownNames.some(name => {
    const nameNorm = normStr(name);
    const firstWord = normStr(name.split(' ')[0]);
    return (
      nameNorm === idNorm ||
      nameNorm === displayNorm ||
      firstWord === displayNorm ||
      idNorm.startsWith(firstWord)
    );
  });
}

export default function WikiHome() {
  const router = useRouter();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [shownNames, setShownNames] = useState<string[] | null>(null);
  const [pfpMap, setPfpMap] = useState<Record<string, string>>({});
  const [factionMap, setFactionMap] = useState<Record<string, string>>({});
  const allCharacters = getAllCharacters();
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

  useEffect(() => {
    fetch('/api/shown-characters')
      .then(r => r.json())
      .then(data => {
        setShownNames(data.shownNames || []);
        setPfpMap(data.pfpMap || {});
        setFactionMap(data.factionMap || {});
      })
      .catch(() => setShownNames([]));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const characters = shownNames === null
    ? []
    : allCharacters.filter(c => isShown(c, shownNames) && (c.gifFile || c.pngFile));

  const goToRandomCharacter = () => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    if (randomChar) router.push(`/character/${randomChar.id}`);
  };

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
            <CharacterOfTheDay shownNames={shownNames ?? undefined} />
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
          {(() => {
            // Get faction for a character — sheet factionMap takes priority over lore data
            const getCharFaction = (char: typeof characters[0]) => {
              for (const [name, faction] of Object.entries(factionMap)) {
                const nameNorm = normStr(name);
                const firstWord = normStr(name.split(' ')[0]);
                const idNorm = normStr(char.id);
                const displayNorm = normStr(char.displayName);
                if (nameNorm === idNorm || nameNorm === displayNorm || firstWord === displayNorm || idNorm.startsWith(firstWord)) {
                  return faction;
                }
              }
              return char.faction || '';
            };

            const factionOrder = ['Liberators', 'Aetherion', 'Respeculators'];
            const getFactionGroup = (raw: string): string | undefined => {
              if (raw.includes('respeculat')) return 'Respeculators';
              if (raw.includes('aetherion')) return 'Aetherion';
              if (raw.includes('undercode') || raw.includes('liberator')) return 'Liberators';
              return undefined;
            };
            const grouped: Record<string, typeof characters> = {};
            factionOrder.forEach(f => { grouped[f] = []; });
            characters.forEach(c => {
              const raw = getCharFaction(c).toLowerCase().trim();
              const mapped = getFactionGroup(raw);
              if (mapped) grouped[mapped].push(c);
            });
            return (
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
                      <div className="wiki-character-avatar">
                        <Image
                          src={`/images/${getSheetPfp(char, pfpMap) || char.gifFile || char.pngFile || 'hamiepfp.png'}`}
                          alt={char.displayName}
                          fill
                          className="wiki-character-gif"
                          unoptimized
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
                    </Link>
                  ))
                ])}
              </div>
            );
          })()}
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
