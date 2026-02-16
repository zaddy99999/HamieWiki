'use client';

import { useEffect, useState } from 'react';

// Dense scattered comic pages covering ~90% of background like pages on a table
const COMIC_PAGES = [
  // Layer 1 - Base layer (slightly larger, more coverage)
  { src: '/comics/comic1.png', top: '-8%', left: '-8%', rotate: -5 },
  { src: '/comics/comic2.png', top: '-5%', left: '12%', rotate: 3 },
  { src: '/comics/comic3.png', top: '-10%', left: '32%', rotate: -2 },
  { src: '/comics/comic4.png', top: '-6%', left: '52%', rotate: 4 },
  { src: '/comics/comic5.png', top: '-8%', left: '72%', rotate: -3 },
  { src: '/comics/comic6.png', top: '-4%', left: '92%', rotate: 2 },
  // Layer 2
  { src: '/comics/comic7.png', top: '12%', left: '-6%', rotate: 4 },
  { src: '/comics/comic8.png', top: '15%', left: '14%', rotate: -3 },
  { src: '/comics/comic9.png', top: '10%', left: '34%', rotate: 2 },
  { src: '/comics/comic10.png', top: '18%', left: '54%', rotate: -4 },
  { src: '/comics/comic11.png', top: '13%', left: '74%', rotate: 3 },
  { src: '/comics/comic12.png', top: '16%', left: '94%', rotate: -2 },
  // Layer 3
  { src: '/comics/comic13.png', top: '30%', left: '-10%', rotate: -3 },
  { src: '/comics/comic14.png', top: '33%', left: '10%', rotate: 5 },
  { src: '/comics/comic15.png', top: '28%', left: '30%', rotate: -2 },
  { src: '/comics/comic1.png', top: '35%', left: '50%', rotate: 3 },
  { src: '/comics/comic2.png', top: '31%', left: '70%', rotate: -4 },
  { src: '/comics/comic3.png', top: '34%', left: '90%', rotate: 2 },
  // Layer 4
  { src: '/comics/comic4.png', top: '48%', left: '-7%', rotate: 3 },
  { src: '/comics/comic5.png', top: '52%', left: '13%', rotate: -2 },
  { src: '/comics/comic6.png', top: '46%', left: '33%', rotate: 4 },
  { src: '/comics/comic7.png', top: '50%', left: '53%', rotate: -3 },
  { src: '/comics/comic8.png', top: '48%', left: '73%', rotate: 2 },
  { src: '/comics/comic9.png', top: '51%', left: '93%', rotate: -4 },
  // Layer 5
  { src: '/comics/comic10.png', top: '66%', left: '-9%', rotate: -4 },
  { src: '/comics/comic11.png', top: '70%', left: '11%', rotate: 3 },
  { src: '/comics/comic12.png', top: '64%', left: '31%', rotate: -2 },
  { src: '/comics/comic13.png', top: '68%', left: '51%', rotate: 4 },
  { src: '/comics/comic14.png', top: '66%', left: '71%', rotate: -3 },
  { src: '/comics/comic15.png', top: '69%', left: '91%', rotate: 2 },
  // Layer 6 - Bottom
  { src: '/comics/comic1.png', top: '84%', left: '-6%', rotate: 2 },
  { src: '/comics/comic3.png', top: '88%', left: '14%', rotate: -4 },
  { src: '/comics/comic5.png', top: '82%', left: '34%', rotate: 3 },
  { src: '/comics/comic7.png', top: '86%', left: '54%', rotate: -2 },
  { src: '/comics/comic9.png', top: '84%', left: '74%', rotate: 4 },
  { src: '/comics/comic11.png', top: '87%', left: '94%', rotate: -3 },
  // Extra overlapping pieces for density
  { src: '/comics/comic2.png', top: '5%', left: '5%', rotate: -6 },
  { src: '/comics/comic4.png', top: '25%', left: '22%', rotate: 5 },
  { src: '/comics/comic6.png', top: '42%', left: '42%', rotate: -5 },
  { src: '/comics/comic8.png', top: '58%', left: '62%', rotate: 6 },
  { src: '/comics/comic10.png', top: '75%', left: '82%', rotate: -6 },
  { src: '/comics/comic12.png', top: '92%', left: '2%', rotate: 5 },
];

export default function ComicBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Don't render on mobile
  if (isMobile) return null;

  // Parallax speed - background moves slower than foreground (0.3 = 30% of scroll speed)
  const parallaxOffset = scrollY * 0.3;

  return (
    <div
      className="comic-background-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        transform: `translateY(-${parallaxOffset}px)`,
      }}
    >
      {COMIC_PAGES.map((comic, index) => (
        <div
          key={index}
          className="comic-page-scatter"
          style={{
            position: 'absolute',
            top: comic.top,
            left: comic.left,
            transform: `rotate(${comic.rotate}deg)`,
          }}
        >
          <div
            style={{
              width: '26vw',
              height: '20vh',
              minWidth: '220px',
              minHeight: '160px',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.08)',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
            }}
          >
            <img
              src={comic.src}
              alt=""
              style={{
                width: '120%',
                height: '120%',
                objectFit: 'cover',
                objectPosition: 'center',
                marginLeft: '-10%',
                marginTop: '-10%',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
