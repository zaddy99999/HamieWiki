'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getAllCharacters } from '@/lib/hamieverse/characters';

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
  { id: 's', label: 'S', color: '#8B5CF6', items: [] },
  { id: 'a', label: 'A', color: '#A855F7', items: [] },
  { id: 'b', label: 'B', color: '#3B82F6', items: [] },
  { id: 'c', label: 'C', color: '#60A5FA', items: [] },
  { id: 'd', label: 'D', color: '#1E40AF', items: [] },
  { id: 'f', label: 'F', color: '#7C3AED', items: [] },
];

export default function TierMaker() {
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

  const characters = getAllCharacters();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load characters as unranked items
  useEffect(() => {
    const items: TierItem[] = characters.map(char => ({
      id: char.id,
      name: char.displayName,
      image: char.gifFile ? `/images/${char.gifFile}` : '/images/hamiepfp.png',
      faction: char.faction,
    }));
    setUnrankedItems(items);
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
    const items: TierItem[] = characters.map(char => ({
      id: char.id,
      name: char.displayName,
      image: char.gifFile ? `/images/${char.gifFile}` : '/images/hamiepfp.png',
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
                      handleItemClick(item, tier.id);
                    }}
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
            const factionGroups = ['Liberators', 'Aetherion', 'Respeculators', 'Other'];
            const grouped: Record<string, TierItem[]> = {
              'Liberators': [],
              'Aetherion': [],
              'Respeculators': [],
              'Other': [],
            };

            unrankedItems.forEach(item => {
              const faction = item.faction || '';
              if (faction === 'Undercode') {
                grouped['Liberators'].push(item);
              } else if (faction === 'Aetherion Elite') {
                grouped['Aetherion'].push(item);
              } else if (faction === 'Respeculators') {
                grouped['Respeculators'].push(item);
              } else {
                grouped['Other'].push(item);
              }
            });

            return factionGroups.filter(g => grouped[g].length > 0).flatMap(group => [
              ...(group === 'Other' ? [<div key="break" className="brutal-faction-break" />] : []),
              <div key={`label-${group}`} className="brutal-faction-label">{group.toUpperCase()}</div>,
              ...grouped[group].map((item) => (
                <div
                  key={item.id}
                  className={`brutal-tier-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                  draggable={!isMobile}
                  onDragStart={() => handleDragStart(item, 'unranked')}
                  onClick={() => handleItemClick(item, 'unranked')}
                >
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                </div>
              ))
            ]);
          })()}
        </div>
      </div>
    </div>
  );
}
