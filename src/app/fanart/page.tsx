'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface FanArtItem {
  id: string;
  title: string;
  artist: string;
  artistUrl?: string;
  imageUrl: string;
  character?: string;
  likes: number;
  createdAt: number;
}

interface SubmitForm {
  title: string;
  artist: string;
  artistUrl: string;
  imageUrl: string;
  character: string;
}

// Placeholder fan art data
const placeholderArt: FanArtItem[] = [
  {
    id: '1',
    title: 'Hamie in Neon City',
    artist: 'CyberArtist42',
    artistUrl: 'https://twitter.com/example',
    imageUrl: 'https://placehold.co/400x400/1c1c1f/F7931A?text=Hamie+Art',
    character: 'hamie',
    likes: 42,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: '2',
    title: 'Sam the Guardian',
    artist: 'PixelMaster',
    imageUrl: 'https://placehold.co/400x400/1c1c1f/00D9A5?text=Sam+Art',
    character: 'sam',
    likes: 38,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: '3',
    title: 'Lira Portrait',
    artist: 'NeonDreamer',
    artistUrl: 'https://twitter.com/example2',
    imageUrl: 'https://placehold.co/400x400/1c1c1f/627EEA?text=Lira+Art',
    character: 'lira',
    likes: 56,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: '4',
    title: 'Silas in Shadow',
    artist: 'DarkInk',
    imageUrl: 'https://placehold.co/400x400/1c1c1f/9333EA?text=Silas+Art',
    character: 'silas',
    likes: 29,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: '5',
    title: 'Ace Speed Run',
    artist: 'SpeedPainter',
    artistUrl: 'https://twitter.com/example3',
    imageUrl: 'https://placehold.co/400x400/1c1c1f/EF4444?text=Ace+Art',
    character: 'ace',
    likes: 45,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: '6',
    title: 'Hikari Light',
    artist: 'GlowArtist',
    imageUrl: 'https://placehold.co/400x400/1c1c1f/FFD700?text=Hikari+Art',
    character: 'hikari',
    likes: 33,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: '7',
    title: 'Hamieverse Group Shot',
    artist: 'TeamworkArt',
    artistUrl: 'https://twitter.com/example4',
    imageUrl: 'https://placehold.co/400x400/1c1c1f/F7931A?text=Group+Art',
    character: 'other',
    likes: 67,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: '8',
    title: 'Kael the Mysterious',
    artist: 'MysteryBrush',
    imageUrl: 'https://placehold.co/400x400/1c1c1f/4B0082?text=Kael+Art',
    character: 'kael',
    likes: 24,
    createdAt: Date.now(),
  },
];

const STORAGE_KEY = 'hamieverse-fanart';
const LIKES_KEY = 'hamieverse-fanart-likes';

export default function FanArtVotingPage() {
  const [artworks, setArtworks] = useState<FanArtItem[]>([]);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [selectedArt, setSelectedArt] = useState<FanArtItem | null>(null);
  const [sortBy, setSortBy] = useState<'likes' | 'newest'>('likes');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState<SubmitForm>({
    title: '',
    artist: '',
    artistUrl: '',
    imageUrl: '',
    character: '',
  });

  // Load artworks and user likes from localStorage
  useEffect(() => {
    const storedArt = localStorage.getItem(STORAGE_KEY);
    const storedLikes = localStorage.getItem(LIKES_KEY);

    if (storedArt) {
      try {
        const parsed = JSON.parse(storedArt);
        setArtworks(parsed);
      } catch {
        // If parsing fails, use placeholder data
        setArtworks(placeholderArt);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(placeholderArt));
      }
    } else {
      // Initialize with placeholder data
      setArtworks(placeholderArt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(placeholderArt));
    }

    if (storedLikes) {
      try {
        const parsed = JSON.parse(storedLikes);
        setUserLikes(new Set(parsed));
      } catch {
        setUserLikes(new Set());
      }
    }
  }, []);

  // Save artworks to localStorage when they change
  const saveArtworks = useCallback((newArtworks: FanArtItem[]) => {
    setArtworks(newArtworks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newArtworks));
  }, []);

  // Save user likes to localStorage
  const saveLikes = useCallback((newLikes: Set<string>) => {
    setUserLikes(newLikes);
    localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(newLikes)));
  }, []);

  // Toggle like on an artwork
  const toggleLike = (artId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const newLikes = new Set(userLikes);
    const newArtworks = artworks.map(art => {
      if (art.id === artId) {
        if (newLikes.has(artId)) {
          newLikes.delete(artId);
          return { ...art, likes: art.likes - 1 };
        } else {
          newLikes.add(artId);
          return { ...art, likes: art.likes + 1 };
        }
      }
      return art;
    });

    saveLikes(newLikes);
    saveArtworks(newArtworks);

    // Update selected art if it's the one being liked
    if (selectedArt && selectedArt.id === artId) {
      const updatedArt = newArtworks.find(a => a.id === artId);
      if (updatedArt) setSelectedArt(updatedArt);
    }
  };

  // Sort artworks based on current sort mode
  const sortedArtworks = [...artworks].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    return b.createdAt - a.createdAt;
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newArt: FanArtItem = {
      id: `user-${Date.now()}`,
      title: form.title,
      artist: form.artist,
      artistUrl: form.artistUrl || undefined,
      imageUrl: form.imageUrl,
      character: form.character || undefined,
      likes: 0,
      createdAt: Date.now(),
    };

    const newArtworks = [newArt, ...artworks];
    saveArtworks(newArtworks);

    setForm({ title: '', artist: '', artistUrl: '', imageUrl: '', character: '' });
    setSubmitSuccess(true);

    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmitSuccess(false);
    }, 2000);
  };

  // Format time ago
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  };

  return (
    <div className="wiki-container">
      <main className="fanart-main">
        <header className="fanart-header">
          <h1>Fan Art Voting</h1>
          <p>Vote for your favorite community creations!</p>

          <div className="fanart-actions">
            <div className="fanart-sort-buttons">
              <button
                className={`fanart-sort-btn ${sortBy === 'likes' ? 'active' : ''}`}
                onClick={() => setSortBy('likes')}
              >
                <span className="fanart-sort-icon">&#9829;</span>
                Most Liked
              </button>
              <button
                className={`fanart-sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
                onClick={() => setSortBy('newest')}
              >
                <span className="fanart-sort-icon">&#9734;</span>
                Newest
              </button>
            </div>
            <button
              className="fanart-submit-trigger"
              onClick={() => setShowSubmitModal(true)}
            >
              + Submit Art
            </button>
          </div>
        </header>

        {sortedArtworks.length === 0 ? (
          <div className="fanart-empty">
            <div className="fanart-empty-icon">&#127912;</div>
            <h2>No Art Yet</h2>
            <p>Be the first to share your Hamieverse fan art!</p>
            <button
              className="fanart-submit-btn"
              onClick={() => setShowSubmitModal(true)}
            >
              Submit Your Art
            </button>
          </div>
        ) : (
          <div className="fanart-grid">
            {sortedArtworks.map((art, index) => (
              <div
                key={art.id}
                className={`fanart-card ${index === 0 && sortBy === 'likes' ? 'top-voted' : ''}`}
                onClick={() => setSelectedArt(art)}
              >
                {index === 0 && sortBy === 'likes' && (
                  <span className="fanart-top-badge">&#9733; Top Voted</span>
                )}
                <div className="fanart-image-container">
                  <img src={art.imageUrl} alt={art.title} className="fanart-image" />
                  <div className="fanart-overlay">
                    <span className="fanart-time">{timeAgo(art.createdAt)}</span>
                  </div>
                </div>
                <div className="fanart-info">
                  <h3 className="fanart-title">{art.title}</h3>
                  <p className="fanart-artist">by {art.artist}</p>
                  <div className="fanart-vote-row">
                    <button
                      className={`fanart-like-btn ${userLikes.has(art.id) ? 'liked' : ''}`}
                      onClick={(e) => toggleLike(art.id, e)}
                      aria-label={userLikes.has(art.id) ? 'Unlike' : 'Like'}
                    >
                      <span className="fanart-heart">{userLikes.has(art.id) ? '&#10084;' : '&#9825;'}</span>
                      <span className="fanart-like-count">{art.likes}</span>
                    </button>
                    {art.character && (
                      <Link
                        href={`/character/${art.character}`}
                        className="fanart-character-tag"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {art.character}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="fanart-modal-backdrop" onClick={() => setShowSubmitModal(false)}>
            <div className="fanart-modal" onClick={e => e.stopPropagation()}>
              <button className="fanart-modal-close" onClick={() => setShowSubmitModal(false)}>
                &#10005;
              </button>

              {submitSuccess ? (
                <div className="fanart-submit-success">
                  <div className="fanart-success-icon">&#10003;</div>
                  <h3>Art Submitted!</h3>
                  <p>Your artwork has been added to the gallery.</p>
                </div>
              ) : (
                <>
                  <h2>Submit Your Fan Art</h2>
                  <p className="fanart-modal-desc">Share your Hamieverse creations with the community!</p>

                  <form onSubmit={handleSubmit} className="fanart-submit-form">
                    <div className="fanart-form-group">
                      <label htmlFor="title">Title *</label>
                      <input
                        type="text"
                        id="title"
                        placeholder="e.g., Hamie in Neon City"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="fanart-form-group">
                      <label htmlFor="artist">Your Name *</label>
                      <input
                        type="text"
                        id="artist"
                        placeholder="How should we credit you?"
                        value={form.artist}
                        onChange={e => setForm({ ...form, artist: e.target.value })}
                        required
                      />
                    </div>

                    <div className="fanart-form-group">
                      <label htmlFor="artistUrl">Social Link (optional)</label>
                      <input
                        type="url"
                        id="artistUrl"
                        placeholder="https://twitter.com/yourhandle"
                        value={form.artistUrl}
                        onChange={e => setForm({ ...form, artistUrl: e.target.value })}
                      />
                    </div>

                    <div className="fanart-form-group">
                      <label htmlFor="imageUrl">Image URL *</label>
                      <input
                        type="url"
                        id="imageUrl"
                        placeholder="https://..."
                        value={form.imageUrl}
                        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                        required
                      />
                      <span className="fanart-form-hint">
                        Upload to Imgur, Twitter, or Discord and paste the direct image link
                      </span>
                    </div>

                    <div className="fanart-form-group">
                      <label htmlFor="character">Character Featured</label>
                      <select
                        id="character"
                        value={form.character}
                        onChange={e => setForm({ ...form, character: e.target.value })}
                      >
                        <option value="">Select character (optional)</option>
                        <option value="hamie">Hamie</option>
                        <option value="sam">Sam</option>
                        <option value="lira">Lira</option>
                        <option value="silas">Silas</option>
                        <option value="ace">Ace</option>
                        <option value="hikari">Hikari</option>
                        <option value="kael">Kael</option>
                        <option value="orrien">Orrien</option>
                        <option value="other">Other / Multiple</option>
                      </select>
                    </div>

                    <button type="submit" className="fanart-submit-form-btn">
                      Submit Art
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedArt && (
          <div className="fanart-lightbox" onClick={() => setSelectedArt(null)}>
            <div className="fanart-lightbox-content" onClick={e => e.stopPropagation()}>
              <button className="fanart-lightbox-close" onClick={() => setSelectedArt(null)}>
                &#10005;
              </button>
              <img src={selectedArt.imageUrl} alt={selectedArt.title} />
              <div className="fanart-lightbox-info">
                <h3>{selectedArt.title}</h3>
                <p>
                  by{' '}
                  {selectedArt.artistUrl ? (
                    <a href={selectedArt.artistUrl} target="_blank" rel="noopener noreferrer">
                      {selectedArt.artist}
                    </a>
                  ) : (
                    selectedArt.artist
                  )}
                </p>
                <div className="fanart-lightbox-actions">
                  <button
                    className={`fanart-lightbox-like ${userLikes.has(selectedArt.id) ? 'liked' : ''}`}
                    onClick={(e) => toggleLike(selectedArt.id, e)}
                  >
                    <span className="fanart-heart-lg">
                      {userLikes.has(selectedArt.id) ? '&#10084;' : '&#9825;'}
                    </span>
                    <span>{selectedArt.likes} likes</span>
                  </button>
                  {selectedArt.character && (
                    <Link href={`/character/${selectedArt.character}`} className="fanart-lightbox-char">
                      View {selectedArt.character}'s profile &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">&copy; 2024 Hamieverse Wiki</p>
        </div>
      </footer>
    </div>
  );
}
