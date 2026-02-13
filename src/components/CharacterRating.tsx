'use client';

import { useState, useEffect } from 'react';

interface CharacterRatingProps {
  characterId: string;
  characterName: string;
}

interface RatingData {
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
}

export default function CharacterRating({ characterId, characterName }: CharacterRatingProps) {
  const [rating, setRating] = useState<RatingData>({ upvotes: 0, downvotes: 0, userVote: null });
  const [isAnimating, setIsAnimating] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    // Load ratings from localStorage
    const stored = localStorage.getItem(`rating_${characterId}`);
    if (stored) {
      try {
        setRating(JSON.parse(stored));
      } catch {
        // Invalid data, use defaults
      }
    } else {
      // Initialize with some base ratings for main characters
      const baseRatings: Record<string, number> = {
        hamie: 42,
        sam: 28,
        lira: 31,
        silas: 19,
        ace: 24,
        hikari: 22,
        kael: 18,
        orrien: 15,
        grandma: 35,
        luna: 20,
      };
      const base = baseRatings[characterId.toLowerCase()] || 5;
      setRating({ upvotes: base, downvotes: Math.floor(base * 0.1), userVote: null });
    }
  }, [characterId]);

  const handleVote = (voteType: 'up' | 'down') => {
    setIsAnimating(voteType);
    setTimeout(() => setIsAnimating(null), 300);

    setRating(prev => {
      let newRating: RatingData;

      if (prev.userVote === voteType) {
        // Remove vote
        newRating = {
          upvotes: voteType === 'up' ? prev.upvotes - 1 : prev.upvotes,
          downvotes: voteType === 'down' ? prev.downvotes - 1 : prev.downvotes,
          userVote: null,
        };
      } else if (prev.userVote) {
        // Change vote
        newRating = {
          upvotes: voteType === 'up' ? prev.upvotes + 1 : prev.upvotes - 1,
          downvotes: voteType === 'down' ? prev.downvotes + 1 : prev.downvotes - 1,
          userVote: voteType,
        };
      } else {
        // New vote
        newRating = {
          upvotes: voteType === 'up' ? prev.upvotes + 1 : prev.upvotes,
          downvotes: voteType === 'down' ? prev.downvotes + 1 : prev.downvotes,
          userVote: voteType,
        };
      }

      localStorage.setItem(`rating_${characterId}`, JSON.stringify(newRating));
      return newRating;
    });
  };

  const score = rating.upvotes - rating.downvotes;
  const percentage = rating.upvotes + rating.downvotes > 0
    ? Math.round((rating.upvotes / (rating.upvotes + rating.downvotes)) * 100)
    : 100;

  return (
    <div className="char-rating">
      <div className="char-rating-header">
        <span className="char-rating-label">Community Rating</span>
        <span className="char-rating-percentage">{percentage}% positive</span>
      </div>

      <div className="char-rating-bar">
        <div
          className="char-rating-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="char-rating-actions">
        <button
          className={`char-rating-btn upvote ${rating.userVote === 'up' ? 'active' : ''} ${isAnimating === 'up' ? 'animating' : ''}`}
          onClick={() => handleVote('up')}
          aria-label={`Upvote ${characterName}`}
        >
          <span className="rating-icon">👍</span>
          <span className="rating-count">{rating.upvotes}</span>
        </button>

        <div className="char-rating-score">
          <span className={`score-value ${score >= 0 ? 'positive' : 'negative'}`}>
            {score >= 0 ? '+' : ''}{score}
          </span>
        </div>

        <button
          className={`char-rating-btn downvote ${rating.userVote === 'down' ? 'active' : ''} ${isAnimating === 'down' ? 'animating' : ''}`}
          onClick={() => handleVote('down')}
          aria-label={`Downvote ${characterName}`}
        >
          <span className="rating-icon">👎</span>
          <span className="rating-count">{rating.downvotes}</span>
        </button>
      </div>

      {rating.userVote && (
        <p className="char-rating-thanks">
          Thanks for rating {characterName}!
        </p>
      )}
    </div>
  );
}
