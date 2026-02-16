'use client';

import { useState, useRef, useCallback } from 'react';
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
  { name: 'Clip 1', image: null, video: '/hamie_clip_1.mp4', displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Clip 2', image: null, video: '/hamie_clip_2.mp4', displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Clip 3', image: null, video: '/hamie_clip_3.mp4', displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Clip 4', image: null, video: '/hamie_clip_4.mp4', displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 1', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 2', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 3', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 4', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 5', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 6', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
  { name: 'Custom 7', image: null, video: null, displayName: '', xp: '', level: '', joinDate: '' },
];

export default function XPCardPage() {
  const [cardType, setCardType] = useState<CardType>('xp');

  // ID Card state - defaults for testing
  const [idProfileImage, setIdProfileImage] = useState<string | null>('/ZaddyPFP.png');
  const [idDisplayName, setIdDisplayName] = useState('Zaddy');
  const [faction, setFaction] = useState<Faction>('Aetherion');
  const [role, setRole] = useState<Role>('Genesis Holder');

  // XP Card state
  const [xpProfileImage, setXpProfileImage] = useState<string | null>('/ZaddyPFP.png');
  const [xpBackgroundImage, setXpBackgroundImage] = useState<string | null>('/HammieBannerBigger.gif');
  const [xpBackgroundVideo, setXpBackgroundVideo] = useState<string | null>(null);
  const [xpDisplayName, setXpDisplayName] = useState('Zaddy');
  const [xpAmount, setXpAmount] = useState('69,000');
  const [level, setLevel] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('Hammie');

  // Text color state
  const [textColor, setTextColor] = useState('#FFFFFF');
  const TEXT_COLORS = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#E53935' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Cyan', value: '#00FFFF' },
    { name: 'Lime', value: '#00FF00' },
  ];

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
  const [idDragging, setIdDragging] = useState(false);
  const [xpDragging, setXpDragging] = useState(false);

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

  // GIF Export function
  const handleGifDownload = useCallback(async () => {
    if ((!xpBackgroundImage && !xpBackgroundVideo) || cardType !== 'xp' || !cardRef.current) {
      return;
    }

    setExportStatus('exporting');
    setExportProgress(0);

    try {
      // Get card dimensions
      const cardEl = cardRef.current;
      const cardRect = cardEl.getBoundingClientRect();
      const cardWidth = Math.round(cardRect.width);
      const cardHeight = Math.round(cardRect.height);

      // Import dependencies
      const [html2canvas, GIF] = await Promise.all([
        import('html2canvas').then(m => m.default),
        import('gif.js').then(m => m.default),
      ]);

      // Create GIF encoder at 2x scale for quality
      const encoder = new GIF({
        workers: 2,
        quality: 10,
        width: cardWidth * 2,
        height: cardHeight * 2,
        workerScript: '/gif.worker.js',
      });

      if (xpBackgroundVideo) {
        // Handle video background
        setExportProgress(5);
        const { frames } = await extractVideoFrames(xpBackgroundVideo, 12);
        setExportProgress(20);

        // Find the video element in the card and hide it temporarily
        const videoEl = cardEl.querySelector('video');
        if (videoEl) videoEl.style.display = 'none';

        // Process each video frame
        for (let i = 0; i < frames.length; i++) {
          const frame = frames[i];
          setExportProgress(20 + Math.round((i / frames.length) * 70));

          // Set frame as background image
          const frameDataUrl = frame.canvas.toDataURL('image/png');
          cardEl.style.backgroundImage = `url(${frameDataUrl})`;
          cardEl.style.backgroundSize = 'cover';
          cardEl.style.backgroundPosition = 'center';

          // Wait for render
          await new Promise(resolve => requestAnimationFrame(resolve));
          await new Promise(resolve => setTimeout(resolve, 30));

          // Capture card - ensure full height is captured
          const capturedCanvas = await html2canvas(cardEl, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            width: cardEl.offsetWidth,
            height: cardEl.offsetHeight,
          });

          encoder.addFrame(capturedCanvas, { delay: frame.delay, copy: true });
        }

        // Restore video
        cardEl.style.backgroundImage = '';
        if (videoEl) videoEl.style.display = '';

      } else if (xpBackgroundImage) {
        // Handle GIF background
        const { frames, width, height } = await parseGifFrames(xpBackgroundImage);

        if (frames.length === 0) {
          throw new Error('No frames found in GIF');
        }

        setExportProgress(10);

        // Store original background
        const originalBg = cardEl.style.backgroundImage;

        // Process each frame
        for (let i = 0; i < frames.length; i++) {
          const frame = frames[i];
          setExportProgress(10 + Math.round((i / frames.length) * 80));

          // Convert frame ImageData to data URL
          const frameCanvas = document.createElement('canvas');
          frameCanvas.width = width;
          frameCanvas.height = height;
          const frameCtx = frameCanvas.getContext('2d')!;
          frameCtx.putImageData(frame.imageData, 0, 0);
          const frameDataUrl = frameCanvas.toDataURL('image/png');

          // Set as card background
          cardEl.style.backgroundImage = `url(${frameDataUrl})`;
          cardEl.style.backgroundSize = 'cover';
          cardEl.style.backgroundPosition = 'center';

          // Wait for render
          await new Promise(resolve => requestAnimationFrame(resolve));
          await new Promise(resolve => setTimeout(resolve, 50));

          // Capture card with html2canvas - ensure full height is captured
          const capturedCanvas = await html2canvas(cardEl, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            width: cardEl.offsetWidth,
            height: cardEl.offsetHeight,
          });

          // Add frame to GIF encoder
          encoder.addFrame(capturedCanvas, { delay: frame.delay, copy: true });
        }

        // Restore original background
        cardEl.style.backgroundImage = originalBg;
      }

      setExportProgress(95);

      // Render and download
      encoder.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `abstract-xp-${xpDisplayName || 'card'}.gif`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        setExportStatus('success');
        setExportProgress(100);
        setTimeout(() => {
          setExportStatus('idle');
          setExportProgress(0);
        }, 2000);
      });

      encoder.render();

    } catch (error) {
      console.error('Error generating GIF:', error);
      setExportStatus('error');
      setTimeout(() => {
        setExportStatus('idle');
        setExportProgress(0);
      }, 2000);
    }
  }, [xpBackgroundImage, xpBackgroundVideo, xpDisplayName, cardType]);

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
        @font-face {
          font-family: 'Mokoto';
          src: url('/fonts/Mokoto.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0); }
          85% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
      <main className="container xp-card-main">
        {/* Page Header */}
        <div className="xp-card-header">
          <h1 className="xp-card-title">XP CARD GENERATOR</h1>
          <p className="xp-card-subtitle">Create your custom Abstract ID or XP card</p>
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

              {/* Color picker on its own row */}
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

              {/* XP Card Presets - below fields */}
              <div className="id-section">
                <label className="id-label">Background Presets</label>
                <div className="xp-preset-grid">
                  {XP_PRESETS.map((preset) => (
                    <div
                      key={preset.name}
                      className={`xp-preset-card ${selectedPreset === preset.name ? 'active' : ''}`}
                      onClick={() => applyPreset(preset.name)}
                      title={preset.name}
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
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <span className="xp-preset-placeholder">+</span>
                      )}
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

          <div className="id-preview-container" style={{ position: 'relative', zIndex: 101, backgroundColor: '#E0E0E0', padding: '1.5rem', borderRadius: '8px' }}>
            {cardType === 'id' ? (
              /* ID Card Preview */
              <div ref={cardRef} className="abstract-id-card" style={{ isolation: 'isolate', position: 'relative', zIndex: 10 }}>
                <img src="/hamieversecardblank.png" alt="Hamieverse ID" className="abstract-id-bg" />
                <div className="abstract-id-avatar" style={{ marginLeft: '-75px', marginTop: '17px', transform: 'scale(1.2)' }}>
                  {idProfileImage ? (
                    <img src={idProfileImage} alt="Profile" />
                  ) : (
                    <div className="abstract-id-avatar-placeholder" />
                  )}
                </div>
                <span className="abstract-id-name" style={{ marginLeft: '65px', marginTop: '-5px', fontFamily: 'Mokoto, sans-serif', color: textColor }}>{idDisplayName || 'Your Name'}</span>
                <span className="abstract-id-rank" style={{ marginLeft: '75px', marginTop: '-13px', fontSize: '1.0625em', fontFamily: 'Mokoto, sans-serif', color: textColor }}>{role}</span>
                <span className="abstract-id-role" style={{ marginLeft: '80px', marginTop: '3px', fontSize: '1.1875em', fontFamily: 'Mokoto, sans-serif', color: textColor }}>{faction}</span>
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
                <div className="abstract-xp-header" style={{ position: 'relative', zIndex: 1 }}>
                  <span className="abstract-xp-title" style={{ color: textColor }}>ABSTRACT XP CARD</span>
                  <img src="/abspfp.png" alt="Abstract" className="abstract-xp-logo" />
                </div>
                <div className="abstract-xp-content" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="abstract-xp-avatar">
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
