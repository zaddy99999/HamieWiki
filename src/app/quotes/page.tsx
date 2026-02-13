'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WikiNavbar from '@/components/WikiNavbar';
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
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);

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

  // Quote of the Day - uses date as seed for consistency
  const getQuoteOfTheDay = (): Quote | null => {
    if (allQuotes.length === 0) return null;
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % allQuotes.length;
    return allQuotes[index];
  };

  const quoteOfTheDay = getQuoteOfTheDay();

  // Get random quote
  const getRandomQuote = () => {
    if (allQuotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    setRandomQuote(allQuotes[randomIndex]);
  };

  // Initialize random quote
  useEffect(() => {
    getRandomQuote();
  }, []);

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

  // Group quotes by character
  const charactersWithQuotes = characters.filter(c => c.quotes && c.quotes.length > 0);

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="quotes" />

      {/* Main Content */}
      <main className="quotes-main">
        {/* Header */}
        <header className="quotes-header">
          <div className="wiki-breadcrumb">
            <Link href="/">Wiki</Link>
            <span className="wiki-breadcrumb-sep">/</span>
            <span>Quotes</span>
          </div>
          <h1 className="quotes-title">Character Quotes</h1>
          <p className="quotes-subtitle">Memorable lines from across the Hamieverse</p>
        </header>

        {/* Quote of the Day */}
        {quoteOfTheDay && (
          <section className="qotd-section">
            <div className="qotd-label">Quote of the Day</div>
            <div className="qotd-card" style={{ '--char-color': quoteOfTheDay.characterColor } as React.CSSProperties}>
              <div className="qotd-content">
                {quoteOfTheDay.characterGif && (
                  <Link href={`/character/${quoteOfTheDay.characterId}`} className="qotd-avatar">
                    <img src={`/images/${quoteOfTheDay.characterGif}`} alt={quoteOfTheDay.characterName} />
                  </Link>
                )}
                <div className="qotd-text-wrapper">
                  <blockquote className="qotd-text">"{quoteOfTheDay.text}"</blockquote>
                  <Link href={`/character/${quoteOfTheDay.characterId}`} className="qotd-author">
                    — {quoteOfTheDay.characterName}
                  </Link>
                </div>
              </div>
              <button
                className="quote-copy-btn"
                onClick={() => copyQuote(quoteOfTheDay)}
                title="Copy quote"
              >
                {copiedQuote === quoteOfTheDay.text ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </section>
        )}

        {/* Random Quote Generator */}
        <section className="random-quote-section">
          <div className="random-quote-header">
            <h2>Random Quote</h2>
            <button className="random-quote-btn" onClick={getRandomQuote}>
              Get New Quote
            </button>
          </div>
          {randomQuote && (
            <div className="random-quote-card" style={{ '--char-color': randomQuote.characterColor } as React.CSSProperties}>
              <div className="random-quote-content">
                {randomQuote.characterGif && (
                  <Link href={`/character/${randomQuote.characterId}`} className="random-quote-avatar">
                    <img src={`/images/${randomQuote.characterGif}`} alt={randomQuote.characterName} />
                  </Link>
                )}
                <div className="random-quote-text-wrapper">
                  <blockquote className="random-quote-text">"{randomQuote.text}"</blockquote>
                  <Link href={`/character/${randomQuote.characterId}`} className="random-quote-author">
                    — {randomQuote.characterName}
                  </Link>
                </div>
              </div>
              <button
                className="quote-copy-btn"
                onClick={() => copyQuote(randomQuote)}
                title="Copy quote"
              >
                {copiedQuote === randomQuote.text ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </section>

        {/* Quotes by Character */}
        <section className="quotes-by-character">
          <h2>All Quotes by Character</h2>
          <div className="character-quotes-grid">
            {charactersWithQuotes.map(character => (
              <div
                key={character.id}
                className="character-quotes-card"
                style={{ '--char-color': character.color } as React.CSSProperties}
              >
                <div className="character-quotes-header">
                  <Link href={`/character/${character.id}`} className="character-quotes-avatar-link">
                    {character.gifFile ? (
                      <img
                        src={`/images/${character.gifFile}`}
                        alt={character.displayName}
                        className="character-quotes-avatar"
                      />
                    ) : (
                      <div className="character-quotes-avatar-placeholder">
                        {character.displayName.charAt(0)}
                      </div>
                    )}
                  </Link>
                  <div className="character-quotes-info">
                    <Link href={`/character/${character.id}`} className="character-quotes-name">
                      {character.displayName}
                    </Link>
                    {character.faction && (
                      <span className="character-quotes-faction">{character.faction}</span>
                    )}
                  </div>
                </div>
                <div className="character-quotes-list">
                  {character.quotes?.map((quote, i) => (
                    <div key={i} className="character-quote-item">
                      <blockquote className="character-quote-text">"{quote}"</blockquote>
                      <button
                        className="quote-copy-btn-small"
                        onClick={() => copyQuote({
                          text: quote,
                          characterId: character.id,
                          characterName: character.displayName,
                          characterGif: character.gifFile,
                          characterColor: character.color,
                        })}
                        title="Copy quote"
                      >
                        {copiedQuote === quote ? 'Done' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
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

      {/* Back to Top Button */}
      <button
        className={`wiki-back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <span>Up</span>
      </button>
    </div>
  );
}
