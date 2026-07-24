# Bake contract (Phase 2)

Human-executable contract for producing a **new client repo** from the 0-Day template. Phase 2 defines behavior; Phase 3 adds the baker CLI at `scaffold/scripts/bake.mjs`.

Companion files:

| Artifact | Path (factory repo) |
|---|---|
| Config schema | `scaffold/scaffold.config.schema.json` |
| Field → file map | `scaffold/touchpoints.md` |
| Nav ID → path registry | `scaffold/mappings/nav-registry.json` |
| Example configs | `scaffold/examples/*.client.json` |

**Factory vs client:** During bake, `scaffold.config.json`, `scaffold.config.schema.json`, and `scaffold/mappings/nav-registry.json` live in the **factory repo** (`lob-scaffV2/scaffold/…`). The baker reads them from there while writing transforms into a **copy** of `zero-day/` at the client destination. Do **not** copy `scaffold/` into the client repo unless a future bake manifest explicitly requires it.

---

## 1. Purpose

Bake = copy `zero-day/` into a **new client repository**, then apply a validated `scaffold.config.json` so the UI shell ships with client brand, theme defaults, auth link prefix, regenerated front-facing nav, and a consistent first-dashboard home policy.

- Output is a Vite SPA admin shell (React 19 + TypeScript + Tailwind 4).
- Azure owns auth, API, and workers — this bake does not wire them.
- Kit pages/routes stay on disk; bake controls what appears in nav (and top-rail mega menu).

---

## 2. Locked decisions (Phase 2)

These four decisions are normative. An implementer must follow them exactly.

### 2.1 First-dashboard home policy

Resolve `homePath` = nav-registry `path` for `dashboards[0]` (first selected dashboard, config order).

Repoint **every** hardcoded `/dashboard` (or equivalent “home” entry) link to `homePath`. Do **not** leave Overview (`/dashboard`) as an eternal fallback when Overview is deselected.

Post-login destination for auth pages is **not** rewritten in Login/Register — bake writes `homePath` into `src/auth/config.ts` as `authConfig.postLoginPath` (see §5 auth config).

| Touchpoint | What to change |
|---|---|
| `src/routes/index.tsx` | Index route `<Navigate to="…" replace />` → `homePath` |
| `src/auth/config.ts` | `authConfig.postLoginPath` → `homePath` |
| `src/layouts/sidebar/Sidebar.tsx` | Logo `<Link to="…">` → `homePath` |
| `src/layouts/AuthLayout.tsx` | All logo/home `<Link to="…">` (split + card layouts) → `homePath` |
| `src/layouts/header/AppHeader.tsx` | Horizontal logo `<Link to="…">`; `TopLink to="…"`; mega menu `footer.to` → `homePath` |
| `src/pages/errors/NotFoundPage.tsx` | “Back home” / primary recovery `<Link to="…">` → `homePath` |

Baker resolves `homePath` via `scaffold/mappings/nav-registry.json` — never hardcode `/dashboard` when baking.

### 2.2 Brand sweep (aggressive)

Replace **all relevant** leftover template product branding in the **client output tree** so engineering does not mop up later. This is not shell-only.

- **Display string:** `productName` (human-readable).
- **Slug contexts:** derived `packageName` (npm name, storage key prefix — see §2.3).

Minimum sweep targets:

| Area | Action |
|---|---|
| `src/i18n/locales/en.json` | Full-file sweep: every `0-Day` / template product mention → `productName` |
| Other locale files (`ar`, `es`, `fr`, `hi-IN`, `ja`, `pt`, `ru`, `ur`, `zh-CN`) | At minimum `brand.name`, `footer.copyright_all_rights`, `home.welcome`, `landing.footer.copyright`; prefer full product-name sweep per file |
| `index.html` | `<title>` → `productName` |
| `src/components/common/Logo.tsx` | `alt` attributes + product comment → `productName` |
| `src/layouts/header/AppHeader.tsx` | Home `aria-label` → `"{productName} Home"` |
| `src/layouts/AuthLayout.tsx` | Uses `t('brand.name')` after locale bake — no extra hardcode |
| `src/pages/forms/FormLayoutPage.tsx` | Placeholder company string (e.g. `"0-Day Inc."`) → `"{productName}"` or `"{productName} Inc."` |
| `package.json` | `name` → `packageName`; `description` / `author` → include `productName` |
| `src/styles/*.css`, `src/index.css` | Comment headers that say `0-Day` as product → `productName` |
| `public/assets/logo/*.svg` | `aria-label` product strings → `productName` |
| `README.md` (client root, if copied) | Product title / intro mentions → `productName` |

**Post-bake grep (client repo):** search for `0-Day`, `0-day`, `zero-day`, `Zero-Day`, `zeroday` in copied client sources (exclude `node_modules`). Fix any hit that refers to the **product**, not the factory folder name `scaffold/`.

**Storage keys (locked):** Rename client-scoped persistence keys from `zeroday-*` to `${packageName}-*`:

| Old key | New key |
|---|---|
| `zeroday-theme` | `${packageName}-theme` |
| `zeroday-locale` | `${packageName}-locale` |
| `zeroday-direction-locked-by-locale` | `${packageName}-direction-locked-by-locale` |

Update in: `index.html` FOUC boot script, `src/context/ThemeContext.tsx`, `src/i18n/LocaleProvider.tsx`.

**Out of scope for brand sweep:** feature-demo persistence keys (`zeroday_rules`, `zeroday_workflows`, etc.) — demo feature internals, not shell branding. Leave unchanged unless a future phase says otherwise.

### 2.3 `packageName` auto-derive

When `packageName` is omitted from config, derive before any write that needs the slug:

1. Start from `productName`.
2. Lowercase.
3. Replace every run of non-alphanumeric characters with a single `-`.
4. Trim leading/trailing `-`.
5. Collapse repeated `-` (steps 3–4 may need a second pass).
6. If empty after slugify, fallback `lob-app`.

Write the result to `package.json` `name`. Use the same value for storage key prefixes (§2.2).

### 2.4 Nav strategy: regenerate (not filter-in-place)

**Do not** edit the template `navData.ts` by filtering rows in place or preserving demo `badge` counts.

**Regenerate** `src/layouts/sidebar/navData.ts` from `scaffold/mappings/nav-registry.json` (read from factory repo) plus config selection:

1. **Dashboards** group — entries for each `dashboards[]` ID in config order. Omit group if empty (config requires ≥1).
2. **Apps** group — selected `starterModules[]` in config order, then selected `advancedFeatures[]` in config order. Omit group if both arrays empty.
3. **Pages** group — always include `alwaysNav` → Account Settings (`/pages/account-settings`). Omit group only if registry has no `alwaysNav` (should not happen).

Per entry: `path`, `label`, `icon: Icons[entry.icon]` (registry `icon` keys match `Icons` exports). Copy `children` from registry when present. **Never** emit `badge` unless the registry defines it (registry must not include demo badge counts).

**Never add to nav:** forms, tables, charts, pricing, gallery, FAQ, typography, or auth-gallery kit pages. `ThemeCustomizer` stays unmounted. Kit routes stay on disk.

When `shell === 'top-rail'`, also **regenerate** (not filter-in-place) the `AppHeader.tsx` mega menu `menus` array from the same registry selection:

- Include selected **starter** modules that fit the current mega menu shape (email, chat, notes, kanban, calendar, e-commerce, blog in template).
- **Contacts** and **advancedFeatures** are not in the template mega shape — they appear in `HorizontalNav` / `navData.ts` only. Document honestly: in top-rail mode, `HorizontalNav` (fed by `navGroups`) is the source of truth for full nav; mega is a subset of selected starters.
- Mega `footer.to` and top dashboard link use `homePath` (§2.1).
- Do not preserve template demo mega `badge` strings unless registry defines badges.

**Maps in nav-registry:** `shellMap` and `authPrefixMap` in `nav-registry.json` are the source of truth for shell layout and auth prefix resolution. This document summarizes them; do not contradict the registry.

```
shellMap:       sidebar → vertical | top-rail → horizontal   (defaultThemeConfig.sidebarLayout)
authPrefixMap:  split → /auth/*  | card → /auth-card/*
```

---

## 3. Inputs

| Input | Required | Notes |
|---|---|---|
| Template tree | yes | `zero-day/` at factory repo root (pristine 0-Day source; **never mutate in place**) |
| Client config | yes | `scaffold.config.json` conforming to `scaffold/scaffold.config.schema.json` |
| Nav registry | yes | `scaffold/mappings/nav-registry.json` in **factory repo** |
| Destination | yes | Empty or new directory for the client repo (not inside `zero-day/`) |

Validate config against the schema before any file writes. Defaults when omitted:

- `shell`: `"sidebar"`
- `authMethods`: `["credentials"]`
- `authPrimary`: first entry of `authMethods` (so `["credentials"]` → `"credentials"`)
- `passwordlessMode`: `"otp"`
- `includeRegister`: `false`
- `starterModules`: `[]`
- `advancedFeatures`: `[]`
- `packageName`: derive per §2.3

Validation rules (hard-fail):

- `authPrimary` must be a member of `authMethods`.
- `includeRegister: true` requires `authMethods` to include `credentials` or `passwordless` (register is meaningless for social/SSO-only).

---

## 4. Outputs

A new client repo whose root looks like a copy of `zero-day/` after transforms. See `touchpoints.md` for the full field map.

Do **not** copy `scaffold/` into the client repo. Do **not** copy `node_modules/`. Prefer excluding `dist/` and local env files.

---

## 5. Ordered bake steps

Execute in order. Paths below are relative to the **new client repo root** (post-copy). Read `scaffold/mappings/nav-registry.json` and `scaffold/scaffold.config.schema.json` from the **factory repo** path.

### 0. Copy template

1. Copy `zero-day/` → `<client-repo>/` (exclude `node_modules`, `dist`, `.tmp` build caches).
2. Do not modify factory `zero-day/` after copy.

### 1. Resolve `packageName`

1. Use config `packageName` if present; else derive per §2.3.
2. Set `package.json` `name` to resolved `packageName`.
3. Optionally set `description` / `author` to include `productName`.

### 2. Brand sweep (`productName`, `packageName`)

Execute §2.2 in full. Rename theme/locale/direction storage keys to `${packageName}-theme`, `${packageName}-locale`, `${packageName}-direction-locked-by-locale`.

### 3. Colors (`primaryHex`, `accentHex`)

Convert each hex `#RRGGBB` → **space-separated RGB channels** (decimal): e.g. `#3b82f6` → `59 130 246`. Not `rgb()`, not hex in CSS vars.

1. `src/styles/variables.css` — set `--theme-primary` and `--theme-accent` to the channel strings.
2. `src/types/theme.ts`
   - Extend `ThemeColor` with `'brand'`.
   - Add `themeColorPresets.brand = { primary, accent }` using the channel strings.
   - Set `defaultThemeConfig.color = 'brand'`.
3. `index.html` FOUC boot script — add matching `brand: ['…', '…']` entry to the inline `presets` object (must stay in sync with `themeColorPresets`).

`ThemeContext` already applies presets from `config.color`; no logic change required if the preset exists.

### 4. Theme / shell defaults

In `src/types/theme.ts` `defaultThemeConfig`:

| Config field | Target |
|---|---|
| `defaultSurface` | `mode` (`light` \| `dark`) |
| `shell` | `sidebarLayout` via `shellMap` in nav-registry (`vertical` \| `horizontal`) |
| `container` | `container` |
| `cardStyle` | `cardStyle` |
| (always) | `direction: 'ltr'` |
| (always) | `sidebarCollapsed: false` |

**FOUC behavior (locked):** The `index.html` boot script runs **only when** `${packageName}-theme` exists in `localStorage` (early return when absent). When storage is empty, no boot attributes are applied; React mounts and `defaultThemeConfig` in `ThemeContext` is the source of truth for first paint after hydration. Baked defaults in `theme.ts` + `variables.css` define the intended empty-storage experience.

Sync boot script to read `${packageName}-theme` (not `zeroday-theme`) after brand sweep.

### 5. Auth layout links (`authLayout`)

Prefix = `authPrefixMap[authLayout]` from nav-registry (`/auth` if `split`, else `/auth-card`).

1. **Keep both** route trees in `src/routes/index.tsx` (`auth` and `auth-card`). Do not delete either.
2. Repoint hardcoded `/auth/…` links to the chosen prefix:
   - `src/pages/auth/LoginPage.tsx` (register)
   - `src/pages/auth/RegisterPage.tsx` (login)
   - `src/pages/auth/ForgotPasswordPage.tsx` (navigate + link to login)
   - `src/pages/auth/components/CredentialsForm.tsx` (forgot-password)
   - `src/auth/RequireAuth.tsx` (unauthenticated → login)
   - `src/layouts/header/AppHeader.tsx` (logout → login)
   - `src/layouts/sidebar/Sidebar.tsx` (logout → login)
3. Ignore kit landing auth links under `src/pages/home/` (landing is not the product entry).
4. `authConfig.postLoginPath` is a dashboard path (e.g. `/dashboard`), not an `/auth/` link — safe from this rewrite.

### 6. Auth UI config (`authMethods`, `authPrimary`, `passwordlessMode`, `includeRegister`)

Regenerate the `export const authConfig: AuthUiConfig = { … }` object literal in `src/auth/config.ts` (regex-target the const; hard-fail if missing). Write:

| Field | Source |
|---|---|
| `methods` | `authMethods` |
| `primary` | `authPrimary` |
| `registerEnabled` | `includeRegister` |
| `passwordlessMode` | `passwordlessMode` |
| `socialProviders` | leave default `['google', 'apple']` |
| `adapter` | **always** `'mock'` at bake (never configurable) |
| `postLoginPath` | computed `homePath` |

Invariants:

- Bake always ships `adapter: 'mock'` (working demo auth). Real Entra/credentials/oauth adapters remain on disk; missing `VITE_AZURE_*` env never blocks bake or first run. Engineering flips one line in `src/auth/config.ts` to go live.
- Register **routes** stay mounted. When `registerEnabled` is false, LoginPage hides the create-account footer via config and RegisterPage self-redirects to login — do **not** strip LoginPage markup or delete register routes.
- Both `/auth` and `/auth-card` trees remain (see §5).

### 7. Navigation regenerate (`dashboards`, `starterModules`, `advancedFeatures`)

Per §2.4 — **regenerate** `src/layouts/sidebar/navData.ts`; do not filter the template file in place.

When `shell === 'top-rail'`, regenerate `AppHeader.tsx` mega `menus` from the same registry selection (starters that fit mega shape; `homePath` on footer and top dashboard link).

Do **not** remove lazy imports or route entries in `src/routes/index.tsx` for deselected modules (kit stays on disk).

### 8. First-dashboard home links

Per §2.1 — repoint routes/AuthLayout/shell home links to `homePath`. Auth post-login uses `authConfig.postLoginPath` from §6 (not Login/Register `navigate('/dashboard')` rewrites).

### 9. Documentation copy + stamp

Copy the engineer handbook from factory `Documentation/` into `<client-repo>/Documentation/`. Do **not** mutate factory `Documentation/`.

1. Copy `index.html` (required) and `favicon.ico` (if present) from factory `Documentation/`.
2. Do **not** copy `STAMP.md` — factory-facing stamp contract only.
3. On the **client copy** of `Documentation/index.html` only: replace every exact occurrence of `0-Day` with `productName` (HTML-escape `productName` for safe insertion).

### 10. Invariants pass

- ThemeCustomizer remains **unmounted** (file may stay on disk / exported; do not mount in layouts).
- No marketing landing is the `/` destination.
- Nav excludes kit demo pages (forms, tables, charts, pricing, gallery, FAQ, typography, auth gallery).
- `direction` remains `ltr`.
- English-first brand sweep completed; other locales at least brand-facing keys.
- `src/auth/config.ts` ships `adapter: 'mock'` and `postLoginPath === homePath`.

### 11. Install & smoke (manual)

From `<client-repo>/`: `npm install` → `npm run build` (or `npm run dev` for interactive QA).

---

## 6. Invariants / do-nots

| Do | Do not |
|---|---|
| Copy out of `zero-day/` into a new repo | Edit factory `zero-day/` as the bake target |
| Regenerate nav + mega from nav-registry | Filter navData in place or keep demo badges |
| Repoint all home links to `dashboards[0]` path | Leave `/dashboard` as fallback when Overview deselected |
| Aggressive brand + storage-key sweep | Shell-only brand replace |
| Keep `/auth` and `/auth-card` trees | Delete the unused auth layout tree |
| Write `authConfig` with `adapter: 'mock'` and `postLoginPath: homePath` | Strip LoginPage markup for register; delete register routes when disabled |
| Set `registerEnabled` from `includeRegister` | Wire live Entra/credentials adapters during bake |
| Sync colors in variables.css + theme presets + index.html boot | Update only one of the three |
| Keep LTR default | Bake RTL as default |
| Keep Account Settings in nav | Mount `ThemeCustomizer` or add kit pages to nav |
| Read nav-registry from factory repo | Require nav-registry inside client repo |
| Copy + stamp `Documentation/` engineer handbook into client output | Mutate factory `Documentation/` during bake |
| Treat this tree as UI shell | Invent Azure auth/API wiring in bake |

---

## 7. Deferred

| Item | Phase |
|---|---|
| Cursor skill / in-chat Q&A that emits `scaffold.config.json` | Phase 3 — landed at `.cursor/skills/0-day-scaffold/SKILL.md` |
| ~~Copy + stamp `Documentation/` into client output~~ | **Landed** — bake step §9; stamp rules in `Documentation/STAMP.md` |
| ~~Automated baker script / CI~~ | **Landed** — `scaffold/scripts/bake.mjs` (Phase 3) |
| Living core template (push aesthetic updates into future scaffolds) | Later |
| Rename feature-demo storage keys (`zeroday_rules`, etc.) | Later |
| Operator logo asset swap (`public/assets/logo/`) | Manual / later tooling |

---

## 8. Validation checklist (post-bake)

Run against the **client repo**, not factory `zero-day/`.

**Config application**

- [ ] `package.json` `name` === resolved `packageName` (explicit or derived)
- [ ] `en.json` full product sweep; `brand.name` === `productName`; document title matches
- [ ] Other locales: at least brand-facing keys use `productName`
- [ ] Logo alt, SVG aria-labels, AppHeader home aria, FormLayout placeholder use `productName`
- [ ] Grep client tree for template product strings — no unintended `0-Day` / `zeroday` leaks (except feature-demo keys per §2.2)
- [ ] Storage keys use `${packageName}-theme` / `-locale` / `-direction-locked-by-locale`; boot script + providers match
- [ ] `defaultThemeConfig.mode` === `defaultSurface`
- [ ] `defaultThemeConfig.sidebarLayout` matches `shellMap`
- [ ] `defaultThemeConfig.container` / `cardStyle` match config
- [ ] `defaultThemeConfig.color === 'brand'` and `themeColorPresets.brand` channels match hex conversion
- [ ] `variables.css` `--theme-primary` / `--theme-accent` match those channels
- [ ] `index.html` boot `presets.brand` matches the same channels
- [ ] Auth page links use `/auth` or `/auth-card` per `authPrefixMap`; both route trees still exist
- [ ] `src/auth/config.ts`: `adapter: 'mock'`, `methods` match `authMethods`, `postLoginPath` === `homePath`, `registerEnabled` === `includeRegister`
- [ ] `includeRegister: false` → create-account footer gated by config; RegisterPage self-redirects; `/register` still routable
- [ ] `navData.ts` regenerated: selected dashboards/modules/features + Account Settings only; icons via `Icons[entry.icon]`; no demo badges
- [ ] If top-rail: AppHeader mega regenerated from selected starters; `homePath` on logo, TopLink, mega footer
- [ ] All §2.1 touchpoints use `homePath`, not hardcoded `/dashboard` (auth pages via `postLoginPath`)
- [ ] `Documentation/index.html` exists in client output; title/brand reflects `productName`; no leftover `0-Day` in that file (factory `Documentation/` unchanged)
- [ ] ThemeCustomizer not mounted in any layout
- [ ] `direction` remains `ltr`
- [ ] Nav does not include forms/tables/charts/pricing/gallery/faq/typography/auth-gallery kit pages

**QA / runtime**

- [ ] `npm run build` succeeds
- [ ] **Clear `${packageName}-theme` (and old `zeroday-theme` if migrating) before visual QA** — stale storage overrides baked defaults
- [ ] Empty `localStorage`: boot script does nothing; after load, UI matches `defaultThemeConfig` / baked CSS vars
- [ ] Login + forgot-password reachable; register link / RegisterPage behavior matches `includeRegister` / `registerEnabled`
- [ ] Selected dashboards open from nav; deselected items absent from nav (direct URL may still work — expected)
- [ ] With Overview deselected: `/` and all home links land on first selected dashboard path
- [ ] Login methods match `authMethods` / `authPrimary`; missing Azure env does not block mock sign-in

---

## Reference: hex → channels

```
#3b82f6 → 59 130 246
#6366f1 → 99 102 241
```

Parse `#RRGGBB`, emit `` `${r} ${g} ${b}` `` for CSS `rgb(var(--theme-primary) / <alpha>)`.

## Reference: `packageName` derivation

```
"My Acme App!"  →  my-acme-app
"---"           →  lob-app
```
