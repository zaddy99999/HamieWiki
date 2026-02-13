'use client';

import { useState } from 'react';
import WikiNavbar from '@/components/WikiNavbar';

interface Chapter {
  number: number;
  title: string;
  summary: string;
  spoilerSummary: string;
  characters: string[];
  themes: string[];
}

const loreLinks = [
  {
    type: 'novel',
    title: 'Songs the City Forgot',
    url: 'https://read.hamieverse.com/songs-the-city-forgot',
    description: 'The Novel',
  },
  {
    type: 'comic',
    title: 'Comic #1',
    url: 'https://publuu.com/flip-book/1028492/2277031',
  },
  {
    type: 'comic',
    title: 'Comic #2',
    url: 'https://publuu.com/flip-book/1028492/2289607',
  },
];

const chapters: Chapter[] = [
  {
    number: 1,
    title: "The Numbered Life",
    summary: "We meet Hamie as Worker #146B in Aetherion's factory system. The chapter establishes the oppressive motion-mandated city and hints at memories of a different life.",
    spoilerSummary: "Hamie works the assembly lines, haunted by memories of his grandmother in Virella. The Red Eye surveillance watches constantly. He struggles with the suppression of identity in the City.",
    characters: ['Hamie', 'Grandma (memory)'],
    themes: ['Identity vs Number', 'Motion vs Stillness'],
  },
  {
    number: 2,
    title: "The Overpass",
    summary: "A chance encounter beneath the city overpass changes everything. Hamie receives a mysterious object with hidden significance.",
    spoilerSummary: "The homeless man and his dog Simba live beneath the overpass. He gives Hamie a cracked pendant that contains a hidden bridge chip and USB drive - contraband that could destroy him or set him free.",
    characters: ['Hamie', 'Homeless Man', 'Simba (dog)'],
    themes: ['Memory vs Erasure', 'Contraband'],
  },
  {
    number: 3,
    title: "Section 9 Cleanup",
    summary: "IronPaw enforcers intensify their presence. Workers are interrogated. Something dangerous is being hunted.",
    spoilerSummary: "The homeless man disappears. Workers are questioned about Subject #101B. When Hamie attempts self-dismissal, senior worker #257A intervenes with Protocol Four-Seven-Grey, saving him from a fate worse than termination.",
    characters: ['Hamie', '#257A', 'IronPaws'],
    themes: ['Surveillance', 'Obedience vs Free Will'],
  },
  {
    number: 4,
    title: "Welcome to Undercode",
    summary: "Hamie discovers a hidden digital world operating beneath the City's systems - a shadow economy where attention is power.",
    spoilerSummary: "Using the USB, Hamie accesses the Undercode - a viral ecosystem of echo raids, market manipulation, and echoloops. During the Aethercreed operation, a single click earns him 13,000,000 AC. The alias 'Simba' is born.",
    characters: ['Hamie/Simba'],
    themes: ['Attention as Power', 'Revolution vs Manipulation'],
  },
  {
    number: 5,
    title: "The Respeculators",
    summary: "New players emerge from the shadows. What looks like rebellion may be something else entirely.",
    spoilerSummary: "Sam and Lira run the Respeculators - an elite shadow coalition that poses as rebels but operates as power brokers. They've noticed Simba's meteoric rise and see him as a dangerous new asset. A coded message arrives with an ancient emblem: rendezvous at Neon Spire, midnight.",
    characters: ['Sam', 'Lira', 'Hamie/Simba'],
    themes: ['Love vs Utility', 'Music as Resistance'],
  },
];

export default function ChaptersPage() {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [showSpoilers, setShowSpoilers] = useState<Set<number>>(new Set());

  const toggleChapter = (num: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  };

  const toggleSpoiler = (num: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSpoilers(prev => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'novel': return '📖';
      case 'comic': return '📚';
      default: return '🔗';
    }
  };

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="chapters" />

      <main className="chapters-main">
        <header className="chapters-header">
          <h1>Chapter Summaries</h1>
          <p>Songs the City Forgot - Book One</p>
        </header>

        <div className="chapters-read-section">
          <h2 className="chapters-read-title">Read the Full Story</h2>
          <div className="chapters-links-grid">
            {loreLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`chapters-link-card chapters-link-${link.type}`}
              >
                <span className="chapters-link-icon">{getTypeIcon(link.type)}</span>
                <div className="chapters-link-content">
                  <span className="chapters-link-type">
                    {link.type === 'novel' ? 'Novel' : 'Comic'}
                  </span>
                  <span className="chapters-link-name">{link.title}</span>
                </div>
                <span className="chapters-link-arrow">→</span>
              </a>
            ))}
          </div>
        </div>

        <div className="chapters-warning">
          <span>Warning</span>
          <span>Spoiler warnings are enabled. Click "Show Spoilers" to reveal full details.</span>
        </div>

        <div className="chapters-list">
          {chapters.map(chapter => {
            const isExpanded = expandedChapters.has(chapter.number);
            const showingSpoiler = showSpoilers.has(chapter.number);

            return (
              <div
                key={chapter.number}
                className={`chapter-card ${isExpanded ? 'expanded' : ''}`}
              >
                <button
                  className="chapter-header"
                  onClick={() => toggleChapter(chapter.number)}
                >
                  <div className="chapter-number">
                    <span>{chapter.number}</span>
                  </div>
                  <div className="chapter-title-wrap">
                    <h2 className="chapter-title">{chapter.title}</h2>
                    <div className="chapter-themes">
                      {chapter.themes.map((theme, i) => (
                        <span key={i} className="chapter-theme">{theme}</span>
                      ))}
                    </div>
                  </div>
                  <span className="chapter-toggle">{isExpanded ? '−' : '+'}</span>
                </button>

                {isExpanded && (
                  <div className="chapter-content">
                    <div className="chapter-summary">
                      <h3>Summary</h3>
                      <p>{chapter.summary}</p>
                    </div>

                    <div className="chapter-spoiler-section">
                      <button
                        className={`chapter-spoiler-toggle ${showingSpoiler ? 'active' : ''}`}
                        onClick={(e) => toggleSpoiler(chapter.number, e)}
                      >
                        {showingSpoiler ? 'Hide Spoilers' : 'Show Spoilers'}
                      </button>

                      {showingSpoiler && (
                        <div className="chapter-spoiler-content">
                          <p>{chapter.spoilerSummary}</p>
                        </div>
                      )}
                    </div>

                    <div className="chapter-characters">
                      <h3>Featured Characters</h3>
                      <div className="chapter-character-list">
                        {chapter.characters.map((char, i) => (
                          <span key={i} className="chapter-character">{char}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="chapters-tbc">
          <div className="chapters-tbc-icon">📖</div>
          <h3>More chapters coming soon...</h3>
          <p>The story continues in future releases</p>
        </div>
      </main>

      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">© 2024 Hamieverse Wiki</p>
        </div>
      </footer>
    </div>
  );
}
