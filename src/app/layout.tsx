import type { Metadata } from 'next';
import './globals.css';
import '@/styles/theme-neon.css';
import '@/styles/theme-glass.css';
import '@/styles/theme-brutalist.css';
import '@/styles/theme-arcade.css';
import '@/styles/theme-minimal.css';
import '@/styles/theme-retro.css';
import '@/styles/theme-matrix.css';
import '@/styles/theme-sunset.css';
import '@/styles/theme-ocean.css';
import '@/styles/theme-cyberpunk.css';
import '@/styles/theme-forest.css';
import '@/styles/theme-midnight.css';
import '@/styles/theme-cherry.css';
import '@/styles/theme-steampunk.css';
import '@/styles/theme-ice.css';
import '@/styles/theme-volcanic.css';
import '@/styles/theme-noir.css';
import '@/styles/theme-candy.css';
import '@/styles/theme-hacker.css';
import '@/styles/premium-polish.css';
import HelpChat from '@/components/HelpChat';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import MusicPlayer from '@/components/MusicPlayer';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';
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

        {/* Cyber Corner Accents */}
        <div className="wiki-cyber-corner wiki-cyber-corner-tl" />
        <div className="wiki-cyber-corner wiki-cyber-corner-tr" />
        <div className="wiki-cyber-corner wiki-cyber-corner-bl" />
        <div className="wiki-cyber-corner wiki-cyber-corner-br" />

        {/* Scan Lines Overlay */}
        <div className="wiki-scanlines" />

        {/* Scroll Progress Indicator */}
        <ScrollProgress />

        {children}

        {/* Help Chat */}
        <HelpChat />

        {/* Music Player */}
        <MusicPlayer />

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Back to Top Button */}
        <BackToTop />

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp />

        {/* Easter Eggs */}
        <EasterEggs />
      </body>
    </html>
  );
}
