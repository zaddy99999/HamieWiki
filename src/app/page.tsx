'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllCharacters, getFactions, getThemes, getGlossary, getLogline } from '@/lib/hamieverse/characters';

export default function WikiHome() {
  const router = useRouter();
  const characters = getAllCharacters();

  const goToRandomCharacter = () => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    router.push(`/character/${randomChar.id}`);
  };
  const factions = getFactions();
  const themes = getThemes();
  const glossary = getGlossary();
  const logline = getLogline();

  const mainCharacters = characters.filter(c =>
    ['hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien'].includes(c.id)
  );
  const supportingCharacters = characters.filter(c =>
    !['hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien', 'simba_digital_identity'].includes(c.id)
  );

  return (
    <div className="wiki-container">
      <header className="wiki-main-header">
        <div className="wiki-header-banner" />
        <button className="wiki-random-btn" onClick={goToRandomCharacter}>
          <span className="wiki-random-icon">🎲</span>
          <span className="wiki-random-text">Random</span>
        </button>
        <div className="wiki-header-content">
          <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-logo" />
          <div className="wiki-header-text">
            <h1 className="wiki-title">Hamieverse Wiki</h1>
            <p className="wiki-subtitle">The comprehensive guide to the Hamieverse saga</p>
          </div>
        </div>
      </header>

      <div className="wiki-main-layout">
        <aside className="wiki-sidebar">
          <nav className="wiki-nav">
            <div className="wiki-nav-section">
              <h3>Navigation</h3>
              <ul>
                <li><a href="#characters">Characters</a></li>
                <li><a href="#factions">Factions</a></li>
                <li><a href="#glossary">Glossary</a></li>
              </ul>
            </div>
            <div className="wiki-nav-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link href="/character/hamie">Hamie</Link></li>
                <li><Link href="/character/sam">Sam</Link></li>
                <li><Link href="/character/lira">Lira</Link></li>
                <li><Link href="/character/silas">Silas</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        <main className="wiki-content">
          <section className="wiki-featured">
            <div className="wiki-featured-header">
              <span className="wiki-featured-badge">Featured</span>
              <h2>The Hamieverse</h2>
            </div>
            <p className="wiki-logline">{logline}</p>
            <div className="wiki-themes">
              <h4>Core Themes</h4>
              <div className="wiki-theme-tags">
                {themes.slice(0, 6).map((theme, i) => (
                  <span key={i} className="wiki-theme-tag">
                    {theme.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section id="characters" className="wiki-section">
            <h2 className="wiki-section-title">Main Characters</h2>
            <div className="wiki-character-grid">
              {mainCharacters.map((char) => (
                <Link
                  key={char.id}
                  href={`/character/${char.id}`}
                  className="wiki-character-card"
                  style={{ '--char-color': char.color } as React.CSSProperties}
                >
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
                    <h3>{char.displayName}</h3>
                    {char.species && <span className="wiki-character-species">{char.species}</span>}
                    <p className="wiki-character-role">
                      {char.roles.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="wiki-section">
            <h2 className="wiki-section-title">Supporting Characters</h2>
            <div className="wiki-character-list">
              {supportingCharacters.map((char) => (
                <Link
                  key={char.id}
                  href={`/character/${char.id}`}
                  className="wiki-character-row"
                >
                  <span className="wiki-character-name">{char.displayName}</span>
                  <span className="wiki-character-desc">
                    {char.roles[0] || char.symbolicRole || 'Character'}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section id="factions" className="wiki-section">
            <h2 className="wiki-section-title">Factions & Organizations</h2>
            <div className="wiki-faction-grid">
              {Object.entries(factions).map(([key, faction]) => (
                <div key={key} className="wiki-faction-card">
                  <h3>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                  <span className="wiki-faction-type">{faction.type}</span>
                  {faction.notes && <p>{faction.notes}</p>}
                  {faction.goals && (
                    <div className="wiki-faction-goals">
                      {faction.goals.slice(0, 3).map((goal, i) => (
                        <span key={i} className="wiki-goal-tag">{goal.replace(/_/g, ' ')}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="glossary" className="wiki-section">
            <h2 className="wiki-section-title">Glossary</h2>
            <div className="wiki-glossary">
              {Object.entries(glossary).slice(0, 12).map(([term, definition]) => (
                <div key={term} className="wiki-glossary-item">
                  <dt>{term}</dt>
                  <dd>{definition}</dd>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer className="wiki-footer">
        <p>Hamieverse Wiki - Part of the Hamie Saga</p>
      </footer>
    </div>
  );
}
