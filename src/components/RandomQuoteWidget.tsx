'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCharacters } from '@/lib/hamieverse/characters';
import { DiceIcon, CheckIcon, CopyIcon } from './Icons';

interface Quote {
  text: string;
  character: string;
  characterId: string;
  color?: string;
  image?: string;
}

export default function RandomQuoteWidget() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  const characters = getAllCharacters();

  // Collect all quotes from characters
  const allQuotes: Quote[] = characters
    .filter(c => c.quotes && c.quotes.length > 0)
    .flatMap(c =>
      (c.quotes || []).map(q => ({
        text: q,
        character: c.displayName,
        characterId: c.id,
        color: c.color,
        image: c.gifFile ? `/images/${c.gifFile}` : c.pngFile ? `/images/${c.pngFile}` : undefined,
      }))
    );

  const getRandomQuote = useCallback(() => {
    if (allQuotes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    return allQuotes[randomIndex];
  }, [allQuotes]);

  const refreshQuote = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setIsAnimating(false);
    }, 150);
  }, [getRandomQuote]);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const copyQuote = async () => {
    if (!quote) return;
    try {
      await navigator.clipboard.writeText(`"${quote.text}" - ${quote.character}, Hamieverse`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!quote) return null;

  return (
    <div
      className={`random-quote-widget ${isAnimating ? 'animating' : ''}`}
      style={{ '--char-color': quote.color } as React.CSSProperties}
    >
      <div className="quote-widget-header">
        <span className="quote-widget-icon">💬</span>
        <span className="quote-widget-title">Random Quote</span>
        <button
          className="quote-widget-refresh"
          onClick={refreshQuote}
          title="Get another quote"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <DiceIcon size={20} />
        </button>
      </div>

      <div className="quote-widget-content">
        {quote.image && (
          <Link href={`/character/${quote.characterId}`} className="quote-widget-avatar">
            <Image
              src={quote.image}
              alt={quote.character}
              width={60}
              height={60}
              unoptimized={quote.image.endsWith('.gif')}
            />
          </Link>
        )}
        <div className="quote-widget-text-wrap">
          <p className="quote-widget-text">"{quote.text}"</p>
          <Link href={`/character/${quote.characterId}`} className="quote-widget-author">
            — {quote.character}
          </Link>
        </div>
      </div>

      <div className="quote-widget-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          className="quote-widget-copy"
          onClick={copyQuote}
          title={copied ? 'Copied!' : 'Copy quote'}
          style={{ minHeight: '44px', padding: '10px 16px' }}
        >
          {copied ? <><CheckIcon size={16} /> Copied</> : <><CopyIcon size={16} /> Copy</>}
        </button>
        <Link href="/quotes" className="quote-widget-more" style={{ minHeight: '44px', padding: '10px 16px', display: 'inline-flex', alignItems: 'center' }}>
          View All Quotes
        </Link>
      </div>
    </div>
  );
}
