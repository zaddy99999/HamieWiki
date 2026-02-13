'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import WikiNavbar from '@/components/WikiNavbar';
import Breadcrumb from '@/components/Breadcrumb';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is Hamie\'s worker designation in the City?',
    options: ['#101B', '#146B', '#257A', '#479C'],
    correctIndex: 1,
    category: 'Characters',
  },
  {
    id: '2',
    question: 'What alias does Hamie adopt in the Undercode?',
    options: ['Shadow', 'Simba', 'Phoenix', 'Ghost'],
    correctIndex: 1,
    category: 'Characters',
  },
  {
    id: '3',
    question: 'Who is the leader of the Respeculators?',
    options: ['Lira', 'Kael', 'Sam', 'Orrien'],
    correctIndex: 2,
    category: 'Characters',
  },
  {
    id: '4',
    question: 'What does Lira\'s role in the Respeculators involve?',
    options: ['Tech specialist', 'Skeptical enforcer', 'Information broker', 'Negotiator'],
    correctIndex: 1,
    category: 'Characters',
  },
  {
    id: '5',
    question: 'Where does Hamie\'s grandmother live?',
    options: ['The City', 'Undercode', 'Virella', 'Aetherion HQ'],
    correctIndex: 2,
    category: 'Locations',
  },
  {
    id: '6',
    question: 'What is the Undercode?',
    options: ['A prison', 'A shadow digital ecosystem', 'A factory sector', 'A government office'],
    correctIndex: 1,
    category: 'World',
  },
  {
    id: '7',
    question: 'What protocol does #257A invoke to save Hamie?',
    options: ['Protocol Zero', 'Protocol Four-Seven-Grey', 'Protocol Omega', 'Protocol Shutdown'],
    correctIndex: 1,
    category: 'Lore',
  },
  {
    id: '8',
    question: 'How much does Hamie gain from the Aethercreed operation?',
    options: ['1,000 AC', '100,000 AC', '1,000,000 AC', '13,000,000 AC'],
    correctIndex: 3,
    category: 'Lore',
  },
  {
    id: '9',
    question: 'What is the Doppel Protocol?',
    options: ['A communication tool', 'A forbidden mimic-script', 'A transportation device', 'A weapon system'],
    correctIndex: 1,
    category: 'Technology',
  },
  {
    id: '10',
    question: 'What is Hikari\'s specialty?',
    options: ['Combat', 'Negotiation', 'Code breaking', 'Surveillance'],
    correctIndex: 2,
    category: 'Characters',
  },
  {
    id: '11',
    question: 'What faction is Kael originally from?',
    options: ['Undercode', 'Respeculators', 'IronPaw', 'Aetherion Elite'],
    correctIndex: 2,
    category: 'Characters',
  },
  {
    id: '12',
    question: 'What does the cracked pendant contain?',
    options: ['A photo', 'A bridge chip and USB drive', 'A key', 'Money'],
    correctIndex: 1,
    category: 'Lore',
  },
  {
    id: '13',
    question: 'Who gave Hamie the cracked pendant?',
    options: ['Sam', 'His grandmother', 'A homeless man', 'Lira'],
    correctIndex: 2,
    category: 'Lore',
  },
  {
    id: '14',
    question: 'What is Orrien known for?',
    options: ['Fighting', 'Information brokering', 'Hacking', 'Leadership'],
    correctIndex: 1,
    category: 'Characters',
  },
  {
    id: '15',
    question: 'What symbolizes fleeting freedom in the Veynar prologue?',
    options: ['A bird', 'A butterfly', 'A flower', 'A star'],
    correctIndex: 1,
    category: 'Symbolism',
  },
  {
    id: '16',
    question: 'What is the City known for?',
    options: ['Freedom', 'Motion-mandated surveillance', 'Democracy', 'Peace'],
    correctIndex: 1,
    category: 'World',
  },
  {
    id: '17',
    question: 'What are echo raids in the Undercode?',
    options: ['Sound attacks', 'Viral coordination operations', 'Communication methods', 'Defense systems'],
    correctIndex: 1,
    category: 'Technology',
  },
  {
    id: '18',
    question: 'Who is Ace?',
    options: ['A factory worker', 'An Undercode operative', 'A government official', 'A scientist'],
    correctIndex: 1,
    category: 'Characters',
  },
  {
    id: '19',
    question: 'What happens when the Red Eye in Hamie\'s ceiling flickers?',
    options: ['An alarm sounds', 'It goes dark after the Doppel Protocol', 'It changes color', 'Nothing'],
    correctIndex: 1,
    category: 'Lore',
  },
  {
    id: '20',
    question: 'What is the Neon Spire?',
    options: ['A prison', 'A factory', 'A meeting location', 'A weapon'],
    correctIndex: 2,
    category: 'Locations',
  },
];

function getRandomQuestion(excludeIds: string[] = []): QuizQuestion {
  const available = quizQuestions.filter(q => !excludeIds.includes(q.id));
  if (available.length === 0) {
    // If all questions used, reset and pick any
    return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Load best streak from localStorage
    const saved = localStorage.getItem('quiz-best-streak');
    if (saved) setBestStreak(parseInt(saved));

    // Load first question
    setCurrentQuestion(getRandomQuestion());
  }, []);

  // Keyboard navigation for quiz options
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;

      // Number keys 1-4 or A-D to select answers
      if (!showResult && currentQuestion) {
        const keyMap: Record<string, number> = {
          '1': 0, '2': 1, '3': 2, '4': 3,
          'a': 0, 'b': 1, 'c': 2, 'd': 3,
          'A': 0, 'B': 1, 'C': 2, 'D': 3,
        };
        if (e.key in keyMap) {
          e.preventDefault();
          handleAnswer(keyMap[e.key]);
        }
      }

      // Enter or Space to go to next question when result is showing
      if (showResult && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult, currentQuestion, isAnimating]);

  // Focus management after answer
  useEffect(() => {
    if (showResult && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [showResult]);

  const handleAnswer = useCallback((index: number) => {
    if (showResult || !currentQuestion || isAnimating) return;

    setIsAnimating(true);
    setSelectedAnswer(index);

    // Small delay before showing result for animation
    setTimeout(() => {
      setShowResult(true);
      setTotalAnswered(prev => prev + 1);

      if (index === currentQuestion.correctIndex) {
        setScore(prev => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
          localStorage.setItem('quiz-best-streak', newStreak.toString());
        }
      } else {
        setStreak(0);
      }
      setIsAnimating(false);
    }, 150);
  }, [showResult, currentQuestion, isAnimating, streak, bestStreak]);

  const nextQuestion = useCallback(() => {
    if (!currentQuestion || isAnimating) return;

    setIsAnimating(true);
    const newUsedIds = [...usedQuestionIds, currentQuestion.id];
    setUsedQuestionIds(newUsedIds);

    // Animate out then in
    setTimeout(() => {
      setCurrentQuestion(getRandomQuestion(newUsedIds));
      setSelectedAnswer(null);
      setShowResult(false);
      setIsAnimating(false);
    }, 200);
  }, [currentQuestion, usedQuestionIds, isAnimating]);

  const getOptionClass = (index: number) => {
    if (!currentQuestion) return '';
    if (!showResult) {
      return selectedAnswer === index ? 'selected' : '';
    }
    if (index === currentQuestion.correctIndex) {
      return 'correct';
    }
    if (selectedAnswer === index && index !== currentQuestion.correctIndex) {
      return 'incorrect';
    }
    return '';
  };

  if (!currentQuestion) {
    return (
      <div className="wiki-container">
        <WikiNavbar currentPage="quiz" />
        <div className="quiz-loading">
          <div className="quiz-spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Wiki', href: '/' },
    { label: 'Quiz' },
  ];

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="quiz" />

      <main className="quiz-main" role="main" aria-label="Hamieverse Knowledge Quiz">
        <Breadcrumb items={breadcrumbItems} />

        <div className="quiz-stats-bar" role="status" aria-live="polite">
          <div className="quiz-stat-item">
            <span className="quiz-stat-label">Current Streak</span>
            <span className="quiz-stat-value" aria-label={`Current streak: ${streak}`}>{streak}</span>
          </div>
          <div className="quiz-stat-item">
            <span className="quiz-stat-label">Best Streak</span>
            <span className="quiz-stat-value" aria-label={`Best streak: ${bestStreak}`}>{bestStreak}</span>
          </div>
          <div className="quiz-stat-item">
            <span className="quiz-stat-label">Correct</span>
            <span className="quiz-stat-value" aria-label={`${score} correct out of ${totalAnswered}`}>{score}/{totalAnswered}</span>
          </div>
        </div>

        <div className={`quiz-card ${isAnimating ? 'quiz-card-animating' : ''}`} role="form" aria-labelledby="quiz-question">
          <span className="quiz-category" aria-label={`Category: ${currentQuestion.category}`}>{currentQuestion.category}</span>
          <h2 id="quiz-question" className="quiz-question">{currentQuestion.question}</h2>

          <p className="quiz-keyboard-hint sr-only">Press 1-4 or A-D to select an answer</p>

          <div className="quiz-options" role="radiogroup" aria-labelledby="quiz-question">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                ref={el => { optionRefs.current[index] = el; }}
                className={`quiz-option ${getOptionClass(index)}`}
                onClick={() => handleAnswer(index)}
                disabled={showResult || isAnimating}
                role="radio"
                aria-checked={selectedAnswer === index}
                aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <span className="quiz-option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                <span className="quiz-option-text">{option}</span>
                <span className="quiz-option-key" aria-hidden="true">Press {index + 1}</span>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="quiz-result" role="alert" aria-live="assertive">
              {selectedAnswer === currentQuestion.correctIndex ? (
                <p className="quiz-correct">
                  <span aria-hidden="true">&#10003;</span> Correct! {streak > 1 && `${streak} in a row!`}
                </p>
              ) : (
                <p className="quiz-incorrect">
                  <span aria-hidden="true">&#10007;</span> Wrong! The answer was {String.fromCharCode(65 + currentQuestion.correctIndex)}: {currentQuestion.options[currentQuestion.correctIndex]}
                </p>
              )}
              <button
                ref={nextButtonRef}
                onClick={nextQuestion}
                className="quiz-btn primary"
                disabled={isAnimating}
              >
                Next Question
                <span className="quiz-btn-hint" aria-hidden="true">Press Enter</span>
              </button>
            </div>
          )}
        </div>

        <div className="quiz-nav-links">
          <Link href="/faction-quiz" className="quiz-link">Take the Faction Quiz</Link>
          <Link href="/" className="quiz-link">Back to Wiki</Link>
        </div>
      </main>
    </div>
  );
}
