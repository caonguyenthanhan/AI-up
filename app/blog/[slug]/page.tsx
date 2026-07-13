import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSortedPostsData, getPostData, getNextPost, getPreviousPost } from '@/lib/posts';
import MermaidRenderer from '@/app/components/MermaidRenderer';
import PrintButton from '@/app/components/PrintButton';
import ReadingToolbar from '@/app/components/ReadingToolbar';
import ReadingProgressTracker from '@/app/components/ReadingProgressTracker';

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

  // Get next/previous posts
  const nextPost = getNextPost(slug);
  const previousPost = getPreviousPost(slug);

  return (
    <>
      <style>{`
        body {
          background-color: var(--background);
          color: var(--on-surface);
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
          background-color: var(--primary);
          transition: width 0.1s ease-out;
        }
        .glass-panel {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
        }
        .article-content p {
          margin-bottom: 24px;
        }
        .article-content h2 {
          margin-top: 32px;
          margin-bottom: 16px;
          border-left: 4px solid var(--accent-teal);
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
          color: var(--accent-amber);
        }
        .article-content i, .article-content em {
          font-style: italic;
          color: var(--text-secondary);
        }
        .code-inline, .article-content code {
          font-family: 'JetBrains Mono', monospace;
          background: var(--accent-purple-dim);
          color: var(--accent-purple);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .article-content pre {
          background: var(--card-bg) !important;
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 2rem 0;
          backdrop-filter: blur(8px);
        }
        .article-content pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
        .article-content .diagram-container {
          margin: 3rem 0;
          padding: 1.5rem;
          background: var(--accent-purple-dim);
          border-radius: 12px;
          border: 1px solid var(--card-border);
          backdrop-filter: blur(8px);
        }
        .article-content .diagram-caption {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 1.5rem;
          font-style: italic;
        }
        .article-content .action-box {
          background: linear-gradient(145deg, var(--accent-purple-dim), var(--background));
          border-left: 4px solid var(--accent-purple);
          border-top: 1px solid var(--card-border);
          border-right: 1px solid var(--card-border);
          border-bottom: 1px solid var(--card-border);
          padding: 1.5rem;
          border-radius: 0 12px 12px 0;
          margin: 3rem 0;
          backdrop-filter: blur(8px);
        }
        .article-content .action-box h3 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          color: var(--accent-purple);
          font-weight: 600;
        }
        .article-content .highlight {
          color: var(--accent-orange);
          font-weight: 500;
          background: rgba(216, 90, 48, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .article-content .question-box {
          background: rgba(29, 158, 117, 0.04);
          border-radius: 12px;
          border: 1px solid rgba(29, 158, 117, 0.2);
          padding: 1.5rem;
          margin-top: 2rem;
          backdrop-filter: blur(8px);
        }
        .article-content .question-box h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.15rem;
          color: var(--accent-teal);
          font-weight: 600;
        }
        .article-content .sources {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--card-border);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        /* Blog tag styling */
        .blog-tag {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.85rem;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 9999px;
          background: rgba(124, 106, 247, 0.05);
          border: 1px solid rgba(124, 106, 247, 0.15);
          color: var(--primary);
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }
        .blog-tag:hover {
          background: rgba(124, 106, 247, 0.12);
          border-color: rgba(124, 106, 247, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(124, 106, 247, 0.15);
        }
        [data-theme="dark"] .blog-tag {
          background: rgba(124, 106, 247, 0.08);
          border-color: rgba(124, 106, 247, 0.2);
        }
        [data-theme="light"] .blog-tag {
          background: rgba(124, 106, 247, 0.04);
          border-color: rgba(124, 106, 247, 0.15);
        }

        /* Focus mode rules */
        body.focus-mode header,
        body.focus-mode footer,
        body.focus-mode nav,
        body.focus-mode section.grid,
        body.focus-mode .print-btn {
          display: none !important;
          opacity: 0;
          pointer-events: none;
        }
        body.focus-mode main {
          padding-top: 4rem !important;
          padding-bottom: 4rem !important;
        }

        /* Font size level overrides */
        .post-content.text-large {
          font-size: 1.15rem !important;
        }
        .post-content.text-xlarge {
          font-size: 1.3rem !important;
        }
        .post-content.text-normal {
          font-size: 1rem !important;
        }

        @media print {
          /* Color & Ink optimizations */
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .article-container, .article-content, h1, h2, h3, h4, h5, h6, p, li, span, code, pre, strong, em, b, i {
            color: #000000 !important;
            text-shadow: none !important;
            box-shadow: none !important;
          }
          .glass-panel, .article-content code {
            background: transparent !important;
            box-shadow: none !important;
            border-color: #333333 !important;
          }

          /* Paper size and margin */
          @page {
            margin: 1cm !important;
            size: A4 !important;
          }
          
          /* Layout adjustments for saving paper */
          main {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .article-container {
            margin: 0 !important;
            padding: 0 !important;
          }
          .mb-12, .mb-20, .mb-24 {
            margin-bottom: 12px !important;
          }
          h1, h2, h3, p, ul, ol, li {
            margin-top: 6px !important;
            margin-bottom: 6px !important;
            line-height: 1.35 !important;
            font-size: 10pt !important;
          }
          h1 {
            font-size: 16pt !important;
            margin-bottom: 10px !important;
          }
          h2 {
            font-size: 12pt !important;
            border-left: 3px solid #000000 !important;
            padding-left: 8px !important;
            margin-top: 16px !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          h3 {
            font-size: 11pt !important;
            margin-top: 12px !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          
          /* Graphic scale limits */
          img, svg, .mermaid-svg-container {
            max-height: 220px !important;
            width: auto !important;
            margin: 8px auto !important;
            display: block !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* SVG colors for print */
          svg *, svg path, svg rect, svg circle, svg line, svg polygon {
            stroke: #000000 !important;
            fill: none !important;
          }
          svg text {
            fill: #000000 !important;
            stroke: none !important;
          }

          /* Code blocks and navigation break avoidance */
          pre, code, table, blockquote, .article-content pre {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            background: rgba(0, 0, 0, 0.03) !important;
            border: 1px solid #dddddd !important;
            color: #000000 !important;
          }

          /* Hide UI interactive elements */
          header, footer, nav, aside, .print-btn, .reading-progress-container, section.grid {
            display: none !important;
          }
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
                {post.dateString}
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
              {(post.tags || []).map((tag) => (
                <span key={tag} className="blog-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Reading Toolbar */}
          <ReadingToolbar postSlug={post.slug} />
          <ReadingProgressTracker postSlug={post.slug} postTitle={post.title} />

          {/* Body Content */}
          <div 
            className="post-content article-content text-on-surface-variant leading-relaxed mb-20"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
          />

          {/* Client-side Mermaid Renderer */}
          <MermaidRenderer />

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

      <PrintButton />
    </>
  );
}
