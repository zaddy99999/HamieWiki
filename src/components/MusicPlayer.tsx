'use client';

import { useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

// Free lofi tracks from various sources
const lofiTracks: Track[] = [
  {
    id: '1',
    title: 'Chill Vibes',
    artist: 'Lofi Beats',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  },
  {
    id: '2',
    title: 'Late Night Study',
    artist: 'Chillhop',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b0939c8.mp3',
  },
  {
    id: '3',
    title: 'Rainy Day',
    artist: 'Lo-Fi Dreams',
    url: 'https://cdn.pixabay.com/download/audio/2023/04/24/audio_3dcf962dab.mp3',
  },
  {
    id: '4',
    title: 'Coffee Shop',
    artist: 'Ambient Waves',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
  },
  {
    id: '5',
    title: 'Midnight Coding',
    artist: 'Lofi Coder',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b32e02f9.mp3',
  },
];

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = lofiTracks[currentTrackIndex];

  useEffect(() => {
    // Load saved preferences
    const savedVolume = localStorage.getItem('music-volume');
    if (savedVolume) setVolume(parseFloat(savedVolume));
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem('music-volume', volume.toString());
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      // Auto-play next track
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % lofiTracks.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 100);
    }
  };

  const prevTrack = () => {
    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIndex = currentTrackIndex === 0 ? lofiTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 100);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.url} preload="metadata" />

      {/* Music Button */}
      <button
        className={`music-player-toggle ${isOpen ? 'open' : ''} ${isPlaying ? 'playing' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle music player"
      >
        {isPlaying ? '🎵' : '🎧'}
      </button>

      {/* Music Player Panel */}
      {isOpen && (
        <div className="music-player-panel">
          <div className="music-player-header">
            <span className="music-player-title">Lofi Radio</span>
            <button className="music-player-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="music-player-track">
            <div className="music-player-art">
              <span className={isPlaying ? 'spinning' : ''}>💿</span>
            </div>
            <div className="music-player-info">
              <span className="music-track-title">{currentTrack.title}</span>
              <span className="music-track-artist">{currentTrack.artist}</span>
            </div>
          </div>

          <div className="music-player-progress" onClick={handleProgressClick}>
            <div
              className="music-player-progress-fill"
              style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
            />
          </div>

          <div className="music-player-time">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="music-player-controls">
            <button className="music-ctrl-btn" onClick={prevTrack} title="Previous / Restart">
              ⏮
            </button>
            <button className="music-ctrl-btn music-play-btn" onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="music-ctrl-btn" onClick={nextTrack} title="Next">
              ⏭
            </button>
          </div>

          <div className="music-player-volume">
            <span>🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="music-volume-slider"
            />
            <span>🔊</span>
          </div>

          <div className="music-player-playlist">
            <span className="music-playlist-label">Up Next</span>
            <div className="music-playlist-tracks">
              {lofiTracks.map((track, i) => (
                <button
                  key={track.id}
                  className={`music-playlist-track ${i === currentTrackIndex ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTrackIndex(i);
                    setProgress(0);
                    if (isPlaying) {
                      setTimeout(() => {
                        audioRef.current?.play().catch(console.error);
                      }, 100);
                    }
                  }}
                >
                  <span className="music-playlist-num">{i + 1}</span>
                  <span className="music-playlist-name">{track.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
