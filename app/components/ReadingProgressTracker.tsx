'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ReadingProgressTrackerProps {
  postSlug: string;
  postTitle: string;
}

export default function ReadingProgressTracker({ postSlug, postTitle }: ReadingProgressTrackerProps) {
  const [showToast, setShowToast] = useState(false);
  const [savedPercentage, setSavedPercentage] = useState(0);
  const savedYRef = useRef(0);
  const activeUserRef = useRef<string | null>(null);

  // 1. Initial check for existing progress on mount
  useEffect(() => {
    const user = localStorage.getItem('active_reader');
    activeUserRef.current = user;

    if (user) {
      const progressKey = `progress_${user}`;
      const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
      const record = savedProgress[postSlug];

      if (record && record.percentage > 5 && record.scrollY > 0) {
        setSavedPercentage(record.percentage);
        savedYRef.current = record.scrollY;
        // Show the restore toast
        setShowToast(true);
      }
    }
  }, [postSlug]);

  // 2. Track scroll events to save progress
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const user = activeUserRef.current || localStorage.getItem('active_reader');
      if (!user) return; // Only track for logged-in readers

      // Throttle/debounce saving to localStorage
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const totalScrollable = scrollHeight - clientHeight;

        if (totalScrollable <= 0) return;

        const percentage = Math.min(Math.round((scrollY / totalScrollable) * 100), 100);

        // Save progress if it has changed or is significant
        const progressKey = `progress_${user}`;
        const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        // Only update if scroll position changed or has not been recorded yet
        if (!savedProgress[postSlug] || Math.abs(savedProgress[postSlug].scrollY - scrollY) > 50) {
          savedProgress[postSlug] = {
            slug: postSlug,
            title: postTitle,
            percentage,
            scrollY,
            updatedAt: Date.now(),
          };
          localStorage.setItem(progressKey, JSON.stringify(savedProgress));
        }
      }, 500); // 500ms debounce
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [postSlug, postTitle]);

  const handleRestore = () => {
    window.scrollTo({
      top: savedYRef.current,
      behavior: 'smooth',
    });
    setShowToast(false);
  };

  if (!showToast) return null;

  return (
    <div className="reading-restore-toast glass-panel card-glow">
      <div className="toast-content-wrapper">
        <span className="material-symbols-outlined bookmark-icon">auto_stories</span>
        <div className="text-container">
          <p className="toast-message">
            Bạn đang đọc dở ở <strong className="highlight-text">{savedPercentage}%</strong>
          </p>
          <p className="toast-submessage">Tiếp tục đọc từ vị trí này?</p>
        </div>
      </div>
      <div className="action-row">
        <button className="dismiss-btn" onClick={() => setShowToast(false)}>
          Bỏ qua
        </button>
        <button className="restore-btn" onClick={handleRestore}>
          Đọc tiếp
          <span className="material-symbols-outlined btn-arrow">arrow_forward</span>
        </button>
      </div>

      <style jsx>{`
        .reading-restore-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 320px;
          padding: 1.25rem;
          z-index: 1000;
          border-radius: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          border: 1px solid var(--card-border);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .toast-content-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .bookmark-icon {
          color: var(--primary);
          font-size: 1.5rem;
          margin-top: 2px;
        }

        .text-container {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .toast-message {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .highlight-text {
          color: var(--accent-teal);
          font-weight: 700;
        }

        .toast-submessage {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .action-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 0.75rem;
        }

        .dismiss-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dismiss-btn:hover {
          color: var(--on-surface);
          background: rgba(255, 255, 255, 0.05);
        }

        .restore-btn {
          background: var(--primary);
          color: var(--on-primary);
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(124, 106, 247, 0.2);
        }

        .restore-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(124, 106, 247, 0.3);
        }

        .btn-arrow {
          font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .reading-restore-toast {
            bottom: 5.5rem; /* Space for mobile navigation bar */
            right: 1rem;
            left: 1rem;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}
