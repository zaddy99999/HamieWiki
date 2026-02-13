'use client';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'character-card' | 'list-item';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className = ''
}: SkeletonProps) {
  const elements = Array.from({ length: count }, (_, i) => i);

  const getStyles = () => {
    const styles: React.CSSProperties = {};
    if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
    if (height) styles.height = typeof height === 'number' ? `${height}px` : height;
    return styles;
  };

  return (
    <>
      {elements.map((_, index) => (
        <div
          key={index}
          className={`skeleton skeleton-${variant} ${className}`}
          style={getStyles()}
          role="presentation"
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function CharacterCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-character-card" role="presentation" aria-hidden="true">
          <div className="skeleton-avatar skeleton-pulse" />
          <div className="skeleton-content">
            <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '70%' }} />
            <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '50%', height: '12px' }} />
          </div>
        </div>
      ))}
    </>
  );
}

export function FactionCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-faction-card" role="presentation" aria-hidden="true">
          <div className="skeleton-faction-header skeleton-pulse" />
          <div className="skeleton-faction-body">
            <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '100%' }} />
            <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '80%' }} />
            <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </>
  );
}

export function LocationCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-location-card" role="presentation" aria-hidden="true">
          <div className="skeleton-location-icon skeleton-pulse" />
          <div className="skeleton-location-content">
            <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '60%' }} />
            <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '100%', height: '40px' }} />
            <div className="skeleton-location-tags">
              <div className="skeleton skeleton-tag skeleton-pulse" />
              <div className="skeleton skeleton-tag skeleton-pulse" />
              <div className="skeleton skeleton-tag skeleton-pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function QuizSkeleton() {
  return (
    <div className="skeleton-quiz" role="presentation" aria-hidden="true">
      <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '40%', marginBottom: '16px' }} />
      <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '90%', height: '24px' }} />
      <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '80%', height: '24px' }} />
      <div className="skeleton-quiz-options">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton skeleton-option skeleton-pulse" />
        ))}
      </div>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="skeleton-page" role="alert" aria-busy="true" aria-label="Loading content">
      <div className="skeleton-page-header">
        <div className="skeleton skeleton-title skeleton-pulse" />
        <div className="skeleton skeleton-text skeleton-pulse" style={{ width: '60%' }} />
      </div>
      <div className="skeleton-page-grid">
        <CharacterCardSkeleton count={8} />
      </div>
    </div>
  );
}
