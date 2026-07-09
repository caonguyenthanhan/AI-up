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
  const postDate = new Date(post.date).toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  return (
    <>
      <style>{`
        body {
          background-color: #0a0a0f;
          color: #e4e1e9;
          scroll-behavior: smooth;
        }
        .reading-progress-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          z-index: 100;
          background: transparent;
        }
        .reading-progress-bar {
          height: 100%;
          width: 0%;
          background-color: #c0c1ff;
          transition: width 0.1s ease-out;
        }
        .glass-panel {
          background: rgba(22, 22, 30, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(39, 39, 50, 0.5);
        }
        .article-content p {
          margin-bottom: 24px;
        }
        .article-content h2 {
          margin-top: 32px;
          margin-bottom: 16px;
          border-left: 4px solid #c0c1ff;
          padding-left: 16px;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 24px;
          margin-left: 20px;
        }
        .article-content li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .article-content b, .article-content strong {
          color: #c0c1ff;
        }
        .article-content i, .article-content em {
          font-style: italic;
          color: #c7c4d7;
        }
        .code-inline {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(192, 193, 255, 0.1);
          color: #c0c1ff;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      {/* Reading Progress Bar */}
      <div className="reading-progress-container">
        <div className="reading-progress-bar" id="progress-bar"></div>
      </div>

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="flex justify-between items-center max-w-[800px] mx-auto px-5 h-16 w-full">
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-2xl font-bold text-primary tracking-tight">AI-up Insights</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary">terminal</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 max-w-[800px] mx-auto px-5">
        {/* Breadcrumb */}
        <nav className="mb-12">
          <Link href="/" className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all duration-200 font-label-md">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Quay lại trang chủ
          </Link>
        </nav>

        {/* Article Header */}
        <article className="article-container">
          <header className="mb-20">
            <div className="flex flex-wrap items-center gap-4 mb-2 text-on-surface-variant font-label-md">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {postDate}
              </span>
              <span className="flex items-center gap-1 border-l border-outline-variant/30 pl-4">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                {post.readTime} phút đọc
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-label-md text-xs">
                #{post.tag}
              </span>
            </div>
          </header>

          {/* Reading Toolbar */}
          <aside className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 p-3 glass-panel rounded-full shadow-xl">
            <button className="p-3 rounded-full hover:bg-surface-variant/50 text-on-surface-variant transition-all" title="Cỡ chữ">
              <span className="material-symbols-outlined">text_fields</span>
            </button>
            <button className="p-3 rounded-full hover:bg-surface-variant/50 text-on-surface-variant transition-all" title="Chủ đề">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
            <button className="p-3 rounded-full hover:bg-surface-variant/50 text-on-surface-variant transition-all" title="Chế độ tập trung">
              <span className="material-symbols-outlined">center_focus_strong</span>
            </button>
            <button className="p-3 rounded-full hover:bg-surface-variant/50 text-on-surface-variant transition-all" title="Đánh dấu">
              <span className="material-symbols-outlined">bookmark</span>
            </button>
          </aside>

          {/* Body Content */}
          <div 
            className="article-content text-on-surface-variant leading-relaxed mb-20"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* Previous/Next Navigation */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-outline-variant/30 pt-8">
            {previousPost ? (
              <Link 
                href={`/blog/${previousPost.slug}`} 
                className="group p-6 rounded-2xl glass-panel hover:bg-surface-variant/30 transition-all"
              >
                <p className="font-label-md text-on-surface-variant group-hover:text-primary mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">chevron_left</span> Previous
                </p>
                <h4 className="text-lg text-on-surface leading-snug font-semibold">{previousPost.title}</h4>
              </Link>
            ) : (
              <div className="p-6 rounded-2xl glass-panel opacity-50">
                <p className="font-label-md text-on-surface-variant mb-2">Bài đầu tiên</p>
              </div>
            )}

            {nextPost ? (
              <Link 
                href={`/blog/${nextPost.slug}`} 
                className="group p-6 rounded-2xl glass-panel hover:bg-surface-variant/30 transition-all text-right"
              >
                <p className="font-label-md text-on-surface-variant group-hover:text-primary mb-2 flex items-center gap-1 justify-end">
                  Next <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </p>
                <h4 className="text-lg text-on-surface leading-snug font-semibold">{nextPost.title}</h4>
              </Link>
            ) : (
              <div className="p-6 rounded-2xl glass-panel opacity-50 text-right">
                <p className="font-label-md text-on-surface-variant">Bài cuối cùng</p>
              </div>
            )}
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-12 pb-32">
        <div className="max-w-[800px] mx-auto px-5 text-center">
          <p className="font-label-md text-xs text-on-surface-variant mb-2">© 2026 AI-up. Cập nhật bởi caonguyenthanhan.</p>
          <p className="font-label-md text-xs text-outline tracking-wider uppercase">Built with Next.js & Vercel</p>
        </div>
      </footer>

      {/* Bottom Navigation Bar (Mobile only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface-container-low/80 backdrop-blur-xl border-t border-outline-variant/30">
        <Link href="/" className="flex items-center justify-center bg-primary-container text-on-primary-container rounded-full p-3 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">home</span>
        </Link>
        <a href="#" className="flex items-center justify-center text-on-surface-variant p-3 hover:bg-surface-variant/50 transition-all active:scale-90">
          <span className="material-symbols-outlined">search</span>
        </a>
        <a href="#" className="flex items-center justify-center text-on-surface-variant p-3 hover:bg-surface-variant/50 transition-all active:scale-90">
          <span className="material-symbols-outlined">bookmarks</span>
        </a>
        <a href="#" className="flex items-center justify-center text-on-surface-variant p-3 hover:bg-surface-variant/50 transition-all active:scale-90">
          <span className="material-symbols-outlined">settings</span>
        </a>
      </nav>

      <script>{`
        // Reading Progress Script
        window.onscroll = function() {
          let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          let scrolled = (winScroll / height) * 100;
          document.getElementById("progress-bar").style.width = scrolled + "%";
        };

        // Micro-interactions
        document.querySelectorAll('a, button').forEach(el => {
          el.addEventListener('mousedown', () => el.classList.add('scale-95'));
          el.addEventListener('mouseup', () => el.classList.remove('scale-95'));
          el.addEventListener('mouseleave', () => el.classList.remove('scale-95'));
        });
      `}</script>
    </>
  );
}
