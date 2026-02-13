'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WikiNavbar from '@/components/WikiNavbar';
import { getAllCharacters, getFactions } from '@/lib/hamieverse/characters';

type FactionKey = 'respeculators' | 'ironpaws' | 'undercode' | 'aetherion' | 'the_beyond' | 'independent';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: Partial<Record<FactionKey, number>>;
  }[];
}

interface FactionResult {
  key: FactionKey;
  name: string;
  description: string;
  traits: string[];
  color: string;
  icon: string;
}

const factionResults: Record<FactionKey, FactionResult> = {
  respeculators: {
    key: 'respeculators',
    name: 'Respeculators',
    description: 'You are a master of influence and strategy. You understand that true power lies not in brute force, but in controlling narratives and steering outcomes from the shadows. You play the long game, accumulating power while maintaining a carefully crafted public image.',
    traits: ['Strategic thinker', 'Influential', 'Pragmatic', 'Charismatic', 'Morally flexible'],
    color: '#9333EA',
    icon: '🎭',
  },
  ironpaws: {
    key: 'ironpaws',
    name: 'IronPaw',
    description: 'You are a guardian of order and structure. Discipline, precision, and protocol define your approach to life. You believe that systems exist for good reason, and that maintaining stability requires unwavering dedication to duty.',
    traits: ['Disciplined', 'Loyal', 'Methodical', 'Authoritative', 'Duty-bound'],
    color: '#1F2937',
    icon: '🛡️',
  },
  undercode: {
    key: 'undercode',
    name: 'Undercode',
    description: 'You thrive in the shadows of the digital realm. Creativity, subversion, and the power of attention are your weapons. You understand that in a world of surveillance, the greatest power is the ability to redirect focus and manipulate flows.',
    traits: ['Creative', 'Rebellious', 'Tech-savvy', 'Adaptable', 'Unconventional'],
    color: '#00D9A5',
    icon: '💻',
  },
  aetherion: {
    key: 'aetherion',
    name: 'Aetherion Elite',
    description: 'You value efficiency, progress, and the greater good of society. You believe that strong leadership and clear hierarchies are necessary to prevent chaos. Order is not oppression—it is the foundation upon which civilizations are built.',
    traits: ['Ambitious', 'Organized', 'Results-driven', 'Traditional', 'Pragmatic'],
    color: '#EF4444',
    icon: '🏛️',
  },
  the_beyond: {
    key: 'the_beyond',
    name: 'The Beyond',
    description: 'You carry the wisdom of the old ways. Connection to nature, community bonds, and ancestral knowledge guide your path. You see what the City has lost, and you hold onto the memories and traditions that define what it truly means to be alive.',
    traits: ['Wise', 'Nurturing', 'Connected to nature', 'Traditional', 'Community-focused'],
    color: '#F472B6',
    icon: '🌿',
  },
  independent: {
    key: 'independent',
    name: 'Independent',
    description: 'You walk your own path, beholden to no faction or ideology. Information flows through you like water, and you trade in secrets and connections. Your loyalty is your own, and your survival depends on playing all sides without being caught.',
    traits: ['Self-reliant', 'Neutral', 'Resourceful', 'Secretive', 'Opportunistic'],
    color: '#F59E0B',
    icon: '🔮',
  },
};

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'A friend asks you to help them with something that could get you both in trouble. What do you do?',
    options: [
      { text: 'Weigh the risks and benefits carefully before committing', scores: { respeculators: 2, independent: 1 } },
      { text: 'Report the situation to the proper authorities', scores: { ironpaws: 2, aetherion: 1 } },
      { text: 'Help immediately—loyalty matters more than rules', scores: { undercode: 2, the_beyond: 1 } },
      { text: 'Suggest a safer alternative that achieves the same goal', scores: { aetherion: 1, respeculators: 1, independent: 1 } },
    ],
  },
  {
    id: 2,
    question: 'What motivates you most in life?',
    options: [
      { text: 'Power and influence over outcomes', scores: { respeculators: 2, aetherion: 1 } },
      { text: 'Maintaining order and stability', scores: { ironpaws: 2, aetherion: 1 } },
      { text: 'Freedom and creative expression', scores: { undercode: 2, independent: 1 } },
      { text: 'Protecting and nurturing those I love', scores: { the_beyond: 2, undercode: 1 } },
    ],
  },
  {
    id: 3,
    question: 'You discover information that could help many people but would harm the system. What do you do?',
    options: [
      { text: 'Use it strategically to gain leverage', scores: { respeculators: 2, independent: 2 } },
      { text: 'Suppress it—stability matters more than truth', scores: { ironpaws: 2, aetherion: 2 } },
      { text: 'Spread it far and wide through underground channels', scores: { undercode: 3 } },
      { text: 'Share it carefully with those who need it most', scores: { the_beyond: 2, independent: 1 } },
    ],
  },
  {
    id: 4,
    question: 'How do you prefer to solve conflicts?',
    options: [
      { text: 'Through negotiation and manipulation of perceptions', scores: { respeculators: 2, independent: 1 } },
      { text: 'Through established protocols and chain of command', scores: { ironpaws: 2, aetherion: 1 } },
      { text: 'Through creative disruption and misdirection', scores: { undercode: 2, respeculators: 1 } },
      { text: 'Through empathy and understanding root causes', scores: { the_beyond: 2, independent: 1 } },
    ],
  },
  {
    id: 5,
    question: 'What kind of environment do you thrive in?',
    options: [
      { text: 'Boardrooms and places of power and decision-making', scores: { respeculators: 2, aetherion: 2 } },
      { text: 'Structured environments with clear hierarchies', scores: { ironpaws: 3 } },
      { text: 'Digital spaces and underground networks', scores: { undercode: 3 } },
      { text: 'Natural settings far from artificial systems', scores: { the_beyond: 3 } },
      { text: 'Anywhere I can gather and trade information', scores: { independent: 3 } },
    ],
  },
  {
    id: 6,
    question: 'Someone betrays your trust. How do you respond?',
    options: [
      { text: 'Plan a calculated response that serves my interests', scores: { respeculators: 2, independent: 1 } },
      { text: 'Follow proper procedures for dealing with traitors', scores: { ironpaws: 2, aetherion: 1 } },
      { text: 'Expose them through viral means so everyone knows', scores: { undercode: 2, respeculators: 1 } },
      { text: 'Distance myself but hold no grudge—karma will handle it', scores: { the_beyond: 2, independent: 1 } },
    ],
  },
  {
    id: 7,
    question: 'What is your view on rules and authority?',
    options: [
      { text: 'Rules are tools—useful when they serve my purposes', scores: { respeculators: 2, independent: 2 } },
      { text: 'Rules create the foundation of a functioning society', scores: { ironpaws: 2, aetherion: 2 } },
      { text: 'Rules are meant to be broken, hacked, and subverted', scores: { undercode: 3 } },
      { text: 'Traditional wisdom matters more than written laws', scores: { the_beyond: 2, independent: 1 } },
    ],
  },
  {
    id: 8,
    question: 'You have access to resources others desperately need. What do you do?',
    options: [
      { text: 'Leverage them for favors and alliances', scores: { respeculators: 2, independent: 2 } },
      { text: 'Distribute them through official channels', scores: { ironpaws: 1, aetherion: 2 } },
      { text: 'Create a decentralized system to share anonymously', scores: { undercode: 3 } },
      { text: 'Give freely to those who need it most', scores: { the_beyond: 3 } },
    ],
  },
  {
    id: 9,
    question: 'How do you feel about surveillance and control?',
    options: [
      { text: 'Useful tools if I am the one controlling them', scores: { respeculators: 2, aetherion: 1 } },
      { text: 'Necessary for maintaining peace and order', scores: { ironpaws: 2, aetherion: 2 } },
      { text: 'Oppressive systems that must be dismantled', scores: { undercode: 3 } },
      { text: 'Artificial constructs disconnected from real life', scores: { the_beyond: 2, independent: 1 } },
    ],
  },
  {
    id: 10,
    question: 'What legacy do you want to leave behind?',
    options: [
      { text: 'A web of influence that shapes the world for generations', scores: { respeculators: 3 } },
      { text: 'A well-ordered system that runs perfectly', scores: { ironpaws: 2, aetherion: 2 } },
      { text: 'A revolution that changed everything', scores: { undercode: 3 } },
      { text: 'Stories and wisdom passed down through generations', scores: { the_beyond: 3 } },
      { text: 'Being known as someone who played by their own rules', scores: { independent: 3 } },
    ],
  },
];

const STORAGE_KEY = 'hamieverse-faction-quiz-result';

export default function FactionQuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<FactionKey, number>>({
    respeculators: 0,
    ironpaws: 0,
    undercode: 0,
    aetherion: 0,
    the_beyond: 0,
    independent: 0,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [result, setResult] = useState<FactionResult | null>(null);
  const [factionCharacters, setFactionCharacters] = useState<{ id: string; displayName: string; gifFile?: string }[]>([]);
  const [previousResult, setPreviousResult] = useState<FactionResult | null>(null);
  const [showPreviousResult, setShowPreviousResult] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // Load previous result from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.factionKey && factionResults[parsed.factionKey as FactionKey]) {
          setPreviousResult(factionResults[parsed.factionKey as FactionKey]);
          setShowPreviousResult(true);
        }
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  const currentQuestion = quizQuestions[currentIndex];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const option = currentQuestion.options[index];

    // Update scores
    const newScores = { ...scores };
    Object.entries(option.scores).forEach(([faction, score]) => {
      newScores[faction as FactionKey] += score;
    });
    setScores(newScores);

    // Move to next question after a delay
    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        // Calculate result
        const sortedFactions = Object.entries(newScores).sort(([, a], [, b]) => b - a);
        const topFaction = sortedFactions[0][0] as FactionKey;
        const finalResult = factionResults[topFaction];
        setResult(finalResult);
        setQuizComplete(true);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          factionKey: topFaction,
          scores: newScores,
          timestamp: Date.now(),
        }));

        // Load characters for this faction
        const allChars = getAllCharacters();
        const factionMapping: Record<FactionKey, string[]> = {
          respeculators: ['Respeculators'],
          ironpaws: ['IronPaw', 'The City'],
          undercode: ['Undercode'],
          aetherion: ['Aetherion Elite'],
          the_beyond: ['The Beyond'],
          independent: ['Independent'],
        };

        const matchingChars = allChars.filter(c =>
          c.faction && factionMapping[topFaction].some(f =>
            c.faction!.toLowerCase().includes(f.toLowerCase())
          )
        ).slice(0, 4);

        setFactionCharacters(matchingChars);
      }
    }, 600);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScores({
      respeculators: 0,
      ironpaws: 0,
      undercode: 0,
      aetherion: 0,
      the_beyond: 0,
      independent: 0,
    });
    setSelectedAnswer(null);
    setQuizComplete(false);
    setResult(null);
    setFactionCharacters([]);
    setShowPreviousResult(false);
    setPreviousResult(null);
  };

  const shareResult = async () => {
    if (!result) return;

    const text = `I belong to the ${result.name} faction in the Hamieverse! ${result.icon}\n\nTake the quiz to find your faction: ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Hamieverse Faction',
          text: text,
        });
      } catch (err) {
        // User cancelled or error, fall back to clipboard
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(null), 2000);
    }).catch(() => {
      setShareMessage('Could not copy to clipboard');
      setTimeout(() => setShareMessage(null), 2000);
    });
  };

  // Show previous result screen
  if (showPreviousResult && previousResult && !quizComplete) {
    return (
      <div className="wiki-container">
        <WikiNavbar currentPage="quiz" />

        <main className="faction-quiz-main">
          <div className="faction-quiz-previous">
            <div className="faction-quiz-previous-icon" style={{ color: previousResult.color }}>
              {previousResult.icon}
            </div>
            <h2>Welcome back!</h2>
            <p className="faction-quiz-previous-text">
              You previously discovered you belong to the <strong style={{ color: previousResult.color }}>{previousResult.name}</strong> faction.
            </p>
            <div className="faction-quiz-actions">
              <button onClick={restartQuiz} className="quiz-btn primary">
                Retake Quiz
              </button>
              <Link href="/quiz" className="quiz-btn">
                Try Trivia Quiz
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results screen
  if (quizComplete && result) {
    return (
      <div className="wiki-container">
        <WikiNavbar currentPage="quiz" />

        <main className="faction-quiz-main">
          <div className="faction-quiz-result">
            <div className="faction-quiz-result-header">
              <span className="faction-quiz-result-label">Your faction is...</span>
              <div className="faction-quiz-result-icon" style={{
                background: `linear-gradient(135deg, ${result.color}22, ${result.color}44)`,
                borderColor: result.color,
              }}>
                {result.icon}
              </div>
              <h1 className="faction-quiz-result-name" style={{ color: result.color }}>
                {result.name}
              </h1>
            </div>

            <p className="faction-quiz-result-desc">{result.description}</p>

            <div className="faction-quiz-traits">
              <h3>Your Traits</h3>
              <div className="faction-quiz-trait-list">
                {result.traits.map((trait, i) => (
                  <span
                    key={i}
                    className="faction-quiz-trait"
                    style={{ borderColor: result.color, color: result.color }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {factionCharacters.length > 0 && (
              <div className="faction-quiz-characters">
                <h3>Characters from your faction</h3>
                <div className="faction-quiz-character-list">
                  {factionCharacters.map(char => (
                    <Link
                      key={char.id}
                      href={`/character/${char.id}`}
                      className="faction-quiz-character"
                    >
                      {char.gifFile ? (
                        <img
                          src={`/images/characters/${char.gifFile}`}
                          alt={char.displayName}
                          className="faction-quiz-character-img"
                        />
                      ) : (
                        <div className="faction-quiz-character-placeholder" style={{ background: result.color }}>
                          {char.displayName[0]}
                        </div>
                      )}
                      <span className="faction-quiz-character-name">{char.displayName}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="faction-quiz-share">
              <button onClick={shareResult} className="faction-quiz-share-btn" style={{ background: result.color }}>
                Share Your Result
              </button>
              {shareMessage && <span className="faction-quiz-share-message">{shareMessage}</span>}
            </div>

            <div className="faction-quiz-actions">
              <button onClick={restartQuiz} className="quiz-btn primary">
                Take Again
              </button>
              <Link href="/factions" className="quiz-btn">
                Explore Factions
              </Link>
              <Link href="/quiz" className="quiz-btn">
                Try Trivia Quiz
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="quiz" />

      <main className="faction-quiz-main">
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>

        <div className="faction-quiz-card">
          <span className="faction-quiz-category">Personality Question</span>
          <h2 className="quiz-question">{currentQuestion.question}</h2>

          <div className="quiz-options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="quiz-option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="quiz-option-text">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="faction-quiz-hint">
          <p>Answer honestly - there are no wrong answers!</p>
        </div>
      </main>
    </div>
  );
}
