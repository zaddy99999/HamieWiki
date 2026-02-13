'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WikiNavbar from '@/components/WikiNavbar';

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

  useEffect(() => {
    // Load best streak from localStorage
    const saved = localStorage.getItem('quiz-best-streak');
    if (saved) setBestStreak(parseInt(saved));

    // Load first question
    setCurrentQuestion(getRandomQuestion());
  }, []);

  const handleAnswer = (index: number) => {
    if (showResult || !currentQuestion) return;
    setSelectedAnswer(index);
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
  };

  const nextQuestion = () => {
    if (!currentQuestion) return;

    const newUsedIds = [...usedQuestionIds, currentQuestion.id];
    setUsedQuestionIds(newUsedIds);
    setCurrentQuestion(getRandomQuestion(newUsedIds));
    setSelectedAnswer(null);
    setShowResult(false);
  };

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

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="quiz" />

      <main className="quiz-main">
        <div className="quiz-stats-bar">
          <div className="quiz-stat-item">
            <span className="quiz-stat-label">Current Streak</span>
            <span className="quiz-stat-value">{streak}</span>
          </div>
          <div className="quiz-stat-item">
            <span className="quiz-stat-label">Best Streak</span>
            <span className="quiz-stat-value">{bestStreak}</span>
          </div>
          <div className="quiz-stat-item">
            <span className="quiz-stat-label">Correct</span>
            <span className="quiz-stat-value">{score}/{totalAnswered}</span>
          </div>
        </div>

        <div className="quiz-card">
          <span className="quiz-category">{currentQuestion.category}</span>
          <h2 className="quiz-question">{currentQuestion.question}</h2>

          <div className="quiz-options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`quiz-option ${getOptionClass(index)}`}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
              >
                <span className="quiz-option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="quiz-option-text">{option}</span>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="quiz-result">
              {selectedAnswer === currentQuestion.correctIndex ? (
                <p className="quiz-correct">Correct! {streak > 1 && `${streak} in a row!`}</p>
              ) : (
                <p className="quiz-incorrect">
                  Wrong! The answer was {String.fromCharCode(65 + currentQuestion.correctIndex)}: {currentQuestion.options[currentQuestion.correctIndex]}
                </p>
              )}
              <button onClick={nextQuestion} className="quiz-btn primary">
                Next Question
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
