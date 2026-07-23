# 0-Day

Internal admin/UI template for agency LOB (line-of-business) client apps. This tree is the pristine source we scaffold new client front-ends from: a themed admin shell plus a broad component and page kit, all in Vite + React 19 + TypeScript + Tailwind 4.

- npm package: `zero-day`
- Not Next.js. Client-rendered SPA (React Router).
- This repo is the **UI/admin shell only**. Clients typically run their auth, API, and workers on Azure; 0-Day is the front-end you wire to those services.

## Quick start

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the built dist/ locally
npm run lint     # eslint
```

Node 18+ and npm 9+ (see `engines` in `package.json`).

## What's in the shell (default nav)

The sidebar ships intentionally lean. Everything else is kit that lives on disk and is reachable by direct URL, but is not linked in the nav.

- **Dashboards** — Overview, Analytics, eCommerce, CRM
- **Apps** — starter modules (Email, Chat, Calendar, Contacts, Blog, E-commerce, Notes, Kanban) and advanced feature modules (Rule Engine, Query Builder, Real-Time Simulation, Smart Insights, Workflow Builder, Task Scheduler)
- **Pages** — Account Settings

`/` redirects to `/dashboard`. There is no marketing landing page in the product path.

## What's in the kit (on disk, not in the sidebar)

These exist and are routable at direct URLs. Prune what a client doesn't need, or promote pieces into the nav when they do:

- Forms, tables, charts (Chart.js — line/area/column/candlestick/pie/radial)
- Auth-card variants (`/auth-card/*`, unlinked)
- Pricing, gallery, FAQ, typography
- Landing/home page sections (still on disk; not in the product path)

## Auth

Live auth routes under the split `AuthLayout`:

- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`

These are UI only — wire them to the client's Azure (or other) auth backend. The older `/auth-card/*` screens still exist but are unlinked.

## Branding and logos

Logos are drop-in. Replace the files in `public/assets/logo/` in place — no code changes needed:

- `logo.svg` — wordmark for light backgrounds
- `logo-dark.svg` — wordmark for dark backgrounds
- `logomark.svg` — icon-only mark (collapsed sidebar, favicon)

See `public/assets/logo/README.md` for details. App branding is "0-Day"; persisted client state uses `zeroday-*` storage keys (e.g. `zeroday-theme`, `zeroday-locale`).

## Theming

- Light and dark modes both ship.
- Primary/accent colors are CSS variables — edit `src/styles/variables.css`.
- Layout options (sidebar vs. horizontal) remain in the theme system.
- A `ThemeCustomizer` component exists but is **unmounted** from `RootLayout` — the default client shell does not expose an end-user theme panel. Mount it if a specific client wants runtime theme switching.

## i18n

Internationalization plumbing is kept, English-first. Add a language by creating a JSON file in `src/i18n/locales/` (copy `en.json`) and registering it in `src/i18n/index.ts`.

## Project structure

```
zero-day/
├── public/assets/        # static assets (logos, images, flags)
├── src/
│   ├── components/        # reusable UI components
│   ├── context/           # React context providers (theme, etc.)
│   ├── data/              # static/mock data
│   ├── features/          # advanced feature modules (rule-engine, workflow-builder, ...)
│   ├── hooks/             # custom hooks
│   ├── i18n/locales/      # translations
│   ├── layouts/           # layouts + sidebar nav (layouts/sidebar/navData.ts)
│   ├── pages/             # page components
│   ├── routes/            # routing config (routes/index.tsx)
│   ├── styles/            # global styles + CSS variables
│   └── types/             # TypeScript types
└── package.json
```

## Common edits

- **Change the nav:** `src/layouts/sidebar/navData.ts`
- **Add a route:** `src/routes/index.tsx`
- **Add a page:** create in `src/pages/`, route it, optionally add to nav
- **Change theme colors:** `src/styles/variables.css`

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router · Chart.js · DND Kit · Tiptap · Swiper. Exact versions live in `package.json`.

## Intended use (roadmap)

Today this tree is the hand-maintained source for LOB client scaffolds: clone/copy, rebrand via logo drop-in and theme vars, prune the kit to what the client needs, and wire auth/data to their backend.

A guided scaffold flow (QA interview → generated client app) is planned but **not built yet**. Don't rely on it existing. Until then, treat this repo as the pristine baseline and keep it clean.
