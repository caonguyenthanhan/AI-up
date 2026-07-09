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
  );
};

export default BottomNavBar;
