'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GifReader from 'omggif';

type CardType = 'id' | 'xp';
type Faction = 'Aetherion' | 'Liberators';
type Role = 'Genesis Holder' | 'Hamie Maxi' | 'Hamie Whale';

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'Genesis Holder', label: 'Genesis Holder' },
  { value: 'Hamie Maxi', label: 'Hamie Maxi (5)' },
  { value: 'Hamie Whale', label: 'Hamie Whale (10)' },
];

interface XPPreset {
  name: string;
  image: string | null;
  video: string | null;
  displayName: string;
  xp: string;
  level: string;
  joinDate: string;
}

const XP_PRESETS: XPPreset[] = [
  { name: 'Hammie', image: '/HammieBannerBigger.gif', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Orrien', image: '/images/OrrienCharacter.gif', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Sam', image: '/images/SamCharacter.gif', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Silas', image: '/images/SilasCharacter.gif', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Hikari', image: '/images/HikariCharacter.gif', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Kael', image: '/images/KaelCharacter.gif', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Ace', image: '/images/AceCharacter.gif', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Lira', image: '/images/LiraCharacter.gif', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 1', image: '/xp-card-1.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 2', image: '/xp-card-2.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 3', image: '/xp-card-3.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 4', image: '/xp-card-4.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 5', image: '/xp-card-5.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 6', image: '/xp-card-6.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 7', image: '/xp-card-7.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 8', image: '/xp-card-8.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 9', image: '/xp-card-9.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 10', image: '/xp-card-10.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 11', image: '/xp-card-11.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 12', image: '/xp-card-12.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 13', image: '/xp-card-13.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 14', image: '/xp-card-14.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 15', image: '/xp-card-15.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 16', image: '/xp-card-16.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 17', image: '/xp-card-17.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'XP Card 18', image: '/xp-card-18.png', video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 1', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 2', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 3', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
];

export default function XPCardPage() {
  const [cardType, setCardType] = useState<CardType>('xp');

  // ID Card state - defaults for testing
  const [idProfileImage, setIdProfileImage] = useState<string | null>(null);
  const [idDisplayName, setIdDisplayName] = useState('');
  const [faction, setFaction] = useState<Faction>('Aetherion');
  const [role, setRole] = useState<Role>('Genesis Holder');

  // XP Card state
  const [xpProfileImage, setXpProfileImage] = useState<string | null>(null);
  const [xpBackgroundImage, setXpBackgroundImage] = useState<string | null>('/HammieBannerBigger.gif');
  const [xpBackgroundVideo, setXpBackgroundVideo] = useState<string | null>(null);
  const [xpDisplayName, setXpDisplayName] = useState('');
  const [xpAmount, setXpAmount] = useState('');
  const [level, setLevel] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('Hammie');

  // Template filter
  const [templateFilter, setTemplateFilter] = useState<'static' | 'videos'>('videos');

  // Preset likes
  const [presetLikes, setPresetLikes] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('xp-preset-likes') || '{}'); } catch { return {}; }
  });
  const [presetCounts, setPresetCounts] = useState<Record<string, number>>({});
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const getUserId = () => {
    let id = localStorage.getItem('xp-user-id');
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('xp-user-id', id); }
    return id;
  };

  useEffect(() => {
    fetch('/api/preset-votes')
      .then(r => r.json())
      .then(data => setPresetCounts(data))
      .catch(() => {});
  }, []);

  const handleLike = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    const liked = !presetLikes[name];
    // Optimistic update
    setPresetLikes(prev => {
      const updated = { ...prev, [name]: liked };
      localStorage.setItem('xp-preset-likes', JSON.stringify(updated));
      return updated;
    });
    setPresetCounts(prev => ({ ...prev, [name]: Math.max(0, (prev[name] ?? 0) + (liked ? 1 : -1)) }));
    try {
      const res = await fetch('/api/preset-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetName: name, uuid: getUserId(), action: liked ? 'like' : 'unlike' }),
      });
      const data = await res.json();
      if (res.ok) {
        setPresetCounts(prev => ({ ...prev, [name]: data.count }));
      } else if (res.status === 409 && liked) {
        // Only revert a like if server says already voted (don't revert unlikes)
        setPresetLikes(prev => {
          const reverted = { ...prev, [name]: false };
          localStorage.setItem('xp-preset-likes', JSON.stringify(reverted));
          return reverted;
        });
        setPresetCounts(prev => ({ ...prev, [name]: Math.max(0, (prev[name] ?? 0) - 1) }));
      }
    } catch {
      // Keep optimistic update on network error, will sync next load
    }
  };

  // Text size state
  const [textScale, setTextScale] = useState(1.1);

  // Text color state
  const [textColor, setTextColor] = useState('#FFFFFF');
  const TEXT_COLORS = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Blue', value: '#0446F1' },
    { name: 'Purple', value: '#AE4DAF' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Cyan', value: '#00FFFF' },
  ];

  // PFP shape state
  const [pfpShape, setPfpShape] = useState<'circle' | 'square'>('circle');

  const applyPreset = (presetName: string) => {
    const preset = XP_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setSelectedPreset(presetName);
      setXpBackgroundImage(preset.image);
      setXpBackgroundVideo(preset.video);
    }
  };

  const idFileInputRef = useRef<HTMLInputElement>(null);
  const xpFileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [idDragging, setIdDragging] = useState(false);
  const [xpDragging, setXpDragging] = useState(false);

  // Position preset
  const [positionPreset, setPositionPreset] = useState<'low' | 'medium'>('low');
  const [contentNaturalSize, setContentNaturalSize] = useState({ w: 0, h: 0 });

  // Draggable content group
  const [contentPos, setContentPos] = useState({ x: 0, y: 0 });
  const [isContentDragging, setIsContentDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const handleContentMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContentDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: contentPos.x, py: contentPos.y };
  };

  useEffect(() => {
    if (contentRef.current) {
      setContentNaturalSize({ w: contentRef.current.scrollWidth, h: contentRef.current.scrollHeight });
    }
  }, []);

  useEffect(() => {
    if (!isContentDragging) return;
    const onMove = (e: MouseEvent) => {
      setContentPos({
        x: dragStart.current.px + (e.clientX - dragStart.current.mx),
        y: dragStart.current.py + (e.clientY - dragStart.current.my),
      });
    };
    const onUp = () => setIsContentDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isContentDragging]);

  const factions: Faction[] = ['Aetherion', 'Liberators'];

  const processImageFile = (file: File, setImage: (url: string) => void) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file, setIdProfileImage);
  };

  const handleXpImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file, setXpProfileImage);
  };

  const handleIdDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file, setIdProfileImage);
  };

  const handleXpDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setXpDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file, setXpProfileImage);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [exportProgress, setExportProgress] = useState(0);

  // Parse GIF frames using omggif
  const parseGifFrames = async (url: string) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    // @ts-ignore - omggif types
    const reader = new GifReader.GifReader(uint8);
    const numFrames = reader.numFrames();

    const frames: { imageData: ImageData; delay: number }[] = [];
    const width = reader.width;
    const height = reader.height;

    // Canvas for compositing frames
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = width;
    compositeCanvas.height = height;
    const compositeCtx = compositeCanvas.getContext('2d')!;

    for (let i = 0; i < numFrames; i++) {
      const frameInfo = reader.frameInfo(i);
      const frameData = new Uint8Array(width * height * 4);
      reader.decodeAndBlitFrameRGBA(i, frameData);

      // Create ImageData from frame
      const frameImageData = new ImageData(new Uint8ClampedArray(frameData), width, height);

      // Handle disposal - composite onto previous frame if needed
      if (frameInfo.disposal === 0 || frameInfo.disposal === 1) {
        // Draw frame onto composite
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(frameImageData, 0, 0);
        compositeCtx.drawImage(tempCanvas, 0, 0);
      } else if (frameInfo.disposal === 2) {
        // Restore to background - clear and draw frame
        compositeCtx.clearRect(0, 0, width, height);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(frameImageData, 0, 0);
        compositeCtx.drawImage(tempCanvas, 0, 0);
      }

      // Get the composited frame
      const compositedImageData = compositeCtx.getImageData(0, 0, width, height);

      frames.push({
        imageData: compositedImageData,
        delay: frameInfo.delay * 10, // Convert to ms
      });
    }

    return { frames, width, height };
  };

  // Extract frames from video
  const extractVideoFrames = async (videoUrl: string, frameRate: number = 15): Promise<{ frames: { canvas: HTMLCanvasElement; delay: number }[] }> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.src = videoUrl;

      video.onloadedmetadata = async () => {
        const duration = video.duration;
        const frameDelay = 1000 / frameRate;
        const totalFrames = Math.floor(duration * frameRate);
        const frames: { canvas: HTMLCanvasElement; delay: number }[] = [];

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d')!;

        for (let i = 0; i < totalFrames; i++) {
          video.currentTime = i / frameRate;
          await new Promise<void>((res) => {
            video.onseeked = () => res();
          });

          const frameCanvas = document.createElement('canvas');
          frameCanvas.width = video.videoWidth;
          frameCanvas.height = video.videoHeight;
          const frameCtx = frameCanvas.getContext('2d')!;
          frameCtx.drawImage(video, 0, 0);

          frames.push({ canvas: frameCanvas, delay: frameDelay });
        }

        resolve({ frames });
      };

      video.onerror = () => reject(new Error('Failed to load video'));
      video.load();
    });
  };

  // GIF Export — direct canvas render, no html2canvas
  const handleGifDownload = useCallback(async () => {
    if (!xpBackgroundImage || cardType !== 'xp' || !cardRef.current) return;

    setExportStatus('exporting');
    setExportProgress(0);

    try {
      const cardEl = cardRef.current;
      const cardRect = cardEl.getBoundingClientRect();
      const SCALE = 2;
      const CW = Math.round(cardRect.width * SCALE);
      const CH = Math.round(cardRect.height * SCALE);

      // Load an image as HTMLImageElement
      const loadImg = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

      // Pre-load overlay images
      const logoImg = await loadImg('/AbsLogoWhite.png');
      const pfpImg = xpProfileImage ? await loadImg(xpProfileImage) : null;

      // Parse GIF background frames
      setExportProgress(5);
      const { frames, width: bgW, height: bgH } = await parseGifFrames(xpBackgroundImage);
      if (frames.length === 0) throw new Error('No frames in GIF');
      setExportProgress(10);

      // Get rendered positions of elements relative to the card
      const relRect = (el: Element | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: (r.left - cardRect.left) * SCALE,
          y: (r.top - cardRect.top) * SCALE,
          w: r.width * SCALE,
          h: r.height * SCALE,
        };
      };

      const titleRect  = relRect(cardEl.querySelector('.abstract-xp-title'));
      const logoRect   = relRect(cardEl.querySelector('.abstract-xp-header img'));
      const avatarRect = relRect(cardEl.querySelector('.abstract-xp-avatar'));
      const nameRect   = relRect(cardEl.querySelector('.abstract-xp-name'));
      const statValRect = relRect(cardEl.querySelector('.abstract-xp-stat-value'));
      const statLblRect = relRect(cardEl.querySelector('.abstract-xp-stat-label'));

      // GIF encoder
      const GIF = (await import('gif.js')).default;
      const encoder = new GIF({
        workers: 2,
        quality: 10,
        width: CW,
        height: CH,
        workerScript: '/gif.worker.js',
      });

      const canvas = document.createElement('canvas');
      canvas.width = CW;
      canvas.height = CH;
      const ctx = canvas.getContext('2d')!;

      const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      };

      for (let i = 0; i < frames.length; i++) {
        setExportProgress(10 + Math.round((i / frames.length) * 82));
        if (i % 5 === 0) await new Promise(resolve => setTimeout(resolve, 0));
        const frame = frames[i];
        ctx.clearRect(0, 0, CW, CH);

        // Clip to card rounded rect
        roundRect(0, 0, CW, CH, 16 * SCALE);
        ctx.save();
        ctx.clip();

        // Draw GIF background frame scaled to cover
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = bgW;
        bgCanvas.height = bgH;
        bgCanvas.getContext('2d')!.putImageData(frame.imageData, 0, 0);
        const bgScale = Math.max(CW / bgW, CH / bgH);
        ctx.drawImage(bgCanvas, (CW - bgW * bgScale) / 2, (CH - bgH * bgScale) / 2, bgW * bgScale, bgH * bgScale);

        ctx.restore();

        // Card border
        ctx.strokeStyle = '#2edb84';
        ctx.lineWidth = 2 * SCALE;
        roundRect(SCALE, SCALE, CW - 2 * SCALE, CH - 2 * SCALE, 16 * SCALE);
        ctx.stroke();

        // "ABSTRACT" text
        if (titleRect) {
          ctx.fillStyle = textColor;
          ctx.font = `bold ${Math.round(titleRect.h * 0.85)}px Satoshi, sans-serif`;
          ctx.fillText('ABSTRACT', titleRect.x, titleRect.y + titleRect.h * 0.85);
        }

        // Abstract logo
        if (logoRect) {
          ctx.drawImage(logoImg, logoRect.x, logoRect.y, logoRect.w, logoRect.h);
        }


        // Profile avatar
        if (avatarRect && pfpImg) {
          ctx.save();
          if (pfpShape === 'circle') {
            ctx.beginPath();
            ctx.arc(avatarRect.x + avatarRect.w / 2, avatarRect.y + avatarRect.h / 2, avatarRect.w / 2, 0, Math.PI * 2);
            ctx.clip();
          }
          ctx.drawImage(pfpImg, avatarRect.x, avatarRect.y, avatarRect.w, avatarRect.h);
          ctx.restore();
          ctx.strokeStyle = 'rgba(46,219,132,0.4)';
          ctx.lineWidth = 2 * SCALE;
          if (pfpShape === 'circle') {
            ctx.beginPath();
            ctx.arc(avatarRect.x + avatarRect.w / 2, avatarRect.y + avatarRect.h / 2, avatarRect.w / 2, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.strokeRect(avatarRect.x, avatarRect.y, avatarRect.w, avatarRect.h);
          }
        }

        // Display name
        if (nameRect) {
          ctx.fillStyle = textColor;
          ctx.font = `600 ${Math.round(nameRect.h * 0.85)}px Satoshi, sans-serif`;
          ctx.fillText(xpDisplayName || 'Your Name', nameRect.x, nameRect.y + nameRect.h * 0.85);
        }

        // XP amount
        if (statValRect) {
          ctx.fillStyle = textColor;
          ctx.font = `bold ${Math.round(statValRect.h)}px Satoshi, sans-serif`;
          ctx.fillText(xpAmount || '0', statValRect.x, statValRect.y + statValRect.h * 0.9);
        }

        // XP label
        if (statLblRect) {
          ctx.fillStyle = textColor;
          ctx.font = `${Math.round(statLblRect.h * 0.85)}px Satoshi, sans-serif`;
          ctx.fillText('XP', statLblRect.x, statLblRect.y + statLblRect.h * 0.9);
        }

        // Watermark
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = `${12 * SCALE}px Satoshi, sans-serif`;
        const wmW = ctx.measureText('Hamieverse').width;
        ctx.fillText('Hamieverse', CW - wmW - 10 * SCALE, CH - 8 * SCALE);

        encoder.addFrame(canvas, { delay: frame.delay, copy: true });
      }

      setExportProgress(95);

      encoder.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `Hamieverse-xp-${xpDisplayName || 'card'}.gif`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setExportStatus('success');
        setExportProgress(100);
        setTimeout(() => { setExportStatus('idle'); setExportProgress(0); }, 2000);
      });

      encoder.render();

    } catch (error) {
      console.error('GIF export error:', error);
      setExportStatus('error');
      setTimeout(() => { setExportStatus('idle'); setExportProgress(0); }, 2000);
    }
  }, [xpBackgroundImage, xpDisplayName, xpAmount, xpProfileImage, pfpShape, textColor, cardType]);

  const handleStaticCopy = useCallback(async () => {
    if (!cardRef.current || !xpBackgroundImage) return;
    setCopyStatus('idle');

    try {
      const cardEl = cardRef.current;
      const cardRect = cardEl.getBoundingClientRect();
      const SCALE = 4;
      const CW = Math.round(cardRect.width * SCALE);
      const CH = Math.round(cardRect.height * SCALE);

      // Step 1: load PNG and draw it scaled to cover at SCALE resolution
      const bgImg = await new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = xpBackgroundImage;
      });
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = CW;
      finalCanvas.height = CH;
      const finalCtx = finalCanvas.getContext('2d')!;
      const bgScale = Math.max(CW / bgImg.naturalWidth, CH / bgImg.naturalHeight);
      const bgW = bgImg.naturalWidth * bgScale;
      const bgH = bgImg.naturalHeight * bgScale;
      finalCtx.drawImage(bgImg, (CW - bgW) / 2, (CH - bgH) / 2, bgW, bgH);

      // Step 2: capture overlay (avatar, text, etc.) with html2canvas, background stripped
      const html2canvas = (await import('html2canvas')).default;
      const overlayCanvas = await html2canvas(cardEl, {
        backgroundColor: null,
        scale: SCALE,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (_doc, el) => {
          el.style.setProperty('background', 'transparent', 'important');
          el.style.setProperty('box-shadow', 'none', 'important');
          el.style.setProperty('border', 'none', 'important');
        },
      });

      // Step 3: composite overlay on top of the sharp PNG background
      finalCtx.drawImage(overlayCanvas, 0, 0);

      finalCanvas.toBlob(async (blob) => {
        if (!blob) { setCopyStatus('error'); setTimeout(() => setCopyStatus('idle'), 2000); return; }
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopyStatus('success');
          setTimeout(() => setCopyStatus('idle'), 2000);
        } catch {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2000);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Copy error:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  }, [cardRef, xpBackgroundImage]);

  const _handleStaticCopy_unused = async () => {
    if (!xpBackgroundImage || !cardRef.current) return;

    try {
      const cardEl = cardRef.current;
      const cardRect = cardEl.getBoundingClientRect();
      const SCALE = 2;
      const CW = Math.round(cardRect.width * SCALE);
      const CH = Math.round(cardRect.height * SCALE);

      const loadImg = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

      const [bgImg, logoImg, pfpImg] = await Promise.all([
        loadImg(xpBackgroundImage),
        loadImg('/AbsLogoWhite.png'),
        xpProfileImage ? loadImg(xpProfileImage) : Promise.resolve(null),
      ]);

      const relRect = (el: Element | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: (r.left - cardRect.left) * SCALE,
          y: (r.top - cardRect.top) * SCALE,
          w: r.width * SCALE,
          h: r.height * SCALE,
        };
      };

      const titleRect   = relRect(cardEl.querySelector('.abstract-xp-title'));
      const logoRect    = relRect(cardEl.querySelector('.abstract-xp-header img'));
      const avatarRect  = relRect(cardEl.querySelector('.abstract-xp-avatar'));
      const nameRect    = relRect(cardEl.querySelector('.abstract-xp-name'));
      const statValRect = relRect(cardEl.querySelector('.abstract-xp-stat-value'));
      const statLblRect = relRect(cardEl.querySelector('.abstract-xp-stat-label'));

      const canvas = document.createElement('canvas');
      canvas.width = CW;
      canvas.height = CH;
      const ctx = canvas.getContext('2d')!;

      const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      };

      // Clip + background
      roundRect(0, 0, CW, CH, 16 * SCALE);
      ctx.save();
      ctx.clip();
      const bgScale = Math.max(CW / bgImg.width, CH / bgImg.height);
      ctx.drawImage(bgImg, (CW - bgImg.width * bgScale) / 2, (CH - bgImg.height * bgScale) / 2, bgImg.width * bgScale, bgImg.height * bgScale);
      ctx.restore();

      // Border
      ctx.strokeStyle = '#2edb84';
      ctx.lineWidth = 2 * SCALE;
      roundRect(SCALE, SCALE, CW - 2 * SCALE, CH - 2 * SCALE, 16 * SCALE);
      ctx.stroke();

      if (titleRect) {
        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.round(titleRect.h * 0.85)}px Satoshi, sans-serif`;
        ctx.fillText('ABSTRACT', titleRect.x, titleRect.y + titleRect.h * 0.85);
      }
      if (logoRect) {
        ctx.drawImage(logoImg, logoRect.x, logoRect.y, logoRect.w, logoRect.h);
      }
      if (avatarRect && pfpImg) {
        ctx.save();
        if (pfpShape === 'circle') {
          ctx.beginPath();
          ctx.arc(avatarRect.x + avatarRect.w / 2, avatarRect.y + avatarRect.h / 2, avatarRect.w / 2, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.drawImage(pfpImg, avatarRect.x, avatarRect.y, avatarRect.w, avatarRect.h);
        ctx.restore();
        ctx.strokeStyle = 'rgba(46,219,132,0.4)';
        ctx.lineWidth = 2 * SCALE;
        if (pfpShape === 'circle') {
          ctx.beginPath();
          ctx.arc(avatarRect.x + avatarRect.w / 2, avatarRect.y + avatarRect.h / 2, avatarRect.w / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.strokeRect(avatarRect.x, avatarRect.y, avatarRect.w, avatarRect.h);
        }
      }
      if (nameRect) {
        ctx.fillStyle = textColor;
        ctx.font = `600 ${Math.round(nameRect.h * 0.85)}px Satoshi, sans-serif`;
        ctx.fillText(xpDisplayName || 'Your Name', nameRect.x, nameRect.y + nameRect.h * 0.85);
      }
      if (statValRect) {
        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.round(statValRect.h)}px Satoshi, sans-serif`;
        ctx.fillText(xpAmount || '0', statValRect.x, statValRect.y + statValRect.h * 0.9);
      }
      if (statLblRect) {
        ctx.fillStyle = textColor;
        ctx.font = `${Math.round(statLblRect.h * 0.85)}px Satoshi, sans-serif`;
        ctx.fillText('XP', statLblRect.x, statLblRect.y + statLblRect.h * 0.9);
      }

      // Watermark
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `${12 * SCALE}px Satoshi, sans-serif`;
      const wmW = ctx.measureText('Hamieverse').width;
      ctx.fillText('Hamieverse', CW - wmW - 10 * SCALE, CH - 8 * SCALE);

      canvas.toBlob(async (blob) => {
        if (!blob) { setCopyStatus('error'); setTimeout(() => setCopyStatus('idle'), 2000); return; }
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopyStatus('success');
          setTimeout(() => setCopyStatus('idle'), 2000);
        } catch {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2000);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Static copy error:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const name = cardType === 'id' ? idDisplayName : xpDisplayName;
      const link = document.createElement('a');
      link.download = `abstract-${cardType}-${name || 'card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleCopy = async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2000);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopyStatus('success');
          setTimeout(() => setCopyStatus('idle'), 2000);
        } catch {
          setCopyStatus('error');
          setTimeout(() => setCopyStatus('idle'), 2000);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error copying image:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <ErrorBoundary>
      <style>{`
        /* Fauna font loaded from globals.css */
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0); }
          85% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
      <main className="container xp-card-main">
        {/* Comic Book Decorations */}
        <div className="comic-decoration comic-deco-1" aria-hidden="true">POW!</div>
        <div className="comic-decoration comic-deco-2" aria-hidden="true">HAMIE</div>
        <div className="comic-decoration comic-deco-3" aria-hidden="true">★</div>

        {/* Page Header */}
        <div className="xp-card-header-wrapper">
          <div className="xp-card-header">
            <h1 className="xp-card-title">XP CARD GENERATOR</h1>
            <p className="xp-card-subtitle">Create your custom Abstract ID or XP card</p>
          </div>
        </div>

      {/* Main Layout */}
      <div className="id-generator-grid">
        {/* Configuration Card */}
        <div className="id-config-card">
          {/* Card Type Toggle */}
          <div className="card-type-toggle" style={{ marginBottom: '1rem' }}>
            <button
              className={`card-type-btn ${cardType === 'xp' ? 'active' : ''}`}
              onClick={() => setCardType('xp')}
            >
              XP Card
            </button>
            <button
              className={`card-type-btn ${cardType === 'id' ? 'active' : ''}`}
              onClick={() => setCardType('id')}
            >
              ID Card
            </button>
          </div>

          {cardType === 'id' ? (
            <>
              {/* ID Card Fields */}
              <div className="id-section">
                <label className="id-label">Profile Image</label>
                <div
                  className="id-upload-box"
                  onClick={() => idFileInputRef.current?.click()}
                  onDrop={handleIdDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => { e.preventDefault(); setIdDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIdDragging(false); }}
                  style={{
                    borderColor: idDragging ? '#2edb84' : undefined,
                    background: idDragging ? 'rgba(46, 219, 132, 0.1)' : undefined,
                    transform: idDragging ? 'scale(1.02)' : undefined,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {idProfileImage ? (
                    <img src={idProfileImage} alt="Profile" className="id-upload-preview" />
                  ) : (
                    <div className="id-upload-placeholder">
                      <span className="id-upload-icon">+</span>
                      <span>{idDragging ? 'Drop image here' : 'Click or drag to upload'}</span>
                    </div>
                  )}
                  <input
                    ref={idFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIdImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="id-section">
                <label className="id-label">Display Name</label>
                <input
                  type="text"
                  className="id-input"
                  placeholder="Enter your name"
                  value={idDisplayName}
                  onChange={(e) => setIdDisplayName(e.target.value)}
                />
              </div>

              <div className="id-section">
                <label className="id-label">Role</label>
                <div className="id-role-list">
                  {ROLE_OPTIONS.map((r) => (
                    <button
                      key={r.value}
                      className={`id-role-btn ${role === r.value ? 'active' : ''}`}
                      onClick={() => setRole(r.value)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="id-section">
                <label className="id-label">Faction</label>
                <div className="id-role-list">
                  {factions.map((f) => (
                    <button
                      key={f}
                      className={`id-role-btn ${faction === f ? 'active' : ''}`}
                      onClick={() => setFaction(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* All fields in one row */}
              <div className="id-row">
                <div className="id-section">
                  <label className="id-label">PFP</label>
                  <div
                    className="id-upload-box id-upload-small"
                    onClick={() => xpFileInputRef.current?.click()}
                    onDrop={handleXpDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => { e.preventDefault(); setXpDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setXpDragging(false); }}
                    style={{
                      borderColor: xpDragging ? '#2edb84' : undefined,
                      background: xpDragging ? 'rgba(46, 219, 132, 0.1)' : undefined,
                    }}
                  >
                    {xpProfileImage ? (
                      <img src={xpProfileImage} alt="Profile" className="id-upload-preview" />
                    ) : (
                      <span className="id-upload-icon">+</span>
                    )}
                    <input
                      ref={xpFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleXpImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div className="id-section" style={{ flex: 1 }}>
                  <label className="id-label">Name</label>
                  <input
                    type="text"
                    className="id-input"
                    placeholder="Your name"
                    value={xpDisplayName}
                    onChange={(e) => setXpDisplayName(e.target.value)}
                  />
                </div>

                <div className="id-section" style={{ flex: 1 }}>
                  <label className="id-label">XP</label>
                  <input
                    type="text"
                    className="id-input"
                    placeholder="12,500"
                    value={xpAmount}
                    onChange={(e) => setXpAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Color picker and PFP Shape on same row */}
              <div className="id-row">
                <div className="id-section">
                  <label className="id-label">Text Color</label>
                  <div className="text-color-picker">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={`text-color-btn ${textColor === color.value ? 'active' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setTextColor(color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="id-section">
                  <label className="id-label">Text / PFP Size</label>
                  <div className="pfp-shape-picker">
                    <button className="pfp-shape-btn" onClick={() => setTextScale(s => Math.max(0.5, +(s - 0.1).toFixed(1)))}>−</button>
                    <button className="pfp-shape-btn" onClick={() => setTextScale(s => Math.min(2, +(s + 0.1).toFixed(1)))}>+</button>
                  </div>
                </div>
                <div className="id-section">
                  <label className="id-label">PFP Shape</label>
                  <div className="pfp-shape-picker">
                    <button
                      className={`pfp-shape-btn ${pfpShape === 'circle' ? 'active' : ''}`}
                      onClick={() => setPfpShape('circle')}
                    >
                      Circle
                    </button>
                    <button
                      className={`pfp-shape-btn ${pfpShape === 'square' ? 'active' : ''}`}
                      onClick={() => setPfpShape('square')}
                    >
                      Square
                    </button>
                  </div>
                </div>
                <div className="id-section">
                  <label className="id-label">Text Position</label>
                  <div className="pfp-shape-picker">
                    <button
                      className={`pfp-shape-btn ${positionPreset === 'low' ? 'active' : ''}`}
                      onClick={() => { setPositionPreset('low'); setContentPos({ x: 0, y: 0 }); }}
                    >
                      Low
                    </button>
                    <button
                      className={`pfp-shape-btn ${positionPreset === 'medium' ? 'active' : ''}`}
                      onClick={() => { setPositionPreset('medium'); setContentPos({ x: 0, y: 0 }); }}
                    >
                      Medium
                    </button>
                  </div>
                </div>
              </div>

              {/* XP Card Presets - below fields */}
              <div className="id-section" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <label className="id-label" style={{ margin: 0 }}>Background Presets</label>
                  <div className="pfp-shape-picker" style={{ margin: 0 }}>
                    <button className={`pfp-shape-btn ${templateFilter === 'static' ? 'active' : ''}`} onClick={() => setTemplateFilter('static')}>Static</button>
                    <button className={`pfp-shape-btn ${templateFilter === 'videos' ? 'active' : ''}`} onClick={() => setTemplateFilter('videos')}>Videos</button>
                  </div>
                  <button
                    title="Reset card"
                    className="pfp-shape-btn"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => {
                      setPositionPreset('low');
                      setContentPos({ x: 0, y: 0 });
                      setTextScale(1);
                      setPfpShape('circle');
                      setXpBackgroundImage('/HammieBannerBigger.gif');
                      setXpBackgroundVideo(null);
                      setSelectedPreset('Hammie');
                      setTemplateFilter('videos');
                    }}
                  >↺</button>
                </div>
                <div className="xp-preset-grid">
                  {XP_PRESETS
                    .filter(p => templateFilter === 'videos'
                      ? (p.video !== null || (p.image !== null && p.image.endsWith('.gif')))
                      : (p.image !== null && !p.image.endsWith('.gif')))
                    .sort((a, b) => (presetCounts[b.name] ?? 0) - (presetCounts[a.name] ?? 0))
                    .map((preset) => (
                    <div
                      key={preset.name}
                      className={`xp-preset-card ${selectedPreset === preset.name ? 'active' : ''}`}
                      onClick={() => applyPreset(preset.name)}
                      title={preset.name}
                      style={{ position: 'relative' }}
                    >
                      {preset.image ? (
                        <img src={preset.image} alt={preset.name} />
                      ) : preset.video ? (
                        <video
                          key={preset.video}
                          src={preset.video}
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <span className="xp-preset-placeholder">+</span>
                      )}
                      <button
                        onClick={(e) => handleLike(e, preset.name)}
                        style={{
                          position: 'absolute', top: '3px', right: '3px',
                          background: 'none', border: 'none',
                          color: presetLikes[preset.name] ? '#ff6b8a' : 'rgba(255,255,255,0.8)',
                          fontSize: '0.85rem', cursor: 'pointer', padding: '2px',
                          display: 'flex', alignItems: 'center', gap: '2px', lineHeight: 1,
                          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        }}
                      >
                        {presetLikes[preset.name] ? '♥' : '♡'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live Preview Card */}
        <div className="id-preview-card">
          <h3 className="id-card-header">Live Preview</h3>

          <div className="id-preview-container" style={{ position: 'relative', zIndex: 101, backgroundColor: '#0f0f1a', padding: 'clamp(0.5rem, 2vw, 1.5rem)', borderRadius: '8px' }}>
            {cardType === 'id' ? (
              /* ID Card Preview */
              <div ref={cardRef} className="abstract-id-card" style={{ isolation: 'isolate', position: 'relative', zIndex: 10 }}>
                <img src="/Hamieversecardblank.png" alt="Hamieverse ID" className="abstract-id-bg" />
                <div className={`abstract-id-avatar ${pfpShape === 'circle' ? 'pfp-circle' : 'pfp-square'}`} style={{ marginLeft: 'clamp(-40px, -10vw, -75px)', marginTop: '17px', transform: 'scale(1.2)' }}>
                  {idProfileImage ? (
                    <img src={idProfileImage} alt="Profile" />
                  ) : (
                    <div className="abstract-id-avatar-placeholder" />
                  )}
                </div>
                <span className="abstract-id-name" style={{ marginLeft: 'clamp(35px, 8vw, 65px)', marginTop: '-5px', fontFamily: 'Satoshi, sans-serif', color: textColor, fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>{idDisplayName || 'Your Name'}</span>
                <span className="abstract-id-rank" style={{ marginLeft: 'clamp(40px, 9vw, 75px)', marginTop: '-13px', fontSize: 'clamp(0.7rem, 1.8vw, 1.0625em)', fontFamily: 'Satoshi, sans-serif', color: textColor }}>{role}</span>
                <span className="abstract-id-role" style={{ marginLeft: 'clamp(45px, 10vw, 80px)', marginTop: '3px', fontSize: 'clamp(0.75rem, 2vw, 1.1875em)', fontFamily: 'Satoshi, sans-serif', color: textColor }}>{faction}</span>
                <span style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Satoshi, sans-serif', letterSpacing: '0.08em', zIndex: 10 }}>Hamieverse</span>
              </div>
            ) : (
              /* XP Card Preview */
              <div ref={cardRef} className="abstract-xp-card" style={xpBackgroundImage && !xpBackgroundVideo ? { backgroundImage: `url(${xpBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {xpBackgroundVideo && (
                  <video
                    key={xpBackgroundVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 0,
                      borderRadius: '16px',
                    }}
                    src={xpBackgroundVideo}
                  />
                )}
                <div className="abstract-xp-header" style={{ position: 'relative', zIndex: 1, justifyContent: 'flex-start', gap: '2px', paddingLeft: 'clamp(8px, 3vw, 16px)', transform: 'translateX(-5%) translateY(-25%)' }}>
                  <span className="abstract-xp-title" style={{ color: textColor, fontSize: 'clamp(0.6rem, 2vw, 0.9rem)' }}>ABSTRACT</span>
                  <img src="/AbsLogoWhite.png" alt="Abstract" style={{ height: 'clamp(20px, 5vw, 28px)', width: 'auto', marginLeft: '-2px' }} />
                </div>
                <span style={{ position: 'absolute', bottom: '8px', right: '10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Satoshi, sans-serif', letterSpacing: '0.08em', zIndex: 10 }}>Hamieverse</span>
                <div
                  ref={contentRef}
                  className="abstract-xp-content"
                  style={{
                    position: 'relative', zIndex: 2,
                    transform: `translate(calc(-20% + ${contentPos.x + 0.3 * (textScale - 1) * contentNaturalSize.w}px), calc(${positionPreset === 'medium' ? '-35%' : '30%'} + ${contentPos.y - 0.3 * (textScale - 1) * contentNaturalSize.h}px)) scale(${0.6 * textScale})`,
                    transformOrigin: 'center center',
                    cursor: isContentDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                  }}
                  onMouseDown={handleContentMouseDown}
                >
                  <div className={`abstract-xp-avatar ${pfpShape === 'circle' ? 'pfp-circle' : 'pfp-square'}`}>
                    {xpProfileImage ? (
                      <img src={xpProfileImage} alt="Profile" />
                    ) : (
                      <div className="abstract-xp-avatar-placeholder" />
                    )}
                  </div>
                  <div className="abstract-xp-info">
                    <p className="abstract-xp-name" style={{ color: textColor }}>{xpDisplayName || 'Your Name'}</p>
                    <div className="abstract-xp-stats">
                      <div className="abstract-xp-stat">
                        <span className="abstract-xp-stat-value" style={{ color: textColor }}>{xpAmount || '0'}</span>
                        <span className="abstract-xp-stat-label" style={{ color: textColor }}>XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="id-btn-group">
            {cardType === 'id' ? (
              <>
                <button className="id-download-btn" onClick={handleCopy}>
                  {copyStatus === 'success' ? 'COPIED!' : copyStatus === 'error' ? 'FAILED' : 'COPY CARD'}
                </button>
                <button className="id-download-btn" onClick={handleDownload}>
                  DOWNLOAD PNG
                </button>
              </>
            ) : xpBackgroundImage && !xpBackgroundImage.endsWith('.gif') && !xpBackgroundVideo ? (
              <button className="id-download-btn" onClick={handleStaticCopy}>
                {copyStatus === 'success' ? 'COPIED!' : copyStatus === 'error' ? 'FAILED' : 'COPY CARD'}
              </button>
            ) : (
              <button
                className="id-download-btn"
                onClick={handleGifDownload}
                disabled={exportStatus === 'exporting'}
                style={exportStatus === 'exporting' ? { opacity: 0.9 } : undefined}
              >
                {exportStatus === 'exporting'
                  ? `GENERATING ${exportProgress}%`
                  : exportStatus === 'success'
                  ? 'DONE!'
                  : exportStatus === 'error'
                  ? 'FAILED'
                  : 'GENERATE CARD'}
              </button>
            )}
          </div>
        </div>
      </div>
      </main>
    </ErrorBoundary>
  );
}
