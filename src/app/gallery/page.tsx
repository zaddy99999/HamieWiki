'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FanArt {
  id: string;
  title: string;
  artist: string;
  artistUrl?: string;
  imageUrl: string;
  character?: string;
  featured?: boolean;
}

interface SubmitForm {
  title: string;
  artist: string;
  twitter: string;
  imageUrl: string;
  character: string;
}

export default function GalleryPage() {
  const [fanArtworks, setFanArtworks] = useState<FanArt[]>([]);
  const [selectedArt, setSelectedArt] = useState<FanArt | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<SubmitForm>({
    title: '',
    artist: '',
    twitter: '',
    imageUrl: '',
    character: '',
  });

  // Fetch approved fan art from API
  useEffect(() => {
    async function fetchFanArt() {
      try {
        const res = await fetch('https://zaddytools.vercel.app/api/fan-art?gameId=hamieverse&status=approved');
        const data = await res.json();
        if (data.artworks) {
          setFanArtworks(data.artworks);
        }
      } catch (err) {
        console.error('Failed to fetch fan art:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFanArt();
  }, []);

  const filteredArt = filter === 'featured'
    ? fanArtworks.filter(a => a.featured)
    : fanArtworks;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('https://zaddytools.vercel.app/api/fan-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: 'hamieverse',
          ...form,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setForm({ title: '', artist: '', twitter: '', imageUrl: '', character: '' });
        setTimeout(() => {
          setShowSubmitModal(false);
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wiki-container">
      <nav className="wiki-topbar">
        <div className="wiki-topbar-inner">
          <Link href="/" className="wiki-topbar-brand">
            <img src="/images/hamiepfp.png" alt="Hamie" className="wiki-topbar-logo" />
            <span className="wiki-topbar-title">Hamieverse</span>
          </Link>
          <div className="wiki-topbar-nav">
            <Link href="/" className="wiki-topbar-link">Home</Link>
            <Link href="/timeline" className="wiki-topbar-link">Timeline</Link>
            <Link href="/gallery" className="wiki-topbar-link active">Fan Art</Link>
          </div>
        </div>
      </nav>

      <main className="gallery-main">
        <header className="gallery-header">
          <h1>Fan Art Gallery</h1>
          <p>Community creations from the Hamieverse</p>

          <div className="gallery-actions">
            <div className="gallery-filters">
              <button
                className={`gallery-filter ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`gallery-filter ${filter === 'featured' ? 'active' : ''}`}
                onClick={() => setFilter('featured')}
              >
                Featured
              </button>
            </div>
            <button
              className="gallery-submit-trigger"
              onClick={() => setShowSubmitModal(true)}
            >
              + Submit Your Art
            </button>
          </div>
        </header>

        {loading ? (
          <div className="gallery-loading">
            <div className="gallery-loading-spinner"></div>
            <p>Loading gallery...</p>
          </div>
        ) : filteredArt.length === 0 ? (
          <div className="gallery-empty">
            <div className="gallery-empty-icon">🎨</div>
            <h2>Gallery Coming Soon</h2>
            <p>Be the first to submit your Hamieverse fan art!</p>
            <button
              className="gallery-submit-btn"
              onClick={() => setShowSubmitModal(true)}
            >
              Submit Your Art
            </button>
            <div className="gallery-submit-info">
              <p>Or share on Twitter with <strong>#HamieverseFanArt</strong></p>
            </div>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredArt.map(art => (
              <button
                key={art.id}
                className={`gallery-item ${art.featured ? 'featured' : ''}`}
                onClick={() => setSelectedArt(art)}
              >
                <img src={art.imageUrl} alt={art.title} className="gallery-image" />
                <div className="gallery-overlay">
                  <span className="gallery-item-title">{art.title}</span>
                  <span className="gallery-item-artist">by {art.artist}</span>
                </div>
                {art.featured && <span className="gallery-featured-badge">Featured</span>}
              </button>
            ))}
          </div>
        )}

        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="gallery-modal-backdrop" onClick={() => setShowSubmitModal(false)}>
            <div className="gallery-modal" onClick={e => e.stopPropagation()}>
              <button className="gallery-modal-close" onClick={() => setShowSubmitModal(false)}>×</button>

              {submitSuccess ? (
                <div className="gallery-submit-success">
                  <div className="gallery-success-icon">✓</div>
                  <h3>Submission Received!</h3>
                  <p>Your art will appear after review.</p>
                </div>
              ) : (
                <>
                  <h2>Submit Your Fan Art</h2>
                  <p className="gallery-modal-desc">Share your Hamieverse creations with the community!</p>

                  <form onSubmit={handleSubmit} className="gallery-submit-form">
                    <div className="gallery-form-group">
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

                    <div className="gallery-form-group">
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

                    <div className="gallery-form-group">
                      <label htmlFor="twitter">Twitter Handle</label>
                      <input
                        type="text"
                        id="twitter"
                        placeholder="@yourhandle"
                        value={form.twitter}
                        onChange={e => setForm({ ...form, twitter: e.target.value })}
                      />
                    </div>

                    <div className="gallery-form-group">
                      <label htmlFor="imageUrl">Image URL *</label>
                      <input
                        type="url"
                        id="imageUrl"
                        placeholder="https://..."
                        value={form.imageUrl}
                        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                        required
                      />
                      <span className="gallery-form-hint">
                        Upload to Imgur, Twitter, or Discord and paste the direct image link
                      </span>
                    </div>

                    <div className="gallery-form-group">
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

                    <button
                      type="submit"
                      className="gallery-submit-form-btn"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit for Review'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedArt && (
          <div className="gallery-lightbox" onClick={() => setSelectedArt(null)}>
            <div className="gallery-lightbox-content" onClick={e => e.stopPropagation()}>
              <button className="gallery-lightbox-close" onClick={() => setSelectedArt(null)}>×</button>
              <img src={selectedArt.imageUrl} alt={selectedArt.title} />
              <div className="gallery-lightbox-info">
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
                {selectedArt.character && (
                  <Link href={`/character/${selectedArt.character}`} className="gallery-lightbox-char">
                    View {selectedArt.character}'s profile →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">© 2024 Hamieverse Wiki</p>
        </div>
      </footer>
    </div>
  );
}
