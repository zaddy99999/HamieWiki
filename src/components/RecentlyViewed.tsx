'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentlyViewed, RecentItem } from '@/hooks/useRecentlyViewed';
import { PersonIcon, LocationIcon, DocumentIcon } from './Icons';

interface RecentlyViewedProps {
  currentType?: string;
  currentId?: string;
  maxShow?: number;
  compact?: boolean;
}

export default function RecentlyViewed({
  currentType,
  currentId,
  maxShow = 5,
  compact = false
}: RecentlyViewedProps) {
  const { items, isLoaded, getItemsExcluding, clearAll } = useRecentlyViewed();

  if (!isLoaded) return null;

  const displayItems = currentType && currentId
    ? getItemsExcluding(currentType, currentId).slice(0, maxShow)
    : items.slice(0, maxShow);

  if (displayItems.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Compact horizontal version
  if (compact) {
    return (
      <div className="recently-viewed-compact">
        <span className="recently-viewed-compact-label">Recent:</span>
        {displayItems.map((item, i) => (
          <Link
            key={`${item.type}-${item.id}-${i}`}
            href={item.path}
            className="recently-viewed-compact-item"
            title={item.name}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={28}
                height={28}
                className="recently-viewed-compact-avatar"
                unoptimized={item.image.endsWith('.gif')}
              />
            ) : (
              <span className="recently-viewed-compact-placeholder">{item.name.charAt(0)}</span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="recently-viewed">
      <div className="recently-viewed-header">
        <h3>Recently Viewed</h3>
        {displayItems.length > 0 && (
          <button className="recently-viewed-clear" onClick={clearAll}>
            Clear
          </button>
        )}
      </div>
      <div className="recently-viewed-list">
        {displayItems.map((item, i) => (
          <Link
            key={`${item.type}-${item.id}-${i}`}
            href={item.path}
            className="recently-viewed-item"
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={32}
                height={32}
                className="recently-viewed-avatar"
                unoptimized={item.image.endsWith('.gif')}
              />
            ) : (
              <div className="recently-viewed-placeholder">
                {item.type === 'character' ? <PersonIcon size={16} /> : item.type === 'location' ? <LocationIcon size={16} /> : <DocumentIcon size={16} />}
              </div>
            )}
            <div className="recently-viewed-info">
              <span className="recently-viewed-name">{item.name}</span>
              <span className="recently-viewed-time">{formatTime(item.viewedAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Hook to track page views
export function useTrackPageView(
  type: 'character' | 'location' | 'page',
  id: string,
  name: string,
  path: string,
  image?: string
) {
  const { addItem } = useRecentlyViewed();

  useEffect(() => {
    addItem({ type, id, name, path, image });
  }, [type, id, name, path, image, addItem]);
}
