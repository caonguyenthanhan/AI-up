'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface InProgressPost {
  slug: string;
  title: string;
  percentage: number;
  scrollY: number;
  updatedAt: number;
}

export default function UserAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dashboard states
  const [progressList, setProgressList] = useState<InProgressPost[]>([]);

  // Load active user and progress list on mount or when modal opens
  useEffect(() => {
    const user = localStorage.getItem('active_reader');
    setActiveUser(user);

    if (user) {
      const progressKey = `progress_${user}`;
      const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
      // Sort progress by updatedAt descending
      const list = Object.values(savedProgress) as InProgressPost[];
      list.sort((a, b) => b.updatedAt - a.updatedAt);
      setProgressList(list);
    }
  }, [isOpen, activeUser]);

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

    // Save account
    accounts[username] = password;
    localStorage.setItem('user_accounts', JSON.stringify(accounts));
    
    // Log in
    localStorage.setItem('active_reader', username);
    setActiveUser(username);
    setSuccess('Đăng ký thành công!');
    setUsername('');
    setPassword('');
    
    // Auto-close modal after 1.5s
    setTimeout(() => {
      setIsOpen(false);
      setSuccess('');
    }, 1500);
  };

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

    // Log in
    localStorage.setItem('active_reader', username);
    setActiveUser(username);
    setSuccess('Đăng nhập thành công!');
    setUsername('');
    setPassword('');

    // Auto-close modal after 1.5s
    setTimeout(() => {
      setIsOpen(false);
      setSuccess('');
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('active_reader');
    setActiveUser(null);
    setProgressList([]);
    setIsOpen(false);
  };

  return (
    <div className="user-account-container">
      {/* Profile Icon Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`profile-toggle-btn ${activeUser ? 'logged-in' : ''}`}
        title={activeUser ? `Tài khoản: ${activeUser}` : 'Đăng nhập / Đăng ký'}
        aria-label="User account dashboard"
      >
        <span className="material-symbols-outlined">
          {activeUser ? 'account_circle' : 'person'}
        </span>
        {activeUser && <span className="active-dot" />}
      </button>

      {/* Modal Dropdown */}
      {isOpen && (
        <div className="user-dropdown-modal glass-panel card-glow">
          <div className="modal-header">
            <h3 className="modal-title">
              {activeUser ? 'Độc Giả Dashboard' : isRegister ? 'Tạo Tài Khoản' : 'Độc Giả Đăng Nhập'}
            </h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {activeUser ? (
            /* Logged-in View */
            <div className="logged-in-view">
              <div className="user-info">
                <span className="material-symbols-outlined user-avatar">face</span>
                <div>
                  <p className="welcome-text">Chào mừng trở lại,</p>
                  <p className="username-display">{activeUser}</p>
                </div>
              </div>

              <div className="divider" />

              <div className="progress-section">
                <h4 className="section-title">Tiến Trình Đọc Dở</h4>
                {progressList.length === 0 ? (
                  <p className="empty-text">Chưa có bài viết nào đang đọc dở.</p>
                ) : (
                  <div className="progress-list-wrapper scrollbar-thin">
                    {progressList.slice(0, 4).map((item) => (
                      <Link
                        key={item.slug}
                        href={`/blog/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="progress-item-link"
                      >
                        <div className="progress-item">
                          <p className="item-title" title={item.title}>
                            {item.title}
                          </p>
                          <div className="item-progress-row">
                            <span className="item-percentage">Đã đọc {item.percentage}%</span>
                            <div className="item-bar-bg">
                              <div className="item-bar-fill" style={{ width: `${item.percentage}%` }} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="divider" />

              <button onClick={handleLogout} className="logout-btn">
                <span className="material-symbols-outlined">logout</span>
                Đăng xuất
              </button>
            </div>
          ) : (
            /* Authentication View (Login/Register) */
            <div className="auth-view">
              <div className="auth-tabs">
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

              <form onSubmit={isRegister ? handleRegister : handleLogin} className="auth-form">
                <div className="input-group">
                  <span className="material-symbols-outlined input-icon">person</span>
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <span className="material-symbols-outlined input-icon">lock</span>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="error-banner">{error}</div>}
                {success && <div className="success-banner">{success}</div>}

                <button type="submit" className="submit-btn">
                  {isRegister ? 'Đăng Ký Độc Giả' : 'Đăng Nhập'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .user-account-container {
          position: relative;
          display: inline-block;
        }

        .profile-toggle-btn {
          position: relative;
          padding: 0.5rem;
          color: var(--on-surface-variant);
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-toggle-btn:hover {
          color: var(--primary);
          background: rgba(128, 131, 255, 0.05);
        }

        .profile-toggle-btn.logged-in {
          color: var(--accent-teal);
        }

        .active-dot {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-teal);
          border: 1px solid var(--background);
        }

        .user-dropdown-modal {
          position: absolute;
          top: 3.5rem;
          right: 0;
          width: 320px;
          padding: 1.5rem;
          z-index: 100;
          border-radius: 1.25rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .modal-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--on-surface);
        }

        .divider {
          height: 1px;
          background: var(--card-border);
          margin: 1rem 0;
        }

        /* Logged-in View */
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          font-size: 2.25rem;
          color: var(--primary);
        }

        .welcome-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .username-display {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-title {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
        }

        .empty-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-style: italic;
        }

        .progress-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .progress-item-link {
          text-decoration: none;
          display: block;
        }

        .progress-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--card-border);
          border-radius: 0.75rem;
          padding: 0.75rem;
          transition: all 0.2s;
        }

        .progress-item:hover {
          border-color: var(--primary);
          background: rgba(124, 106, 247, 0.04);
        }

        .item-title {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--on-surface);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.35rem;
        }

        .item-progress-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .item-percentage {
          font-size: 0.7rem;
          color: var(--accent-teal);
          font-weight: 500;
        }

        .item-bar-bg {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
        }

        .item-bar-fill {
          height: 100%;
          background: var(--accent-teal);
          border-radius: 2px;
        }

        .logout-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(216, 90, 48, 0.2);
          color: var(--accent-orange);
          padding: 0.5rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(216, 90, 48, 0.08);
          border-color: var(--accent-orange);
        }

        /* Auth View */
        .auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--card-border);
          margin-bottom: 1.25rem;
        }

        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.5rem 0;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .tab-btn:hover {
          color: var(--on-surface);
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

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          font-size: 1.125rem;
          color: var(--text-secondary);
        }

        .auth-form input {
          width: 100%;
          padding: 0.65rem 0.75rem 0.65rem 2.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--card-border);
          color: var(--on-surface);
          border-radius: 0.75rem;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .auth-form input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(124, 106, 247, 0.1);
        }

        .error-banner {
          background: rgba(216, 90, 48, 0.08);
          border: 1px solid rgba(216, 90, 48, 0.2);
          color: var(--accent-orange);
          padding: 0.5rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          text-align: center;
        }

        .success-banner {
          background: rgba(29, 158, 117, 0.08);
          border: 1px solid rgba(29, 158, 117, 0.2);
          color: var(--accent-teal);
          padding: 0.5rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          text-align: center;
        }

        .submit-btn {
          background: var(--primary);
          color: var(--on-primary);
          border: none;
          padding: 0.65rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }

        .submit-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
