# zero-day factory

Git factory for scaffolding LOB client admin UIs from the pristine [`zero-day/`](./zero-day/) template. Operators interview once, bake a client repo elsewhere — never edit `zero-day/` in place.

- **Canonical remote:** [https://github.com/jdotstrange/zero-day](https://github.com/jdotstrange/zero-day)
- **Requirements:** Node 18+, git, npm 9+
- **Bake contract:** [`scaffold/BAKE.md`](./scaffold/BAKE.md)

## What lives here

| Path | Purpose |
|---|---|
| `zero-day/` | Pristine Vite + React admin template (copy source for bakes) |
| `scaffold/` | Config schema, bake CLI, nav registry, examples |
| `Documentation/` | Engineer handbook (stamped into each client bake) |
| `.cursor/skills/0-day-scaffold/` | Cursor skill (repo copy) |
| `skills/0-day-scaffold/` | Portable skill copy for personal install |

## Option A — operator setup (recommended)

Operators do **not** need to clone this repo into their client workspace. One-time setup, then fire the skill from any project.

### 1. Git access

Ensure `git` works and you can reach [https://github.com/jdotstrange/zero-day](https://github.com/jdotstrange/zero-day) (HTTPS clone or SSH remote via `ZERO_DAY_FACTORY_URL`).

### 2. Install the Cursor skill once

Copy the portable skill into your personal Cursor skills folder:

**Windows (PowerShell)**

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\skills\0-day-scaffold"
Copy-Item -Recurse -Force ".\skills\0-day-scaffold\*" "$env:USERPROFILE\.cursor\skills\0-day-scaffold\"
```

**macOS / Linux**

```bash
mkdir -p ~/.cursor/skills/0-day-scaffold
cp -r skills/0-day-scaffold/* ~/.cursor/skills/0-day-scaffold/
```

If you do not have this repo locally yet, clone it once only to copy the skill, or copy from [`.cursor/skills/0-day-scaffold/`](./.cursor/skills/0-day-scaffold/SKILL.md) after cloning.

### 3. Scaffold from any workspace

In Cursor, ask to scaffold / bake / bootstrap a new client admin UI. The skill will:

1. Ensure the factory (local dev tree or shallow git cache)
2. Run the locked operator interview
3. Write `scaffold.config.json` into the factory cache
4. Bake with `--out` into your chosen output directory
5. Optionally `npm install` in the output

Factory cache defaults (overridable via env):

- **Windows:** `%LOCALAPPDATA%\zero-day-factory`
- **macOS / Linux:** `~/.cache/zero-day-factory`

Manual ensure (optional):

```bash
node "%LOCALAPPDATA%\zero-day-factory\scaffold\scripts\ensure-factory.mjs"
# or, from this repo:
node scaffold/scripts/ensure-factory.mjs
```

## Factory developers

When working inside this repo, `ensure-factory.mjs` detects the local tree and skips network clone. Smoke bake:

```bash
node scaffold/scripts/ensure-factory.mjs
node scaffold/scripts/bake.mjs --config scaffold/examples/minimal.client.json --out _bake-smoke-minimal
```

See [`scaffold/README.md`](./scaffold/README.md) for the full bake matrix and CLI details.

## Rules

- **Never mutate `zero-day/` for a client** — always bake to `--out`.
- Client output must not be inside `zero-day/`.
- `packageName` is derived from `productName` when omitted (see `scaffold/BAKE.md`).
