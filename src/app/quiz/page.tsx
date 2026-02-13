'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    // Shuffle and pick 10 questions
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10));
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  const getOptionClass = (index: number) => {
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

  if (questions.length === 0) {
    return (
      <div className="wiki-container">
        <nav className="wiki-topbar">
          <div className="wiki-topbar-inner">
            <Link href="/" className="wiki-topbar-brand">
              <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-topbar-logo" />
              <span className="wiki-topbar-title">Hamieverse</span>
            </Link>
          </div>
        </nav>
        <div className="quiz-loading">
          <div className="quiz-spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    let emoji = '';
    if (percentage === 100) {
      message = 'Perfect! You are a true Hamieverse expert!';
      emoji = '🏆';
    } else if (percentage >= 80) {
      message = 'Excellent! You know your lore!';
      emoji = '🌟';
    } else if (percentage >= 60) {
      message = 'Good job! Keep exploring the wiki!';
      emoji = '👍';
    } else if (percentage >= 40) {
      message = 'Not bad! Time to read more lore!';
      emoji = '📚';
    } else {
      message = 'Keep studying the Hamieverse!';
      emoji = '🔍';
    }

    return (
      <div className="wiki-container">
        <nav className="wiki-topbar">
          <div className="wiki-topbar-inner">
            <Link href="/" className="wiki-topbar-brand">
              <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-topbar-logo" />
              <span className="wiki-topbar-title">Hamieverse</span>
            </Link>
          </div>
        </nav>
        <div className="quiz-complete">
          <div className="quiz-complete-emoji">{emoji}</div>
          <h1>Quiz Complete!</h1>
          <div className="quiz-score-display">
            <div className="quiz-score-circle">
              <span className="quiz-score-number">{score}</span>
              <span className="quiz-score-total">/ {questions.length}</span>
            </div>
            <p className="quiz-percentage">{percentage}%</p>
          </div>
          <p className="quiz-message">{message}</p>
          <div className="quiz-actions">
            <button onClick={restartQuiz} className="quiz-btn primary">Play Again</button>
            <Link href="/" className="quiz-btn">Back to Wiki</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wiki-container">
      <nav className="wiki-topbar">
        <div className="wiki-topbar-inner">
          <Link href="/" className="wiki-topbar-brand">
            <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-topbar-logo" />
            <span className="wiki-topbar-title">Hamieverse</span>
          </Link>
          <div className="quiz-progress-info">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="quiz-score-inline">Score: {score}</span>
          </div>
        </div>
      </nav>

      <main className="quiz-main">
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
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
                <p className="quiz-correct">Correct!</p>
              ) : (
                <p className="quiz-incorrect">
                  Wrong! The answer was {String.fromCharCode(65 + currentQuestion.correctIndex)}: {currentQuestion.options[currentQuestion.correctIndex]}
                </p>
              )}
              <button onClick={nextQuestion} className="quiz-btn primary">
                {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
