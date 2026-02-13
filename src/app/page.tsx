'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllCharacters, getFactions, getThemes, getGlossary, getLogline } from '@/lib/hamieverse/characters';

export default function WikiHome() {
  const router = useRouter();
  const characters = getAllCharacters();
  const factions = getFactions();
  const themes = getThemes();
  const glossary = getGlossary();
  const logline = getLogline();

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

  const factionCount = Object.keys(factions).length;
  const glossaryCount = Object.keys(glossary).length;

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
            <a href="#characters" className="wiki-topbar-link active">Characters</a>
            <a href="#factions" className="wiki-topbar-link">Factions</a>
            <a href="#glossary" className="wiki-topbar-link">Glossary</a>
          </div>

          <div className="wiki-search-box">
            <span className="wiki-search-icon">🔍</span>
            <input
              type="text"
              className="wiki-search-input"
              placeholder="Search the wiki..."
              disabled
            />
          </div>

          <button className="wiki-random-btn" onClick={goToRandomCharacter}>
            <span>🎲</span>
            <span>Random</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="wiki-hero">
        <div className="wiki-hero-bg" />
        <div className="wiki-hero-content">
          <div className="wiki-hero-text">
            <h1>The <span>Hamieverse</span> Wiki</h1>
            <p className="wiki-hero-subtitle">{logline}</p>

            <div className="wiki-hero-stats">
              <div className="wiki-stat">
                <div className="wiki-stat-value">{characters.length}</div>
                <div className="wiki-stat-label">Characters</div>
              </div>
              <div className="wiki-stat">
                <div className="wiki-stat-value">{factionCount}</div>
                <div className="wiki-stat-label">Factions</div>
              </div>
              <div className="wiki-stat">
                <div className="wiki-stat-value">{glossaryCount}</div>
                <div className="wiki-stat-label">Terms</div>
              </div>
            </div>
          </div>

          <div className="wiki-hero-featured">
            <div className="wiki-hero-featured-header">
              <span className="wiki-hero-featured-badge">Themes</span>
              <span className="wiki-hero-featured-title">Core Narrative</span>
            </div>
            <div className="wiki-theme-grid">
              {themes.slice(0, 8).map((theme, i) => (
                <span key={i} className="wiki-theme-chip">
                  {theme.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="wiki-main">
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
                  <h3 className="wiki-character-name">{char.displayName}</h3>
                  <div className="wiki-character-meta">
                    {char.species && <span className="wiki-character-species">{char.species}</span>}
                    <span className="wiki-character-role">
                      {char.roles.slice(0, 2).join(' · ')}
                    </span>
                  </div>
                </div>
                <span className="wiki-character-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Supporting Characters */}
        <section className="wiki-section">
          <div className="wiki-section-header">
            <h2 className="wiki-section-title">
              Supporting Characters
              <span className="wiki-section-count">({supportingCharacters.length})</span>
            </h2>
          </div>
          <div className="wiki-character-list">
            {supportingCharacters.map((char) => (
              <Link
                key={char.id}
                href={`/character/${char.id}`}
                className="wiki-character-row"
              >
                <span className="wiki-character-name">{char.displayName}</span>
                <span className="wiki-character-role">
                  {char.roles[0] || char.symbolicRole || 'Character'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Factions */}
        <section id="factions" className="wiki-section">
          <div className="wiki-section-header">
            <h2 className="wiki-section-title">
              Factions & Organizations
              <span className="wiki-section-count">({factionCount})</span>
            </h2>
          </div>
          <div className="wiki-faction-grid">
            {Object.entries(factions).map(([key, faction]) => (
              <div key={key} className="wiki-faction-card">
                <div className="wiki-faction-header">
                  <h3 className="wiki-faction-name">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                  </h3>
                  <span className="wiki-faction-type">{faction.type}</span>
                </div>
                {faction.notes && <p className="wiki-faction-desc">{faction.notes}</p>}
                {faction.goals && (
                  <div className="wiki-faction-goals">
                    {faction.goals.slice(0, 3).map((goal, i) => (
                      <span key={i} className="wiki-goal-chip">{goal.replace(/_/g, ' ')}</span>
                    ))}
                  </div>
                )}
              </div>
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
