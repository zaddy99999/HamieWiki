'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';

const SPEED_CLASS: Record<string, string> = {
  fast: 'anim-fast',
  medium: 'anim-medium',
  slow: 'anim-slow',
  scroll: 'anim-scroll',
};

// All comic pages from both issues
const allComicPages = [
  ...Array.from({ length: 20 }, (_, i) => `/comics/issue1/${i + 1}.png`),
  ...Array.from({ length: 26 }, (_, i) => `/comics/issue2/${i + 1}.png`),
];

// Generate scattered comics for chaos mode - packed tight!
const generateScatteredComics = () => {
  const comics = [];
  // Create a dense grid with overlap
  const cols = 12;
  const rows = 30;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const pageIndex = (row * cols + col) % allComicPages.length;
      // Base position from grid, with random offset for overlap
      const baseX = (col / cols) * 100;
      const baseY = (row / rows) * 100;
      comics.push({
        src: allComicPages[pageIndex],
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

// Hamieverse tab — Game Cards with Stats 2 folder + videos/GIFs
const hamieverse = [
  // Cards first — load instantly
  { src: '/fanart/Hamie Cinders of Power ( Game Card ).png', type: 'image' },
  { src: '/fanart/Sam The Insider (Game Card).png', type: 'image' },
  { src: '/fanart/Lira Velvet Strings ( Game Card ).png', type: 'image' },
  { src: '/fanart/Silas Veiled Devotion ( Game Card ).png', type: 'image' },
  { src: '/fanart/Ace Havoc ( Game Card ) 2.png', type: 'image' },
  { src: '/fanart/Hikari Hack Jester ( Game Card ).png', type: 'image' },
  { src: '/fanart/Kael The Mighty ( Game Card ).png', type: 'image' },
  { src: '/fanart/Orrien Hand of Control ( Game Card ).png', type: 'image' },
  { src: '/fanart/Kira Flux Hysteria_s herald ( Game Card ).png', type: 'image' },
  { src: '/fanart/Halo Whispered Omens ( Game Card ).png', type: 'image' },
  { src: '/fanart/Alistair veynar his shadow remains ( Website card BG ).png', type: 'image' },
  { src: '/fanart/Simba Quiet Companion ( Game Card ).png', type: 'image' },
  { src: '/fanart/Veylor Quann Architect of Undoing ( Game Card ).png', type: 'image' },
  { src: '/fanart/Iron Paw Commander ( Game Card ) Red.png', type: 'image' },
  { src: '/fanart/Caligo Midnight Strike ( Game Card ).png', type: 'image' },
  { src: '/fanart/Lost Sentinel Forgotten Guardian( Game Card ).png', type: 'image' },
  { src: '/fanart/Malvoria Time Leech ( Game Card ).png', type: 'image' },
  { src: '/fanart/Kai vox Killzone Warden ( Game Card ).png', type: 'image' },
  { src: '/fanart/Echo Whisper Memory Shade ( Game Card ).png', type: 'image' },
  { src: '/fanart/ELyndor The Observer_s Touch ( Game Card ).png', type: 'image' },
  // Other static images
  { src: '/fanart/HamieVsOrrien.png', type: 'image' },
  { src: '/fanart/Dashboard.png', type: 'image' },
  { src: '/fanart/Hamiecharacter.png', type: 'image' },
  { src: '/fanart/OrrienCharacter.png', type: 'image' },
  { src: '/fanart/hamieverse riven missions draft.png', type: 'image' },
  { src: '/fanart/HamieComiconBooth.jpeg', type: 'image' },
];

// Community tab — Marketing Graphics folder (numbered card variants)
const communityItems = [
  { src: '/fanart/hamie1.png', type: 'image' },
  { src: '/fanart/hamie2.png', type: 'image' },
  { src: '/fanart/hamie3.png', type: 'image' },
  { src: '/fanart/hamie4.png', type: 'image' },
  { src: '/fanart/sam2.png', type: 'image' },
  { src: '/fanart/sam3.png', type: 'image' },
  { src: '/fanart/sam4.png', type: 'image' },
  { src: '/fanart/lira1.png', type: 'image' },
  { src: '/fanart/lira2.png', type: 'image' },
  { src: '/fanart/lira3.png', type: 'image' },
  { src: '/fanart/lira4.png', type: 'image' },
  { src: '/fanart/silas1.png', type: 'image' },
  { src: '/fanart/silas2.png', type: 'image' },
  { src: '/fanart/silas3.png', type: 'image' },
  { src: '/fanart/silas4.png', type: 'image' },
  { src: '/fanart/ace1.png', type: 'image' },
  { src: '/fanart/ace2.png', type: 'image' },
  { src: '/fanart/ace3.png', type: 'image' },
  { src: '/fanart/ace4.png', type: 'image' },
  { src: '/fanart/hikari1.png', type: 'image' },
  { src: '/fanart/hikari2.png', type: 'image' },
  { src: '/fanart/hikari3.png', type: 'image' },
  { src: '/fanart/hikari4.png', type: 'image' },
  { src: '/fanart/kael1.png', type: 'image' },
  { src: '/fanart/kael2.png', type: 'image' },
  { src: '/fanart/kael3.png', type: 'image' },
  { src: '/fanart/kael4.png', type: 'image' },
  { src: '/fanart/orrien1.png', type: 'image' },
  { src: '/fanart/orrien2.png', type: 'image' },
  { src: '/fanart/orrien3.png', type: 'image' },
  { src: '/fanart/orrien4.png', type: 'image' },
  { src: '/fanart/kira1.png', type: 'image' },
  { src: '/fanart/kira2.png', type: 'image' },
  { src: '/fanart/kira3.png', type: 'image' },
  { src: '/fanart/kira4.png', type: 'image' },
  { src: '/fanart/halo1.png', type: 'image' },
  { src: '/fanart/halo2.png', type: 'image' },
  { src: '/fanart/halo3.png', type: 'image' },
  { src: '/fanart/halo4.png', type: 'image' },
  { src: '/fanart/alistair1.png', type: 'image' },
  { src: '/fanart/alistair2.png', type: 'image' },
  { src: '/fanart/alistair3.png', type: 'image' },
  { src: '/fanart/alistair4.png', type: 'image' },
  { src: '/fanart/simba1.png', type: 'image' },
  { src: '/fanart/simba2.png', type: 'image' },
  { src: '/fanart/simba3.png', type: 'image' },
  { src: '/fanart/simba4.png', type: 'image' },
  { src: '/fanart/veylor1.png', type: 'image' },
  { src: '/fanart/veylor2.png', type: 'image' },
  { src: '/fanart/veylor3.png', type: 'image' },
  { src: '/fanart/veylor4.png', type: 'image' },
  { src: '/fanart/ironpaw1.png', type: 'image' },
  { src: '/fanart/ironpaw3.png', type: 'image' },
  { src: '/fanart/ironpaw4.png', type: 'image' },
  { src: '/fanart/caligo1.png', type: 'image' },
  { src: '/fanart/caligo2.png', type: 'image' },
  { src: '/fanart/caligo3.png', type: 'image' },
  { src: '/fanart/caligo4.png', type: 'image' },
  { src: '/fanart/sentinel1.png', type: 'image' },
  { src: '/fanart/sentinel2.png', type: 'image' },
  { src: '/fanart/sentinel3.png', type: 'image' },
  { src: '/fanart/sentinel4.png', type: 'image' },
  { src: '/fanart/malvoria1.png', type: 'image' },
  { src: '/fanart/malvoria2.png', type: 'image' },
  { src: '/fanart/malvoria3.png', type: 'image' },
  { src: '/fanart/malvoria4.png', type: 'image' },
  { src: '/fanart/kaivox1.png', type: 'image' },
  { src: '/fanart/kaivox2.png', type: 'image' },
  { src: '/fanart/kaivox4.png', type: 'image' },
  { src: '/fanart/echo1.png', type: 'image' },
  { src: '/fanart/echo2.png', type: 'image' },
  { src: '/fanart/echo3.png', type: 'image' },
  { src: '/fanart/echo4.png', type: 'image' },
  { src: '/fanart/elyndor1.png', type: 'image' },
  { src: '/fanart/elyndor2.png', type: 'image' },
  { src: '/fanart/elyndor3.png', type: 'image' },
  { src: '/fanart/elyndor4.png', type: 'image' },
];

// Comics
const comicSeries = [
  {
    title: 'The Hamie Saga: Into The Hamieverse - Issue 1',
    pages: Array.from({ length: 20 }, (_, i) => `/comics/issue1/${i + 1}.png`),
  },
  {
    title: 'The Hamie Saga: Beyond The Hamieverse - Issue 2',
    pages: Array.from({ length: 26 }, (_, i) => `/comics/issue2/${i + 1}.png`),
  },
];

export default function GalleryPage() {
  const [tab, setTab] = useState<'hamieverse' | 'comics' | 'community' | 'chaos'>('hamieverse');
  const [comicsPerRow, setComicsPerRow] = useState<2 | 3>(3);
  const [speed, setSpeed] = useState<'fast' | 'medium' | 'slow' | 'scroll'>('medium');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [scrollMultiplier, setScrollMultiplier] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const chaosRef = useRef<HTMLDivElement>(null);

  // Generate chaos comics once - 360 comics (12 cols x 30 rows)
  const chaosComics = useMemo(() => generateScatteredComics(), []);

  // For infinite scroll in scroll mode
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 300) {
      setScrollMultiplier(prev => prev + 2);
    }
  }, []);

  // Auto-scroll for hamieverse/community feeds
  useEffect(() => {
    const isFeedTab = tab === 'hamieverse' || tab === 'community';
    const el = tab === 'hamieverse' ? containerRef.current : communityRef.current;
    if (!isFeedTab || speed === 'scroll' || !el) return;

    const speedMap = { fast: 0.12, medium: 0.05, slow: 0.02 };
    const baseSpeed = speedMap[speed as 'fast' | 'medium' | 'slow'];
    let animationId: number;
    let lastTime = performance.now();
    let userScrolling = false;
    let userScrollTimeout: NodeJS.Timeout;

    const autoScroll = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      const halfHeight = el.scrollHeight / 2;
      el.scrollTop += delta * (userScrolling ? baseSpeed * 3 : baseSpeed);
      if (el.scrollTop >= halfHeight) el.scrollTop = 0;
      animationId = requestAnimationFrame(autoScroll);
    };

    const handleWheel = () => {
      userScrolling = true;
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => { userScrolling = false; }, 1000);
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    animationId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener('wheel', handleWheel);
      clearTimeout(userScrollTimeout);
    };
  }, [tab, speed]);

  // Auto-scroll for chaos mode with speed boost on user scroll
  useEffect(() => {
    if (tab !== 'chaos' || !chaosRef.current) return;

    const el = chaosRef.current;
    let animationId: number;
    let lastTime = performance.now();
    let userScrolling = false;
    let userScrollTimeout: NodeJS.Timeout;

    const autoScroll = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      const halfHeight = el.scrollHeight / 2;
      const speed = userScrolling ? 0.15 : 0.05; // Faster when user is scrolling

      el.scrollTop += delta * speed;

      // Loop back when past halfway
      if (el.scrollTop >= halfHeight) {
        el.scrollTop = el.scrollTop - halfHeight;
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    const handleWheel = () => {
      userScrolling = true;
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => {
        userScrolling = false;
      }, 150);
    };

    el.addEventListener('wheel', handleWheel);
    animationId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener('wheel', handleWheel);
      clearTimeout(userScrollTimeout);
    };
  }, [tab]);

  // Double the items for looping animation (was triple — 33% fewer DOM nodes)
  const loopedItems = [...hamieverse, ...hamieverse];
  const scrollItems = Array(scrollMultiplier).fill(hamieverse).flat();

  return (
    <div className="gallery-page-new">
      <div className="gallery-layout-new">
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
              className="gallery-stream-new gallery-stream-scrollable"
              onScroll={speed === 'scroll' ? handleScroll : undefined}
              ref={containerRef}
            >
              <div className="gallery-grid-new">
                {(speed === 'scroll' ? scrollItems : loopedItems).map((item, i) => (
                  <div key={i} className="gallery-card-new" onClick={() => setLightbox(item.src)}>
                    <img src={item.src} alt="" />
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
              className="gallery-stream-new gallery-stream-scrollable"
              onScroll={speed === 'scroll' ? handleScroll : undefined}
              ref={communityRef}
            >
              <div className="gallery-grid-new">
                {(speed === 'scroll'
                  ? Array(scrollMultiplier).fill(communityItems).flat()
                  : [...communityItems, ...communityItems]
                ).map((item, i) => (
                  <div key={i} className="gallery-card-new" onClick={() => setLightbox(item.src)}>
                    <img src={item.src} alt="" />
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
            <div className="gallery-chaos-feed" ref={chaosRef}>
              <div className="chaos-scroll-wrapper">
                {/* First copy */}
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
                {/* Second copy for seamless loop */}
                <div className="chaos-scatter-container">
                  {chaosComics.map((comic, i) => (
                    <div
                      key={`dup-${i}`}
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
