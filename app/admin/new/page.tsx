'use client';

import React, { useState, useEffect } from 'react';
import { getBlogArticles } from '@/lib/blog-data';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [readTime, setReadTime] = useState('5');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Extract unique tags from existing posts
  const existingArticles = getBlogArticles();
  const availableTags = Array.from(
    new Set(existingArticles.map(article => article.tag))
  ).sort();

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [title]);

  const handleAnalyzeWithAI = () => {
    setIsAnalyzing(true);
    console.log('[v0] Analyze clicked - placeholder action');
    setTimeout(() => setIsAnalyzing(false), 1000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    console.log('[v0] Publish clicked - placeholder action');
    setTimeout(() => setIsPublishing(false), 1000);
  };

  return (
    <main className="pt-24 pb-32 max-w-4xl mx-auto px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-on-surface mb-2">Tạo bài viết mới</h1>
        <p className="text-on-surface-variant">Soạn thảo, phân tích với AI, và xuất bản bài viết</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title Input */}
          <div>
            <label className="block text-on-surface font-semibold mb-2 text-sm uppercase tracking-wider">
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Slug and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slug Input */}
            <div>
              <label className="block text-on-surface font-semibold mb-2 text-sm uppercase tracking-wider">
                Slug (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="tieu-de-bai-viet"
                className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <p className="text-xs text-on-surface-variant mt-1">Tự sinh từ tiêu đề, có thể sửa tay</p>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-on-surface font-semibold mb-2 text-sm uppercase tracking-wider">
                Ngày đăng
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Excerpt and Read Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Excerpt */}
            <div className="md:col-span-2">
              <label className="block text-on-surface font-semibold mb-2 text-sm uppercase tracking-wider">
                Tóm tắt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tóm tắt ngắn gọn về bài viết..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all resize-none"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-on-surface font-semibold mb-2 text-sm uppercase tracking-wider">
                Thời gian đọc (phút)
              </label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                min="1"
                max="60"
                className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* HTML Content */}
          <div>
            <label className="block text-on-surface font-semibold mb-2 text-sm uppercase tracking-wider">
              Nội dung (HTML)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`<h2>Tiêu đề h2</h2>\n<p>Nội dung bài viết...</p>\n<ul>\n<li>Điểm 1</li>\n<li>Điểm 2</li>\n</ul>`}
              rows={12}
              className="w-full px-4 py-3 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all resize-vertical font-mono text-sm"
            />
            <p className="text-xs text-on-surface-variant mt-1">Hỗ trợ HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, v.v.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzing || !content}
              className="flex-1 px-6 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-semibold hover:bg-secondary-container/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  {isAnalyzing ? 'sync' : 'auto_awesome'}
                </span>
                {isAnalyzing ? 'Đang phân tích...' : 'Phân tích với AI'}
              </span>
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing || !title || !slug || !content || !selectedTag}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  {isPublishing ? 'sync' : 'publish'}
                </span>
                {isPublishing ? 'Đang xuất bản...' : 'Xuất bản'}
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tag Selection */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <h3 className="text-on-surface font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">local_offer</span>
              Thẻ (Tag)
            </h3>
            <div className="space-y-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    selectedTag === tag
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-variant/30 text-on-surface hover:bg-surface-variant/60'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            {selectedTag && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-on-surface text-xs">
                  <span className="font-semibold">Đã chọn:</span> #{selectedTag}
                </p>
              </div>
            )}
          </div>

          {/* Article Stats */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <h3 className="text-on-surface font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              Thống kê
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-on-surface-variant">Số từ:</p>
                <p className="text-on-surface font-semibold text-lg">
                  {content.split(/\s+/).filter(w => w.length > 0).length}
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant">Thời gian đọc:</p>
                <p className="text-on-surface font-semibold text-lg">{readTime} phút</p>
              </div>
              <div className="pt-3 border-t border-outline-variant/20">
                <p className="text-on-surface-variant text-xs">URL cuối cùng:</p>
                <p className="text-primary font-mono text-xs mt-1">/blog/{slug}</p>
              </div>
            </div>
          </div>

          {/* Form Status */}
          <div className="p-4 rounded-lg bg-surface-variant/20 border border-outline-variant/30">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${title ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                <span className="text-on-surface-variant">Tiêu đề: {title ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${slug ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                <span className="text-on-surface-variant">Slug: {slug ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${content ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                <span className="text-on-surface-variant">Nội dung: {content ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${selectedTag ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                <span className="text-on-surface-variant">Thẻ: {selectedTag ? '✓' : '✗'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
