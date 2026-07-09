import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSortedPostsData, getPostData } from '@/lib/posts';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

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
          <time>{post.dateString}</time>
        </div>
        <h1 className="post-title" id="post-title-heading">{post.title}</h1>
        {post.tags.length > 0 && (
          <div className="post-tags-list">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag-badge">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Render parsed HTML/Markdown contents */}
      <section 
        className="post-content" 
        dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
      />
    </article>
  );
}
