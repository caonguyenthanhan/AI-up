'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface BookmarkedPost {
  slug: string;
  title: string;
  dateString?: string;
}

const BottomNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');
  const [activeUser, setActiveUser] = useState<string | null>(null);
  
  // Drawer/Sheet states
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Bookmarks data state
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);

  // Settings / Profile states
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load initial states on mount and whenever tabs open or path changes
  useEffect(() => {
    if (pathname === '/') {
      if (!isBookmarksOpen && !isSettingsOpen) {
        setActiveTab('home');
      }
    } else {
      if (!isBookmarksOpen && !isSettingsOpen) {
        setActiveTab('');
      }
    }

    // Load active user
    setActiveUser(localStorage.getItem('active_reader'));

    // Load theme
    const activeTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
    setTheme(activeTheme);
  }, [pathname, isBookmarksOpen, isSettingsOpen]);

  // Load bookmarks when bookmarks drawer is opened
  useEffect(() => {
    const loadBookmarks = () => {
      const data = JSON.parse(localStorage.getItem('bookmarks_data') || '[]');
      setBookmarks(data);
    };

    if (isBookmarksOpen) {
      loadBookmarks();
    }

    // Listen to storage events to keep bookmarks updated
    window.addEventListener('storage', loadBookmarks);
    return () => window.removeEventListener('storage', loadBookmarks);
  }, [isBookmarksOpen]);

  // Handle Home Click
  const handleHomeClick = () => {
    setIsBookmarksOpen(false);
    setIsSettingsOpen(false);
    setActiveTab('home');
    router.push('/');
  };

  // Handle Search Click
  const handleSearchClick = () => {
    setIsBookmarksOpen(false);
    setIsSettingsOpen(false);
    setActiveTab('search');
    
    if (pathname === '/') {
      const searchInput = document.querySelector('input.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      router.push('/?focus=search');
    }
  };

  // Handle Bookmarks Click
  const handleBookmarksClick = () => {
    setIsSettingsOpen(false);
    setIsBookmarksOpen(!isBookmarksOpen);
    if (!isBookmarksOpen) {
      setActiveTab('bookmarks');
    } else {
      setActiveTab(pathname === '/' ? 'home' : '');
    }
  };

  // Handle Settings Click
  const handleSettingsClick = () => {
    setIsBookmarksOpen(false);
    setIsSettingsOpen(!isSettingsOpen);
    if (!isSettingsOpen) {
      setActiveTab('settings');
    } else {
      setActiveTab(pathname === '/' ? 'home' : '');
    }
  };

  // Remove Bookmark
  const handleRemoveBookmark = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Update bookmarks_data list
    const updatedData = bookmarks.filter(item => item.slug !== slug);
    setBookmarks(updatedData);
    localStorage.setItem('bookmarks_data', JSON.stringify(updatedData));

    // Update simple bookmarks slugs list (used by ReadingToolbar)
    const simpleBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const updatedSimple = simpleBookmarks.filter((s: string) => s !== slug);
    localStorage.setItem('bookmarks', JSON.stringify(updatedSimple));

    // Dispatch custom event to notify other components (like ReadingToolbar) to update their state
    window.dispatchEvent(new Event('storage'));
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

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const accounts = JSON.parse(localStorage.getItem('user_accounts') || '{}');
    if (!accounts[username] || accounts[username] !== password) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      return;
    }

    localStorage.setItem('active_reader', username);
    setActiveUser(username);
    setSuccess('Đăng nhập thành công!');
    setUsername('');
    setPassword('');
    setTimeout(() => {
      setSuccess('');
    }, 1500);
  };

  // Register handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const accounts = JSON.parse(localStorage.getItem('user_accounts') || '{}');
    if (accounts[username]) {
      setError('Tài khoản đã tồn tại.');
      return;
    }

    accounts[username] = password;
    localStorage.setItem('user_accounts', JSON.stringify(accounts));
    localStorage.setItem('active_reader', username);
    setActiveUser(username);
    setSuccess('Đăng ký thành công!');
    setUsername('');
    setPassword('');
    setTimeout(() => {
      setSuccess('');
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('active_reader');
    setActiveUser(null);
    setIsSettingsOpen(false);
  };

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="bottom-nav animate-fade-in" aria-label="Mobile navigation">
        <button
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={handleHomeClick}
          aria-label="Home"
        >
          <span className="material-symbols-outlined nav-icon" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>
            home
          </span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={handleSearchClick}
          aria-label="Search"
        >
          <span className="material-symbols-outlined nav-icon" style={{ fontVariationSettings: activeTab === 'search' ? "'FILL' 1" : "'FILL' 0" }}>
            search
          </span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={handleBookmarksClick}
          aria-label="Bookmarks"
        >
          <span className="material-symbols-outlined nav-icon" style={{ fontVariationSettings: activeTab === 'bookmarks' ? "'FILL' 1" : "'FILL' 0" }}>
            bookmarks
          </span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={handleSettingsClick}
          aria-label="Settings"
        >
          <span className="material-symbols-outlined nav-icon" style={{ fontVariationSettings: activeTab === 'settings' ? "'FILL' 1" : "'FILL' 0" }}>
            settings
          </span>
        </button>
      </nav>

      {/* Bookmarks Bottom Sheet */}
      {isBookmarksOpen && (
        <div className="bottom-sheet glass-panel card-glow z-50">
          <div className="sheet-header">
            <h3 className="sheet-title">Bài Viết Đã Đánh Dấu</h3>
            <button className="sheet-close" onClick={() => setIsBookmarksOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="sheet-content scrollbar-thin">
            {bookmarks.length === 0 ? (
              <p className="empty-text">Chưa có bài viết nào được đánh dấu.</p>
            ) : (
              <div className="bookmarks-list">
                {bookmarks.map((item) => (
                  <div key={item.slug} className="bookmark-item-container">
                    <Link
                      href={`/blog/${item.slug}`}
                      onClick={() => setIsBookmarksOpen(false)}
                      className="bookmark-item-link"
                    >
                      <span className="material-symbols-outlined post-icon">menu_book</span>
                      <span className="bookmark-title">{item.title}</span>
                    </Link>
                    <button
                      onClick={(e) => handleRemoveBookmark(item.slug, e)}
                      className="bookmark-remove-btn"
                      title="Bỏ đánh dấu"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Bottom Sheet */}
      {isSettingsOpen && (
        <div className="bottom-sheet glass-panel card-glow z-50">
          <div className="sheet-header">
            <h3 className="sheet-title">Cài Đặt & Giao Diện</h3>
            <button className="sheet-close" onClick={() => setIsSettingsOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="sheet-content">
            <div className="setting-option">
              <span className="setting-label">Chủ đề hiển thị</span>
              <button onClick={toggleTheme} className="theme-toggle-option-btn">
                <span className="material-symbols-outlined">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                {theme === 'dark' ? 'Chuyển sang nền Sáng' : 'Chuyển sang nền Tối'}
              </button>
            </div>

            <div className="divider" />

            <div className="mobile-auth-section">
              <h4 className="setting-section-title">Tài Khoản Độc Giả</h4>
              {activeUser ? (
                <div className="mobile-profile-display">
                  <div className="profile-details">
                    <span className="material-symbols-outlined avatar-icon">face</span>
                    <span className="username-text">{activeUser}</span>
                  </div>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-form-wrapper">
                  <div className="mobile-auth-tabs">
                    <button
                      type="button"
                      className={`tab-btn ${!isRegister ? 'active' : ''}`}
                      onClick={() => { setIsRegister(false); setError(''); }}
                    >
                      Đăng Nhập
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${isRegister ? 'active' : ''}`}
                      onClick={() => { setIsRegister(true); setError(''); }}
                    >
                      Đăng Ký
                    </button>
                  </div>

                  <form onSubmit={isRegister ? handleRegister : handleLogin} className="mobile-form">
                    <input
                      type="text"
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {error && <div className="error-banner">{error}</div>}
                    {success && <div className="success-banner">{success}</div>}
                    <button type="submit" className="submit-btn">
                      {isRegister ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for open bottom sheets */}
      {(isBookmarksOpen || isSettingsOpen) && (
        <div 
          className="sheet-backdrop z-40" 
          onClick={() => { setIsBookmarksOpen(false); setIsSettingsOpen(false); }}
        />
      )}

      <style jsx>{`
        .bottom-sheet {
          position: fixed;
          bottom: 4.5rem;
          left: 1rem;
          right: 1rem;
          max-height: 70vh;
          border-radius: 1.5rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6);
          animation: slideUpSheet 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUpSheet {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sheet-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .sheet-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .sheet-close {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .sheet-content {
          overflow-y: auto;
          max-height: 55vh;
        }

        .empty-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-style: italic;
          padding: 1.5rem 0;
          text-align: center;
        }

        /* Bookmarks list */
        .bookmarks-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .bookmark-item-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--card-border);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }

        .bookmark-item-container:hover {
          border-color: var(--primary);
          background: rgba(124, 106, 247, 0.04);
        }

        .bookmark-item-link {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          min-width: 0;
        }

        .post-icon {
          color: var(--primary);
          font-size: 1.125rem;
        }

        .bookmark-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--on-surface);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bookmark-remove-btn {
          background: transparent;
          border: none;
          color: var(--accent-orange);
          opacity: 0.8;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          transition: background 0.2s;
        }

        .bookmark-remove-btn:hover {
          background: rgba(216, 90, 48, 0.08);
          opacity: 1;
        }

        /* Settings sheet styles */
        .setting-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .setting-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--on-surface);
        }

        .theme-toggle-option-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--card-border);
          color: var(--on-surface);
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-toggle-option-btn:hover {
          background: rgba(124, 106, 247, 0.05);
          border-color: var(--primary);
        }

        .divider {
          height: 1px;
          background: var(--card-border);
          margin: 1rem 0;
        }

        .setting-section-title {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .mobile-profile-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--card-border);
          border-radius: 0.75rem;
          padding: 0.75rem;
        }

        .profile-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--on-surface);
        }

        .avatar-icon {
          color: var(--accent-teal);
        }

        .username-text {
          font-weight: 600;
        }

        .mobile-logout-btn {
          background: transparent;
          border: 1px solid rgba(216, 90, 48, 0.2);
          color: var(--accent-orange);
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.35rem 0.65rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mobile-logout-btn:hover {
          background: rgba(216, 90, 48, 0.08);
        }

        /* Mobile Auth Forms */
        .mobile-auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--card-border);
          margin-bottom: 0.75rem;
        }

        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.4rem 0;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
        }

        .tab-btn.active {
          color: var(--primary);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
        }

        .mobile-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-form input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--card-border);
          color: var(--on-surface);
          border-radius: 0.5rem;
          font-size: 0.8rem;
        }

        .mobile-form input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .error-banner {
          background: rgba(216, 90, 48, 0.08);
          color: var(--accent-orange);
          padding: 0.4rem;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          text-align: center;
        }

        .success-banner {
          background: rgba(29, 158, 117, 0.08);
          color: var(--accent-teal);
          padding: 0.4rem;
          border-radius: 0.5rem;
          font-size: 0.7rem;
          text-align: center;
        }

        .submit-btn {
          background: var(--primary);
          color: var(--on-primary);
          border: none;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        @media (min-width: 769px) {
          .bottom-sheet, .sheet-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default BottomNavBar;
