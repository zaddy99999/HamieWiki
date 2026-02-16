'use client';

import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // Simple navigation - just window.location
  const navigate = (path: string) => {
    window.location.href = path;
  };

  // Random character
  const goRandom = () => {
    const characters = [
      'hamie', 'kira', 'grandma', 'mitch', 'sam', 'aetherion',
      'ironpaws', '257a', 'contractor_friend', 'homeless_man_under_overpass'
    ];
    const random = characters[Math.floor(Math.random() * characters.length)];
    window.location.href = `/character/${random}`;
  };

  return (
    <aside className="brutal-sidebar">
      {/* Logo */}
      <div
        className="brutal-sidebar-brand"
        onClick={() => navigate('/')}
      >
        <img
          src="/images/hamiepfp.png"
          alt="Hamie"
          className="brutal-sidebar-logo"
        />
        <span
          className="brutal-sidebar-title"
          style={{ color: '#212121', textShadow: 'none' }}
        >HAMIEVERSE</span>
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
