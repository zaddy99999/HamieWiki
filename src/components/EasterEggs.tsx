'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Konami Code: up, up, down, down, left, right, left, right, b, a
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

// Secret code for Hamie: h-a-m-i-e
const HAMIE_CODE = ['h', 'a', 'm', 'i', 'e'];

export default function EasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [hamieIndex, setHamieIndex] = useState(0);
  const [showKonamiEgg, setShowKonamiEgg] = useState(false);
  const [showHamieEgg, setShowHamieEgg] = useState(false);
  const [hamieClicks, setHamieClicks] = useState(0);
  const [showSecretMessage, setShowSecretMessage] = useState(false);

  // Track footer clicks
  useEffect(() => {
    const handleFooterClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.wiki-footer')) {
        setHamieClicks(prev => {
          const newCount = prev + 1;
          if (newCount >= 7) {
            setShowSecretMessage(true);
            return 0;
          }
          return newCount;
        });
      }
    };

    document.addEventListener('click', handleFooterClick);
    return () => document.removeEventListener('click', handleFooterClick);
  }, []);

  // Keyboard code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tagName = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) return;

      // Check Konami code
      if (e.key === KONAMI_CODE[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === KONAMI_CODE.length) {
          setShowKonamiEgg(true);
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else if (e.key === KONAMI_CODE[0]) {
        setKonamiIndex(1);
      } else {
        setKonamiIndex(0);
      }

      // Check Hamie code
      if (e.key.toLowerCase() === HAMIE_CODE[hamieIndex]) {
        const nextIndex = hamieIndex + 1;
        if (nextIndex === HAMIE_CODE.length) {
          setShowHamieEgg(true);
          setHamieIndex(0);
        } else {
          setHamieIndex(nextIndex);
        }
      } else if (e.key.toLowerCase() === HAMIE_CODE[0]) {
        setHamieIndex(1);
      } else {
        setHamieIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, hamieIndex]);

  // Auto-hide secret message
  useEffect(() => {
    if (showSecretMessage) {
      const timer = setTimeout(() => setShowSecretMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSecretMessage]);

  return (
    <>
      {/* Konami Code Easter Egg - Matrix Rain */}
      {showKonamiEgg && (
        <div className="easter-egg-overlay konami" onClick={() => setShowKonamiEgg(false)}>
          <div className="matrix-rain">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="matrix-column"
                style={{
                  left: `${(i / 30) * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <span key={j} style={{ animationDelay: `${j * 0.1}s` }}>
                    {String.fromCharCode(0x30A0 + Math.random() * 96)}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="easter-egg-content">
            <div className="easter-egg-icon">🎮</div>
            <h2>KONAMI CODE ACTIVATED!</h2>
            <p>You discovered the secret code!</p>
            <p className="easter-egg-hint">+30 Lives Added to your Wiki Journey</p>
          </div>
        </div>
      )}

      {/* Hamie Code Easter Egg */}
      {showHamieEgg && (
        <div className="easter-egg-overlay hamie" onClick={() => setShowHamieEgg(false)}>
          <div className="hamie-celebration">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="hamie-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random()}s`,
                  backgroundColor: ['#0446F1', '#AE4DAF', '#FFFFFF', '#0446F1'][Math.floor(Math.random() * 4)],
                }}
              />
            ))}
          </div>
          <div className="easter-egg-content">
            <div className="easter-egg-icon bounce">
              <Image src="/images/hamiepfp.png" alt="Hamie" width={120} height={120} className="hamie-egg-avatar" />
            </div>
            <h2>HAMIE MODE ACTIVATED!</h2>
            <p>You found the secret Hamie code!</p>
            <p className="easter-egg-quote">"The City remembers those who seek."</p>
          </div>
        </div>
      )}

      {/* Secret footer message */}
      {showSecretMessage && (
        <div className="secret-message">
          <span>The Undercode whispers: "Worker #146B was here..."</span>
        </div>
      )}
    </>
  );
}
