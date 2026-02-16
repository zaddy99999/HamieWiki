'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getLocation, getAllLocations, getLocationConnections } from '@/lib/hamieverse/locations';
import { getAllCharacters } from '@/lib/hamieverse/characters';

export default function LocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id as string;

  const location = getLocation(locationId);
  const allLocations = getAllLocations();
  const connections = location ? getLocationConnections(locationId) : [];
  const characters = getAllCharacters();

  // Find matching characters for this location
  const relatedCharacters = characters.filter(char => {
    if (!location) return false;
    const notableNames = location.notableCharacters.map(n => n.toLowerCase());
    return notableNames.some(name =>
      char.displayName.toLowerCase().includes(name.replace(/[#()]/g, '').trim()) ||
      name.includes(char.displayName.toLowerCase()) ||
      name.includes(char.id.toLowerCase())
    );
  });

  // Get previous and next locations for navigation
  const currentIndex = allLocations.findIndex(l => l.id === locationId);
  const prevLocation = currentIndex > 0 ? allLocations[currentIndex - 1] : null;
  const nextLocation = currentIndex < allLocations.length - 1 ? allLocations[currentIndex + 1] : null;

  if (!location) {
    return (
      <div className="wiki-container">
        <main className="location-detail-error">
          <h1>Location Not Found</h1>
          <p>The location you are looking for does not exist in the Hamieverse.</p>
          <Link href="/locations" className="location-back-link">Return to Locations</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="wiki-container">
      {/* Breadcrumb */}
      <div className="location-breadcrumb">
        <Link href="/">Home</Link>
        <span className="location-breadcrumb-sep">&#8250;</span>
        <Link href="/locations">Locations</Link>
        <span className="location-breadcrumb-sep">&#8250;</span>
        <span className="location-breadcrumb-current">{location.name}</span>
      </div>

      {/* Location Detail */}
      <main className="location-detail" style={{ '--location-color': location.color } as React.CSSProperties}>
        {/* Hero Section */}
        <header className="location-detail-hero">
          <div className="location-detail-hero-bg">
            <div className="location-detail-hero-grid"></div>
            <div className="location-detail-hero-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${location.color}20, transparent 70%)` }}></div>
          </div>
          <div className="location-detail-hero-content">
            <span className="location-detail-icon">{location.icon}</span>
            <h1 className="location-detail-title">{location.name}</h1>
            <span className="location-detail-type">{location.type}</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="location-detail-content">
          {/* Description Section */}
          <section className="location-detail-section">
            <h2 className="location-detail-section-title">
              <span className="location-detail-section-icon">&#128214;</span>
              Overview
            </h2>
            <p className="location-detail-description">{location.description}</p>
          </section>

          {/* Key Features */}
          <section className="location-detail-section">
            <h2 className="location-detail-section-title">
              <span className="location-detail-section-icon">&#10024;</span>
              Key Features
            </h2>
            <ul className="location-detail-features">
              {location.keyFeatures.map((feature, i) => (
                <li key={i} className="location-detail-feature">
                  <span className="location-detail-feature-bullet"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          {/* Significance */}
          <section className="location-detail-section">
            <h2 className="location-detail-section-title">
              <span className="location-detail-section-icon">&#127919;</span>
              Significance to the Story
            </h2>
            <div className="location-detail-significance">
              <p>{location.significance}</p>
            </div>
          </section>

          {/* Symbolism */}
          {location.symbolism && location.symbolism.length > 0 && (
            <section className="location-detail-section">
              <h2 className="location-detail-section-title">
                <span className="location-detail-section-icon">&#128300;</span>
                Symbolism &amp; Themes
              </h2>
              <div className="location-detail-tags">
                {location.symbolism.map((symbol, i) => (
                  <span key={i} className="location-detail-tag">{symbol}</span>
                ))}
              </div>
            </section>
          )}

          {/* Aesthetic Tags */}
          {location.aestheticTags && location.aestheticTags.length > 0 && (
            <section className="location-detail-section">
              <h2 className="location-detail-section-title">
                <span className="location-detail-section-icon">&#127912;</span>
                Aesthetic
              </h2>
              <div className="location-detail-tags aesthetic">
                {location.aestheticTags.map((tag, i) => (
                  <span key={i} className="location-detail-tag">{tag}</span>
                ))}
              </div>
            </section>
          )}

          {/* Notable Characters */}
          <section className="location-detail-section">
            <h2 className="location-detail-section-title">
              <span className="location-detail-section-icon">&#128101;</span>
              Notable Characters
            </h2>
            <div className="location-detail-characters">
              {relatedCharacters.length > 0 ? (
                relatedCharacters.map(char => (
                  <Link
                    key={char.id}
                    href={`/character/${char.id}`}
                    className="location-detail-character"
                  >
                    <div className="location-detail-character-avatar" style={{ borderColor: char.color }}>
                      {char.gifFile ? (
                        <img src={`/images/${char.gifFile}`} alt={char.displayName} />
                      ) : (
                        <span>{char.displayName[0]}</span>
                      )}
                    </div>
                    <div className="location-detail-character-info">
                      <span className="location-detail-character-name">{char.displayName}</span>
                      <span className="location-detail-character-role">
                        {char.roles[0]?.replace(/_/g, ' ') || 'Character'}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="location-detail-characters-list">
                  {location.notableCharacters.map((name, i) => (
                    <span key={i} className="location-detail-character-badge">{name}</span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Connected Locations */}
          {connections.length > 0 && (
            <section className="location-detail-section">
              <h2 className="location-detail-section-title">
                <span className="location-detail-section-icon">&#128279;</span>
                Connected Locations
              </h2>
              <div className="location-detail-connections">
                {connections.map(conn => (
                  <Link
                    key={conn.id}
                    href={`/locations/${conn.id}`}
                    className="location-detail-connection"
                    style={{ '--conn-color': conn.color } as React.CSSProperties}
                  >
                    <span className="location-detail-connection-icon">{conn.icon}</span>
                    <div className="location-detail-connection-info">
                      <span className="location-detail-connection-name">{conn.name}</span>
                      <span className="location-detail-connection-type">{conn.type}</span>
                    </div>
                    <span className="location-detail-connection-arrow">&#8594;</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Navigation */}
        <nav className="location-detail-nav">
          {prevLocation ? (
            <Link href={`/locations/${prevLocation.id}`} className="location-detail-nav-link prev">
              <span className="location-detail-nav-arrow">&#8592;</span>
              <div className="location-detail-nav-content">
                <span className="location-detail-nav-label">Previous</span>
                <span className="location-detail-nav-name">{prevLocation.name}</span>
              </div>
            </Link>
          ) : (
            <div className="location-detail-nav-link disabled"></div>
          )}

          <Link href="/locations" className="location-detail-nav-all">
            <span>&#127961;</span>
            <span>All Locations</span>
          </Link>

          {nextLocation ? (
            <Link href={`/locations/${nextLocation.id}`} className="location-detail-nav-link next">
              <div className="location-detail-nav-content">
                <span className="location-detail-nav-label">Next</span>
                <span className="location-detail-nav-name">{nextLocation.name}</span>
              </div>
              <span className="location-detail-nav-arrow">&#8594;</span>
            </Link>
          ) : (
            <div className="location-detail-nav-link disabled"></div>
          )}
        </nav>
      </main>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">&copy; 2024 Hamieverse Wiki</p>
          <div className="wiki-footer-links">
            <a href="https://x.com/hamieverse" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://discord.gg/XpheMErdk6" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
