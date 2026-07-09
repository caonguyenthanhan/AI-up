'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewPostFormProps {
  availableTags: string[];
}

interface AISuggestions {
  suggestedTags: string[];
  newTagSuggestions: string[];
  seoDescription: string;
  diagrams: Array<{ afterHeading: string; mermaidCode: string }>;
  imageSuggestions: Array<{ afterHeading: string; searchKeywords: string }>;
}

// SSR-safe Mermaid Renderer
function MermaidPreview({ code }: { code: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const elementId = React.useId().replace(/:/g, '');

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        setError('');
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
        });
        const cleanCode = code.trim();
        const { svg: renderedSvg } = await mermaid.render(`mermaid-${elementId}`, cleanCode);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Không thể render sơ đồ. Vui lòng kiểm tra mã Mermaid.');
      }
    };

    renderDiagram();
  }, [code, elementId]);

  if (error) {
    return (
      <div className="text-red-400 text-xs p-3 bg-red-950/20 border border-red-500/20 rounded-lg">
        {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="text-xs text-on-surface-variant animate-pulse p-3 text-center">
        Đang vẽ sơ đồ...
      </div>
    );
  }

  return (
    <div
      className="mermaid-svg-container overflow-auto p-4 bg-[#0b0b0f] rounded-xl border border-outline-variant/20 flex justify-center w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function NewPostForm({ availableTags }: NewPostFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [excerpt, setExcerpt] = useState('');
  const [readTime, setReadTime] = useState('5');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  // AI Suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese diacritics
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [title]);

  // Check if draft exists on mount
  useEffect(() => {
    const draft = localStorage.getItem('ai_up_draft_post');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.title || parsed.content) {
          setHasDraft(true);
        }
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Restore Draft
  const handleRestoreDraft = () => {
    const draft = localStorage.getItem('ai_up_draft_post');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setTitle(parsed.title || '');
        setDate(parsed.date || new Date().toISOString().split('T')[0]);
        setSlug(parsed.slug || '');
        setContent(parsed.content || '');
        setSelectedTags(parsed.selectedTags || []);
        setExcerpt(parsed.excerpt || '');
        setReadTime(parsed.readTime || '5');
        
        if (parsed.aiSuggestions) {
          setAiSuggestions(parsed.aiSuggestions);
        }
        
        showToast('Đã khôi phục bản nháp!', 'success');
      } catch (e) {
        showToast('Khôi phục bản nháp thất bại', 'error');
      }
    }
    setHasDraft(false);
  };

  // Clear Draft
  const handleClearDraft = () => {
    localStorage.removeItem('ai_up_draft_post');
    setHasDraft(false);
    showToast('Đã xóa bản nháp', 'info');
  };

  // Save Draft
  const handleSaveDraft = () => {
    const draftData = {
      title,
      date,
      slug,
      content,
      selectedTags,
      excerpt,
      readTime,
      aiSuggestions,
    };
    localStorage.setItem('ai_up_draft_post', JSON.stringify(draftData));
    showToast('Đã lưu bản nháp vào localStorage!', 'success');
  };

  // Tag toggler
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Insert HTML helper after a specific heading text
  const insertAfterHeading = (headingText: string, textToInsert: string) => {
    const index = content.indexOf(headingText);
    if (index === -1) {
      // Fallback: append
      setContent((prev) => prev + '\n\n' + textToInsert);
      showToast('Không tìm thấy heading chính xác, đã chèn vào cuối bài viết', 'info');
      return;
    }

    const subContent = content.substring(index);
    const closingTagMatch = subContent.match(/<\/(h1|h2|h3|h4|h5|h6)>/i);
    
    if (closingTagMatch && closingTagMatch.index !== undefined) {
      const insertPos = index + closingTagMatch.index + closingTagMatch[0].length;
      const newContent =
        content.substring(0, insertPos) + '\n' + textToInsert + content.substring(insertPos);
      setContent(newContent);
      showToast('Đã chèn nội dung thành công!', 'success');
    } else {
      const insertPos = index + headingText.length;
      const newContent =
        content.substring(0, insertPos) + '\n' + textToInsert + content.substring(insertPos);
      setContent(newContent);
      showToast('Đã chèn nội dung thành công!', 'success');
    }
  };

  // Call API Analyze
  const handleAnalyzeWithAI = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    setAiSuggestions(null);
    showToast('Trợ lý AI đang phân tích bài viết...', 'info');

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          existingTags: availableTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Phân tích thất bại');
      }

      setAiSuggestions(data);

      // Auto-toggle suggested tags by AI
      if (data.suggestedTags && Array.isArray(data.suggestedTags)) {
        setSelectedTags((prev) => {
          const combined = [...prev];
          data.suggestedTags.forEach((tag: string) => {
            if (!combined.includes(tag)) {
              combined.push(tag);
            }
          });
          return combined;
        });
      }

      showToast('AI đã hoàn tất phân tích bài viết!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Lỗi khi kết nối AI Assistant', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !slug || !content || selectedTags.length === 0) {
      showToast('Vui lòng điền đầy đủ các thông tin bắt buộc (Tiêu đề, Slug, Nội dung, Thẻ) trước khi xuất bản', 'error');
      return;
    }
    
    setIsPublishing(true);
    showToast('Đang gửi yêu cầu xuất bản bài viết lên GitHub...', 'info');

    try {
      const response = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          date,
          tags: selectedTags,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Xuất bản thất bại');
      }

      // Clear draft on successful publish
      localStorage.removeItem('ai_up_draft_post');
      setHasDraft(false);

      showToast('Đã xuất bản thành công! Vercel sẽ tự động deploy trong 1-2 phút.', 'success');
      
      // Redirect back to dashboard after 3 seconds
      setTimeout(() => {
        window.location.href = '/admin';
      }, 3000);

    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Lỗi kết nối khi xuất bản', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="pt-24 pb-32 max-w-5xl mx-auto px-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 flex items-center gap-3 backdrop-blur-xl ${
            toastMessage.type === 'success'
              ? 'bg-[#1d9e75]/10 border-[#1d9e75]/30 text-[#1d9e75]'
              : toastMessage.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-[#7c6af7]/10 border-[#7c6af7]/30 text-[#7c6af7]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {toastMessage.type === 'success' ? 'check_circle' : toastMessage.type === 'error' ? 'error' : 'info'}
          </span>
          <span className="text-sm font-medium text-on-surface">{toastMessage.text}</span>
        </div>
      )}

      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="mb-2">
            <Link href="/admin" className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all duration-200 text-xs font-medium uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Quay lại Dashboard
            </Link>
          </nav>
          <h1 className="text-4xl font-bold text-on-surface mb-1">Viết bài mới</h1>
          <p className="text-on-surface-variant text-sm">Soạn thảo nội dung và sử dụng trợ lý AI Assistant</p>
        </div>

        {/* Draft Restore Notification */}
        {hasDraft && (
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant">Phát hiện bản nháp chưa lưu</span>
            <button
              onClick={handleRestoreDraft}
              className="px-3 py-1 rounded bg-[#7c6af7] text-white text-xs font-semibold hover:bg-[#7c6af7]/80 transition-all cursor-pointer"
            >
              Khôi phục
            </button>
            <button
              onClick={handleClearDraft}
              className="px-2 py-1 rounded bg-surface-variant text-on-surface-variant text-xs hover:bg-surface-variant/80 transition-all cursor-pointer"
            >
              Xóa
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-on-surface font-semibold mb-2 text-xs uppercase tracking-wider">
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: GraphRAG - Cứu Tinh Của Bài Toán Suy Luận Nhiều Bước..."
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#7c6af7] focus:outline-none focus:ring-2 focus:ring-[#7c6af7]/20 transition-all font-medium"
            />
          </div>

          {/* Slug & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-on-surface font-semibold mb-2 text-xs uppercase tracking-wider">
                Slug (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug-tieu-de-bai-viet"
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#7c6af7] focus:outline-none focus:ring-2 focus:ring-[#7c6af7]/20 transition-all font-mono text-sm"
              />
              <p className="text-[11px] text-on-surface-variant mt-1.5 pl-1">Lowercase, số và dấu gạch ngang</p>
            </div>

            <div>
              <label className="block text-on-surface font-semibold mb-2 text-xs uppercase tracking-wider">
                Ngày đăng
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:border-[#7c6af7] focus:outline-none focus:ring-2 focus:ring-[#7c6af7]/20 transition-all"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-on-surface font-semibold mb-2 text-xs uppercase tracking-wider">
              Tóm tắt (Excerpt)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Mô tả ngắn gọn về bài viết để hiển thị ở trang chủ..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#7c6af7] focus:outline-none focus:ring-2 focus:ring-[#7c6af7]/20 transition-all resize-none text-sm"
            />
          </div>

          {/* HTML Content */}
          <div>
            <label className="block text-on-surface font-semibold mb-2 text-xs uppercase tracking-wider flex justify-between items-center">
              <span>Nội dung (HTML)</span>
              <span className="text-[11px] text-[#7c6af7] font-mono normal-case tracking-normal">Hỗ trợ các thẻ: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;code-inline&gt;, v.v.</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`<h2>1. Vector Database Là Gì?</h2>\n<p>Đầu tiên, chúng ta cần hiểu rõ khái niệm...</p>\n\n<h2>2. Kiến trúc GraphRAG nâng cao</h2>\n<p>Kết hợp đồ thị tri thức...</p>`}
              rows={16}
              className="w-full px-4 py-4 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/30 focus:border-[#7c6af7] focus:outline-none focus:ring-2 focus:ring-[#7c6af7]/20 transition-all font-mono text-sm leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzing || !content}
              className="flex-1 min-w-[200px] px-6 py-3.5 rounded-xl bg-[#7c6af7]/10 text-[#c0c1ff] border border-[#7c6af7]/30 hover:bg-[#7c6af7]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAnalyzing ? 'sync' : 'auto_awesome'}
              </span>
              {isAnalyzing ? 'Đang phân tích...' : 'Phân tích với AI'}
            </button>

            <button
              onClick={handleSaveDraft}
              className="px-6 py-3.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface hover:bg-surface-container-highest transition-all font-semibold active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">draft</span>
              Lưu nháp
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing || !title || !slug || !content || selectedTags.length === 0}
              className="flex-1 min-w-[200px] px-6 py-3.5 rounded-xl bg-[#1d9e75] text-white hover:bg-[#1d9e75]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPublishing ? 'sync' : 'publish'}
              </span>
              {isPublishing ? 'Đang xuất bản...' : 'Xuất bản'}
            </button>
          </div>

          {/* AI Suggestions Results */}
          {aiSuggestions && (
            <div className="p-6 rounded-2xl bg-surface-container border border-[#7c6af7]/30 shadow-2xl shadow-[#7c6af7]/5 space-y-6 mt-8">
              <div className="flex items-center gap-2.5 border-b border-outline-variant/20 pb-4">
                <span className="material-symbols-outlined text-[#7c6af7]">auto_awesome</span>
                <h2 className="text-lg font-bold text-on-surface">Đề xuất tối ưu từ Trợ lý AI</h2>
              </div>

              {/* SEO Description */}
              {aiSuggestions.seoDescription && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-on-surface">Mô tả SEO đề xuất</h4>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch">
                    <input
                      type="text"
                      readOnly
                      value={aiSuggestions.seoDescription}
                      className="flex-1 px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-xs font-medium text-on-surface-variant select-all cursor-default"
                    />
                    <button
                      onClick={() => {
                        setExcerpt(aiSuggestions.seoDescription);
                        showToast('Đã sao chép mô tả SEO làm tóm tắt!', 'success');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#7c6af7]/10 hover:bg-[#7c6af7]/20 border border-[#7c6af7]/20 text-[#c0c1ff] text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[14px]">file_copy</span>
                      Dùng làm tóm tắt
                    </button>
                  </div>
                </div>
              )}

              {/* Suggested Tags */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-on-surface">Tags đề xuất</h4>
                
                {/* Existing Tags Suggestions */}
                {aiSuggestions.suggestedTags && aiSuggestions.suggestedTags.length > 0 && (
                  <div>
                    <p className="text-[10px] text-on-surface-variant mb-1.5 uppercase font-medium">Tag hiện có (tự động bật):</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.suggestedTags.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#7c6af7] text-white border border-[#7c6af7]'
                                : 'bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest'
                            }`}
                          >
                            <span>#{tag}</span>
                            {isSelected && <span className="material-symbols-outlined text-[12px]">check</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* New Tags Suggestions */}
                {aiSuggestions.newTagSuggestions && aiSuggestions.newTagSuggestions.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] text-[#7c6af7] mb-1.5 uppercase font-medium">Đề xuất thêm tag mới (nhấp để thêm):</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.newTagSuggestions.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border border-dashed flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#7c6af7] border-[#7c6af7] text-white'
                                : 'border-[#7c6af7]/40 text-[#c0c1ff] bg-[#7c6af7]/5 hover:bg-[#7c6af7]/10'
                            }`}
                          >
                            <span>#{tag}</span>
                            {isSelected && <span className="material-symbols-outlined text-[12px]">check</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Diagrams Suggestions */}
              {aiSuggestions.diagrams && aiSuggestions.diagrams.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-on-surface">Sơ đồ Mermaid đề xuất</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {aiSuggestions.diagrams.map((diag, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/10 pb-3">
                          <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-[#ef9f27]">schema</span>
                            Chèn sau: <code className="px-1.5 py-0.5 rounded bg-surface-container-low border border-outline-variant/10 font-mono text-[10px] text-[#c0c1ff]">{diag.afterHeading}</code>
                          </span>
                          <button
                            onClick={() =>
                              insertAfterHeading(
                                diag.afterHeading,
                                `\n<pre className="mermaid">\n${diag.mermaidCode}\n</pre>\n`
                              )
                            }
                            className="px-3 py-1.5 rounded-lg bg-[#7c6af7] hover:bg-[#7c6af7]/90 text-white text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-md shadow-[#7c6af7]/10"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            Chèn vào bài viết
                          </button>
                        </div>
                        
                        {/* Live Mermaid Preview */}
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Xem trước sơ đồ (Live Preview):</p>
                          <MermaidPreview code={diag.mermaidCode} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Suggestions */}
              {aiSuggestions.imageSuggestions && aiSuggestions.imageSuggestions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-on-surface">Từ khóa hình ảnh đề xuất</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiSuggestions.imageSuggestions.map((img, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 flex flex-col justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-on-surface-variant mb-1 uppercase font-semibold">Vị trí: sau heading</p>
                          <code className="block px-2 py-1 rounded bg-surface-container-low border border-outline-variant/10 font-mono text-[10px] text-[#c0c1ff] mb-2 truncate">
                            {img.afterHeading}
                          </code>
                          <p className="text-xs text-on-surface font-semibold flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-[#1d9e75]">search</span>
                            Từ khóa: &quot;{img.searchKeywords}&quot;
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            insertAfterHeading(
                              img.afterHeading,
                              `\n<img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="${img.searchKeywords}" className="w-full rounded-xl my-6 border border-outline-variant/15" />\n`
                            )
                          }
                          className="w-full py-2 rounded-lg bg-[#1d9e75]/10 hover:bg-[#1d9e75]/20 border border-[#1d9e75]/20 text-[#1d9e75] text-xs font-semibold cursor-pointer flex items-center justify-center gap-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-[14px]">image</span>
                          Chèn thẻ &lt;img&gt; placeholder
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Existing Tags selection */}
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/20 backdrop-blur-xl">
            <h3 className="text-on-surface font-semibold mb-4 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant/20 pb-3">
              <span className="material-symbols-outlined text-[16px] text-[#7c6af7]">local_offer</span>
              Thẻ hiện có
            </h3>
            
            <div className="flex flex-wrap lg:flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
              {availableTags.length > 0 ? (
                availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`text-left px-3 py-2 rounded-xl transition-all text-xs font-semibold flex items-center justify-between cursor-pointer w-full ${
                        isSelected
                          ? 'bg-[#7c6af7] text-white shadow-lg shadow-[#7c6af7]/20'
                          : 'bg-surface-container-high/40 text-on-surface-variant hover:bg-surface-container-highest/60 hover:text-on-surface'
                      }`}
                    >
                      <span>#{tag}</span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-on-surface-variant italic">Không có thẻ nào</p>
              )}
            </div>
            
            {selectedTags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-outline-variant/20">
                <p className="text-[11px] text-on-surface-variant font-medium mb-2 uppercase">Đã chọn ({selectedTags.length}):</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-[#7c6af7]/20 border border-[#7c6af7]/40 text-[#c0c1ff] text-[10px] font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats info */}
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/20">
            <h3 className="text-on-surface font-semibold mb-4 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-outline-variant/20 pb-3">
              <span className="material-symbols-outlined text-[16px] text-[#ef9f27]">insights</span>
              Thông số
            </h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <p className="text-on-surface-variant mb-1">Số từ nội dung:</p>
                <p className="text-on-surface font-bold text-lg">
                  {content ? content.trim().split(/\s+/).filter(Boolean).length : 0}
                </p>
              </div>

              <div>
                <p className="text-on-surface-variant mb-1">Ước tính thời gian đọc (phút):</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    min="1"
                    max="60"
                    className="w-16 px-2.5 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold text-center focus:border-[#7c6af7] focus:outline-none"
                  />
                  <span className="text-on-surface-variant">phút</span>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/10">
                <p className="text-on-surface-variant text-[10px] uppercase font-semibold">Đường dẫn bài viết:</p>
                <p className="text-[#c0c1ff] font-mono text-[11px] mt-1 break-all bg-surface-container-low p-2 rounded-lg border border-outline-variant/15">
                  /blog/{slug || 'tieu-de-bai-viet'}
                </p>
              </div>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
            <h4 className="text-on-surface font-semibold mb-3 text-xs uppercase tracking-wider text-on-surface-variant">Checklist xuất bản</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full ${title ? 'bg-[#1d9e75]' : 'bg-outline-variant'}`}></span>
                <span className={title ? 'text-on-surface/80' : 'text-on-surface-variant/60'}>Tiêu đề: {title ? '✓' : 'Trống'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full ${slug ? 'bg-[#1d9e75]' : 'bg-outline-variant'}`}></span>
                <span className={slug ? 'text-on-surface/80' : 'text-on-surface-variant/60'}>Slug: {slug ? '✓' : 'Trống'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full ${content ? 'bg-[#1d9e75]' : 'bg-outline-variant'}`}></span>
                <span className={content ? 'text-on-surface/80' : 'text-on-surface-variant/60'}>Nội dung: {content ? '✓' : 'Trống'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedTags.length > 0 ? 'bg-[#1d9e75]' : 'bg-outline-variant'}`}></span>
                <span className={selectedTags.length > 0 ? 'text-on-surface/80' : 'text-on-surface-variant/60'}>Thẻ tags: {selectedTags.length > 0 ? '✓' : 'Chưa chọn'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
