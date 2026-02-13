'use client';

import { useState, useRef, useEffect } from 'react';

interface Track {
  name: string;
  url: string;
}

// Placeholder tracks - replace with actual ambient music URLs
const tracks: Track[] = [
  { name: 'City Ambience', url: '/audio/city-ambient.mp3' },
  { name: 'Undercode Pulse', url: '/audio/undercode.mp3' },
  { name: 'The Beyond', url: '/audio/beyond.mp3' },
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [showPlayer, setShowPlayer] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if audio files exist
    const audio = new Audio(tracks[0].url);
    audio.addEventListener('canplaythrough', () => setHasAudio(true));
    audio.addEventListener('error', () => setHasAudio(false));

    return () => {
      audio.remove();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, that's ok
      });
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };

  // Don't show if no audio files available
  if (!hasAudio) {
    return (
      <div className="audio-player-toggle audio-unavailable" title="Audio coming soon">
        <span>🎵</span>
      </div>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={tracks[currentTrack].url}
        loop
        onEnded={nextTrack}
      />

      <button
        className={`audio-player-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={() => setShowPlayer(!showPlayer)}
        title="Toggle music player"
      >
        <span>{isPlaying ? '🎵' : '🔇'}</span>
      </button>

      {showPlayer && (
        <div className="audio-player-panel">
          <div className="audio-player-header">
            <span className="audio-player-title">Ambient Music</span>
            <button className="audio-player-close" onClick={() => setShowPlayer(false)}>×</button>
          </div>

          <div className="audio-track-info">
            <span className="audio-track-name">{tracks[currentTrack].name}</span>
          </div>

          <div className="audio-controls">
            <button className="audio-btn" onClick={prevTrack}>⏮</button>
            <button className="audio-btn audio-btn-play" onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="audio-btn" onClick={nextTrack}>⏭</button>
          </div>

          <div className="audio-volume">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="audio-volume-slider"
            />
          </div>
        </div>
      )}
    </>
  );
}
