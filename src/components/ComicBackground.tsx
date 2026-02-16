'use client';

const COMIC_PAGES = [
  { src: '/comics/comic1.png', top: '50px', left: '-50px', rotate: -8, scale: 0.35 },
  { src: '/comics/comic2.png', top: '100px', right: '-30px', rotate: 6, scale: 0.32 },
  { src: '/comics/comic3.png', top: '450px', left: '-80px', rotate: -4, scale: 0.38 },
  { src: '/comics/comic4.png', top: '500px', right: '-60px', rotate: 10, scale: 0.3 },
  { src: '/comics/comic5.png', top: '850px', left: '20px', rotate: -12, scale: 0.35 },
  { src: '/comics/comic6.png', top: '900px', right: '10px', rotate: 5, scale: 0.33 },
  { src: '/comics/comic7.png', top: '1250px', left: '-40px', rotate: 8, scale: 0.3 },
  { src: '/comics/comic8.png', top: '1300px', right: '-20px', rotate: -7, scale: 0.36 },
  { src: '/comics/comic9.png', top: '1650px', left: '30px', rotate: 11, scale: 0.32 },
  { src: '/comics/comic10.png', top: '1700px', right: '0px', rotate: -5, scale: 0.34 },
  { src: '/comics/comic11.png', top: '2050px', left: '-60px', rotate: 9, scale: 0.35 },
  { src: '/comics/comic12.png', top: '2100px', right: '-40px', rotate: -10, scale: 0.31 },
  { src: '/comics/comic13.png', top: '2450px', left: '10px', rotate: 7, scale: 0.33 },
  { src: '/comics/comic14.png', top: '2500px', right: '20px', rotate: -6, scale: 0.36 },
  { src: '/comics/comic15.png', top: '2850px', left: '-30px', rotate: 12, scale: 0.34 },
];

export default function ComicBackground() {
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
      }}
    >
      {COMIC_PAGES.map((comic, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: comic.top,
            left: comic.left,
            right: comic.right,
            transform: `rotate(${comic.rotate}deg) scale(${comic.scale})`,
            opacity: 0.12,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            style={{
              width: '520px',
              height: '380px',
              overflow: 'hidden',
              border: '5px solid rgba(33,33,33,0.2)',
              boxShadow: '10px 10px 0 rgba(0,0,0,0.12)',
              background: '#1a1a2e',
            }}
          >
            <img
              src={comic.src}
              alt=""
              style={{
                width: '110%',
                height: '110%',
                objectFit: 'cover',
                objectPosition: 'center',
                marginLeft: '-5%',
                marginTop: '-5%',
              }}
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
