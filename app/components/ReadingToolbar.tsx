'use client';

import React, { useState, useEffect } from 'react';

interface ReadingToolbarProps {
  postSlug: string;
  postTitle: string;
}

export default function ReadingToolbar({ postSlug, postTitle }: ReadingToolbarProps) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [focusMode, setFocusMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Load initial states from DOM and localStorage
  useEffect(() => {
    const loadState = () => {
      // 1. Theme
      const activeTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
      setTheme(activeTheme);

      // 2. Bookmarks
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(postSlug));
    };

    loadState();

    // Listen to storage events to keep state in sync
    window.addEventListener('storage', loadState);

    // 3. Listen to document theme change (if changes from header button)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
          setTheme(newTheme);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('storage', loadState);
      observer.disconnect();
    };
  }, [postSlug]);

  // Handle Font Size toggle
  const toggleFontSize = () => {
    let nextSize: 'normal' | 'large' | 'xlarge' = 'normal';
    if (fontSize === 'normal') nextSize = 'large';
    else if (fontSize === 'large') nextSize = 'xlarge';
    
    setFontSize(nextSize);

    // Toggle body font classes
    const articleBody = document.querySelector('.post-content');
    if (articleBody) {
      articleBody.classList.remove('text-normal', 'text-large', 'text-xlarge');
      if (nextSize === 'large') {
        articleBody.classList.add('text-large');
      } else if (nextSize === 'xlarge') {
        articleBody.classList.add('text-xlarge');
      } else {
        articleBody.classList.add('text-normal');
      }
    }
  };

  // Handle Theme Toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  // Handle Focus Mode Toggle
  const toggleFocusMode = () => {
    const newFocus = !focusMode;
    setFocusMode(newFocus);
    if (newFocus) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
  };

  // Handle Bookmark Toggle
  const toggleBookmark = () => {
    // 1. Update simple slugs list
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let newBookmarks = [...bookmarks];
    if (isBookmarked) {
      newBookmarks = newBookmarks.filter(slug => slug !== postSlug);
      setIsBookmarked(false);
    } else {
      newBookmarks.push(postSlug);
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));

    // 2. Update descriptive bookmarks_data list (with titles)
    const bookmarksData = JSON.parse(localStorage.getItem('bookmarks_data') || '[]');
    let newBookmarksData = [...bookmarksData];
    if (isBookmarked) {
      newBookmarksData = newBookmarksData.filter((item: any) => item.slug !== postSlug);
    } else {
      newBookmarksData.push({ slug: postSlug, title: postTitle });
    }
    localStorage.setItem('bookmarks_data', JSON.stringify(newBookmarksData));

    // Trigger storage event to notify other components (like BottomNavBar)
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <aside className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 p-3 glass-panel rounded-full shadow-xl z-40">
      <button 
        onClick={toggleFontSize}
        className={`p-3 rounded-full hover:bg-surface-variant/50 text-on-surface-variant transition-all active:scale-95 flex items-center justify-center ${fontSize !== 'normal' ? 'text-primary bg-primary/10' : ''}`}
        title={`Cỡ chữ: ${fontSize === 'normal' ? 'Mặc định' : fontSize === 'large' ? 'Lớn' : 'Rất lớn'}`}
      >
        <span className="material-symbols-outlined">text_fields</span>
      </button>
      <button 
        onClick={toggleTheme}
        className="p-3 rounded-full hover:bg-surface-variant/50 text-on-surface-variant transition-all active:scale-95 flex items-center justify-center"
        title={theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
      >
        <span className="material-symbols-outlined">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
      <button 
        onClick={toggleFocusMode}
        className={`p-3 rounded-full hover:bg-surface-variant/50 text-on-surface-variant transition-all active:scale-95 flex items-center justify-center ${focusMode ? 'text-primary bg-primary/10' : ''}`}
        title={focusMode ? 'Tắt chế độ tập trung' : 'Bật chế độ tập trung'}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: focusMode ? "'FILL' 1" : "'FILL' 0" }}>
          center_focus_strong
        </span>
      </button>
      <button 
        onClick={toggleBookmark}
        className={`p-3 rounded-full hover:bg-surface-variant/50 text-on-surface-variant transition-all active:scale-95 flex items-center justify-center ${isBookmarked ? 'text-amber-500 bg-amber-500/10' : ''}`}
        title={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0", color: isBookmarked ? '#ef9f27' : 'inherit' }}>
          bookmark
        </span>
      </button>
    </aside>
  );
}
