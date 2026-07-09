# Project Rules: AI-up Blog Repository

## 1. Web App Styling & Aesthetics
- **Dark Mode Priority**: The app must be visually stunning under dark mode. Background `#0b0b0f`, text `#e2e8f0`.
- **Accents**: Neon purple `#7c6af7`, teal `#1d9e75`, and amber `#ef9f27` for highlights and hover glows.
- **Typography**: Import Google Fonts `Outfit` and `JetBrains Mono` (for code blocks).
- **Animations**: Subtle, smooth CSS transitions (0.2s duration) on links, cards, and filter tag selections. No jarring jumps.
- **Glassmorphism**: Use cards with `backdrop-filter: blur(12px)` and very thin semi-transparent borders `1px solid rgba(255, 255, 255, 0.08)`.

## 2. Blog Parsing System
- All articles are stored in `detail/`.
- Support both `.html` and `.md` file formats.
- Scan and sort blogs by date descending on the homepage.
- Slug must be clean (lowercase, alphanumeric, and hyphens only).
- Keep parses extremely robust: if a file has malformed metadata, fallback gracefully.

## 3. SEO & Standard Compliance
- Use semantic HTML tags (`<header>`, `<main>`, `<article>`, `<nav>`, `<footer>`).
- Ensure all interactive elements have unique IDs or classnames for accessibility and testing.
- Single `<h1>` per page (Page Title).
