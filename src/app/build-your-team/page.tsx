'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { getAllCharacters } from '@/lib/hamieverse/characters';

interface Character {
  id: string;
  displayName: string;
  gifFile?: string;
  color?: string;
  roles: string[];
  faction?: string;
}

interface Tier {
  id: string;
  price: number;
  slots: (Character | null)[];
}

interface TierListTier {
  id: string;
  label: string;
  color: string;
  items: Character[];
}

const DEFAULT_TIER_LIST: TierListTier[] = [
  { id: 's', label: 'S', color: '#0446F1', items: [] },
  { id: 'a', label: 'A', color: '#AE4DAF', items: [] },
  { id: 'b', label: 'B', color: '#6B7280', items: [] },
  { id: 'c', label: 'C', color: '#4B5563', items: [] },
  { id: 'd', label: 'D', color: '#374151', items: [] },
  { id: 'f', label: 'F', color: '#EF4444', items: [] },
];

const getAvatar = (character: Character) =>
  character.gifFile ? `/images/${character.gifFile}` : character.pngFile ? `/images/${character.pngFile}` : null;

const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/images/hamiepfp.png';
};

type Mode = 'pick' | 'create';

interface Template {
  id: string;
  name: string;
  title: string;
  description: string;
  filter?: (c: Character) => boolean;
}

const TEMPLATES: Template[] = [
  { id: 'all', name: 'All Characters', title: 'Build Your Team', description: 'Everyone' },
  { id: 'aetherion', name: 'Aetherion', title: 'Aetherion Team', description: 'The elite', filter: (c) => c.faction?.toLowerCase().includes('aetherion') ?? false },
  { id: 'undercode', name: 'Liberators', title: 'Liberators Team', description: 'The rebels', filter: (c) => c.faction?.toLowerCase() === 'undercode' },
];

export default function BuildYourTeam() {
  const [mode, setMode] = useState<Mode>('pick');
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Build Your Hamieverse Team');
  const [budget, setBudget] = useState(15);
  const [activeTemplate, setActiveTemplate] = useState('classic');
  const [tiers, setTiers] = useState<Tier[]>([
    { id: '5', price: 5, slots: [null, null, null, null, null] },
    { id: '4', price: 4, slots: [null, null, null, null, null] },
    { id: '3', price: 3, slots: [null, null, null, null, null] },
    { id: '2', price: 2, slots: [null, null, null, null, null] },
    { id: '1', price: 1, slots: [null, null, null, null, null] },
  ]);
  const [selectedPicks, setSelectedPicks] = useState<Record<string, Character | null>>({});
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const [isSpinning, setIsSpinning] = useState(false);
  const [draggedCharacter, setDraggedCharacter] = useState<{ character: Character; fromTierId?: string; fromSlotIndex?: number } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ tierId: string; slotIndex: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tierListRef = useRef<HTMLDivElement>(null);

  // Tier List state
  const [tierList, setTierList] = useState<TierListTier[]>(DEFAULT_TIER_LIST);
  const [tierListTitle, setTierListTitle] = useState('HAMIEVERSE TIER LIST');
  const [tierUnranked, setTierUnranked] = useState<Character[]>([]);
  const [tierDraggedItem, setTierDraggedItem] = useState<Character | null>(null);
  const [tierDragSource, setTierDragSource] = useState<string | null>(null);

  useEffect(() => {
    const characters = getAllCharacters();
    setAllCharacters(characters);
    distributePeople(characters.filter(c => c.gifFile || c.pngFile));
    setLoading(false);
  }, []);

  const distributePeople = (characters: Character[]) => {
    const shuffled = [...characters].sort(() => Math.random() - 0.5);

    const makeSlots = (arr: Character[]): (Character | null)[] => {
      const slots: (Character | null)[] = [null, null, null, null, null];
      arr.slice(0, 5).forEach((c, i) => { slots[i] = c; });
      return slots;
    };

    setTiers([
      { id: '5', price: 5, slots: makeSlots(shuffled.slice(0, 5)) },
      { id: '4', price: 4, slots: makeSlots(shuffled.slice(5, 10)) },
      { id: '3', price: 3, slots: makeSlots(shuffled.slice(10, 15)) },
      { id: '2', price: 2, slots: makeSlots(shuffled.slice(15, 20)) },
      { id: '1', price: 1, slots: makeSlots(shuffled.slice(20, 25)) },
    ]);
    setSelectedPicks({});
  };

  const charactersInTiers = useMemo(() => {
    const ids = new Set<string>();
    tiers.forEach(tier => tier.slots.forEach(c => { if (c) ids.add(c.id); }));
    return ids;
  }, [tiers]);

  const poolCharacters = useMemo(() => {
    return allCharacters.filter(c => !charactersInTiers.has(c.id));
  }, [allCharacters, charactersInTiers]);

  const totalSpent = Object.entries(selectedPicks)
    .filter(([, character]) => character !== null)
    .reduce((sum, [tierId]) => {
      const tier = tiers.find(t => t.id === tierId);
      return sum + (tier?.price || 0);
    }, 0);

  const handleSelect = (tierId: string, character: Character) => {
    setSelectedPicks(prev => ({
      ...prev,
      [tierId]: prev[tierId]?.id === character.id ? null : character,
    }));
  };

  const handleRandomize = () => {
    setIsSpinning(true);
    setTimeout(() => {
      distributePeople(allCharacters);
      setIsSpinning(false);
    }, 500);
  };

  const applyTemplate = (template: Template) => {
    setActiveTemplate(template.id);
    setTitle(template.title);

    // Filter characters based on template
    const filtered = template.filter
      ? allCharacters.filter(template.filter)
      : allCharacters;

    // Shuffle the filtered characters
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);

    // Create 5 tiers with the filtered characters
    const tierPrices = [5, 4, 3, 2, 1];
    const slotsPerTier = 5;

    const newTiers: Tier[] = tierPrices.map((price, tierIndex) => {
      const slots: (Character | null)[] = Array(slotsPerTier).fill(null);
      for (let j = 0; j < slotsPerTier; j++) {
        const charIndex = tierIndex * slotsPerTier + j;
        if (charIndex < shuffled.length) {
          slots[j] = shuffled[charIndex];
        }
      }
      return { id: `${price}`, price, slots };
    });

    setTiers(newTiers);
    setSelectedPicks({});
  };

  const handleAddTier = () => {
    const newPrice = Math.max(...tiers.map(t => t.price), 0) + 1;
    const newId = `tier-${Date.now()}`;
    setTiers(prev => [{ id: newId, price: newPrice, slots: [null, null, null, null, null] }, ...prev]);
  };

  const handleDeleteTier = (tierId: string) => {
    if (tiers.length <= 1) return;
    setTiers(prev => prev.filter(t => t.id !== tierId));
    setSelectedPicks(prev => {
      const next = { ...prev };
      delete next[tierId];
      return next;
    });
  };

  const handleChangeTierPrice = (tierId: string, newPrice: number) => {
    setTiers(prev => prev.map(t => t.id === tierId ? { ...t, price: Math.max(1, newPrice) } : t));
  };

  const handleRemoveFromSlot = (tierId: string, slotIndex: number) => {
    setTiers(prev => prev.map(t => {
      if (t.id !== tierId) return t;
      const newSlots = [...t.slots];
      const character = newSlots[slotIndex];
      newSlots[slotIndex] = null;
      if (character && selectedPicks[tierId]?.id === character.id) {
        setSelectedPicks(p => ({ ...p, [tierId]: null }));
      }
      return { ...t, slots: newSlots };
    }));
  };

  const handleDragStart = (character: Character, fromTierId?: string, fromSlotIndex?: number) => {
    setDraggedCharacter({ character, fromTierId, fromSlotIndex });
  };

  const handleDragEnd = () => {
    setDraggedCharacter(null);
    setDragOverSlot(null);
  };

  const handleSlotDragOver = (e: React.DragEvent, tierId: string, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot({ tierId, slotIndex });
  };

  const handleSlotDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleSlotDrop = (e: React.DragEvent, targetTierId: string, targetSlotIndex: number) => {
    e.preventDefault();
    if (!draggedCharacter) return;

    const { character: draggedChar, fromTierId, fromSlotIndex } = draggedCharacter;

    setTiers(prev => {
      const targetTier = prev.find(t => t.id === targetTierId);
      const charInTargetSlot = targetTier?.slots[targetSlotIndex] || null;

      return prev.map(tier => {
        const newSlots = [...tier.slots];

        if (fromTierId && tier.id === fromTierId && fromSlotIndex !== undefined) {
          if (fromTierId === targetTierId && fromSlotIndex === targetSlotIndex) {
            return tier;
          }
          newSlots[fromSlotIndex] = charInTargetSlot;
        }

        if (tier.id === targetTierId) {
          newSlots[targetSlotIndex] = draggedChar;
        }

        return { ...tier, slots: newSlots };
      });
    });

    setDraggedCharacter(null);
    setDragOverSlot(null);
  };

  // Tier List handlers
  const handleTierDragStart = (item: Character, source: string) => {
    setTierDraggedItem(item);
    setTierDragSource(source);
  };

  const handleTierDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTierDropOnTier = (targetTierId: string) => {
    if (!tierDraggedItem) return;

    if (tierDragSource === 'unranked') {
      setTierUnranked(prev => prev.filter(i => i.id !== tierDraggedItem.id));
    } else {
      setTierList(prev => prev.map(tier => ({
        ...tier,
        items: tier.items.filter(i => i.id !== tierDraggedItem.id)
      })));
    }

    setTierList(prev => prev.map(tier =>
      tier.id === targetTierId
        ? { ...tier, items: [...tier.items, tierDraggedItem] }
        : tier
    ));

    setTierDraggedItem(null);
    setTierDragSource(null);
  };

  const handleTierDropOnUnranked = () => {
    if (!tierDraggedItem || tierDragSource === 'unranked') return;

    setTierList(prev => prev.map(tier => ({
      ...tier,
      items: tier.items.filter(i => i.id !== tierDraggedItem.id)
    })));

    setTierUnranked(prev => [...prev, tierDraggedItem]);

    setTierDraggedItem(null);
    setTierDragSource(null);
  };

  const resetTierList = () => {
    setTierList(DEFAULT_TIER_LIST);
    setTierUnranked(allCharacters);
  };

  const handleCopyTierList = async () => {
    if (!tierListRef.current || copyStatus === 'copying') return;
    setCopyStatus('copying');

    try {
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('No blob')), 'image/png');
      });

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed:', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleCopyTeam = async () => {
    if (!gridRef.current || copyStatus === 'copying') return;
    setCopyStatus('copying');

    try {
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('No blob')), 'image/png');
      });

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to generate image:', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <main className="build-team-page">
      <div className="build-team-layout">
        <div className="build-team-main">
          <div className="build-team-top-bar">
            <div className="build-team-mode-toggle">
              <button
                className={`build-team-mode-btn ${mode === 'pick' ? 'active' : ''}`}
                onClick={() => setMode('pick')}
              >
                Pick
              </button>
              <button
                className={`build-team-mode-btn ${mode === 'create' ? 'active' : ''}`}
                onClick={() => setMode('create')}
              >
                Create
              </button>
            </div>
            <div className="build-team-actions">
              <button
                className={`build-team-action-btn ${isSpinning ? 'spinning' : ''}`}
                onClick={handleRandomize}
              >
                Shuffle
              </button>
              <button
                className={`build-team-action-btn build-team-copy-btn ${copyStatus}`}
                onClick={handleCopyTeam}
                disabled={copyStatus === 'copying'}
              >
                {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Failed' : 'Copy'}
              </button>
              <div className={`build-team-spent ${totalSpent > budget ? 'over' : totalSpent === budget ? 'exact' : ''}`}>
                ${totalSpent}/${budget}
              </div>
            </div>
          </div>

          <div className="build-team-container" ref={gridRef}>
            <div className="build-team-header">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="build-team-title-input"
                placeholder="Enter title..."
              />
              <span className="build-team-subtitle">
                Budget: $<input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Math.max(1, parseInt(e.target.value) || 1))}
                  className="build-team-budget-input"
                  min="1"
                />
              </span>
            </div>

        {loading ? (
          <div className="build-team-loading">Loading characters...</div>
        ) : (
          <div className="build-team-tiers">
            {tiers.map(tier => (
              <div key={tier.id} className="build-team-tier-row">
                {mode === 'create' && (
                  <button
                    className="build-team-delete-tier"
                    onClick={() => handleDeleteTier(tier.id)}
                  >
                    X
                  </button>
                )}
                <div className="build-team-price-label">
                  {mode === 'create' ? (
                    <>
                      $<input
                        type="number"
                        value={tier.price}
                        onChange={(e) => handleChangeTierPrice(tier.id, parseInt(e.target.value) || 1)}
                        className="build-team-price-input"
                        min="1"
                      />
                    </>
                  ) : (
                    <span>${tier.price}</span>
                  )}
                </div>
                <div className="build-team-slots">
                  {tier.slots.map((character, slotIndex) => {
                    const isSelected = character && selectedPicks[tier.id]?.id === character.id;
                    const isDragOver = dragOverSlot?.tierId === tier.id && dragOverSlot?.slotIndex === slotIndex;
                    return (
                      <div
                        key={slotIndex}
                        className={`build-team-slot ${character ? 'filled' : 'empty'} ${isDragOver && mode === 'create' ? 'drag-over' : ''} ${isSelected ? 'selected' : ''}`}
                        onDragOver={mode === 'create' ? (e) => handleSlotDragOver(e, tier.id, slotIndex) : undefined}
                        onDragLeave={mode === 'create' ? handleSlotDragLeave : undefined}
                        onDrop={mode === 'create' ? (e) => handleSlotDrop(e, tier.id, slotIndex) : undefined}
                        onClick={() => character && handleSelect(tier.id, character)}
                      >
                        {character ? (
                          <>
                            {getAvatar(character) && (
                              <img
                                src={getAvatar(character)!}
                                alt={character.displayName}
                                className="build-team-avatar"
                                draggable={mode === 'create'}
                                onDragStart={mode === 'create' ? () => handleDragStart(character, tier.id, slotIndex) : undefined}
                                onDragEnd={mode === 'create' ? handleDragEnd : undefined}
                                onError={(e) => handleAvatarError(e)}
                              />
                            )}
                            <span className="build-team-name">{character.displayName}</span>
                            {isSelected && <div className="build-team-check">✓</div>}
                            {mode === 'create' && (
                              <button
                                className="build-team-remove-btn"
                                onClick={(e) => { e.stopPropagation(); handleRemoveFromSlot(tier.id, slotIndex); }}
                              >
                                ×
                              </button>
                            )}
                          </>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {mode === 'create' && (
              <button className="build-team-add-tier" onClick={handleAddTier}>
                + Add Tier
              </button>
            )}
          </div>
        )}

            <div className="build-team-footer">
              <span>Hamieverse Wiki</span>
            </div>
          </div>

          {mode === 'create' && poolCharacters.length > 0 && (
            <div className="build-team-pool">
              <h3>Character Pool ({poolCharacters.length})</h3>
              <div className="build-team-pool-grid">
                {poolCharacters.map(character => (
                  <div
                    key={character.id}
                    className="build-team-pool-item"
                    draggable
                    onDragStart={() => handleDragStart(character)}
                    onDragEnd={handleDragEnd}
                  >
                    {getAvatar(character) && (
                      <img
                        src={getAvatar(character)!}
                        alt={character.displayName}
                        onError={(e) => handleAvatarError(e)}
                      />
                    )}
                    <span>{character.displayName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Characters by Faction */}
          <div className="tier-list-unranked">
            <div className="tier-list-unranked-header">ALL CHARACTERS</div>
            <div className="tier-list-unranked-items">
              {(() => {
                const factionGroups: Record<string, Character[]> = {
                  'Liberators': [],
                  'Aetherion': [],
                  'Respeculators': [],
                  'Citizens': [],
                  'Other': [],
                };

                allCharacters.forEach(char => {
                  const faction = char.faction || '';
                  if (faction === 'Undercode') {
                    factionGroups['Liberators'].push(char);
                  } else if (faction.includes('Aetherion')) {
                    factionGroups['Aetherion'].push(char);
                  } else if (faction === 'Respeculators') {
                    factionGroups['Respeculators'].push(char);
                  } else if (faction === 'The City' || faction === 'The Beyond') {
                    factionGroups['Citizens'].push(char);
                  } else {
                    factionGroups['Other'].push(char);
                  }
                });

                return ['Liberators', 'Aetherion', 'Respeculators', 'Citizens', 'Other']
                  .filter(g => factionGroups[g].length > 0)
                  .flatMap(group => [
                    <div key={`label-${group}`} className="faction-label-inline">{group}</div>,
                    ...factionGroups[group].map((item) => (
                      <div
                        key={item.id}
                        className="tier-list-item"
                        draggable={mode === 'create'}
                        onDragStart={mode === 'create' ? () => handleDragStart(item) : undefined}
                        onDragEnd={mode === 'create' ? handleDragEnd : undefined}
                      >
                        <img
                          src={getAvatar(item) || '/images/hamiepfp.png'}
                          alt={item.displayName}
                          onError={handleAvatarError}
                        />
                        <span>{item.displayName}</span>
                      </div>
                    ))
                  ]);
              })()}
            </div>
          </div>
        </div>

        <div className="build-team-templates">
          <h3>Templates</h3>
          <div className="build-team-templates-grid">
            {TEMPLATES.map(template => (
              <button
                key={template.id}
                className={`build-team-template-btn ${activeTemplate === template.id ? 'active' : ''}`}
                onClick={() => applyTemplate(template)}
              >
                <span className="template-name">{template.name}</span>
                <span className="template-info">{template.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
