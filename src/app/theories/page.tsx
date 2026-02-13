'use client';

import { useState, useEffect } from 'react';
import WikiNavbar from '@/components/WikiNavbar';

interface Theory {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

const CATEGORIES = [
  { id: 'character-origins', label: 'Character Origins', color: '#F7931A' },
  { id: 'plot-predictions', label: 'Plot Predictions', color: '#00D9A5' },
  { id: 'hidden-connections', label: 'Hidden Connections', color: '#627EEA' },
  { id: 'world-building', label: 'World Building', color: '#9333EA' },
  { id: 'tech-speculation', label: 'Tech Speculation', color: '#EF4444' },
];

const INITIAL_THEORIES: Theory[] = [
  {
    id: '1',
    author: 'CyberSleuth42',
    title: 'The Grandmother Connection: Is She Part of the Original Resistance?',
    content: 'I believe Hamie\'s grandmother in Virella isn\'t just a simple villager. The way she possesses knowledge about the old world and her mysterious pendant suggests she may have been part of an original resistance movement before the City\'s surveillance state fully formed. The cracked pendant could contain more than just a bridge chip - it might hold encrypted memories of the pre-surveillance era.',
    category: 'character-origins',
    upvotes: 47,
    downvotes: 5,
    createdAt: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    author: 'UndercodeAnalyst',
    title: '#257A Knew Hamie Before the Factory',
    content: 'Protocol Four-Seven-Grey wasn\'t random. I theorize that #257A recognized something in Hamie - perhaps a genetic marker or a behavioral pattern that matched someone from their past. The protocol name itself (47-Grey) might reference a classified project. #257A sacrificed themselves not just for any worker, but for someone they were programmed to protect.',
    category: 'hidden-connections',
    upvotes: 89,
    downvotes: 12,
    createdAt: '2025-01-20T14:15:00Z',
  },
  {
    id: '3',
    author: 'NeonProphet',
    title: 'The City Will Fall by Chapter 10',
    content: 'Based on the narrative pacing and the 13,000,000 AC Hamie gained from Aethercreed, I predict the City\'s surveillance infrastructure will begin to crumble by Chapter 10. The Respeculators are gathering too much power, and the Doppel Protocol has shown that the system can be beaten. Sam\'s leadership will lead to a coordinated strike on the Red Eye network.',
    category: 'plot-predictions',
    upvotes: 156,
    downvotes: 43,
    createdAt: '2025-02-01T09:00:00Z',
  },
  {
    id: '4',
    author: 'VirellaDreamer',
    title: 'Virella and the City Were Once One Nation',
    content: 'The stark contrast between Virella\'s freedom and the City\'s oppression seems intentional. I believe they were once a single nation that split after a catastrophic event - possibly related to the creation of the surveillance technology. The "old ways" the grandmother remembers might be from before this split. The Undercode could be built on the remnants of the original unified communication network.',
    category: 'world-building',
    upvotes: 72,
    downvotes: 8,
    createdAt: '2025-02-05T16:45:00Z',
  },
  {
    id: '5',
    author: 'TechSpeculator',
    title: 'The Red Eye System Has a Hidden Purpose',
    content: 'What if the Red Eye surveillance isn\'t just for control? The amount of data being collected is enormous. I theorize that the City is using this data for something bigger - perhaps training an AI, predicting future events, or even attempting to achieve some form of digital immortality for its rulers. The flickering after the Doppel Protocol might indicate the system was trying to learn from the intrusion.',
    category: 'tech-speculation',
    upvotes: 94,
    downvotes: 15,
    createdAt: '2025-02-10T11:20:00Z',
  },
  {
    id: '6',
    author: 'ShadowTheoryX',
    title: 'Simba Alias Has Deeper Meaning',
    content: 'Hamie choosing "Simba" as his Undercode alias isn\'t random. In the context of the story, it represents a prince in exile who must reclaim his kingdom. This foreshadows Hamie\'s eventual role in liberating the City. The lion symbolism also connects to themes of courage and rightful leadership that will likely define his character arc.',
    category: 'character-origins',
    upvotes: 63,
    downvotes: 7,
    createdAt: '2025-02-08T13:30:00Z',
  },
];

type SortOption = 'popular' | 'newest';

export default function TheoriesPage() {
  const [theories, setTheories] = useState<Theory[]>([]);
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    content: '',
    category: 'character-origins',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load theories from localStorage or use initial
    const savedTheories = localStorage.getItem('hamieverse-theories');
    const savedVotes = localStorage.getItem('hamieverse-theory-votes');

    if (savedTheories) {
      setTheories(JSON.parse(savedTheories));
    } else {
      setTheories(INITIAL_THEORIES);
      localStorage.setItem('hamieverse-theories', JSON.stringify(INITIAL_THEORIES));
    }

    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }

    setIsLoading(false);
  }, []);

  const handleVote = (theoryId: string, voteType: 'up' | 'down') => {
    const currentVote = votes[theoryId];
    let newVotes = { ...votes };
    let updatedTheories = theories.map(theory => {
      if (theory.id !== theoryId) return theory;

      let newTheory = { ...theory };

      // Remove previous vote if exists
      if (currentVote === 'up') {
        newTheory.upvotes--;
      } else if (currentVote === 'down') {
        newTheory.downvotes--;
      }

      // Apply new vote (toggle off if same, otherwise apply)
      if (currentVote === voteType) {
        newVotes[theoryId] = null;
      } else {
        newVotes[theoryId] = voteType;
        if (voteType === 'up') {
          newTheory.upvotes++;
        } else {
          newTheory.downvotes++;
        }
      }

      return newTheory;
    });

    setVotes(newVotes);
    setTheories(updatedTheories);
    localStorage.setItem('hamieverse-theory-votes', JSON.stringify(newVotes));
    localStorage.setItem('hamieverse-theories', JSON.stringify(updatedTheories));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.author.trim() || !formData.title.trim() || !formData.content.trim()) {
      return;
    }

    const newTheory: Theory = {
      id: Date.now().toString(),
      author: formData.author.trim(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedTheories = [newTheory, ...theories];
    setTheories(updatedTheories);
    localStorage.setItem('hamieverse-theories', JSON.stringify(updatedTheories));

    setFormData({ author: '', title: '', content: '', category: 'character-origins' });
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getScore = (theory: Theory) => theory.upvotes - theory.downvotes;

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  };

  const filteredAndSortedTheories = theories
    .filter(theory => filterCategory === 'all' || theory.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return getScore(b) - getScore(a);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (isLoading) {
    return (
      <div className="wiki-container">
        <WikiNavbar currentPage="theories" />
        <div className="theories-loading">
          <div className="quiz-spinner"></div>
          <p>Loading theories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="theories" />

      <header className="theories-header">
        <h1>Fan Theories</h1>
        <p>Share your speculations about the Hamieverse lore, characters, and plot</p>
      </header>

      <main className="theories-main">
        <div className="theories-controls">
          <div className="theories-filters">
            <div className="theories-sort">
              <button
                className={`theories-sort-btn ${sortBy === 'popular' ? 'active' : ''}`}
                onClick={() => setSortBy('popular')}
              >
                Most Popular
              </button>
              <button
                className={`theories-sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
                onClick={() => setSortBy('newest')}
              >
                Newest
              </button>
            </div>
            <div className="theories-categories">
              <button
                className={`theories-category-btn ${filterCategory === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCategory('all')}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`theories-category-btn ${filterCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat.id)}
                  style={{ '--cat-color': cat.color } as React.CSSProperties}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <button className="theories-submit-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Submit Theory'}
          </button>
        </div>

        {showForm && (
          <form className="theories-form" onSubmit={handleSubmit}>
            <h2>Submit Your Theory</h2>
            <div className="theories-form-row">
              <div className="theories-form-group">
                <label htmlFor="author">Your Name</label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Enter your username"
                  maxLength={30}
                  required
                />
              </div>
              <div className="theories-form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="theories-form-group">
              <label htmlFor="title">Theory Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your theory a compelling title"
                maxLength={100}
                required
              />
            </div>
            <div className="theories-form-group">
              <label htmlFor="content">Your Theory</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Explain your theory in detail. What evidence supports it? What implications does it have for the story?"
                rows={6}
                maxLength={2000}
                required
              />
              <span className="theories-char-count">{formData.content.length}/2000</span>
            </div>
            <button type="submit" className="theories-form-submit">
              Post Theory
            </button>
          </form>
        )}

        <div className="theories-list">
          {filteredAndSortedTheories.length === 0 ? (
            <div className="theories-empty">
              <p>No theories found in this category. Be the first to submit one!</p>
            </div>
          ) : (
            filteredAndSortedTheories.map(theory => {
              const categoryInfo = getCategoryInfo(theory.category);
              const userVote = votes[theory.id];
              const score = getScore(theory);

              return (
                <article key={theory.id} className="theory-card">
                  <div className="theory-votes">
                    <button
                      className={`theory-vote-btn upvote ${userVote === 'up' ? 'active' : ''}`}
                      onClick={() => handleVote(theory.id, 'up')}
                      aria-label="Upvote"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4l-8 8h5v8h6v-8h5z" />
                      </svg>
                    </button>
                    <span className={`theory-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : ''}`}>
                      {score}
                    </span>
                    <button
                      className={`theory-vote-btn downvote ${userVote === 'down' ? 'active' : ''}`}
                      onClick={() => handleVote(theory.id, 'down')}
                      aria-label="Downvote"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 20l8-8h-5v-8h-6v8h-5z" />
                      </svg>
                    </button>
                  </div>
                  <div className="theory-content">
                    <div className="theory-meta">
                      <span
                        className="theory-category"
                        style={{ '--cat-color': categoryInfo.color } as React.CSSProperties}
                      >
                        {categoryInfo.label}
                      </span>
                      <span className="theory-author">by {theory.author}</span>
                      <span className="theory-date">{formatDate(theory.createdAt)}</span>
                    </div>
                    <h3 className="theory-title">{theory.title}</h3>
                    <p className="theory-text">{theory.content}</p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
