'use client';

import React, { useState } from 'react';
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

export default function AdminDashboard({ posts }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

      {/* Search Bar */}
      <div className="mb-8 max-w-md">
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
                      <div className="font-semibold text-on-surface text-sm max-w-sm sm:max-w-md md:max-w-lg truncate">
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
      
      <div className="mt-8 text-left">
        <Link href="/" className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Quay lại trang chủ Blog
        </Link>
      </div>
    </main>
  );
}
