'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllCharacters } from '@/lib/hamieverse/characters';

interface Quote {
  text: string;
  characterId: string;
  characterName: string;
  characterGif?: string;
  characterColor?: string;
}

export default function QuotesPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  const characters = getAllCharacters();

  // Build all quotes array
  const allQuotes: Quote[] = characters
    .filter(c => c.quotes && c.quotes.length > 0)
    .flatMap(c =>
      c.quotes!.map(quote => ({
        text: quote,
        characterId: c.id,
        characterName: c.displayName,
        characterGif: c.gifFile,
        characterColor: c.color,
      }))
    );

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyQuote = (quote: Quote) => {
    const textToCopy = `"${quote.text}" - ${quote.characterName}, Hamieverse`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuote(quote.text);
    setTimeout(() => setCopiedQuote(null), 2000);
  };

  const breadcrumbItems = [
    { label: 'Wiki', href: '/' },
    { label: 'Quotes' },
  ];

  return (
    <div className="wiki-container">

      {/* Main Content */}
      <main className="quotes-main" id="main-content" role="main">
        {/* Header */}
        <header className="quotes-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="quotes-title">CHARACTER QUOTES</h1>
          <p className="quotes-subtitle">{allQuotes.length} memorable lines from across the Hamieverse</p>
        </header>

        {/* All Quotes in One Module */}
        <section className="quotes-all-section">
          <div className="quotes-list brutal-card">
            {allQuotes.map((quote, index) => (
              <div
                key={`${quote.characterId}-${index}`}
                className="quote-item"
                style={{ '--char-color': quote.characterColor } as React.CSSProperties}
              >
                <div className="quote-content">
                  {quote.characterGif && (
                    <Link href={`/character/${quote.characterId}`} className="quote-avatar">
                      <img src={`/images/${quote.characterGif}`} alt={quote.characterName} />
                    </Link>
                  )}
                  <div className="quote-text-wrapper">
                    <blockquote className="quote-text">"{quote.text}"</blockquote>
                    <Link href={`/character/${quote.characterId}`} className="quote-author">
                      — {quote.characterName}
                    </Link>
                  </div>
                </div>
                <button
                  className="quote-copy-btn brutal-btn-sm"
                  onClick={() => copyQuote(quote)}
                  title="Copy quote"
                >
                  {copiedQuote === quote.text ? 'COPIED' : 'COPY'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">© 2024 Hamieverse Wiki — Part of the Hamie Saga</p>
          <div className="wiki-footer-links">
            <a href="https://x.com/hamieverse" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://discord.gg/XpheMErdk6" className="wiki-footer-link" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
