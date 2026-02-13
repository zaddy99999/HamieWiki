'use client';

import Link from 'next/link';

export default function QuizTeaser() {
  return (
    <div className="quiz-teaser-card">
      <div className="quiz-teaser-icon">🧠</div>
      <h3 className="quiz-teaser-title">Take a Quiz</h3>
      <p className="quiz-teaser-desc">
        Test your Hamieverse knowledge or discover which faction you belong to!
      </p>
      <div className="quiz-teaser-buttons">
        <Link href="/quiz" className="quiz-teaser-btn">
          Trivia Quiz
        </Link>
        <Link href="/faction-quiz" className="quiz-teaser-btn faction">
          Faction Quiz
        </Link>
      </div>
    </div>
  );
}
