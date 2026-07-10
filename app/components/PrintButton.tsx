'use client';

import React from 'react';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="print-btn print:hidden fixed bottom-8 right-8 z-50 p-4 rounded-full bg-surface-container/80 backdrop-blur-xl text-[#7c6af7] shadow-2xl border border-outline-variant/30 hover:bg-[#7c6af7]/10 hover:border-[#7c6af7]/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer group"
      title="In bài viết (Tối ưu tiết kiệm giấy)"
    >
      <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform duration-200">
        print
      </span>
    </button>
  );
}
