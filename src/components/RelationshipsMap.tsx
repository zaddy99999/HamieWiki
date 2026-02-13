'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllCharacters, getRelationships } from '@/lib/hamieverse/characters';

interface Relationship {
  a: string;
  b: string;
  type: string;
  valence: string;
}

const relationshipColors: Record<string, string> = {
  family: '#F472B6',
  workplace: '#60A5FA',
  alliance: '#34D399',
  target: '#FBBF24',
  oppression: '#EF4444',
  enforcement: '#F87171',
  neighbor: '#A78BFA',
};

export default function RelationshipsMap() {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const characters = getAllCharacters();
  const relationships = getRelationships() as Relationship[];

  // Filter to main characters for cleaner display
  const mainCharIds = ['hamie', 'sam', 'lira', 'silas', 'grandma', 'mitch', '257a', 'ace', 'hikari', 'kael', 'orrien'];
  const displayChars = characters.filter(c =>
    mainCharIds.includes(c.id.toLowerCase()) ||
    relationships.some(r => r.a === c.id || r.b === c.id)
  ).slice(0, 12);

  const getCharRelationships = (charId: string) => {
    return relationships.filter(r =>
      r.a.toLowerCase() === charId.toLowerCase() ||
      r.b.toLowerCase() === charId.toLowerCase()
    );
  };

  const getRelatedChar = (rel: Relationship, currentId: string) => {
    const otherId = rel.a.toLowerCase() === currentId.toLowerCase() ? rel.b : rel.a;
    return characters.find(c => c.id.toLowerCase() === otherId.toLowerCase());
  };

  const formatValence = (valence: string) => {
    return valence.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="relationships-map">
      <div className="relationships-header">
        <h3>Character Connections</h3>
        <p>Click a character to see their relationships</p>
      </div>

      <div className="relationships-grid">
        {displayChars.map(char => {
          const charRels = getCharRelationships(char.id);
          const isSelected = selectedChar === char.id;
          const isRelated = selectedChar && charRels.some(r =>
            r.a.toLowerCase() === selectedChar.toLowerCase() ||
            r.b.toLowerCase() === selectedChar.toLowerCase()
          );

          return (
            <button
              key={char.id}
              className={`relationships-node ${isSelected ? 'selected' : ''} ${isRelated ? 'related' : ''} ${selectedChar && !isSelected && !isRelated ? 'dimmed' : ''}`}
              onClick={() => setSelectedChar(isSelected ? null : char.id)}
              style={{ '--char-color': char.color } as React.CSSProperties}
            >
              <div className="relationships-node-avatar">
                {char.gifFile ? (
                  <img src={`/images/${char.gifFile}`} alt={char.displayName} />
                ) : (
                  <span>{char.displayName[0]}</span>
                )}
              </div>
              <span className="relationships-node-name">{char.displayName}</span>
              {charRels.length > 0 && (
                <span className="relationships-node-count">{charRels.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {selectedChar && (
        <div className="relationships-detail">
          <h4>
            {characters.find(c => c.id === selectedChar)?.displayName}'s Relationships
          </h4>
          <div className="relationships-list">
            {getCharRelationships(selectedChar).map((rel, i) => {
              const other = getRelatedChar(rel, selectedChar);
              if (!other) return null;

              return (
                <Link
                  key={i}
                  href={`/character/${other.id}`}
                  className="relationship-item"
                  style={{ '--rel-color': relationshipColors[rel.type] || '#888' } as React.CSSProperties}
                >
                  <div className="relationship-avatar">
                    {other.gifFile ? (
                      <img src={`/images/${other.gifFile}`} alt={other.displayName} />
                    ) : (
                      <span>{other.displayName[0]}</span>
                    )}
                  </div>
                  <div className="relationship-info">
                    <span className="relationship-name">{other.displayName}</span>
                    <span className="relationship-type">{rel.type}</span>
                  </div>
                  <span className="relationship-valence">{formatValence(rel.valence)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="relationships-legend">
        {Object.entries(relationshipColors).map(([type, color]) => (
          <span key={type} className="legend-item" style={{ '--leg-color': color } as React.CSSProperties}>
            <span className="legend-dot"></span>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
