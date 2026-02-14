'use client';

import { useState, useEffect } from 'react';
import { getAllCharacters } from '@/lib/hamieverse/characters';

interface Trivia {
  fact: string;
  character?: string;
  category: string;
}

const triviaFacts: Trivia[] = [
  { fact: "Hamie's worker ID is #146B", character: 'hamie', category: 'Characters' },
  { fact: "The City enforces mandatory motion - stillness is seen as a system fault", category: 'World' },
  { fact: "The Undercode uses attention and virality as currency", category: 'World' },
  { fact: "Red Eye cameras provide constant surveillance throughout Aetherion", category: 'World' },
  { fact: "Sam and Lira run the Respeculators, a shadow coalition posing as rebels", character: 'sam', category: 'Factions' },
  { fact: "Hamie gained 13,000,000 AC from a single click during the Aethercreed operation", character: 'hamie', category: 'Lore' },
  { fact: "The Doppel Protocol can temporarily disable surveillance systems", category: 'Technology' },
  { fact: "Worker #257A invoked Protocol Four-Seven-Grey to save Hamie", category: 'Lore' },
  { fact: "In the City, personal names are like contraband - using one signals trust or danger", category: 'World' },
  { fact: "The Beyond is described with warmth: grass, woodsmoke, firelight, roasted crickets", category: 'World' },
  { fact: "Silas watched silently as Alistair Veynar punished emotion as weakness", character: 'silas', category: 'Characters' },
  { fact: "A butterfly symbolizes fleeting freedom in Silas's backstory", character: 'silas', category: 'Motifs' },
  { fact: "The homeless man under the overpass gave Hamie a cracked pendant containing secrets", category: 'Lore' },
  { fact: "Echo raids, viral loops, and echoloops can tank entire markets", category: 'Technology' },
  { fact: "The sunrise mantra is a daily ritual for City workers", category: 'World' },
];

export default function TriviaCard() {
  const [currentTrivia, setCurrentTrivia] = useState<Trivia | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const characters = getAllCharacters();

  useEffect(() => {
    // Set initial trivia
    setCurrentTrivia(triviaFacts[Math.floor(Math.random() * triviaFacts.length)]);

    // Rotate every 10 seconds
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentTrivia(triviaFacts[Math.floor(Math.random() * triviaFacts.length)]);
        setIsFlipping(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getNextTrivia = () => {
    setIsFlipping(true);
    setTimeout(() => {
      let newTrivia = triviaFacts[Math.floor(Math.random() * triviaFacts.length)];
      while (newTrivia === currentTrivia && triviaFacts.length > 1) {
        newTrivia = triviaFacts[Math.floor(Math.random() * triviaFacts.length)];
      }
      setCurrentTrivia(newTrivia);
      setIsFlipping(false);
    }, 300);
  };

  if (!currentTrivia) return null;

  const character = currentTrivia.character
    ? characters.find(c => c.id.toLowerCase() === currentTrivia.character!.toLowerCase())
    : null;

  return (
    <div className={`trivia-card ${isFlipping ? 'flipping' : ''}`} onClick={getNextTrivia}>
      <div className="trivia-header">
        <span className="trivia-icon">💡</span>
        <span className="trivia-label">Did You Know?</span>
        <span className="trivia-category">{currentTrivia.category}</span>
      </div>
      <p className="trivia-fact">{currentTrivia.fact}</p>
      {character && (
        <div className="trivia-character">
          Related: <span>{character.displayName}</span>
        </div>
      )}
      <div className="trivia-hint">Click for another fact</div>
    </div>
  );
}
