import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogArticles, getBlogArticleBySlug, getNextArticle, getPreviousArticle } from '@/lib/blog-data';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for SSG
export async function generateStaticParams() {
  const articles = getBlogArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get next/previous posts
  const nextPost = getNextArticle(slug);
  const previousPost = getPreviousArticle(slug);

  return (
    <article>
      {/* Back to home button */}
      <Link href="/" className="back-btn" id="back-to-home-link">
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
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Quay lại trang chủ
      </Link>

      {/* Post Header */}
      <header className="post-header">
        <div className="post-meta-top">
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
          <time>{new Date(post.date).toLocaleDateString('vi-VN')}</time>
          <span className="meta-dot">•</span>
          <span>{post.readTime} phút đọc</span>
        </div>
        <h1 className="post-title" id="post-title-heading">{post.title}</h1>
        <div className="post-tags-list">
          <span className="post-tag-badge">#{post.tag}</span>
        </div>
      </header>

      {/* Render content */}
      <section 
        className="post-content" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {/* Navigation between posts */}
      <nav className="post-navigation">
        <div className="nav-item nav-prev">
          {previousPost ? (
            <Link href={`/blog/${previousPost.slug}`} className="nav-link">
              <span className="nav-arrow">←</span>
              <div className="nav-content">
                <span className="nav-label">Bài trước</span>
                <span className="nav-title">{previousPost.title}</span>
              </div>
            </Link>
          ) : (
            <div className="nav-link disabled">
              <span className="nav-arrow">←</span>
              <div className="nav-content">
                <span className="nav-label">Bài đầu tiên</span>
              </div>
            </div>
          )}
        </div>

        <div className="nav-item nav-next">
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="nav-link">
              <div className="nav-content">
                <span className="nav-label">Bài tiếp theo</span>
                <span className="nav-title">{nextPost.title}</span>
              </div>
              <span className="nav-arrow">→</span>
            </Link>
          ) : (
            <div className="nav-link disabled">
              <div className="nav-content">
                <span className="nav-label">Bài cuối cùng</span>
              </div>
              <span className="nav-arrow">→</span>
            </div>
          )}
        </div>
      </nav>
    </article>
  );
}
