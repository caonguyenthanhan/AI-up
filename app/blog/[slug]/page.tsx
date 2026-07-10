import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSortedPostsData, getPostData, getNextPost, getPreviousPost } from '@/lib/posts';
import MermaidRenderer from '@/app/components/MermaidRenderer';
import PrintButton from '@/app/components/PrintButton';

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
                <span key={tag} className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-label-md text-xs">
                  #{tag}
                </span>
              ))}
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
