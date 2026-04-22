# Repo Context

> For AI agents: this file is a repo briefing meant to give coding agents fast working context. Keep it concise, practical, and focused on how to change this repo safely.

## Stack
- Vite 7 + React 19 + TypeScript.
- Routing lives in `src/App.tsx` via `react-router`.
- Deploy target is the GitHub Pages root site, so `vite.config.ts` uses `base: '/'`.
- GitHub Pages deploy runs from `.github/workflows/main.yml` on push to `main`.

## Build Flow
- `npm run build`
- `node sitemap.js`
- `vite build` -> client bundle in `dist/client`
- `vite build --ssr src/entry-server.tsx --outDir dist/server`
- `npx tsx prerender.ts` -> static HTML per route in `dist/client/**/index.html`
- Primary verification is `npm run build`. ESLint is configured, but there is no lint script in `package.json`.

## Runtime Map
- `src/main.tsx`: hydrates with `BrowserRouter`; restores paths from the `?redirect=` fallback.
- `src/entry-server.tsx`: SSR render used by prerender only.
- `prerender.ts`: injects rendered HTML plus title/meta/OG/Twitter/JSON-LD.
- `sitemap.js`: rebuilds `public/sitemap.xml` and `public/sitemap.html` from published blog posts.
- `index.html`: shared Vite shell.
- `public/404.html`: GitHub Pages fallback redirect for client routes.

## Verified Edge Cases
- Canonical URL generation in `prerender.ts` is intentionally asymmetric and has been manually verified to work:
  - homepage canonical is exactly `https://rishinandha.github.io` with no trailing slash
  - every subpage canonical is `https://rishinandha.github.io/<route>/` with a trailing slash
- Preserve the current `canonicalUrl` behavior exactly as implemented in `prerender.ts`; do not normalize all pages to the same slash style.
- `og:url` and `twitter:url` intentionally reuse that same `canonicalUrl`, so any SEO edits must preserve the same homepage-vs-subpage slash rule there too.
- `/research` is a real alias for `/projects` and is part of the current verified setup. It is referenced across routes, sitemap generation, prerendering, and the Pages workflow checks.
- GitHub Pages routing depends on the current `public/404.html` redirect plus the `?redirect=` recovery in `src/main.tsx`. Treat those two pieces as one working system.

## Route Map
- `/`: `src/pages/About.tsx`, styles `src/pages/css/About.css`, image `src/assets/headshot.jpg`.
- `/projects`: `src/pages/Projects.tsx`.
- `/research`: alias to Projects. Keep this alias; sitemap/workflow expect it.
- `/music`: `src/pages/Music.tsx`.
- `/blog`: `src/pages/Blog.tsx`.
- `/blog/:post`: `src/components/MdToBlog.tsx`.
- `/activism`: `src/pages/Activism.tsx`.
- `/cv` and `/CV`: `src/pages/CV.tsx` -> redirects to `public/CV.pdf`.
- Nav: `src/components/NavBar.tsx`. Global layout/theme: `src/App.css`.

## Where To Edit
- Navbar links or labels: `src/components/NavBar.tsx`, `src/components/Navbar.css`.
- About copy/layout: `src/pages/About.tsx`, `src/pages/css/About.css`.
- Projects:
  - data: `src/assets/projects/projects.json`
  - card UI: `src/components/Iproject.tsx`
  - images: `public/projects/*`
- Music:
  - data: `src/assets/music/music.json`
  - page grouping: `src/pages/Music.tsx`
  - embed UI: `src/components/Imusic.tsx`
- Blog:
  - metadata: `src/assets/blog/blog.json`
  - markdown: `src/assets/blog/markdowns/*.md`
  - list page: `src/pages/Blog.tsx`
  - list card: `src/components/Iblog.tsx`
  - post renderer / TOC / related: `src/components/MdToBlog.tsx`
  - thumbnails/images: `public/blogs/thumbnails/*`, `public/blogs/images/*`
- Activism:
  - data: `src/assets/activism/activism.json`
  - page: `src/pages/Activism.tsx`
  - card UI: `src/components/Iactivism.tsx`
  - card thumbnails: `src/assets/activism/thumbnails/*`
  - linked public assets: `public/activism/*`
- CV: replace `public/CV.pdf`.
- Shared types are in `src/assets/types.ts`, but most prop shapes are local to components.

## CSS Practices In Use
- CSS is plain global CSS, split per page/component. There are no CSS modules or utility frameworks in the current setup.
- The global dark theme and base spacing come from `src/App.css`; treat that file as the root visual baseline.
- `src/components/Iproject.css` is a shared layout file used by projects and also imported by activism. Changes there can affect both sections.
- `src/components/MdToBlog.css` is its own design system for blog detail pages, with local CSS variables, grid layout, TOC, author box, figure sizing helpers, and mobile breakpoints.
- Current layout sizing relies on explicit widths/min-widths/max-widths in several files:
  - `Iproject.css` and `Iblog.css` use fixed-width style constraints plus mobile overrides
  - `Navbar.css` uses `width: calc(100vw - 9vh)` and a mobile reflow
  - `About.css` relies on a desktop two-column layout that flips on mobile
- Current responsive behavior is manually tuned with existing breakpoints such as `768px`, `770px`, `700px`, and `1000px`. Preserve those patterns unless there is a deliberate reason to change them.
- Blog list and blog detail styling are separate systems:
  - `Iblog.css` controls the blog index cards and filters
  - `MdToBlog.css` controls the full post page
- The current CSS intentionally uses a mix of:
  - card-based dark surfaces
  - pill links/buttons/tags
  - justified body copy in many sections
  - explicit mobile layout overrides rather than relying on fluid defaults
- Treat the current CSS files as verified working behavior. When editing styles, prefer preserving the established class structure and responsive rules instead of rewriting layout patterns.

## Content Schemas
- Projects: `title`, `imageSrc`, `description1`, `description2`, `links[{ link, annotation }]`, `year`, `type`.
- Music: `title`, `embedUrl`, `description`, `type`, `linkType`.
- Blog: `url`, `filename`, `title`, `publish`, `thumbnail`, `tags`, `date`, `description`, `related`, optional `metaDescription`, `keywords`.
- Activism: `title`, `publish`, `thumbnail`, `date`, `links[{ link, annotation }]`, `description`.

## Change Rules
- New static route/page:
  - add route in `src/App.tsx`
  - add page/component file(s)
  - add route in `prerender.ts`
  - add route in `sitemap.js` if it should be indexed
  - add nav link if needed
  - update `.github/workflows/main.yml` verify step if deploy should check it
- New blog post:
  - add markdown file
  - add entry in `src/assets/blog/blog.json`
  - add thumbnail/public images
  - set `publish: 1` to include it in blog list, sitemap, and prerender
- SEO/meta changes:
  - per-route logic: `prerender.ts`
  - shared shell tags: `index.html`
  - preserve the verified canonical rule: home has no trailing slash, subpages do

## PR Checklist
- Branch from `main`; target `main`.
- Run `npm run build` before pushing.
- If routes or slugs changed, sanity check `public/sitemap.xml`, `public/sitemap.html`, and expected files in `dist/client`.
- Do not commit `dist/` or `node_modules/`.
- Merge to `main` triggers GitHub Pages deploy. PRs themselves do not deploy.
