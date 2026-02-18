'use client';

import { useState } from 'react';
import { CheckIcon, LinkIcon } from './Icons';

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  compact?: boolean;
}

export default function SocialShare({
  title,
  description,
  url,
  hashtags = ['Hamieverse'],
  compact = false
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullText = description ? `${title} - ${description}` : title;
  const hashtagString = hashtags.join(',');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtagString}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fullText)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fullText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${fullText} ${shareUrl}`)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setShowDropdown(false);
  };

  if (compact) {
    return (
      <div className="social-share-compact">
        <button
          className="social-share-btn"
          onClick={() => setShowDropdown(!showDropdown)}
          title="Share"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>

        {showDropdown && (
          <div className="social-share-dropdown">
            <button onClick={() => openShare('twitter')} style={{ minWidth: '44px', minHeight: '44px' }}>
              <span>X</span>
            </button>
            <button onClick={() => openShare('facebook')} style={{ minWidth: '44px', minHeight: '44px' }}>
              <span>FB</span>
            </button>
            <button onClick={() => openShare('reddit')} style={{ minWidth: '44px', minHeight: '44px' }}>
              <span>R</span>
            </button>
            <button onClick={copyToClipboard} style={{ minWidth: '44px', minHeight: '44px' }}>
              <span>{copied ? <CheckIcon size={18} /> : <LinkIcon size={18} />}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="social-share">
      <span className="social-share-label">Share:</span>
      <div className="social-share-buttons">
        <button
          className="social-share-btn twitter"
          onClick={() => openShare('twitter')}
          title="Share on X/Twitter"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        <button
          className="social-share-btn facebook"
          onClick={() => openShare('facebook')}
          title="Share on Facebook"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        <button
          className="social-share-btn reddit"
          onClick={() => openShare('reddit')}
          title="Share on Reddit"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
        </button>

        <button
          className="social-share-btn telegram"
          onClick={() => openShare('telegram')}
          title="Share on Telegram"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
          </svg>
        </button>

        <button
          className="social-share-btn copy"
          onClick={copyToClipboard}
          title={copied ? 'Copied!' : 'Copy link'}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          {copied ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
