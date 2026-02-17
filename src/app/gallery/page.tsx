'use client';

import { useState, useRef, useCallback, useMemo } from 'react';

// Generate scattered comics for chaos mode - packed tight!
const generateScatteredComics = () => {
  const comics = [];
  // Create a dense grid with overlap
  const cols = 12;
  const rows = 30;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const pageNum = ((row * cols + col) % 20) + 1;
      // Base position from grid, with random offset for overlap
      const baseX = (col / cols) * 100;
      const baseY = (row / rows) * 100;
      comics.push({
        src: `/comics/issue1/${pageNum}.png`,
        x: baseX + (Math.random() * 15 - 7.5),
        y: baseY + (Math.random() * 8 - 4),
        rotate: Math.random() * 50 - 25,
        scale: 0.7 + Math.random() * 0.5,
        delay: Math.random() * 3,
        zIndex: Math.floor(Math.random() * 10),
      });
    }
  }
  return comics;
};

// All assets
const hamieverse = [
  { src: '/fanart/HamieComiconBooth.jpeg', type: 'image' },
  { src: '/fanart/OrrienCharacter.png', type: 'image' },
  { src: '/fanart/Dashboard.png', type: 'image' },
  { src: '/fanart/Hamiecharacter.png', type: 'image' },
  { src: '/fanart/HamieVsOrrien.png', type: 'image' },
  { src: '/fanart/hamieverse riven missions draft.png', type: 'image' },
  { src: '/fanart/MeetORRIEN.mp4', type: 'video' },
  { src: '/fanart/HamieXpAbs2.gif', type: 'image' },
  { src: '/fanart/hamiexpabs.gif', type: 'image' },
  { src: '/fanart/HamieAbsPillow.gif', type: 'image' },
  { src: '/fanart/AetherionFaction.mp4', type: 'video' },
  { src: '/fanart/Liberators.mp4', type: 'video' },
  { src: '/fanart/Coffee both hands.gif', type: 'image' },
  { src: '/fanart/HamieCoffeePour.gif', type: 'image' },
  { src: '/fanart/RunningWithAbster.gif', type: 'image' },
  { src: '/fanart/HamieFlying2.gif', type: 'image' },
];

// Comics
const comicSeries = [
  {
    title: 'The Hamie Saga: Into The Hamieverse - Issue 1',
    pages: Array.from({ length: 20 }, (_, i) => `/comics/issue1/${i + 1}.png`),
  },
  {
    title: 'The Hamie Saga: Beyond The Hamieverse - Issue 2',
    pages: [],
  },
];

export default function GalleryPage() {
  const [tab, setTab] = useState<'hamieverse' | 'comics' | 'community' | 'chaos'>('hamieverse');
  const [comicsPerRow, setComicsPerRow] = useState<2 | 3>(3);
  const [speed, setSpeed] = useState<'fast' | 'medium' | 'slow' | 'scroll'>('medium');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [scrollMultiplier, setScrollMultiplier] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate chaos comics once - 360 comics (12 cols x 30 rows)
  const chaosComics = useMemo(() => generateScatteredComics(), []);

  // For infinite scroll in scroll mode
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 300) {
      setScrollMultiplier(prev => prev + 2);
    }
  }, []);

  // Triple the items for looping animation
  const loopedItems = [...hamieverse, ...hamieverse, ...hamieverse];
  const scrollItems = Array(scrollMultiplier).fill(hamieverse).flat();

  return (
    <div className="gallery-page-new">
      <div className="gallery-layout-new">
        {/* Vertical Title */}
        <div className="gallery-sidebar-new">
          <span>HAMIE GALLERY</span>
        </div>

        <div className="gallery-main-new">
          {/* Header */}
          <div className="gallery-header-new">
            <div className="gallery-tabs-new">
              <button className={tab === 'hamieverse' ? 'active' : ''} onClick={() => setTab('hamieverse')}>
                Hamieverse
              </button>
              <button className={tab === 'comics' ? 'active' : ''} onClick={() => setTab('comics')}>
                Comics
              </button>
              <button className={tab === 'community' ? 'active' : ''} onClick={() => setTab('community')}>
                Community
              </button>
              <button
                className={`gallery-chaos-btn ${tab === 'chaos' ? 'active' : ''}`}
                onClick={() => setTab('chaos')}
                title="Comic Chaos!"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/>
                </svg>
              </button>
            </div>

            <div className="gallery-controls-new">
              {tab === 'comics' && (
                <div className="gallery-tabs-new">
                  <button className={comicsPerRow === 2 ? 'active' : ''} onClick={() => setComicsPerRow(2)}>2</button>
                  <button className={comicsPerRow === 3 ? 'active' : ''} onClick={() => setComicsPerRow(3)}>3</button>
                </div>
              )}
              {(tab === 'hamieverse' || tab === 'community') && (
                <select
                  className="gallery-speed-new"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value as typeof speed)}
                >
                  <option value="fast">Fast</option>
                  <option value="medium">Medium</option>
                  <option value="slow">Slow</option>
                  <option value="scroll">Scroll</option>
                </select>
              )}
            </div>
          </div>

          {/* Hamieverse Tab */}
          {tab === 'hamieverse' && (
            <div
              className={`gallery-stream-new ${speed === 'scroll' ? 'scroll-mode' : ''}`}
              onScroll={speed === 'scroll' ? handleScroll : undefined}
              ref={containerRef}
            >
              <div className={`gallery-grid-new anim-${speed}`}>
                {(speed === 'scroll' ? scrollItems : loopedItems).map((item, i) => (
                  <div key={i} className="gallery-card-new" onClick={() => setLightbox(item.src)}>
                    {item.type === 'video' ? (
                      <video src={item.src} autoPlay loop muted playsInline />
                    ) : (
                      <img src={item.src} alt="" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comics Tab */}
          {tab === 'comics' && (
            <div className="gallery-comics-new">
              {comicSeries.map((series, i) => (
                <div key={i} className="comic-series-new">
                  <h2>{series.title}</h2>
                  <div className={`comic-grid-new cols-${comicsPerRow}`}>
                    {series.pages.map((src, j) => (
                      <div key={j} className="comic-card-new" onClick={() => setLightbox(src)}>
                        <img src={src} alt={`Page ${j + 1}`} />
                        <span>Page {j + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Community Tab */}
          {tab === 'community' && (
            <div
              className={`gallery-stream-new ${speed === 'scroll' ? 'scroll-mode' : ''}`}
              onScroll={speed === 'scroll' ? handleScroll : undefined}
            >
              <div className={`gallery-grid-new anim-${speed}`}>
                {(speed === 'scroll' ? scrollItems : loopedItems).slice(0, speed === 'scroll' ? scrollItems.length : 12).map((item, i) => (
                  <div key={i} className="gallery-card-new" onClick={() => setLightbox(item.src)}>
                    {item.type === 'video' ? (
                      <video src={item.src} autoPlay loop muted playsInline />
                    ) : (
                      <img src={item.src} alt="" />
                    )}
                  </div>
                ))}
                <div className="gallery-card-new placeholder-new">
                  <span>YOUR ART HERE</span>
                </div>
                <div className="gallery-card-new placeholder-new">
                  <span>YOUR ART HERE</span>
                </div>
              </div>
            </div>
          )}

          {/* Chaos Tab - Scattered Comics Everywhere */}
          {tab === 'chaos' && (
            <div className="gallery-chaos-feed">
              <div className="chaos-scatter-container">
                {chaosComics.map((comic, i) => (
                  <div
                    key={i}
                    className="chaos-comic"
                    style={{
                      left: `${comic.x}%`,
                      top: `${comic.y}%`,
                      zIndex: comic.zIndex,
                      '--rotate': `${comic.rotate}deg`,
                      '--scale': comic.scale,
                      '--delay': `${comic.delay}s`,
                    } as React.CSSProperties}
                    onClick={() => setLightbox(comic.src)}
                  >
                    <img src={comic.src} alt="" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="gallery-lightbox-new" onClick={() => setLightbox(null)}>
          {lightbox.endsWith('.mp4') ? (
            <video src={lightbox} autoPlay loop controls />
          ) : (
            <img src={lightbox} alt="" />
          )}
          <button onClick={() => setLightbox(null)}>×</button>
        </div>
      )}
    </div>
  );
}
