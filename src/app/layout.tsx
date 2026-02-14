import type { Metadata } from 'next';
import './globals.css';
/**
 * All theme CSS files are imported upfront to enable instant theme switching.
 * Each theme contains unique visual effects (scanlines, animations, overlays)
 * beyond just CSS variable overrides, making lazy loading impractical.
 * Total: ~254KB uncompressed (~30-40KB gzipped). This is acceptable for the UX benefit
 * of instant switching without layout shifts or loading delays.
 *
 * If bundle size becomes critical, consider:
 * 1. Extracting shared animation/effect code to a common file
 * 2. Using CSS-in-JS with dynamic imports (but loses SSR benefits)
 * 3. Keeping only 2-3 most popular themes pre-loaded
 */
import '@/styles/theme-neon.css';
import '@/styles/theme-brutalist.css';
import '@/styles/theme-arcade.css';
import '@/styles/theme-retro.css';
import '@/styles/theme-matrix.css';
import '@/styles/theme-cyberpunk.css';
import '@/styles/theme-volcanic.css';
import '@/styles/theme-candy.css';
import '@/styles/theme-hacker.css';
import '@/styles/premium-polish.css';
import HelpChat from '@/components/HelpChat';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import BackToTop from '@/components/BackToTop';
import EasterEggs from '@/components/EasterEggs';

export const metadata: Metadata = {
  title: 'Hamieverse Wiki',
  description: 'The comprehensive guide to the Hamieverse saga',
  icons: {
    icon: '/images/hamiepfp.png',
    apple: '/images/hamiepfp.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var keywords = ['MetaMask', 'ethereum', 'inpage.js', 'chrome-extension', 'User rejected', 'wallet'];
                function shouldSuppress(str) {
                  if (!str) return false;
                  str = String(str);
                  for (var i = 0; i < keywords.length; i++) {
                    if (str.indexOf(keywords[i]) > -1) return true;
                  }
                  return false;
                }
                window.addEventListener('error', function(e) {
                  if (shouldSuppress(e.message) || shouldSuppress(e.filename)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  if (shouldSuppress(e.reason)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                var origError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments);
                  if (shouldSuppress(args.join(' '))) return;
                  origError.apply(console, args);
                };
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body>
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Cyberpunk Background System */}
        <div className="wiki-bg-effects">
          {/* Glowing Orbs */}
          <div className="wiki-orb wiki-orb-1" />
          <div className="wiki-orb wiki-orb-2" />
          <div className="wiki-orb wiki-orb-3" />

          {/* Aurora Effect */}
          <div className="wiki-aurora" />

          {/* Neon Grid Floor */}
          <div className="wiki-neon-grid" />

          {/* Holographic Shimmer */}
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

        {/* Rising Particles with Trails */}
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

        {/* Scan Lines Overlay */}
        <div className="wiki-scanlines" />


        {children}

        {/* Help Chat */}
        <HelpChat />

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Back to Top Button */}
        <BackToTop />

        {/* Easter Eggs */}
        <EasterEggs />
      </body>
    </html>
  );
}
