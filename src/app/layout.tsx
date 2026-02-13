import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hamieverse Wiki',
  description: 'The comprehensive guide to the Hamieverse saga',
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
      </head>
      <body>{children}</body>
    </html>
  );
}
