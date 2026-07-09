import type { Metadata, Viewport } from "next";
import "./globals.css";
import React from "react";
import BottomNavBar from "./components/BottomNavBar";

export const metadata: Metadata = {
  title: "AI-up Insights | AI Engineering & Learning Blog",
  description: "Hành trình học tập, nghiên cứu và phát triển trong thế giới AI Engineering & Agentic Workflow.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  themeColor: "#131318",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="bg-background">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#131318" />
      </head>
      <body className="text-on-surface selection:bg-primary-container selection:text-on-primary-container">
        {/* Global Progress Bar */}
        <div
          className="fixed top-0 left-0 w-full h-1 bg-primary origin-left scale-x-0 transition-transform duration-75 z-60"
          id="global-progress"
          style={{ backgroundColor: 'var(--primary)' }}
        />

        <div className="layout-container">
          {/* TopAppBar */}
          <header className="header glass-header">
            <div className="nav-wrapper">
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-primary cursor-pointer active:scale-95 transition-transform"
                  data-icon="menu"
                >
                  menu
                </span>
                <h1 className="logo">
                  AI-up
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/caonguyenthanhan/AI-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined" data-icon="terminal">
                    terminal
                  </span>
                </a>
              </div>
            </div>
          </header>

          <main className="main-content">
            {children}
          </main>

          {/* Bottom Navigation (Mobile) */}
          <BottomNavBar />

          <footer className="footer">
            <div className="footer-content">
              <span>© {new Date().getFullYear()} AI-up. Cập nhật bởi caonguyenthanhan.</span>
              <span>Built with Next.js & Vercel</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
