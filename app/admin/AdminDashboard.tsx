'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface DashboardPost {
  slug: string;
  title: string;
  dateString: string;
  tags: string[];
  fileType: 'html' | 'md';
}

interface AdminDashboardProps {
  posts: DashboardPost[];
}

interface Log {
  time: string;
  type: 'info' | 'success' | 'error' | 'warn';
  message: string;
}

export default function AdminDashboard({ posts }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      if (response.ok) {
        window.location.href = '/admin/login';
      } else {
        alert('Đăng xuất thất bại');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const addLog = (message: string, type: Log['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    setLogs((prev) => [...prev, { time, type, message }]);
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
    addLog(`Đã chọn tệp: '${selectedFile.name}' (${(selectedFile.size / 1024).toFixed(2)} KB).`, 'info');
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    if (file) {
      addLog(`Đã gỡ tệp: '${file.name}'.`, 'info');
      setFile(null);
      setUploadSuccess(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setLogs([]);
    addLog(`Bắt đầu tải lên tệp '${file.name}'...`, 'info');

    try {
      addLog('Đang đọc nội dung tệp...', 'info');
      const reader = new FileReader();
      
      const fileContentPromise = new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
      });

      const content = await fileContentPromise;
      addLog('Đọc tệp thành công. Đang gửi dữ liệu lên GitHub...', 'info');

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          content,
          password: 'dummy_session_validated', // Session handles auth
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Yêu cầu tải lên thất bại.');
      }

      addLog(data.message, 'success');
      setUploadSuccess(true);
      setFile(null);
      
      // Auto refresh list page after a delay to show new posts
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err: any) {
      console.error(err);
      addLog(`Lỗi: ${err.message || 'Không thể tải lên tệp.'}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="pt-24 pb-32 max-w-6xl mx-auto px-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-outline-variant/20 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-on-surface mb-2">Bảng điều khiển Admin</h1>
          <p className="text-on-surface-variant text-sm">Quản lý và xuất bản bài viết với Trợ lý AI</p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/new"
            className="px-5 py-3 rounded-xl bg-[#7c6af7] text-white hover:bg-[#7c6af7]/90 transition-all font-semibold active:scale-98 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#7c6af7]/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Viết bài mới
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-all font-semibold active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-red-400">logout</span>
            {isLoggingOut ? 'Đang thoát...' : 'Đăng xuất'}
          </button>
        </div>
      </div>

      {/* Grid Layout: Columns split on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (70% on desktop) - Posts List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#7c6af7] focus:outline-none focus:ring-2 focus:ring-[#7c6af7]/20 transition-all"
              />
            </div>
          </div>

          {/* Posts List Table */}
          <div className="rounded-2xl bg-surface-container/60 border border-outline-variant/15 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-high/40">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Bài viết</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Ngày đăng</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Thẻ (Tags)</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Định dạng</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <tr key={post.slug} className="hover:bg-surface-container-high/20 transition-all">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-on-surface text-sm max-w-sm sm:max-w-md truncate">
                            {post.title}
                          </div>
                          <div className="text-[11px] text-on-surface-variant/60 font-mono mt-1">
                            /blog/{post.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                          {post.dateString}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded bg-[#7c6af7]/10 border border-[#7c6af7]/20 text-[#c0c1ff] text-[10px] font-semibold"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                              post.fileType === 'html'
                                ? 'bg-[#1d9e75]/10 border-[#1d9e75]/30 text-[#1d9e75]'
                                : 'bg-[#ef9f27]/10 border-[#ef9f27]/30 text-[#ef9f27]'
                            }`}
                          >
                            {post.fileType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/admin/new?slug=${post.slug}`}
                              className="px-3.5 py-1.5 rounded-lg bg-[#7c6af7]/10 border border-[#7c6af7]/30 text-[#c0c1ff] text-xs font-semibold hover:bg-[#7c6af7]/20 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                              Sửa
                            </Link>
                            
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface-variant text-xs font-semibold hover:bg-surface-container-highest hover:text-on-surface transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">visibility</span>
                              Xem
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs text-on-surface-variant italic">
                        Không tìm thấy bài viết nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (30% on desktop) - File Upload Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-surface-container/60 border border-outline-variant/15 backdrop-blur-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-on-surface mb-1">Tải bài viết bằng tệp tin</h2>
              <p className="text-xs text-on-surface-variant/70">Đăng nhanh bài viết bằng tệp HTML hoặc Markdown</p>
            </div>

            {/* Drag & Drop Zone */}
            {!file && (
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-[#7c6af7] bg-[#7c6af7]/5' 
                    : 'border-outline-variant/30 hover:border-[#7c6af7]/50 hover:bg-surface-container-high/20'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".html,.md"
                  onChange={handleFileChange}
                />
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant/70 mb-3">upload_file</span>
                <p className="text-sm font-semibold text-on-surface mb-1">Kéo thả tệp tin vào đây</p>
                <p className="text-xs text-on-surface-variant/60">Hoặc bấm để chọn tệp .html/.md</p>
              </div>
            )}

            {/* File Selected Preview */}
            {file && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant/30">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="material-symbols-outlined text-[#7c6af7] text-[24px]">description</span>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-on-surface truncate">{file.name}</p>
                    <p className="text-xs text-on-surface-variant/60">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                  className="text-on-surface-variant/70 hover:text-red-400 p-1.5 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            )}

            {/* Upload Button */}
            {file && (
              <button
                onClick={handleUploadSubmit}
                disabled={isUploading}
                className="w-full py-3 rounded-xl bg-[#7c6af7] text-white hover:bg-[#7c6af7]/90 disabled:bg-[#7c6af7]/50 transition-all font-semibold active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#7c6af7]/10"
              >
                {isUploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                    Đăng bài bằng tệp
                  </>
                )}
              </button>
            )}

            {/* Logs Console */}
            {logs.length > 0 && (
              <div className="p-3 rounded-xl bg-black/40 border border-outline-variant/15 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto space-y-1 text-on-surface-variant">
                {logs.map((log, i) => (
                  <div key={i} className={
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warn' ? 'text-amber-400' : 'text-on-surface-variant/80'
                  }>
                    <span className="opacity-50">[{log.time}]</span> {log.message}
                  </div>
                ))}
              </div>
            )}

            {/* Success Banner */}
            {uploadSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs leading-normal">
                <p className="font-semibold mb-1">🎉 Tải lên bài viết thành công!</p>
                Tệp đã được commit lên GitHub. Trang web đang được cập nhật và tự động làm mới sau vài giây.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-left">
        <Link href="/" className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Quay lại trang chủ Blog
        </Link>
      </div>
    </main>
  );
}
