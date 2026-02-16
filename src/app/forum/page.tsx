'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WikiNavbar from '@/components/WikiNavbar';
import { ChatIcon, CrystalIcon, PersonIcon, BookIcon, PaletteIcon, ArrowRightIcon } from '@/components/Icons';

interface Reply {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface Topic {
  id: string;
  title: string;
  authorName: string;
  content: string;
  createdAt: string;
  replies: Reply[];
  category: string;
}

const CATEGORIES = [
  { id: 'general', name: 'General Discussion', icon: 'chat' },
  { id: 'theories', name: 'Theories & Speculation', icon: 'crystal' },
  { id: 'characters', name: 'Character Discussion', icon: 'person' },
  { id: 'lore', name: 'Lore & World', icon: 'book' },
  { id: 'fanwork', name: 'Fan Work', icon: 'palette' },
];

export default function ForumPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [userName, setUserName] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('general');
  const [replyContent, setReplyContent] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedTopics = localStorage.getItem('hamieverse_forum_topics');
    const savedName = localStorage.getItem('hamieverse_forum_name');

    if (savedTopics) {
      try {
        setTopics(JSON.parse(savedTopics));
      } catch {
        setTopics([]);
      }
    }

    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Save topics to localStorage whenever they change
  useEffect(() => {
    if (topics.length > 0) {
      localStorage.setItem('hamieverse_forum_topics', JSON.stringify(topics));
    }
  }, [topics]);

  const handleSetName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('hamieverse_forum_name', tempName.trim());
      setShowNamePrompt(false);
      setTempName('');
    }
  };

  const handleCreateTopic = () => {
    if (!userName) {
      setShowNamePrompt(true);
      return;
    }

    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;

    const newTopic: Topic = {
      id: Date.now().toString(),
      title: newTopicTitle.trim(),
      authorName: userName,
      content: newTopicContent.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
      category: newTopicCategory,
    };

    setTopics([newTopic, ...topics]);
    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicCategory('general');
    setShowNewTopic(false);
  };

  const handleReply = () => {
    if (!userName) {
      setShowNamePrompt(true);
      return;
    }

    if (!replyContent.trim() || !selectedTopic) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      authorName: userName,
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedTopics = topics.map((topic) =>
      topic.id === selectedTopic.id
        ? { ...topic, replies: [...topic.replies, newReply] }
        : topic
    );

    setTopics(updatedTopics);
    setSelectedTopic({
      ...selectedTopic,
      replies: [...selectedTopic.replies, newReply],
    });
    setReplyContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getLastActivity = (topic: Topic) => {
    if (topic.replies.length === 0) {
      return topic.createdAt;
    }
    return topic.replies[topic.replies.length - 1].createdAt;
  };

  const filteredTopics = selectedCategory
    ? topics.filter((t) => t.category === selectedCategory)
    : topics;

  const sortedTopics = [...filteredTopics].sort(
    (a, b) =>
      new Date(getLastActivity(b)).getTime() -
      new Date(getLastActivity(a)).getTime()
  );

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'chat': return <ChatIcon size={16} />;
      case 'crystal': return <CrystalIcon size={16} />;
      case 'person': return <PersonIcon size={16} />;
      case 'book': return <BookIcon size={16} />;
      case 'palette': return <PaletteIcon size={16} />;
      default: return <ChatIcon size={16} />;
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
    return { ...category, icon: getIconComponent(category.icon) };
  };

  return (
    <div className="wiki-container">
      <WikiNavbar currentPage="forum" />

      {/* Name Prompt Modal */}
      {showNamePrompt && (
        <div className="forum-modal-overlay" onClick={() => setShowNamePrompt(false)}>
          <div className="forum-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Your Name</h3>
            <p>Choose a display name for the forum</p>
            <input
              type="text"
              className="forum-input"
              placeholder="Your name..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
              autoFocus
            />
            <div className="forum-modal-actions">
              <button className="forum-btn" onClick={() => setShowNamePrompt(false)}>
                Cancel
              </button>
              <button className="forum-btn primary" onClick={handleSetName}>
                Save Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="forum-header">
        <h1>Community Forum</h1>
        <p>Discuss theories, characters, and all things Hamieverse</p>
      </header>

      {/* Main Content */}
      <main className="forum-main">
        {/* Topic View */}
        {selectedTopic ? (
          <div className="forum-topic-view">
            <button
              className="forum-back-btn"
              onClick={() => setSelectedTopic(null)}
            >
              ← Back to Topics
            </button>

            <article className="forum-topic-detail">
              <div className="forum-topic-header">
                <span className="forum-category-badge">
                  {getCategoryInfo(selectedTopic.category).icon}{' '}
                  {getCategoryInfo(selectedTopic.category).name}
                </span>
                <h2>{selectedTopic.title}</h2>
                <div className="forum-topic-meta">
                  <span className="forum-author">
                    <PersonIcon size={14} /> {selectedTopic.authorName}
                  </span>
                  <span className="forum-date">
                    {formatDate(selectedTopic.createdAt)}
                  </span>
                </div>
              </div>
              <div className="forum-topic-content">
                {selectedTopic.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>

            {/* Replies */}
            <section className="forum-replies">
              <h3>
                Replies{' '}
                <span className="forum-reply-count">
                  ({selectedTopic.replies.length})
                </span>
              </h3>

              {selectedTopic.replies.length === 0 ? (
                <div className="forum-no-replies">
                  <p>No replies yet. Be the first to respond!</p>
                </div>
              ) : (
                <div className="forum-replies-list">
                  {selectedTopic.replies.map((reply) => (
                    <div key={reply.id} className="forum-reply">
                      <div className="forum-reply-header">
                        <span className="forum-author">
                          <PersonIcon size={14} /> {reply.authorName}
                        </span>
                        <span className="forum-date">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <div className="forum-reply-content">
                        {reply.content.split('\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <div className="forum-reply-form">
                <h4>Post a Reply</h4>
                {!userName && (
                  <button
                    className="forum-btn primary"
                    onClick={() => setShowNamePrompt(true)}
                  >
                    Set Your Name to Reply
                  </button>
                )}
                {userName && (
                  <>
                    <textarea
                      className="forum-textarea"
                      placeholder="Write your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                    />
                    <button
                      className="forum-btn primary"
                      onClick={handleReply}
                      disabled={!replyContent.trim()}
                    >
                      Post Reply
                    </button>
                  </>
                )}
              </div>
            </section>
          </div>
        ) : (
          <>
            {/* Forum Actions */}
            <div className="forum-actions">
              <button
                className="forum-btn primary new-topic-btn"
                onClick={() => {
                  if (!userName) {
                    setShowNamePrompt(true);
                  } else {
                    setShowNewTopic(true);
                  }
                }}
              >
                <span>+</span> New Topic
              </button>
            </div>

            {/* Categories Filter */}
            <div className="forum-categories">
              <button
                className={`forum-category-filter ${
                  selectedCategory === null ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Topics
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`forum-category-filter ${
                    selectedCategory === cat.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* New Topic Form */}
            {showNewTopic && (
              <div className="forum-new-topic-form">
                <h3>Create New Topic</h3>
                <div className="forum-form-group">
                  <label>Category</label>
                  <select
                    className="forum-select"
                    value={newTopicCategory}
                    onChange={(e) => setNewTopicCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="forum-form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="forum-input"
                    placeholder="Topic title..."
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                </div>
                <div className="forum-form-group">
                  <label>Content</label>
                  <textarea
                    className="forum-textarea"
                    placeholder="What do you want to discuss?"
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    rows={6}
                  />
                </div>
                <div className="forum-form-actions">
                  <button
                    className="forum-btn"
                    onClick={() => setShowNewTopic(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="forum-btn primary"
                    onClick={handleCreateTopic}
                    disabled={!newTopicTitle.trim() || !newTopicContent.trim()}
                  >
                    Create Topic
                  </button>
                </div>
              </div>
            )}

            {/* Topics List */}
            <div className="forum-topics-list">
              {sortedTopics.length === 0 ? (
                <div className="forum-empty">
                  <div className="forum-empty-icon">💬</div>
                  <h3>No topics yet</h3>
                  <p>Be the first to start a discussion!</p>
                </div>
              ) : (
                sortedTopics.map((topic) => (
                  <button
                    key={topic.id}
                    className="forum-topic-card"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="forum-topic-icon">
                      {getCategoryInfo(topic.category).icon}
                    </div>
                    <div className="forum-topic-info">
                      <h3 className="forum-topic-title">{topic.title}</h3>
                      <div className="forum-topic-meta">
                        <span className="forum-author">
                          <PersonIcon size={14} /> {topic.authorName}
                        </span>
                        <span className="forum-category-tag">
                          {getCategoryInfo(topic.category).name}
                        </span>
                      </div>
                    </div>
                    <div className="forum-topic-stats">
                      <div className="forum-stat-item">
                        <span className="forum-stat-value">
                          {topic.replies.length}
                        </span>
                        <span className="forum-stat-label">replies</span>
                      </div>
                      <div className="forum-stat-item">
                        <span className="forum-stat-label">
                          {formatDate(getLastActivity(topic))}
                        </span>
                      </div>
                    </div>
                    <span className="forum-topic-arrow"><ArrowRightIcon size={16} /></span>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="wiki-footer">
        <div className="wiki-footer-inner">
          <p className="wiki-footer-text">
            © 2024 Hamieverse Wiki — Community Forum
          </p>
          <div className="wiki-footer-links">
            <a
              href="https://x.com/hamieverse"
              className="wiki-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://discord.gg/XpheMErdk6"
              className="wiki-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
