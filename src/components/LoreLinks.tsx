'use client';

import { useState, useEffect } from 'react';

interface LoreLink {
  type: 'novel' | 'comic' | 'other';
  title: string;
  url: string;
  description?: string;
}

export default function LoreLinks() {
  const [links, setLinks] = useState<LoreLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch('https://zaddytools.vercel.app/api/lore-links?gameId=hamieverse');
        const data = await res.json();
        if (data.links) {
          setLinks(data.links);
        }
      } catch (err) {
        console.error('Failed to fetch lore links:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'novel': return '📖';
      case 'comic': return '📚';
      default: return '🔗';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'novel': return 'Novel';
      case 'comic': return 'Comic';
      default: return 'Link';
    }
  };

  if (loading) {
    return (
      <div className="lore-links-section">
        <h3 className="lore-links-title">Read the Story</h3>
        <div className="lore-links-grid">
          {[1, 2].map(i => (
            <div key={i} className="lore-link-card skeleton">
              <div className="skeleton-icon"></div>
              <div className="skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="lore-links-section">
      <h3 className="lore-links-title">Read the Story</h3>
      <div className="lore-links-grid">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lore-link-card"
          >
            <span className="lore-link-icon">{getTypeIcon(link.type)}</span>
            <div className="lore-link-content">
              <span className="lore-link-type">{getTypeLabel(link.type)}</span>
              <span className="lore-link-name">{link.title}</span>
              {link.description && (
                <span className="lore-link-desc">{link.description}</span>
              )}
            </div>
            <span className="lore-link-arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
