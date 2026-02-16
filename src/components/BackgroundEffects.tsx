'use client';

import { useState, useEffect } from 'react';

export default function BackgroundEffects() {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to prevent flash

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render ANY of this on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Cyberpunk Background System */}
      <div className="wiki-bg-effects">
        <div className="wiki-orb wiki-orb-1" />
        <div className="wiki-orb wiki-orb-2" />
        <div className="wiki-orb wiki-orb-3" />
        <div className="wiki-aurora" />
        <div className="wiki-neon-grid" />
        <div className="wiki-holo-shimmer" />
      </div>

      {/* Lightning Effects */}
      <div className="wiki-lightning">
        <div className="wiki-bolt wiki-bolt-1" />
        <div className="wiki-bolt wiki-bolt-2" />
        <div className="wiki-bolt wiki-bolt-3" />
      </div>

      {/* Energy Streams */}
      <div className="wiki-energy-stream wiki-stream-1" />
      <div className="wiki-energy-stream wiki-stream-2" />
      <div className="wiki-energy-stream wiki-stream-3" />

      {/* Rising Particles */}
      <div className="wiki-particles">
        <div className="wiki-particle" />
        <div className="wiki-particle" />
        <div className="wiki-particle" />
        <div className="wiki-particle" />
        <div className="wiki-particle" />
        <div className="wiki-particle" />
        <div className="wiki-particle" />
        <div className="wiki-particle" />
        <div className="wiki-particle" />
      </div>

      {/* Scan Lines */}
      <div className="wiki-scanlines" />
    </>
  );
}
