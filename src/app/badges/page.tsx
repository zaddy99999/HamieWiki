'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import BadgeNotification from '@/components/BadgeNotification';
import { useBadges, BADGE_DEFINITIONS } from '@/hooks/useBadges';
import { LockIcon, BookIcon, TargetIcon, CompassIcon, CopyIcon, StarIcon, BrainIcon, SwordIcon, ChatIcon, RocketIcon } from '@/components/Icons';

const getBadgeIcon = (iconName: string) => {
  switch (iconName) {
    case 'star': return <StarIcon size={24} />;
    case 'book': return <BookIcon size={24} />;
    case 'brain': return <BrainIcon size={24} />;
    case 'compass': return <CompassIcon size={24} />;
    case 'sword': return <SwordIcon size={24} />;
    case 'chat': return <ChatIcon size={24} />;
    case 'rocket': return <RocketIcon size={24} />;
    default: return <StarIcon size={24} />;
  }
};

export default function BadgesPage() {
  const {
    isLoaded,
    newBadge,
    clearNewBadge,
    trackFirstVisit,
    trackSectionVisit,
    getAllBadges,
    getBadgeProgress,
    badges,
  } = useBadges();

  const [showBackToTop, setShowBackToTop] = useState(false);

  // Track visit and section
  useEffect(() => {
    if (isLoaded) {
      trackFirstVisit();
      trackSectionVisit('badges');
    }
  }, [isLoaded, trackFirstVisit, trackSectionVisit]);

  // Scroll handler for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allBadges = getAllBadges();
  const unlockedCount = badges.length;
  const totalCount = BADGE_DEFINITIONS.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  // Format unlock date
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isLoaded) {
    return (
      <div className="wiki-container">
        <div className="badges-loading">
          <div className="badges-spinner"></div>
          <p>Loading badges...</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Wiki', href: '/' },
    { label: 'Badges' },
  ];

  return (
    <div className="wiki-container">
      <BadgeNotification badge={newBadge} onClose={clearNewBadge} />

      <main className="badges-main" id="main-content" role="main">
        {/* Header */}
        <header className="badges-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="badges-title">Achievement Badges</h1>
          <p className="badges-subtitle">
            Unlock badges by exploring the Hamieverse Wiki
          </p>
        </header>

        {/* Progress Section */}
        <section className="badges-progress-section">
          <div className="badges-progress-card">
            <div className="badges-progress-stats">
              <div className="badges-progress-circle">
                <svg viewBox="0 0 100 100">
                  <circle
                    className="badges-progress-bg"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                  />
                  <circle
                    className="badges-progress-fill"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                    strokeDasharray={`${completionPercent * 2.83} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="badges-progress-text">
                  <span className="badges-progress-percent">{completionPercent}%</span>
                  <span className="badges-progress-label">Complete</span>
                </div>
              </div>
              <div className="badges-progress-info">
                <h3>Your Collection</h3>
                <p>
                  <strong>{unlockedCount}</strong> of <strong>{totalCount}</strong> badges unlocked
                </p>
                {unlockedCount === totalCount ? (
                  <span className="badges-complete-msg">
                    Congratulations! You have collected all badges!
                  </span>
                ) : (
                  <span className="badges-progress-hint">
                    Keep exploring to unlock more badges
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Badges Grid */}
        <section className="badges-grid-section">
          <h2>All Badges</h2>
          <div className="badges-grid">
            {allBadges.map((badge, index) => {
              const progress = getBadgeProgress(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
                  style={{
                    '--badge-color': badge.color,
                    '--animation-delay': `${index * 0.1}s`,
                  } as React.CSSProperties}
                >
                  <div className="badge-card-icon-wrapper">
                    <div className="badge-card-icon">
                      {badge.unlocked ? getBadgeIcon(badge.icon) : <LockIcon size={24} />}
                    </div>
                    {badge.unlocked && <div className="badge-card-glow" />}
                  </div>
                  <div className="badge-card-info">
                    <h3 className="badge-card-name">{badge.name}</h3>
                    <p className="badge-card-desc">
                      {badge.unlocked ? badge.description : badge.condition}
                    </p>
                    {badge.unlocked && badge.unlockedAt && (
                      <span className="badge-card-date">
                        Unlocked: {formatDate(badge.unlockedAt)}
                      </span>
                    )}
                    {!badge.unlocked && progress && (
                      <div className="badge-card-progress">
                        <div
                          className="badge-card-progress-fill"
                          style={{
                            width: `${Math.min((progress.current / progress.required) * 100, 100)}%`,
                          }}
                        />
                        <span className="badge-card-progress-text">
                          {progress.current}/{progress.required}
                        </span>
                      </div>
                    )}
                  </div>
                  {badge.unlocked && (
                    <div className="badge-card-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Tips Section */}
        <section className="badges-tips-section">
          <h2>How to Unlock Badges</h2>
          <div className="badges-tips-grid">
            <div className="badges-tip-card">
              <span className="badges-tip-icon"><BookIcon size={24} /></span>
              <h4>Read Character Pages</h4>
              <p>Visit 5 different character profile pages to earn the Lore Scholar badge.</p>
            </div>
            <div className="badges-tip-card">
              <span className="badges-tip-icon"><TargetIcon size={24} /></span>
              <h4>Take Quizzes</h4>
              <p>Answer 5 questions correctly in the trivia quiz for Quiz Master.</p>
            </div>
            <div className="badges-tip-card">
              <span className="badges-tip-icon"><CompassIcon size={24} /></span>
              <h4>Explore Everything</h4>
              <p>Visit all main sections of the wiki to become an Explorer.</p>
            </div>
            <div className="badges-tip-card">
              <span className="badges-tip-icon"><CopyIcon size={24} /></span>
              <h4>Collect Quotes</h4>
              <p>Copy 3 character quotes to earn Quote Collector.</p>
            </div>
          </div>
        </section>

        {/* Navigation Links */}
        <div className="badges-nav-links">
          <Link href="/faction-quiz" className="badges-nav-link">
            Faction Quiz
          </Link>
          <Link href="/quotes" className="badges-nav-link">
            View Quotes
          </Link>
          <Link href="/" className="badges-nav-link">
            Back to Wiki
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">
            Part of the Hamieverse Wiki
          </p>
          <div className="wiki-footer-links">
            <a
              href="https://x.com/hamieverse"
              className="wiki-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://discord.gg/XpheMErdk6"
              className="wiki-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
