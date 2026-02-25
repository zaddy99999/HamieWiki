'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAllCharacters } from '@/lib/hamieverse/characters';
import { HamieCharacter } from '@/lib/hamieverse/types';

function normStr(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isShown(char: HamieCharacter, shownNames: string[]): boolean {
  const idNorm = normStr(char.id);
  const displayNorm = normStr(char.displayName);
  return shownNames.some(name => {
    const nameNorm = normStr(name);
    const firstWord = normStr(name.split(' ')[0]);
    return nameNorm === idNorm || nameNorm === displayNorm || firstWord === displayNorm || idNorm.startsWith(firstWord);
  });
}

function getSheetPfp(char: HamieCharacter, pfpMap: Record<string, string>): string | undefined {
  for (const [name, file] of Object.entries(pfpMap)) {
    const firstWord = normStr(name.split(' ')[0]);
    const nameNorm = normStr(name);
    if (nameNorm === normStr(char.id) || nameNorm === normStr(char.displayName) || firstWord === normStr(char.displayName) || normStr(char.id).startsWith(firstWord)) {
      return file;
    }
  }
  return undefined;
}

interface TierItem {
  id: string;
  name: string;
  image: string;
  faction?: string;
}

interface Tier {
  id: string;
  label: string;
  color: string;
  items: TierItem[];
}

const DEFAULT_TIERS: Tier[] = [
  { id: 's', label: 'S', color: '#0446F1', items: [] },
  { id: 'a', label: 'A', color: '#AE4DAF', items: [] },
  { id: 'b', label: 'B', color: '#6B7280', items: [] },
  { id: 'c', label: 'C', color: '#4B5563', items: [] },
  { id: 'd', label: 'D', color: '#374151', items: [] },
  { id: 'f', label: 'F', color: '#EF4444', items: [] },
];

export default function TierMaker() {
  const router = useRouter();
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [unrankedItems, setUnrankedItems] = useState<TierItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<TierItem | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [title, setTitle] = useState('HAMIEVERSE TIER LIST');
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);
  const tierListRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TierItem | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const allCharacters = getAllCharacters();
  const [shownNames, setShownNames] = useState<string[]>([]);
  const [pfpMap, setPfpMap] = useState<Record<string, string>>({});

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch sheet data then populate unranked items
  useEffect(() => {
    fetch('/api/shown-characters')
      .then(r => r.json())
      .then(data => {
        const names: string[] = data.shownNames || [];
        const pMap: Record<string, string> = data.pfpMap || {};
        setShownNames(names);
        setPfpMap(pMap);
        const filtered = allCharacters.filter(c => isShown(c, names) && (c.gifFile || c.pngFile));
        const items: TierItem[] = filtered.map(char => ({
          id: char.id,
          name: char.displayName,
          image: `/images/${getSheetPfp(char, pMap) || char.pngFile || char.gifFile || 'hamiepfp.png'}`,
          faction: char.faction,
        }));
        setUnrankedItems(items);
      });
  }, []);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const copyImage = async () => {
    if (!tierListRef.current) return;
    showToast('GENERATING...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('No blob')), 'image/png');
      });

      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('COPIED TO CLIPBOARD!');
    } catch (error) {
      console.error('Failed:', error);
      showToast('FAILED TO COPY', true);
    }
  };

  const downloadImage = async () => {
    if (!tierListRef.current) return;
    showToast('GENERATING...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tierListRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = 'hamieverse-tier-list.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('DOWNLOADED!');
    } catch (error) {
      console.error('Failed:', error);
      showToast('FAILED TO DOWNLOAD', true);
    }
  };

  const handleItemClick = (item: TierItem, source: string) => {
    if (isMobile) {
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
        setSelectedSource(null);
      } else {
        setSelectedItem(item);
        setSelectedSource(source);
        showToast(`SELECTED: ${item.name.toUpperCase()}`);
      }
    }
  };

  const handleTierClick = (tierId: string) => {
    if (!isMobile || !selectedItem) return;

    if (selectedSource === 'unranked') {
      setUnrankedItems(prev => prev.filter(i => i.id !== selectedItem.id));
    } else {
      setTiers(prev => prev.map(tier => ({
        ...tier,
        items: tier.items.filter(i => i.id !== selectedItem.id)
      })));
    }

    setTiers(prev => prev.map(tier =>
      tier.id === tierId
        ? { ...tier, items: [...tier.items, selectedItem] }
        : tier
    ));

    setSelectedItem(null);
    setSelectedSource(null);
  };

  const handleDragStart = (item: TierItem, source: string) => {
    setDraggedItem(item);
    setDragSource(source);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnTier = useCallback((targetTierId: string) => {
    if (!draggedItem) return;

    if (dragSource === 'unranked') {
      setUnrankedItems(prev => prev.filter(i => i.id !== draggedItem.id));
    } else {
      setTiers(prev => prev.map(tier => ({
        ...tier,
        items: tier.items.filter(i => i.id !== draggedItem.id)
      })));
    }

    setTiers(prev => prev.map(tier =>
      tier.id === targetTierId
        ? { ...tier, items: [...tier.items, draggedItem] }
        : tier
    ));

    setDraggedItem(null);
    setDragSource(null);
  }, [draggedItem, dragSource]);

  const handleDropOnUnranked = useCallback(() => {
    if (!draggedItem || dragSource === 'unranked') return;

    setTiers(prev => prev.map(tier => ({
      ...tier,
      items: tier.items.filter(i => i.id !== draggedItem.id)
    })));

    setUnrankedItems(prev => [...prev, draggedItem]);

    setDraggedItem(null);
    setDragSource(null);
  }, [draggedItem, dragSource]);

  const resetTiers = () => {
    setTiers(DEFAULT_TIERS);
    const filtered = allCharacters.filter(c => isShown(c, shownNames) && (c.gifFile || c.pngFile));
    const items: TierItem[] = filtered.map(char => ({
      id: char.id,
      name: char.displayName,
      image: `/images/${getSheetPfp(char, pfpMap) || char.pngFile || char.gifFile || 'hamiepfp.png'}`,
      faction: char.faction,
    }));
    setUnrankedItems(items);
    showToast('RESET!');
  };

  return (
    <div className="brutal-tier-maker">
      {toast && (
        <div className={`brutal-toast ${toast.isError ? 'error' : ''}`}>
          {toast.message}
        </div>
      )}

      <div className="brutal-tier-header-wrapper">
        <div className="brutal-tier-header">
          <h1>TIER MAKER</h1>
          <p>RANK THE HAMIEVERSE CHARACTERS</p>
        </div>
      </div>

      <div className="brutal-tier-container" ref={tierListRef}>
        <div className="brutal-tier-top-row">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.toUpperCase())}
            className="brutal-tier-title"
          />
          <div className="brutal-tier-actions">
            <button className="brutal-btn" onClick={copyImage}>COPY</button>
            <button className="brutal-btn brutal-btn-danger" onClick={resetTiers}>RESET</button>
          </div>
        </div>

        <div className="brutal-tier-list">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`brutal-tier-row ${isMobile && selectedItem ? 'tap-target' : ''}`}
              onDragOver={handleDragOver}
              onDrop={() => handleDropOnTier(tier.id)}
              onClick={() => handleTierClick(tier.id)}
            >
              <div
                className="brutal-tier-label"
                style={{ backgroundColor: tier.color, color: tier.color === '#FFFF00' || tier.color === '#00FF00' ? '#000' : '#fff' }}
              >
                {tier.label}
              </div>
              <div className="brutal-tier-items">
                {tier.items.map((item) => (
                  <div
                    key={item.id}
                    className={`brutal-tier-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                    draggable={!isMobile}
                    onDragStart={() => handleDragStart(item, tier.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isMobile) {
                        handleItemClick(item, tier.id);
                      } else {
                        router.push(`/character/${item.id}`);
                      }
                    }}
                    style={!isMobile ? { cursor: 'pointer' } : undefined}
                  >
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="brutal-watermark">HAMIEVERSE</div>
      </div>

      <div
        className="brutal-unranked"
        onDragOver={handleDragOver}
        onDrop={handleDropOnUnranked}
      >
        <div className="brutal-unranked-header">
          <span>UNRANKED</span>
        </div>

        <div className="brutal-unranked-items">
          {(() => {
            const factionGroups = ['Liberators', 'Aetherion', 'Respeculators', 'Citizens', 'Other'];
            const grouped: Record<string, TierItem[]> = {
              'Liberators': [],
              'Aetherion': [],
              'Respeculators': [],
              'Citizens': [],
              'Other': [],
            };

            unrankedItems.forEach(item => {
              const faction = item.faction || '';
              if (faction === 'Undercode') {
                grouped['Liberators'].push(item);
              } else if (faction.includes('Aetherion')) {
                grouped['Aetherion'].push(item);
              } else if (faction === 'Respeculators') {
                grouped['Respeculators'].push(item);
              } else if (faction === 'The City' || faction === 'The Beyond') {
                grouped['Citizens'].push(item);
              } else {
                grouped['Other'].push(item);
              }
            });

            return factionGroups.filter(g => grouped[g].length > 0).map((group) => (
              <div key={group} className="brutal-faction-group">
                <div className="brutal-faction-label">{group.toUpperCase()}</div>
                {grouped[group].map((item) => (
                  <div
                    key={item.id}
                    className={`brutal-tier-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                    draggable={!isMobile}
                    onDragStart={() => handleDragStart(item, 'unranked')}
                    onClick={() => {
                      if (isMobile) {
                        handleItemClick(item, 'unranked');
                      } else {
                        router.push(`/character/${item.id}`);
                      }
                    }}
                    style={!isMobile ? { cursor: 'pointer' } : undefined}
                  >
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
