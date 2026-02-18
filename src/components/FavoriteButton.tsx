'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { HeartIcon, HeartFilledIcon } from './Icons';

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

  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 24 : 20;

  if (!isLoaded) {
    return (
      <button className={`favorite-btn favorite-btn-${size} favorite-loading`} disabled>
        <span className="favorite-icon"><HeartIcon size={iconSize} /></span>
      </button>
    );
  }

  return (
    <button
      className={`favorite-btn favorite-btn-${size} ${favorited ? 'favorited' : ''}`}
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      style={{ minWidth: '44px', minHeight: '44px' }}
    >
      <span className="favorite-icon">{favorited ? <HeartFilledIcon size={iconSize} /> : <HeartIcon size={iconSize} />}</span>
      {showLabel && (
        <span className="favorite-label">
          {favorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
}
