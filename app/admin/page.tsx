"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface Log {
  time: string;
  type: 'info' | 'success' | 'error' | 'warn';
  message: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (message: string, type: Log['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    setLogs((prev) => [...prev, { time, type, message }]);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setAuthError('Vui lòng nhập mật khẩu.');
      return;
    }
    // Set authentication locally. The server route will do the actual validation.
    setIsAuthenticated(true);
    addLog('Khởi tạo phiên làm việc Admin thành công.', 'info');
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'html' && ext !== 'md') {
      addLog(`Hủy bỏ: File '${selectedFile.name}' không đúng định dạng. Chỉ chấp nhận .html hoặc .md.`, 'warn');
      return;
    }
    setFile(selectedFile);
    setUploadSuccess(false);
    addLog(`Đã tải file local: '${selectedFile.name}' (${(selectedFile.size / 1024).toFixed(2)} KB).`, 'info');
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    if (file) {
      addLog(`Đã gỡ file: '${file.name}'.`, 'info');
      setFile(null);
      setUploadSuccess(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setLogs([]); // Clear logs for new upload
    addLog(`Bắt đầu xử lý file '${file.name}'...`, 'info');

    try {
      // 1. Read file content
      addLog('Đang đọc nội dung file...', 'info');
      const reader = new FileReader();
      
      const fileContentPromise = new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
      });

      const content = await fileContentPromise;
      addLog('Đọc file thành công. Đang gửi dữ liệu lên máy chủ...', 'info');

      // 2. Call API Route
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          content,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Yêu cầu upload thất bại.');
      }

      addLog(data.message, 'success');
      setUploadSuccess(true);
      setFile(null); // Clear selected file on success

    } catch (err: any) {
      console.error(err);
      addLog(`Lỗi: ${err.message || 'Không thể upload file.'}`, 'error');
      
      // If unauthorized, reset authentication
      if (err.message?.includes('Mật khẩu')) {
        setIsAuthenticated(false);
        setAuthError('Phiên làm việc hết hạn hoặc mật khẩu sai.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* 1. Login Authentication Card */}
      {!isAuthenticated ? (
        <div className="admin-card">
          <h2>Bảng Quản Trị Blog</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-0.5rem' }}>
            Vui lòng nhập mật khẩu quản trị để tiếp tục
          </p>
          
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-form-group">
              <label htmlFor="admin-password">Mật khẩu quản trị</label>
              <input
                type="password"
                id="admin-password"
                className="admin-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError('');
                }}
                placeholder="Nhập mật khẩu..."
                autoFocus
              />
              {authError && (
                <span style={{ color: 'var(--accent-orange)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {authError}
                </span>
              )}
            </div>

            <button type="submit" className="admin-button" id="admin-login-btn">
              Xác thực phiên
            </button>
          </form>
          
          <Link href="/" style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            ← Quay lại trang chủ
          </Link>
        </div>
      ) : (
        /* 2. Upload Blog Dashboard */
        <div className="admin-card dashboard-card">
          <h2>Đăng Bài Viết Mới</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-0.5rem', textAlign: 'center' }}>
            Hệ thống hỗ trợ tự động commit lên GitHub để kích hoạt Vercel deploy.
          </p>

          {/* Drag & Drop zone */}
          {!file && (
            <div
              className={`dropzone ${isDragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              id="upload-dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept=".html,.md"
                onChange={handleFileChange}
              />
              <svg
                className="dropzone-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Kéo thả file vào đây hoặc click để chọn
                </p>
                <p style={{ fontSize: '0.8rem' }}>Hỗ trợ tệp định dạng .html hoặc .md</p>
              </div>
            </div>
          )}

          {/* File Selected Preview */}
          {file && (
            <div className="file-preview" id="selected-file-preview">
              <div className="file-preview-details">
                <svg
                  className="file-preview-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                className="remove-file-btn"
                onClick={handleRemoveFile}
                disabled={isUploading}
                title="Gỡ file"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          {/* Action Trigger */}
          {file && (
            <button
              className="admin-button"
              onClick={handleUploadSubmit}
              disabled={isUploading}
              id="submit-upload-btn"
            >
              {isUploading ? (
                <>
                  <span className="spinner"></span> Đang đẩy lên GitHub...
                </>
              ) : (
                'Đăng bài viết'
              )}
            </button>
          )}

          {/* Log / Console Terminal */}
          {logs.length > 0 && (
            <div className="log-console" id="upload-logs-console">
              {logs.map((log, i) => (
                <div key={i} className={`log-entry ${log.type}`}>
                  <span className="log-time">[{log.time}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Success Info & Back Link */}
          {uploadSuccess && (
            <div
              style={{
                background: 'rgba(29, 158, 117, 0.08)',
                border: '1px solid rgba(29, 158, 117, 0.2)',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '0.9rem',
                color: '#e2e8f0',
              }}
              id="upload-success-message"
            >
              <p style={{ fontWeight: 600, color: 'var(--accent-teal)', marginBottom: '0.25rem' }}>
                🎉 Đã xếp hàng chờ cập nhật!
              </p>
              Vercel đang tự động kéo bài viết mới và deploy lại. Quá trình này thường mất từ 30 đến 45 giây.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>
              ← Quay lại trang chủ
            </Link>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
                setLogs([]);
                setFile(null);
                setUploadSuccess(false);
              }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', cursor: 'pointer' }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
