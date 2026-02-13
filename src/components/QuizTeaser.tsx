'use client';

import Link from 'next/link';

export default function QuizTeaser() {
  return (
    <div className="quiz-teaser-card">
      <div className="quiz-teaser-icon">🧠</div>
      <h3 className="quiz-teaser-title">Test Your Knowledge</h3>
      <p className="quiz-teaser-desc">
        Think you know the Hamieverse? Take the quiz and prove it!
      </p>
      <div className="quiz-teaser-stats">
        <span className="quiz-teaser-stat">
          <strong>20</strong> Questions
        </span>
        <span className="quiz-teaser-stat">
          <strong>10</strong> Per Round
        </span>
      </div>
      <Link href="/quiz" className="quiz-teaser-btn">
        Start Quiz
      </Link>
    </div>
  );
}
