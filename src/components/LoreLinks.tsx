'use client';

import { useState, useEffect } from 'react';

interface LoreLink {
  type: 'novel' | 'comic' | 'other';
  title: string;
  url: string;
  description?: string;
}

const SHEET_ID = '1djbRNl6LB-g9k-IDmn4FEaPJHEKcg1FyVu0FQ9NsG10';

export default function LoreLinks() {
  const [links, setLinks] = useState<LoreLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=lore_links`;
        const res = await fetch(url);
        const text = await res.text();

        // Parse CSV
        const rows: string[][] = [];
        const lines = text.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;

          const row: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              row.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          row.push(current.trim());
          rows.push(row);
        }

        // Skip header row, parse data
        const parsedLinks: LoreLink[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row[0] || !row[1] || !row[2]) continue;

          parsedLinks.push({
            type: (row[0].toLowerCase() as 'novel' | 'comic' | 'other') || 'other',
            title: row[1],
            url: row[2],
            description: row[3] || undefined,
          });
        }

        setLinks(parsedLinks);
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
