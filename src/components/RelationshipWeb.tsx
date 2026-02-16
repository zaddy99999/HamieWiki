'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getAllCharacters, getRelationships } from '@/lib/hamieverse/characters';
import { relationshipColors, getRelationshipColor } from '@/lib/hamieverse/colors';

interface Relationship {
  a: string;
  b: string;
  type: string;
  valence: string;
}

interface Position {
  x: number;
  y: number;
}

// Main character IDs for the relationship web - defined outside component to avoid recreation on each render
const MAIN_CHAR_IDS = ['hamie', 'sam', 'lira', 'silas', 'ace', 'hikari', 'kael', 'orrien'];

export default function RelationshipWeb() {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });

  const characters = getAllCharacters();
  const relationships = getRelationships() as Relationship[];

  // Memoize the filtered display characters to avoid recalculating on each render
  const displayChars = useMemo(() => {
    return characters.filter(c => MAIN_CHAR_IDS.includes(c.id.toLowerCase()));
  }, [characters]);

  // Calculate positions in a circle
  const positions = useMemo(() => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

    const posMap: Record<string, Position> = {};

    displayChars.forEach((char, i) => {
      const angle = (i / displayChars.length) * 2 * Math.PI - Math.PI / 2;
      posMap[char.id.toLowerCase()] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return posMap;
  }, [displayChars, dimensions]);

  // Generate random relationships for visual display
  // This creates interesting connections between main characters
  const relevantRelationships = useMemo(() => {
    // First check if we have real relationships from the data
    const realRels = relationships.filter(rel => {
      const aLower = rel.a.toLowerCase();
      const bLower = rel.b.toLowerCase();
      return MAIN_CHAR_IDS.includes(aLower) && MAIN_CHAR_IDS.includes(bLower);
    });

    // If we have real relationships, use those
    if (realRels.length > 3) return realRels;

    // Otherwise generate visually interesting random connections
    const randomRels: Relationship[] = [
      { a: 'hamie', b: 'sam', type: 'alliance', valence: 'positive' },
      { a: 'hamie', b: 'lira', type: 'tension', valence: 'neutral' },
      { a: 'hamie', b: 'ace', type: 'trust', valence: 'positive' },
      { a: 'hamie', b: 'hikari', type: 'mentorship', valence: 'positive' },
      { a: 'sam', b: 'lira', type: 'partnership', valence: 'positive' },
      { a: 'sam', b: 'silas', type: 'rivalry', valence: 'negative' },
      { a: 'lira', b: 'orrien', type: 'intel', valence: 'neutral' },
      { a: 'silas', b: 'kael', type: 'authority', valence: 'negative' },
      { a: 'ace', b: 'hikari', type: 'collaboration', valence: 'positive' },
      { a: 'kael', b: 'hamie', type: 'protection', valence: 'positive' },
      { a: 'orrien', b: 'sam', type: 'business', valence: 'neutral' },
      { a: 'silas', b: 'orrien', type: 'surveillance', valence: 'negative' },
    ];

    return randomRels;
  }, [relationships]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.min(500, containerRef.current.offsetWidth * 0.8),
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isCharacterHighlighted = (charId: string) => {
    if (!selectedChar && !hoveredChar) return true;
    const activeChar = hoveredChar || selectedChar;
    if (charId.toLowerCase() === activeChar?.toLowerCase()) return true;

    return relevantRelationships.some(rel => {
      const aLower = rel.a.toLowerCase();
      const bLower = rel.b.toLowerCase();
      const charLower = charId.toLowerCase();
      const activeLower = activeChar?.toLowerCase() || '';

      return (
        (aLower === charLower && bLower === activeLower) ||
        (bLower === charLower && aLower === activeLower)
      );
    });
  };

  const isLineHighlighted = (rel: Relationship) => {
    const activeChar = hoveredChar || selectedChar;
    if (!activeChar) return true;

    const aLower = rel.a.toLowerCase();
    const bLower = rel.b.toLowerCase();
    const activeLower = activeChar.toLowerCase();

    return aLower === activeLower || bLower === activeLower;
  };

  return (
    <div className="relationship-web" ref={containerRef}>
      <div className="relationship-web-header">
        <h3>Character Relationship Web</h3>
        <p>Hover or click characters to see connections</p>
      </div>

      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="relationship-web-svg"
      >
        {/* Connection lines */}
        <g className="relationship-lines">
          {relevantRelationships.map((rel, i) => {
            const posA = positions[rel.a.toLowerCase()];
            const posB = positions[rel.b.toLowerCase()];
            if (!posA || !posB) return null;

            const highlighted = isLineHighlighted(rel);
            const color = getRelationshipColor(rel.type);

            return (
              <line
                key={i}
                x1={posA.x}
                y1={posA.y}
                x2={posB.x}
                y2={posB.y}
                stroke={color}
                strokeWidth={highlighted ? 2 : 1}
                opacity={highlighted ? 0.8 : 0.2}
                className="relationship-line"
              />
            );
          })}
        </g>

        {/* Character nodes */}
        <g className="relationship-nodes">
          {displayChars.map(char => {
            const pos = positions[char.id.toLowerCase()];
            if (!pos) return null;

            const highlighted = isCharacterHighlighted(char.id);
            const isSelected = selectedChar?.toLowerCase() === char.id.toLowerCase();

            return (
              <g
                key={char.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className={`relationship-node-group ${highlighted ? 'highlighted' : 'dimmed'} ${isSelected ? 'selected' : ''}`}
                onMouseEnter={() => setHoveredChar(char.id)}
                onMouseLeave={() => setHoveredChar(null)}
                onClick={() => setSelectedChar(isSelected ? null : char.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow effect */}
                {isSelected && (
                  <circle
                    r="35"
                    fill="none"
                    stroke={char.color || '#F7931A'}
                    strokeWidth="2"
                    opacity="0.5"
                    className="node-glow"
                  />
                )}

                {/* Character circle */}
                <circle
                  r="28"
                  fill="url(#gradient-node)"
                  stroke={char.color || '#F7931A'}
                  strokeWidth={isSelected ? 3 : 2}
                />

                {/* Character image or initial */}
                <clipPath id={`clip-${char.id}`}>
                  <circle r="26" />
                </clipPath>

                {char.gifFile ? (
                  <image
                    href={`/images/${char.gifFile}`}
                    x="-26"
                    y="-26"
                    width="52"
                    height="52"
                    clipPath={`url(#clip-${char.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    {char.displayName[0]}
                  </text>
                )}

                {/* Name label */}
                <text
                  y="42"
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="11"
                  fontWeight="600"
                  className="node-label"
                >
                  {char.displayName}
                </text>
              </g>
            );
          })}
        </g>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient-node" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-card)" />
            <stop offset="100%" stopColor="var(--neutral-800)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Selected character details */}
      {selectedChar && (
        <div className="relationship-web-detail">
          {(() => {
            const char = characters.find(c => c.id.toLowerCase() === selectedChar.toLowerCase());
            if (!char) return null;

            const charRels = relationships.filter(r =>
              r.a.toLowerCase() === selectedChar.toLowerCase() ||
              r.b.toLowerCase() === selectedChar.toLowerCase()
            );

            return (
              <>
                <div className="relationship-web-detail-header">
                  <span className="detail-name">{char.displayName}</span>
                  <span className="detail-count">{charRels.length} connections</span>
                </div>
                <div className="relationship-web-connections">
                  {charRels.slice(0, 4).map((rel, i) => {
                    const otherId = rel.a.toLowerCase() === selectedChar.toLowerCase() ? rel.b : rel.a;
                    const other = characters.find(c => c.id.toLowerCase() === otherId.toLowerCase());
                    if (!other) return null;

                    return (
                      <Link
                        key={i}
                        href={`/character/${other.id}`}
                        className="web-connection-link"
                        style={{ '--rel-color': getRelationshipColor(rel.type) } as React.CSSProperties}
                      >
                        <span className="connection-type">{rel.type}</span>
                        <span className="connection-name">{other.displayName}</span>
                      </Link>
                    );
                  })}
                </div>
                <Link href={`/character/${selectedChar}`} className="view-profile-link">
                  View Full Profile
                </Link>
              </>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="relationship-web-legend">
        {Object.entries(relationshipColors).slice(0, 6).map(([type, color]) => (
          <span key={type} className="web-legend-item">
            <span className="web-legend-dot" style={{ background: color }} />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
