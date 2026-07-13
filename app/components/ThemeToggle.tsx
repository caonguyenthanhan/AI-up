'use client';

import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load initial theme from DOM attribute set by head script to avoid flash/sync issues
  useEffect(() => {
    const activeTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Apply theme to documentElement
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    
    // Persist choice
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-on-surface-variant hover:text-primary transition-all duration-200 flex items-center justify-center rounded-xl hover:bg-surface-container-high/40 active:scale-90 cursor-pointer"
      title={theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
      aria-label="Theme Toggle"
    >
      <span className="material-symbols-outlined text-[20px]">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
