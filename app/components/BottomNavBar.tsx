'use client';

import React, { useState } from 'react';

const BottomNavBar = () => {
  const [activeButton, setActiveButton] = useState('home');

  const navItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'search', icon: 'search', label: 'Search' },
    { id: 'bookmarks', icon: 'bookmarks', label: 'Bookmarks' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${activeButton === item.id ? 'active' : ''}`}
            onClick={() => setActiveButton(item.id)}
            aria-label={item.label}
          >
            <span
              className="material-symbols-outlined nav-icon"
              data-icon={item.icon}
              style={{
                fontVariationSettings: activeButton === item.id ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
          </button>
        ))}
      </nav>

      <style jsx>{`
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          background: var(--surface-container-low) / 0.8;
          backdrop-filter: blur(24px);
          border-top: 1px solid rgba(71, 69, 84, 0.3);
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          padding: 0.75rem 1rem;
        }

        @media (max-width: 768px) {
          .bottom-nav {
            display: flex;
          }
        }

        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--on-surface-variant);
          cursor: pointer;
          padding: 0.75rem;
          border-radius: 9999px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-btn.active {
          background: var(--primary-container);
          color: var(--on-primary-container);
        }

        .nav-btn:not(.active):hover {
          background: rgba(128, 131, 255, 0.05);
          color: var(--on-surface);
        }

        .nav-btn:active {
          transform: scale(0.9);
        }

        .nav-icon {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .nav-btn:hover .nav-icon {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default BottomNavBar;
