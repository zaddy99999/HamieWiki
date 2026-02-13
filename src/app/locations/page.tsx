'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WikiNavbar from '@/components/WikiNavbar';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllLocations } from '@/lib/hamieverse/locations';

export default function LocationsPage() {
  const router = useRouter();
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const locations = getAllLocations();

  const goToRandomLocation = () => {
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    router.push(`/locations/${randomLoc.id}`);
  };

  const breadcrumbItems = [
    { label: 'Wiki', href: '/' },
    { label: 'Locations' },
  ];

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="locations" />

      {/* Header */}
      <header className="locations-header">
        <div className="locations-header-content">
          <Breadcrumb items={breadcrumbItems} />
          <h1>Locations of the Hamieverse</h1>
          <p>Navigate the dystopian landscape from the machine City to the remembered Beyond</p>
        </div>
      </header>

      {/* Interactive Map Section */}
      <section className="locations-map-section">
        <div className="locations-map-container">
          <div className="locations-map">
            {/* Map background with grid and glow effects */}
            <div className="locations-map-bg">
              <div className="locations-map-grid"></div>
              <div className="locations-map-glow"></div>
            </div>

            {/* Connection lines between locations */}
            <svg className="locations-map-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
              {locations.map(loc =>
                loc.connections.map(connId => {
                  const connLoc = locations.find(l => l.id === connId);
                  if (!connLoc) return null;
                  const isHovered = hoveredLocation === loc.id || hoveredLocation === connId;
                  return (
                    <line
                      key={`${loc.id}-${connId}`}
                      x1={`${loc.mapPosition.x}%`}
                      y1={`${loc.mapPosition.y}%`}
                      x2={`${connLoc.mapPosition.x}%`}
                      y2={`${connLoc.mapPosition.y}%`}
                      className={`locations-map-line ${isHovered ? 'active' : ''}`}
                      style={{ stroke: isHovered ? loc.color : 'rgba(255,255,255,0.15)' }}
                    />
                  );
                })
              )}
            </svg>

            {/* Location nodes */}
            {locations.map(loc => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className={`locations-map-node ${hoveredLocation === loc.id ? 'active' : ''}`}
                style={{
                  left: `${loc.mapPosition.x}%`,
                  top: `${loc.mapPosition.y}%`,
                  '--location-color': loc.color,
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredLocation(loc.id)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <span className="locations-map-node-icon">{loc.icon}</span>
                <span className="locations-map-node-pulse"></span>
                <span className="locations-map-node-label">{loc.name}</span>
              </Link>
            ))}
          </div>
          <p className="locations-map-hint">Click a location to explore its details</p>
        </div>
      </section>

      {/* Locations Grid */}
      <main className="locations-main">
        <div className="locations-grid">
          {locations.map((location, index) => (
            <Link
              key={location.id}
              href={`/locations/${location.id}`}
              className="location-card"
              style={{
                '--location-color': location.color,
                animationDelay: `${index * 0.1}s`
              } as React.CSSProperties}
            >
              <div className="location-card-header">
                <span className="location-card-icon">{location.icon}</span>
                <div className="location-card-titles">
                  <h2 className="location-card-name">{location.name}</h2>
                  <span className="location-card-type">{location.type}</span>
                </div>
              </div>

              <p className="location-card-desc">
                {location.description.length > 180
                  ? location.description.substring(0, 180) + '...'
                  : location.description}
              </p>

              <div className="location-card-features">
                {location.keyFeatures.slice(0, 3).map((feature, i) => (
                  <span key={i} className="location-card-feature">{feature}</span>
                ))}
              </div>

              <div className="location-card-footer">
                <div className="location-card-characters">
                  <span className="location-card-characters-label">Notable:</span>
                  <span className="location-card-characters-list">
                    {location.notableCharacters.slice(0, 3).join(', ')}
                    {location.notableCharacters.length > 3 && ` +${location.notableCharacters.length - 3}`}
                  </span>
                </div>
                <span className="location-card-arrow">&#8594;</span>
              </div>
            </Link>
          ))}
        </div>
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
