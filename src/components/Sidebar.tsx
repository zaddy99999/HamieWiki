'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navigate = (path: string) => {
    setIsOpen(false);
    window.location.href = path;
  };

  const goRandom = () => {
    // Only characters with Shown=TRUE in the Google Sheet
    const characters = [
      'hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien',
      'grandma', 'luna', 'kira', 'mitch', 'alistair_veynar', 'simba',
      'halo_chryseos', 'veylor_quann', 'ironpaw_commander', 'caligo',
      'lost_sentinel', 'malvoria_chryseos', 'kai_vox', 'echo_whisperer', 'elyndor'
    ];
    const random = characters[Math.floor(Math.random() * characters.length)];
    setIsOpen(false);
    window.location.href = `/character/${random}`;
  };

  // Mobile: show hamburger button + overlay menu
  if (isMobile) {
    return (
      <>
        {/* Hamburger Button */}
        <button
          className="mobile-hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
        </button>

        {/* Overlay */}
        {isOpen && (
          <div
            className="mobile-nav-overlay"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <aside className={`mobile-nav-menu ${isOpen ? 'open' : ''}`}>
          {/* Logo */}
          <div className="mobile-nav-header" onClick={() => navigate('/')}>
            <img src="/images/hamiepfp.png" alt="Hamie" className="mobile-nav-logo" />
            <span className="mobile-nav-title">HAMIEVERSE</span>
          </div>

          {/* Nav Links */}
          <nav className="mobile-nav-links">
            <div
              className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}
              onClick={() => navigate('/')}
            >
              <span className="mobile-nav-icon">⌂</span>
              <span>HOME</span>
            </div>

            <div
              className={`mobile-nav-link ${pathname === '/xp-card' ? 'active' : ''}`}
              onClick={() => navigate('/xp-card')}
            >
              <span className="mobile-nav-icon">ID</span>
              <span>XP CARD</span>
            </div>

            <div
              className={`mobile-nav-link ${pathname === '/tier-maker' ? 'active' : ''}`}
              onClick={() => navigate('/tier-maker')}
            >
              <span className="mobile-nav-icon">▤</span>
              <span>TIER MAKER</span>
            </div>

            <div
              className={`mobile-nav-link ${pathname === '/build-your-team' ? 'active' : ''}`}
              onClick={() => navigate('/build-your-team')}
            >
              <span className="mobile-nav-icon">★</span>
              <span>BUILD TEAM</span>
            </div>

            <div className="mobile-nav-link" onClick={goRandom}>
              <span className="mobile-nav-icon">🎲</span>
              <span>RANDOM</span>
            </div>
          </nav>

          {/* Footer */}
          <div className="mobile-nav-footer">
            <a href="https://x.com/hamieverse" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://discord.gg/XpheMErdk6" target="_blank" rel="noopener noreferrer">DISCORD</a>
          </div>
        </aside>
      </>
    );
  }

  // Desktop: normal sidebar
  return (
    <aside className="brutal-sidebar">
      {/* Logo */}
      <div className="brutal-sidebar-brand" onClick={() => navigate('/')}>
        <img src="/images/hamiepfp.png" alt="Hamie" className="brutal-sidebar-logo" />
        <span className="brutal-sidebar-title" style={{ color: '#8B5CF6', textShadow: 'none' }}>
          HAMIEVERSE
        </span>
      </div>

      {/* Nav Links */}
      <nav className="brutal-sidebar-nav">
        <div
          className={`brutal-sidebar-link ${pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="brutal-sidebar-icon">⌂</span>
          <span className="brutal-sidebar-label">HOME</span>
        </div>

        <div
          className={`brutal-sidebar-link ${pathname === '/xp-card' ? 'active' : ''}`}
          onClick={() => navigate('/xp-card')}
        >
          <span className="brutal-sidebar-icon">ID</span>
          <span className="brutal-sidebar-label">XP CARD</span>
        </div>

        <div
          className={`brutal-sidebar-link ${pathname === '/tier-maker' ? 'active' : ''}`}
          onClick={() => navigate('/tier-maker')}
        >
          <span className="brutal-sidebar-icon">▤</span>
          <span className="brutal-sidebar-label">TIER MAKER</span>
        </div>

        <div
          className={`brutal-sidebar-link ${pathname === '/build-your-team' ? 'active' : ''}`}
          onClick={() => navigate('/build-your-team')}
        >
          <span className="brutal-sidebar-icon">★</span>
          <span className="brutal-sidebar-label">BUILD TEAM</span>
        </div>
      </nav>

      {/* Random */}
      <button className="brutal-sidebar-random" onClick={goRandom}>
        <span className="brutal-sidebar-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z"/>
          </svg>
        </span>
        <span className="brutal-sidebar-label">RANDOM</span>
      </button>

      {/* Footer */}
      <div className="brutal-sidebar-footer">
        <a href="https://x.com/hamieverse" target="_blank" rel="noopener noreferrer">X</a>
        <a href="https://discord.gg/XpheMErdk6" target="_blank" rel="noopener noreferrer">DISCORD</a>
      </div>
    </aside>
  );
}
