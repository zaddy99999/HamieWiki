'use client';

import { useEffect, useState } from 'react';
import type { Badge } from '@/hooks/useBadges';

interface BadgeNotificationProps {
  badge: Badge | null;
  onClose: () => void;
}

export default function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (badge) {
      // Small delay to trigger entrance animation
      setTimeout(() => setIsVisible(true), 50);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [badge]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsLeaving(false);
      onClose();
    }, 300);
  };

  if (!badge) return null;

  return (
    <div
      className={`badge-notification ${isVisible ? 'visible' : ''} ${isLeaving ? 'leaving' : ''}`}
      style={{ '--badge-color': badge.color } as React.CSSProperties}
    >
      <div className="badge-notification-glow" />
      <div className="badge-notification-content">
        <div className="badge-notification-header">
          <span className="badge-notification-label">Badge Unlocked!</span>
          <button
            className="badge-notification-close"
            onClick={handleClose}
            aria-label="Close notification"
            style={{ minWidth: '44px', minHeight: '44px', fontSize: '24px' }}
          >
            &times;
          </button>
        </div>
        <div className="badge-notification-body">
          <div className="badge-notification-icon">
            {badge.icon}
          </div>
          <div className="badge-notification-info">
            <span className="badge-notification-name">{badge.name}</span>
            <span className="badge-notification-desc">{badge.description}</span>
          </div>
        </div>
      </div>
      <div className="badge-notification-progress" />
    </div>
  );
}
