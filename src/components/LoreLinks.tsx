'use client';

import { OpenBookIcon, ComicIcon, LinkIcon, ArrowRightIcon } from './Icons';

const loreLinks = [
  {
    type: 'novel',
    title: 'Songs the City Forgot',
    url: 'https://read.hamieverse.com/songs-the-city-forgot',
    description: 'The Novel',
  },
  {
    type: 'comic',
    title: 'Comic #1',
    url: 'https://publuu.com/flip-book/1028492/2277031',
  },
  {
    type: 'comic',
    title: 'Comic #2',
    url: 'https://publuu.com/flip-book/1028492/2289607',
  },
];

export default function LoreLinks() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'novel': return <OpenBookIcon size={20} />;
      case 'comic': return <ComicIcon size={20} />;
      default: return <LinkIcon size={20} />;
    }
  };

  return (
    <div className="lore-links-section">
      <h3 className="lore-links-title">Read the Story</h3>
      <div className="lore-links-grid">
        {loreLinks.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lore-link-card"
          >
            <span className="lore-link-icon">{getTypeIcon(link.type)}</span>
            <div className="lore-link-content">
              <span className="lore-link-type">{link.type === 'novel' ? 'Novel' : 'Comic'}</span>
              <span className="lore-link-name">{link.title}</span>
              {link.description && (
                <span className="lore-link-desc">{link.description}</span>
              )}
            </div>
            <span className="lore-link-arrow"><ArrowRightIcon size={16} /></span>
          </a>
        ))}
      </div>
    </div>
  );
}
