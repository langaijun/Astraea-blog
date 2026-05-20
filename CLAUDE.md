# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astraea is a minimalist blog application built with React 19, TypeScript, and Vite. The design philosophy emphasizes simplicity and purity — all styling uses inline styles rather than Tailwind classes or UI component libraries.

## Commands

```bash
cd app  # All work happens in the app/ directory
npm run dev       # Dev server on port 3000
npm run build     # Production build (tsc + vite build)
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Architecture

### Routing
- Uses `react-router` with `HashRouter` (not BrowserRouter)
- Routes: `/` (Home), `/p/:slug` (Article), `/admin` (Admin)

### Page Structure
```
src/
├── App.tsx              # Root component with HashRouter
├── main.tsx             # Entry point, imports Noto Sans SC fonts
├── pages/
│   ├── Home.tsx         # Blog listing
│   ├── Article.tsx      # Single post view
│   └── Admin.tsx        # CMS for editing posts
├── sections/
│   ├── Navigation.tsx   # Sticky nav with "edit" link
│   └── Footer.tsx       # External links footer
└── data/
    └── posts.ts         # Post data management
```

### Data Management
- Blog posts are stored in `public/posts.json` (static)
- Admin UI uses `localStorage` (`farsight_posts` key) for draft editing
- `getPosts()` reads static JSON first, falls back to localStorage
- `saveLocalPosts()` writes to localStorage (admin only)
- Deploying content: Admin → Export JSON → Place in `public/posts.json` → Commit to Git

### Styling Philosophy
- **No Tailwind classes** — All styling uses inline `style={{ ... }}` objects
- **No shadcn/ui components** — Despite being installed, the project uses custom minimalist UI
- Design tokens: Primary color `#3d2b1f`, background `#faf5f0`, accent `#c1784a`
- All interactions use inline event handlers with CSS transitions (hover states)

### Path Aliases
- `@/*` → `./src/*` (configured in vite.config.ts and tsconfig.json)

## Development Notes

- Chinese font: `@fontsource/noto-sans-sc` weights 300 and 400 imported in main.tsx
- Content paragraphs split by `\n\n` in Admin form, rendered as `<p>` blocks in Article view
- Slug generation uses `slugify()` which preserves Chinese characters