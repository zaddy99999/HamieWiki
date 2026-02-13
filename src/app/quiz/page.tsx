'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface QuizQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  category?: string;
  difficulty?: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('https://zaddytools.vercel.app/api/quiz?gameId=hamieverse');
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions.slice(0, 10)); // Limit to 10 questions
        } else {
          setError('No questions available yet. Check back soon!');
        }
      } catch (err) {
        setError('Failed to load quiz questions');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === currentQuestion.correctAnswer) {
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
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    // Reshuffle
    setQuestions([...questions].sort(() => Math.random() - 0.5));
  };

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? 'selected' : '';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'correct';
    }
    if (selectedAnswer === option && option !== currentQuestion.correctAnswer) {
      return 'incorrect';
    }
    return '';
  };

  if (loading) {
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

  if (error) {
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
        <div className="quiz-error">
          <h2>Quiz Unavailable</h2>
          <p>{error}</p>
          <Link href="/" className="quiz-btn">Back to Wiki</Link>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    if (percentage === 100) message = 'Perfect! You are a true Hamieverse expert!';
    else if (percentage >= 80) message = 'Excellent! You know your lore!';
    else if (percentage >= 60) message = 'Good job! Keep exploring the wiki!';
    else if (percentage >= 40) message = 'Not bad! Time to read more lore!';
    else message = 'Keep studying the Hamieverse!';

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
          {currentQuestion.category && (
            <span className="quiz-category">{currentQuestion.category}</span>
          )}
          <h2 className="quiz-question">{currentQuestion.question}</h2>

          <div className="quiz-options">
            {['A', 'B', 'C', 'D'].map((letter) => {
              const optionKey = `option${letter}` as keyof QuizQuestion;
              const optionText = currentQuestion[optionKey] as string;
              if (!optionText) return null;
              return (
                <button
                  key={letter}
                  className={`quiz-option ${getOptionClass(letter)}`}
                  onClick={() => handleAnswer(letter)}
                  disabled={showResult}
                >
                  <span className="quiz-option-letter">{letter}</span>
                  <span className="quiz-option-text">{optionText}</span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="quiz-result">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <p className="quiz-correct">Correct!</p>
              ) : (
                <p className="quiz-incorrect">
                  Wrong! The answer was {currentQuestion.correctAnswer}: {currentQuestion[`option${currentQuestion.correctAnswer}` as keyof QuizQuestion]}
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
