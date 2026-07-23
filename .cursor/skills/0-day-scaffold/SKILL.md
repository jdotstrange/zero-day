---
name: 0-day-scaffold
description: Scaffold a new LOB client admin UI from the 0-Day template. Ensures factory from git cache, runs the locked operator interview, emits a validated scaffold.config.json, then materializes a client repo (copy zero-day/ + bake). Use when the user wants to scaffold, bake, generate, or bootstrap a new client repo, client admin shell, or LOB app — from any workspace, not only the factory repo.
---

# 0-Day Client Scaffold (Option A)

Turn operator answers into a new client repo: **ensure factory** → interview → `scaffold.config.json` → copy `zero-day/` → bake per `scaffold/BAKE.md` → `--out` in the operator workspace.

Operators do **not** need to open or clone the factory repo first. The factory is resolved from the current workspace (dev mode) or a shallow git cache.

## Constants

| Constant | Value |
|---|---|
| Factory URL | `https://github.com/jdotstrange/zero-day.git` |
| Env URL override | `ZERO_DAY_FACTORY_URL` |
| Cache (Windows) | `%LOCALAPPDATA%\zero-day-factory` |
| Cache (macOS/Linux) | `~/.cache/zero-day-factory` |
| Env cache override | `ZERO_DAY_FACTORY_CACHE` |
| Template tree | `zero-day/` (never mutate in place) |

**Personal skill install (one-time):** copy `skills/0-day-scaffold/` from the factory repo to `~/.cursor/skills/0-day-scaffold/` so this skill works from any project. See factory root `README.md`.

## Step 0: Ensure factory

Resolve `factoryRoot` before interview or bake.

### A — Already in factory (dev mode)

If the workspace (or a parent directory) contains both `zero-day/` and `scaffold/scripts/bake.mjs`, use that directory as `factoryRoot`. Skip clone.

### B — Run ensure-factory

From a factory checkout:

```bash
node scaffold/scripts/ensure-factory.mjs
```

Last line of stdout is the absolute `factoryRoot`. Use `--json` for `{ "factoryRoot": "...", "source": "workspace"|"cache" }`.

### C — Bootstrap (no factory on disk yet)

When the operator has only this personal skill and no factory clone, ensure the cache with shell **before** interview:

**Windows (PowerShell):**

```powershell
$cache = "$env:LOCALAPPDATA\zero-day-factory"
if (-not (Test-Path "$cache\scaffold\scripts\bake.mjs")) {
  git clone --depth 1 https://github.com/jdotstrange/zero-day.git $cache
} else {
  git -C $cache fetch --depth 1 origin
  git -C $cache reset --hard origin/main
}
```

**macOS / Linux:**

```bash
CACHE="${ZERO_DAY_FACTORY_CACHE:-$HOME/.cache/zero-day-factory}"
if [ ! -f "$CACHE/scaffold/scripts/bake.mjs" ]; then
  git clone --depth 1 https://github.com/jdotstrange/zero-day.git "$CACHE"
else
  git -C "$CACHE" fetch --depth 1 origin
  git -C "$CACHE" reset --hard origin/main || git -C "$CACHE" reset --hard origin/HEAD
fi
```

Then set `factoryRoot` to the cache path and run all bake paths **against that root** (absolute paths).

After cache exists, prefer:

```bash
node "<factoryRoot>/scaffold/scripts/ensure-factory.mjs"
```

to refresh and confirm `factoryRoot`.

**Chicken-egg:** this skill is installable as a personal/team skill; Step 0 shell bootstrap is only needed until the cache exists once.

## Factory artifacts

All paths below are relative to `factoryRoot`:

| Artifact | Path |
|---|---|
| Ensure factory | `scaffold/scripts/ensure-factory.mjs` |
| Bake contract (normative) | `scaffold/BAKE.md` |
| Field → file map | `scaffold/touchpoints.md` |
| Config schema | `scaffold/scaffold.config.schema.json` |
| Nav registry | `scaffold/mappings/nav-registry.json` |
| Example configs | `scaffold/examples/*.client.json` |
| Template tree | `zero-day/` |

## Step 1: Interview

Ask these questions **in this order**. Do not invent extra product questions.

| # | Question | Options | Config field |
|---|---|---|---|
| 1 | Product / client display name? | free text | `productName` |
| 2 | Default surface? | Light / Dark (both modes always ship) | `defaultSurface`: `light` \| `dark` |
| 3 | Primary hex + Accent hex? | two `#RRGGBB` values | `primaryHex`, `accentHex` |
| 4 | Shell? | Sidebar (default) / Top rail | `shell`: `sidebar` \| `top-rail` |
| 5 | Container? | Full width / Boxed | `container`: `full` \| `boxed` |
| 6 | Card style? | Shadow / Border | `cardStyle`: `shadow` \| `border` |
| 7 | Auth experience? | Split screen / Card | `authLayout`: `split` \| `card` |
| 8 | Register flow? | No (default) / Yes | `includeRegister` |
| 9 | Dashboards to front-face? (multi-select, ≥1) | Overview, Analytics, eCommerce, CRM | `dashboards` |
| 10 | Prebuilt starter modules? (multi-select, may be empty) | Email, Chat, Calendar, Contacts, Blog, E-commerce, Notes, Kanban | `starterModules` |
| 11 | Advanced features? (multi-select, default none) | Rule Engine, Query Builder, Simulation, Insights, Workflow Builder, Task Scheduler | `advancedFeatures` |
| 12 | Output directory path for the new client repo? | absolute path; must be empty or nonexistent, not inside `zero-day/` | (bake `--out`, not a config field) |

Array values must use the exact enum strings above (e.g. `"E-commerce"`, `"Rule Engine"`); order in the arrays is nav order, and `dashboards[0]` becomes the app home.

**Fixed decisions — state them, never ask:**

- No marketing landing; home → first selected dashboard.
- LTR only. Account Settings always in nav. Never nav forms/tables/charts/pricing/gallery/FAQ/typography/auth-gallery kit pages.
- English-first with aggressive brand sweep; ThemeCustomizer stays unmounted; full kit remains on disk (nav controls visibility, not routes).
- `packageName` auto-derived from `productName` if not provided (slug rule in `scaffold/BAKE.md` §2.3).
- Bake copies the stamped engineer handbook (`Documentation/index.html` + optional `favicon.ico`) into client `Documentation/`; factory `Documentation/` stays canonical `0-Day`.
- Vite SPA, not Next; Azure owns auth/API/workers — bake wires none of it.

## Step 2: Write and validate config

Write answers under `factoryRoot`, e.g. `scaffold/configs/<packageName>.client.json` (create `scaffold/configs/` if absent). Include `"version": "1"` and `"$schema": "../scaffold.config.schema.json"`. See `scaffold/examples/minimal.client.json` and `full-kit.client.json` for shape.

Validate against `<factoryRoot>/scaffold/scaffold.config.schema.json` before any bake. Fix violations by re-asking the operator, not by guessing.

## Step 3: Bake

Run from any cwd; paths are absolute via `factoryRoot`:

```bash
node "<factoryRoot>/scaffold/scripts/bake.mjs" --config "<factoryRoot>/scaffold/configs/<packageName>.client.json" --out "<operator-output-dir>"
```

Behavior contract: validates config against the schema; derives `packageName` if omitted; copies `zero-day/` → `--out` (which must be empty or nonexistent); applies all `scaffold/BAKE.md` transforms (including stamped `Documentation/`); prints a checklist summary; exits non-zero on any failure.

`--out` is typically in the operator's current workspace, **not** inside `factoryRoot/zero-day/`.

## Step 4: Verify

1. Run the post-bake validation checklist in `scaffold/BAKE.md` §8 against the client repo (brand grep, storage keys, theme defaults, nav, home links).
2. From the client repo: `npm install` then `npm run build`.
3. Report results; do not mark the scaffold done on a failing build or failed checklist item.

## Outside Cursor

Without this skill, an operator can:

1. Clone or refresh the factory cache (Step 0 shell bootstrap).
2. Hand-author `scaffold.config.json` from `scaffold/examples/` + the schema.
3. Run the same bake CLI for an identical result.
