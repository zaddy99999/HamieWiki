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
import '@/styles/theme-brutalist.css';
import '@/styles/theme-arcade.css';
import '@/styles/premium-polish.css';
import '@/styles/mobile-fix.css';
import BackToTop from '@/components/BackToTop';
import EasterEggs from '@/components/EasterEggs';
import Sidebar from '@/components/Sidebar';
import PaletteSelector from '@/components/PaletteSelector';
import Providers from './providers';

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
    <html lang="en" data-theme="brutalist">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
        <Providers>
          {/* Skip to main content for accessibility */}
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>

          {/* Sidebar Navigation */}
          <Sidebar />

          {children}

          {/* Back to Top Button */}
          <BackToTop />

          {/* Color Palette Selector */}
          <PaletteSelector />

          {/* Easter Eggs */}
          <EasterEggs />
        </Providers>
      </body>
    </html>
  );
}
