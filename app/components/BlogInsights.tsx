'use client';

import React, { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: number;
  image: string;
  imageAlt: string;
  tag: string;
}

const BlogInsights = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortOrder, setsortOrder] = useState<'latest' | 'oldest'>('latest');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Featured article
  const featuredArticle: Article = {
    id: 'featured',
    title: 'Lời mở đầu: Hành trình giải mã trí tuệ nhân tạo',
    excerpt: 'Chào mừng bạn đến với AI-up Insights. Đây không chỉ là một blog công nghệ, mà là nơi chúng ta cùng nhau khám phá những ngóc ngách sâu nhất của LLMs, cơ chế RAG tối ưu và cách xây dựng hệ thống AI bền vững trong thực tế.',
    readTime: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAddB3XqetatTluwLs1mjpP4IzTxvDH_zOzrk8_GvpmR7UBw-daVIMO-5xWQmDtD3ydaBk_1TKu9AWCgt376nv1ye31BuMKV0_i5E_TSNqh2RVPpIwAcLuhGSYE0cTA24HKPTpj70OpCvmUmbe12zoncJT8TfYKG0tsEcWKZRScoT-wyscdtxyyei906uF-R-UK_pbDUYLtH-zEBkDKUxKTCsRzrTBzvgbio5Rcn0qZEwSy7QFPw5B7XqiNdhoU2tHlNcK-hnzL7UAF',
    imageAlt: 'A cinematic neural network structure',
    tag: 'Featured',
  };

  // Regular articles
  const articles: Article[] = [
    {
      id: 'day1',
      title: 'Thiết lập nền tảng: Từ Prompt đến Architecture',
      excerpt: 'Tại sao việc hiểu cấu trúc dữ liệu lại quan trọng hơn việc viết prompt giỏi? Chúng ta bắt đầu hành trình bằng việc định nghĩa lại cách tiếp cận hệ thống dựa trên AI.',
      readTime: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3e5mL1KJFRlip_tnXWpy3DXNK4myNjW5VuKkHi6H5S5LtcqE725XAv2jL2Dt1o2Mt1gVHxzWjAxORskcV7ykCzk_o83NVX6PirRU17wWN_zAy0BwTxdKlDwaitwEc9nbwXRurvlNM4FHxOzhblbAYoIlvvHhtEGYwFi22SJCHA3A35HFNMWElJaKksYAcedOp3X-2nWEt7DhmYvUJuOxqhLSb7ujikFzqvxdhPSkBvX1MWqf6QEOqtP_hZvwc9iv6hhSiCybCSXus',
      imageAlt: 'Minimalist 3D code blocks',
      tag: 'LLM',
    },
    {
      id: 'day2',
      title: 'Tối ưu hóa RAG: Khi Retrieval gặp Context',
      excerpt: 'Deep dive vào các kỹ thuật phân mảnh dữ liệu (chunking) và vector embeddings để giảm thiểu hiện tượng "hallucination" trong mô hình ngôn ngữ lớn.',
      readTime: 12,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkLioWezc-Pyj_ckedi37kspmw7qQCbHTGo7gbn5HJpu-Ar1tGbw-_cVxXKpGxlao_Xdm9Rz9u6ED-ExQNpkTdiOIBfbjvaC4rRp1y-l7Dd_wKT3LONZ8yxcgtwIUe8IeyGYcTBW5gnnY9i4BPIKFH7onVvmbTupimnddMckZzreXB50QbFQw9XtdttJJZQ1djX7BBNizqmhH9VsIyLPGSb5Ia8C6WBuKrRrs4Qh2TdTZLY59b0waN2DhN9So-cFRnj6GOLaOj4MQc',
      imageAlt: 'Data retrieval visualization',
      tag: 'RAG',
    },
    {
      id: 'day3',
      title: 'Xây dựng Agentic Workflows đầu tiên',
      excerpt: 'Vượt xa hơn các phản hồi đơn lẻ. Học cách thiết kế hệ thống có khả năng tự lập kế hoạch và thực thi nhiệm vụ phức tạp thông qua các công cụ.',
      readTime: 7,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChgXz_2KI-MHde4yVyJ3S8e-dx6BNd_SmNL1xUSqSmRnRNrz4hky5XYeebBS8YDEhYQiaAlNZFBT0dNXEq0HTEeAqUGiiQkb2FP4mOdkEBaNTSgZTdmqteoPHerD_EqW91bH1q4v0Blzip969i2EBz29D7qEcHW_wAUsc2YPCxQNbTRzjcSdWG3tWKYyjJSsBrC7-PWLlIVdVvsJEv_SQ3G-G_i_IGS6u-Tjut999NddhuGNx520tRdR93ba-24YeaLgl9vz2H0K-D',
      imageAlt: 'Futuristic terminal interface',
      tag: 'Engineering',
    },
  ];

  const tags = ['All', 'LLM', 'RAG', 'Engineering', 'NeuralOps'];

  // Scroll progress effect
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Update scroll indicator
      const progressBar = document.getElementById('global-progress');
      if (progressBar) {
        progressBar.style.transform = `scaleX(${scrolled / 100})`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sort toggle
  const handleSortToggle = () => {
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);

    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);

    setScrollProgress(0);
    setScrollProgress(100);

    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);

    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);

    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);

    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);

    setScrollProgress(0);
    setScrollProgress(100);

    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);
    setScrollProgress(100);
    setScrollProgress(0);

    setScrollProgress(0);
    setScrollProgress(100);

    setScrollProgress(0);
    setScrollProgress(100);

    setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest');
  };

  return (
    <div className="ai-up-insights">
      {/* Global Progress Bar */}
      <div
        id="global-progress"
        className="fixed top-0 left-0 h-1 bg-primary origin-left scale-x-0 transition-transform duration-75 z-60"
        style={{ backgroundColor: 'var(--primary)' }}
      />

      {/* Search & Filter Section */}
      <section className="search-filter-section">
        <div className="search-container">
          <span
            className="material-symbols-outlined search-icon"
            style={{ color: 'var(--outline)' }}
          >
            search
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              (e.currentTarget.parentElement as HTMLElement)?.classList.add('focused');
            }}
            onBlur={(e) => {
              (e.currentTarget.parentElement as HTMLElement)?.classList.remove('focused');
            }}
          />
        </div>

        <div className="filter-row">
          <div className="tags-scroll">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="sort-container">
            <span className="sort-label">Sort</span>
            <button className="sort-btn" onClick={handleSortToggle}>
              <span className="sort-text">
                {sortOrder === 'latest' ? 'Latest' : 'Oldest'}
              </span>
              <span className="material-symbols-outlined sort-icon">
                swap_vert
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Card */}
      <article className="featured-card-wrapper">
        <div className="featured-card card-glow">
          <div
            className="featured-image"
            style={{ backgroundImage: `url('${featuredArticle.image}')` }}
          />
          <div className="featured-content">
            <div className="featured-meta">
              <span className="featured-badge">Featured</span>
              <span className="read-time">{featuredArticle.readTime} min read</span>
            </div>
            <h2 className="featured-title">{featuredArticle.title}</h2>
            <p className="featured-excerpt">{featuredArticle.excerpt}</p>
            <div className="reading-progress-track">
              <div className="reading-progress-fill" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </article>

      {/* Articles Grid */}
      <div className="articles-grid">
        {articles.map((article, index) => (
          <article key={article.id} className="article-card-wrapper">
            <div className="article-card card-glow">
              <div className="article-layout">
                <div
                  className="article-image"
                  style={{ backgroundImage: `url('${article.image}')` }}
                />
                <div className="article-content">
                  <div className="article-meta">
                    <span className="day-badge">Day {index + 1}</span>
                    <span className="meta-dot">•</span>
                    <span className="read-time">{article.readTime} min read</span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="reading-progress-track" style={{ maxWidth: '120px' }}>
                    <div
                      className="reading-progress-fill"
                      style={{ width: `${Math.max(15, 45 - index * 15)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      <div className="load-more-container">
        <button className="load-more-btn">
          <span>View All Articles</span>
          <span className="material-symbols-outlined arrow-icon">arrow_forward</span>
        </button>
      </div>

      <style jsx>{`
        .ai-up-insights {
          width: 100%;
        }

        .search-filter-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 5rem;
        }

        .search-container {
          position: relative;
          group: true;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          transition: color 0.2s ease;
        }

        .search-input {
          width: 100%;
          background: var(--surface-container-low);
          border: none;
          border-bottom: 2px solid var(--outline-variant);
          color: var(--on-surface);
          padding: 1rem 1rem 1rem 3rem;
          font-size: 1rem;
          font-family: var(--font-body);
          transition: all 0.2s ease;
          border-radius: 0.75rem 0.75rem 0 0;
        }

        .search-input:focus {
          outline: none;
          border-bottom-color: var(--primary);
          background: var(--surface-container-low);
        }

        .search-container.focused .search-icon {
          color: var(--primary);
        }

        .filter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .tags-scroll {
          display: flex;
          overflow-x: auto;
          gap: 0.5rem;
          scroll-behavior: smooth;
          padding: 0.5rem 0;
        }

        .tags-scroll::-webkit-scrollbar {
          display: none;
        }

        .tag-btn {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.25rem;
          letter-spacing: 0.05em;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          background: var(--primary-container);
          color: var(--on-primary-container);
          border: 1px solid transparent;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tag-btn:not(.active) {
          background: transparent;
          border: 1px solid rgba(192, 193, 255, 0.3);
          color: rgba(192, 193, 255, 0.5);
        }

        .tag-btn:not(.active):hover {
          background: rgba(128, 131, 255, 0.05);
          color: var(--primary);
          border-color: var(--primary);
        }

        .sort-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-left: 1px solid rgba(71, 69, 84, 0.3);
          padding-left: 1rem;
          flex-shrink: 0;
        }

        .sort-label {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1.25rem;
          letter-spacing: 0.05em;
          color: var(--outline);
          text-transform: uppercase;
        }

        .sort-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: transparent;
          border: none;
          color: var(--primary);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          padding: 0.5rem 0.5rem;
        }

        .sort-btn:hover {
          background: rgba(128, 131, 255, 0.05);
          border-radius: 0.5rem;
        }

        .sort-icon {
          font-size: 1.125rem;
        }

        .featured-card-wrapper {
          margin-bottom: 2.5rem;
        }

        .featured-card {
          background: var(--surface-container-low);
          border: 1px solid rgba(71, 69, 84, 0.3);
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.5s ease;
        }

        .featured-image {
          width: 100%;
          height: 20rem;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s ease;
        }

        .featured-card:hover .featured-image {
          transform: scale(1.05);
        }

        .featured-content {
          padding: 2rem;
        }

        .featured-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .featured-badge {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
          line-height: 1.25rem;
          letter-spacing: 0.05em;
          background: rgba(255, 183, 131, 0.2);
          color: var(--tertiary);
          padding: 0.1875rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 183, 131, 0.2);
        }

        .read-time {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.25rem;
          color: var(--on-surface-variant);
        }

        .featured-title {
          font-family: var(--font-title);
          font-size: 2rem;
          font-weight: 600;
          line-height: 2.5rem;
          letter-spacing: -0.01em;
          color: var(--on-surface);
          margin-bottom: 1rem;
          transition: color 0.2s ease;
        }

        .featured-card:hover .featured-title {
          color: var(--primary);
        }

        .featured-excerpt {
          font-family: var(--font-body);
          font-size: 1.25rem;
          font-weight: 400;
          line-height: 2rem;
          color: var(--on-surface-variant);
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .articles-grid {
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        .article-card-wrapper {
          width: 100%;
        }

        .article-card {
          background: var(--surface-container-low);
          border: 1px solid rgba(71, 69, 84, 0.2);
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.5s ease;
        }

        .article-layout {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .article-layout {
            flex-direction: row;
            gap: 2rem;
            align-items: flex-start;
          }
        }

        .article-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          background-size: cover;
          background-position: center;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: transform 0.7s ease;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .article-image {
            width: 33.333%;
          }
        }

        .article-card:hover .article-image {
          transform: scale(1.1);
        }

        .article-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0 0 0 0;
        }

        @media (min-width: 768px) {
          .article-content {
            width: 66.667%;
            padding: 0;
          }
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.25rem;
          letter-spacing: 0.05em;
        }

        .day-badge {
          color: rgba(192, 193, 255, 0.7);
          text-transform: uppercase;
        }

        .meta-dot {
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 50%;
          background: var(--outline-variant);
        }

        .article-title {
          font-family: var(--font-title);
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 2rem;
          color: var(--on-surface);
          margin-bottom: 0.75rem;
          transition: color 0.2s ease;
        }

        .article-card:hover .article-title {
          color: var(--primary);
        }

        .article-excerpt {
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.625rem;
          color: var(--on-surface-variant);
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .load-more-container {
          display: flex;
          justify-content: center;
          margin-top: 5rem;
        }

        .load-more-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(192, 193, 255, 0.4);
          background: transparent;
          color: var(--primary);
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.625rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .load-more-btn:hover {
          background: rgba(192, 193, 255, 0.1);
          border-color: var(--primary);
        }

        .arrow-icon {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
};

export default BlogInsights;
