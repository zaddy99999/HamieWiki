'use client';

import { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const { shortcuts } = useKeyboardShortcuts({
    enableNavigation: true,
    enableCharacterNav: true,
    onHelp: () => setIsOpen(prev => !prev)
  });

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const enabledShortcuts = shortcuts.filter(s => s.enabled);
  const navShortcuts = enabledShortcuts.filter(s => ['h', 'c', 'q', 't', 'f', 'r'].includes(s.key));
  const charShortcuts = enabledShortcuts.filter(s => ['j', 'k'].includes(s.key));
  const utilShortcuts = enabledShortcuts.filter(s => ['/', 'Esc', '?'].includes(s.key));

  return (
    <>
      {/* Help Button */}
      <button
        className="keyboard-help-btn"
        onClick={() => setIsOpen(true)}
        title="Keyboard Shortcuts (?)"
      >
        <span className="keyboard-help-icon">?</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="keyboard-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="keyboard-modal" onClick={e => e.stopPropagation()}>
            <div className="keyboard-modal-header">
              <h2>Keyboard Shortcuts</h2>
              <button className="keyboard-modal-close" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <div className="keyboard-modal-content">
              {navShortcuts.length > 0 && (
                <div className="keyboard-group">
                  <h3>Navigation</h3>
                  <div className="keyboard-list">
                    {navShortcuts.map(s => (
                      <div key={s.key} className="keyboard-item">
                        <kbd>{s.key.toUpperCase()}</kbd>
                        <span>{s.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {charShortcuts.length > 0 && (
                <div className="keyboard-group">
                  <h3>Character Pages</h3>
                  <div className="keyboard-list">
                    {charShortcuts.map(s => (
                      <div key={s.key} className="keyboard-item">
                        <kbd>{s.key.toUpperCase()}</kbd>
                        <span>{s.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {utilShortcuts.length > 0 && (
                <div className="keyboard-group">
                  <h3>Utility</h3>
                  <div className="keyboard-list">
                    {utilShortcuts.map(s => (
                      <div key={s.key} className="keyboard-item">
                        <kbd>{s.key}</kbd>
                        <span>{s.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="keyboard-modal-footer">
              <span>Press <kbd>?</kbd> to toggle this menu</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
