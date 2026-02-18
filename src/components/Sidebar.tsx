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
    // Valid character IDs from lore.json and comics.json
    const characters = [
      'hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien',
      'grandma', 'luna', 'kira', 'mitch', 'alistair_veynar', 'halo',
      'veylor', 'iris'
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
          style={{ minWidth: '48px', minHeight: '48px' }}
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
              style={{ minHeight: '48px', padding: '12px 16px' }}
            >
              <img src="/home_icon.png" alt="Home" className="mobile-nav-icon" style={{ width: '24px', height: '24px' }} />
              <span>HOME</span>
            </div>

            <div
              className={`mobile-nav-link ${pathname === '/xp-card' ? 'active' : ''}`}
              onClick={() => navigate('/xp-card')}
              style={{ minHeight: '48px', padding: '12px 16px' }}
            >
              <svg className="mobile-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              <span>XP CARD</span>
            </div>

            <div
              className={`mobile-nav-link ${pathname === '/tier-maker' ? 'active' : ''}`}
              onClick={() => navigate('/tier-maker')}
              style={{ minHeight: '48px', padding: '12px 16px' }}
            >
              <span className="mobile-nav-icon" style={{ fontSize: '20px' }}>▤</span>
              <span>TIER MAKER</span>
            </div>

            <div
              className={`mobile-nav-link ${pathname === '/build-your-team' ? 'active' : ''}`}
              onClick={() => navigate('/build-your-team')}
              style={{ minHeight: '48px', padding: '12px 16px' }}
            >
              <span className="mobile-nav-icon" style={{ fontSize: '20px' }}>★</span>
              <span>BUILD TEAM</span>
            </div>

            <div
              className={`mobile-nav-link ${pathname === '/gallery' ? 'active' : ''}`}
              onClick={() => navigate('/gallery')}
              style={{ minHeight: '48px', padding: '12px 16px' }}
            >
              <svg className="mobile-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
              </svg>
              <span>GALLERY</span>
            </div>

            <div className="mobile-nav-link" onClick={goRandom} style={{ minHeight: '48px', padding: '12px 16px' }}>
              <span className="mobile-nav-icon" style={{ fontSize: '20px' }}>🎲</span>
              <span>RANDOM</span>
            </div>
          </nav>

          {/* Footer */}
          <div className="mobile-nav-footer" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="https://x.com/hamieverse" target="_blank" rel="noopener noreferrer" style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px' }}>X</a>
            <a href="https://discord.gg/XpheMErdk6" target="_blank" rel="noopener noreferrer" style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px' }}>DISCORD</a>
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
        <span className="brutal-sidebar-title" style={{ color: '#0446F1', textShadow: 'none' }}>
          HAMIEVERSE
        </span>
      </div>

      {/* Nav Links */}
      <nav className="brutal-sidebar-nav">
        <div
          className={`brutal-sidebar-link ${pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <img src="/home_icon.png" alt="Home" className="brutal-sidebar-icon" style={{ width: '20px', height: '20px' }} />
          <span className="brutal-sidebar-label">HOME</span>
        </div>

        <div
          className={`brutal-sidebar-link ${pathname === '/xp-card' ? 'active' : ''}`}
          onClick={() => navigate('/xp-card')}
        >
          <svg className="brutal-sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
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

        <div
          className={`brutal-sidebar-link ${pathname === '/gallery' ? 'active' : ''}`}
          onClick={() => navigate('/gallery')}
        >
          <svg className="brutal-sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
          </svg>
          <span className="brutal-sidebar-label">GALLERY</span>
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
