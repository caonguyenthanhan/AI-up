'use client';

import { useEffect } from 'react';

export default function MermaidRenderer() {
  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          themeVariables: {
            background: '#0b0b0f',
            primaryColor: '#7c6af7',
            primaryTextColor: '#e2e8f0',
            lineColor: '#464554',
          }
        });

        // Find all mermaid blocks
        // 1. <pre className="mermaid">...</pre> (what our editor chèn button creates)
        // 2. <pre><code className="language-mermaid">...</code></pre> (what standard markdown compilers output)
        const elements = document.querySelectorAll('pre.mermaid, pre > code.language-mermaid');
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i] as HTMLElement;
          const isCodeInsidePre = element.tagName.toLowerCase() === 'code' && element.parentElement?.tagName.toLowerCase() === 'pre';
          const targetToReplace = isCodeInsidePre ? (element.parentElement as HTMLElement) : element;
          
          const codeText = element.textContent || '';
          if (!codeText.trim()) continue;

          // Generate a unique ID for rendering
          const id = `mermaid-post-${i}-${Math.random().toString(36).substring(2, 9)}`;
          
          try {
            // Render diagram asynchronously
            const { svg } = await mermaid.render(id, codeText);
            
            // Create a wrapper div to hold the SVG and apply styling
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-rendered-container my-8 p-4 bg-[#0b0b0f] rounded-2xl border border-outline-variant/15 flex justify-center overflow-auto w-full';
            wrapper.innerHTML = svg;
            
            targetToReplace.parentNode?.replaceChild(wrapper, targetToReplace);
          } catch (err) {
            console.error('Error rendering mermaid block:', err);
            // Display error cleanly
            const errorContainer = document.createElement('div');
            errorContainer.className = 'text-red-400 text-xs p-3 bg-red-950/20 border border-red-500/20 rounded-xl my-6 font-mono';
            errorContainer.textContent = `[Lỗi vẽ sơ đồ Mermaid]: Vui lòng kiểm tra cú pháp sơ đồ.`;
            targetToReplace.parentNode?.replaceChild(errorContainer, targetToReplace);
          }
        }
      } catch (e) {
        console.error('Failed to run Mermaid renderer:', e);
      }
    };

    // Delay slightly to ensure client-side DOM is fully parsed and mounted
    const timer = setTimeout(renderMermaid, 150);
    return () => clearTimeout(timer);
  }, []);

  return null; // Behavior-only component
}
