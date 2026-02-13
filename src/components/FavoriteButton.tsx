'use client';

import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  characterId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoriteButton({ characterId, size = 'md', showLabel = false }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const favorited = isFavorite(characterId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(characterId);
  };

  if (!isLoaded) {
    return (
      <button className={`favorite-btn favorite-btn-${size} favorite-loading`} disabled>
        <span className="favorite-icon">♡</span>
      </button>
    );
  }

  return (
    <button
      className={`favorite-btn favorite-btn-${size} ${favorited ? 'favorited' : ''}`}
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="favorite-icon">{favorited ? '♥' : '♡'}</span>
      {showLabel && (
        <span className="favorite-label">
          {favorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
}
