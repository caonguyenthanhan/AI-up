"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { PostData } from '@/lib/posts';

interface BlogListClientProps {
  posts: PostData[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort();

  // Find Day 0 post for featured presentation
  const day0Post = posts.find((post) => post.slug === 'day-0');

  // Filter posts based on selected tag.
  // In "All Posts" view (selectedTag === null), we exclude Day 0 from the grid so it's not duplicated.
  const gridPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts.filter((post) => post.slug !== 'day-0');

  // Mouse move handler for premium card glowing hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div>
      {/* Tags Filter Bar */}
      <div className="tag-filter-container">
        <button
          className={`tag-btn ${selectedTag === null ? 'active' : ''}`}
          onClick={() => setSelectedTag(null)}
          id="tag-all-btn"
        >
          Tất cả bài viết
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => setSelectedTag(tag)}
            id={`tag-${tag}-btn`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Special Presentation for Day 0 on the "All Posts" view */}
      {selectedTag === null && day0Post && (
        <div className="featured-post-container" id="featured-post-day-0">
          <div 
            className="featured-post-card"
            onMouseMove={handleMouseMove}
          >
            <span className="featured-badge">
              🚀 LỜI MỞ ĐẦU
            </span>
            <div className="post-card-meta">
              <span className="post-card-date">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {day0Post.dateString}
              </span>
              
              {day0Post.tags.length > 0 && (
                <div className="post-card-tags">
                  {day0Post.tags.map((tag) => (
                    <span key={tag} className="post-card-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/blog/${day0Post.slug}`} passHref>
              <h2 className="featured-post-title">{day0Post.title}</h2>
            </Link>

            <p className="post-card-excerpt">{day0Post.excerpt}</p>

            <Link href={`/blog/${day0Post.slug}`} className="post-card-link" id={`post-link-${day0Post.slug}`}>
              Khám phá hành trình
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Grid of Blog Posts */}
      {gridPosts.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
          Chưa có bài viết nào thuộc chủ đề này.
        </div>
      ) : (
        <div className="posts-grid">
          {gridPosts.map((post) => (
            <div
              key={post.slug}
              className="post-card"
              onMouseMove={handleMouseMove}
              id={`post-card-${post.slug}`}
            >
              {/* Card Meta */}
              <div className="post-card-meta">
                <span className="post-card-date">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {post.dateString}
                </span>
                
                {post.tags.length > 0 && (
                  <div className="post-card-tags">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="post-card-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Title */}
              <Link href={`/blog/${post.slug}`} passHref>
                <h3 className="post-card-title">{post.title}</h3>
              </Link>

              {/* Card Excerpt */}
              <p className="post-card-excerpt">{post.excerpt}</p>

              {/* Card Link */}
              <Link href={`/blog/${post.slug}`} className="post-card-link" id={`post-link-${post.slug}`}>
                Đọc chi tiết
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
