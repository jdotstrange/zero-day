# Bake touchpoints

Field → files map for applying `scaffold.config.json` to a copy of `zero-day/`. Paths are relative to the **client repo root** after copy.

**Read from factory repo:** `scaffold/mappings/nav-registry.json`, `scaffold/scaffold.config.schema.json`. **Write to client repo** only. Full procedure and locked decisions: `BAKE.md`.

---

## Resolved values (baker computes once)

| Symbol | Source |
|---|---|
| `packageName` | Config field, or derive per `BAKE.md` §2.3 |
| `homePath` | `nav-registry.dashboards` entry matching `config.dashboards[0]` → `.path` |
| `authPrefix` | `nav-registry.authPrefixMap[config.authLayout]` (`/auth` or `/auth-card`) |
| `sidebarLayout` | `nav-registry.shellMap[config.shell]` (`vertical` or `horizontal`) |
| `themeStorageKey` | `` `${packageName}-theme` `` |
| `localeStorageKey` | `` `${packageName}-locale` `` |
| `directionLockKey` | `` `${packageName}-direction-locked-by-locale` `` |

---

## Config fields

| Config field | Files / symbols | Bake action |
|---|---|---|
| `productName` | `src/i18n/locales/*.json` (full sweep `en.json`; other locales at least `brand.name`, `footer.copyright_all_rights`, `home.welcome`, `landing.footer.copyright` — prefer full product-name sweep); `index.html` `<title>`; `src/components/common/Logo.tsx` `alt` + comment; `src/layouts/header/AppHeader.tsx` home `aria-label`; `src/pages/forms/FormLayoutPage.tsx` placeholder; `public/assets/logo/*.svg` `aria-label`; `src/styles/*.css` + `src/index.css` comment headers; `package.json` `description`/`author`; client `README.md` if present | Replace all template product strings (`0-Day`, variants) with `productName`. Grep client tree post-bake. `AuthLayout` uses `t('brand.name')` after locale bake |
| `packageName` | `package.json` `name`; `index.html` FOUC `localStorage` key; `src/context/ThemeContext.tsx` `STORAGE_KEY`; `src/i18n/LocaleProvider.tsx` `STORAGE_KEY` + `DIRECTION_LOCK_STORAGE_KEY` | Set npm slug; rename `zeroday-theme` / `zeroday-locale` / `zeroday-direction-locked-by-locale` → `${packageName}-*` |
| `defaultSurface` | `src/types/theme.ts` → `defaultThemeConfig.mode` | `light` \| `dark` (both modes always ship) |
| `primaryHex` / `accentHex` | `src/styles/variables.css` (`--theme-primary`, `--theme-accent`); `src/types/theme.ts` → `themeColorPresets.brand` + `defaultThemeConfig.color = 'brand'` (extend `ThemeColor`); `index.html` FOUC `presets` object | Hex → space-separated RGB channels; **triple sync**. `ThemeContext` applies presets |
| `shell` | `src/types/theme.ts` → `defaultThemeConfig.sidebarLayout` via `nav-registry.shellMap`; `src/layouts/FullLayout.tsx` (reads config); `index.html` FOUC `sidebarLayout` | `sidebar`→`vertical`, `top-rail`→`horizontal` |
| `container` | `defaultThemeConfig.container`; `index.html` FOUC | `full` \| `boxed` |
| `cardStyle` | `defaultThemeConfig.cardStyle`; `index.html` FOUC | `shadow` \| `border` (DOM attr `data-card-style`) |
| `authLayout` | Links: `src/pages/auth/LoginPage.tsx`, `RegisterPage.tsx`, `ForgotPasswordPage.tsx`, `components/CredentialsForm.tsx`; `src/auth/RequireAuth.tsx`; logout: `AppHeader.tsx`, `Sidebar.tsx`. Routes: `src/routes/index.tsx` | Repoint hardcoded `/auth/…` links to `authPrefix` from `nav-registry.authPrefixMap`. **Keep both route trees**. `postLoginPath` is not an auth link — leave alone |
| `authMethods` / `authPrimary` / `passwordlessMode` / `includeRegister` | **Regenerate** `src/auth/config.ts` → `authConfig` object literal | `methods`, `primary`, `passwordlessMode`, `registerEnabled=includeRegister`; `socialProviders` default `['google','apple']`; **`adapter` always `'mock'`**; `postLoginPath` = `homePath`. Register routes stay mounted; UI/self-redirect is config-driven |
| `dashboards` | **Regenerate** `src/layouts/sidebar/navData.ts` Dashboards group; `src/routes/index.tsx` `/` `<Navigate>`; all §2.1 home links (see below); `authConfig.postLoginPath` | Registry lookup by ID in config order. `homePath` = path of `dashboards[0]`. Routes untouched |
| `starterModules` | **Regenerate** `navData.ts` Apps group (before advanced); if `shell === 'top-rail'`: **regenerate** `AppHeader.tsx` `menus` mega items for starters that fit mega shape | `Icons[entry.icon]` per registry. No demo badges. Routes untouched |
| `advancedFeatures` | **Regenerate** `navData.ts` Apps group (after starters) | In top-rail: **not** in mega menu (template shape); visible via `HorizontalNav` / `navGroups` only. Routes untouched |

---

## First-dashboard home links (`homePath`)

All must use `homePath` (first selected dashboard via nav-registry), **not** hardcoded `/dashboard`:

| File | Symbol / location |
|---|---|
| `src/routes/index.tsx` | Index `<Navigate to=…>` |
| `src/auth/config.ts` | `authConfig.postLoginPath` |
| `src/layouts/sidebar/Sidebar.tsx` | Logo `<Link to=…>` |
| `src/layouts/AuthLayout.tsx` | Logo/home `<Link to=…>` (all instances) |
| `src/layouts/header/AppHeader.tsx` | Horizontal logo `<Link>`; `TopLink`; mega `footer.to` |
| `src/pages/errors/NotFoundPage.tsx` | Home / recovery `<Link to=…>` |

Login/Register pages read `authConfig.postLoginPath` — do not rewrite `navigate('/dashboard')` in those files (that pattern is gone).

---

## Navigation regenerate (`navData.ts`)

**Strategy:** Replace file content generated from `nav-registry.json` + config — do **not** filter template rows in place.

Output shape (`NavGroup[]`):

1. **Dashboards** — selected `dashboards[]` in order; omit group if empty.
2. **Apps** — `starterModules[]` then `advancedFeatures[]` in order; omit if both empty.
3. **Pages** — `alwaysNav` (Account Settings); omit only if registry empty.

Per item: `{ path, label, icon: Icons[registry.icon], children? }`. Registry `icon` keys match `Icons` exports. Copy `children` from registry when defined. **Never** emit `badge` unless registry defines it (it must not).

**Never add:** forms, tables, charts, pricing, gallery, FAQ, typography, auth-gallery kit routes.

---

## Top-rail mega menu (`AppHeader.tsx`)

When `shell === 'top-rail'`, regenerate `menus` (not filter-in-place):

- Items from selected **starterModules** that match template mega shape (email, chat, notes, kanban, calendar, e-commerce, blog).
- **Contacts** + **advancedFeatures**: not in mega; full nav via `HorizontalNav` ← `navGroups`.
- `footer.to` and horizontal logo / `TopLink` → `homePath`.
- No template demo badge strings unless registry defines badges.

---

## Always (no config field)

| Rule | Where |
|---|---|
| Account Settings in nav | `navData.ts` Pages ← `nav-registry.alwaysNav` |
| ThemeCustomizer unmounted | Do not mount in layouts; file may remain on disk |
| No landing as product entry | `/` → `homePath` (first dashboard) |
| LTR default | `defaultThemeConfig.direction = 'ltr'` |
| Kit stays on disk | Do not prune `routes/index.tsx` lazy routes for deselected modules |
| `shellMap` / `authPrefixMap` | Source of truth in `nav-registry.json`; baker reads maps from registry |
| English-first brand | Full `en.json` sweep; other locales at least brand-facing keys |
| FOUC empty storage | Boot script no-ops when `${packageName}-theme` absent; React `defaultThemeConfig` applies after mount |

---

## QA note

Before validating baked defaults:

1. Clear `${packageName}-theme` (and legacy `zeroday-theme` if testing a re-bake).
2. Clear `${packageName}-locale` / legacy `zeroday-locale` if locale QA matters.
3. Empty storage: confirm boot script does not set DOM attrs; after load, theme matches `defaultThemeConfig` and `variables.css`.

Stale `localStorage` overrides baked defaults when the saved key exists.

---

## Out of scope (Phase 2)

| Item | Notes |
|---|---|
| Feature demo storage (`zeroday_rules`, `zeroday_workflows`, …) | Demo feature persistence; not renamed in Phase 2 |
| `scaffold/` in client output | Stays in factory repo unless future manifest says otherwise |
| Azure auth/API wiring | Engineer-owned post-bake; bake always ships `adapter: 'mock'`. Flip `src/auth/config.ts` adapter + env for live Entra |
