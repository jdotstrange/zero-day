# Scaffold (Phase 2 + 3)

Bake spec and **baker CLI** for generating client repos from `zero-day/`.

| Doc | Purpose |
|---|---|
| [`BAKE.md`](./BAKE.md) | Ordered procedure, locked decisions, validation checklist |
| [`touchpoints.md`](./touchpoints.md) | Config field → client file map |
| [`scaffold.config.schema.json`](./scaffold.config.schema.json) | Config validation schema |
| [`mappings/nav-registry.json`](./mappings/nav-registry.json) | Nav ID → path/label/icon registry (factory repo; not copied to client) |
| [`examples/`](./examples/) | Sample `scaffold.config.json` files |
| [`scripts/bake.mjs`](./scripts/bake.mjs) | Automated baker CLI |

**Factory vs client:** Baker reads `scaffold/` artifacts from this repo (`lob-scaffV2/scaffold/…`), copies `zero-day/` to the client destination, copies + stamps `Documentation/` (engineer handbook), and writes transforms there. Client output does not include `scaffold/` unless a future manifest requires it.

## Run the baker

From the **factory repo root** (`lob-scaffV2/`):

```bash
node scaffold/scripts/bake.mjs --config <path-to-scaffold.config.json> --out <client-output-dir>
```

Example (smoke output under repo root; gitignored):

```bash
node scaffold/scripts/bake.mjs --config scaffold/examples/minimal.client.json --out _bake-smoke-minimal
```

Requirements:

- `--config` — validated client config (see schema + `examples/`)
- `--out` — must not exist, or must be an **empty** directory; must not be inside factory `zero-day/`

On success the CLI prints a checklist summary and exits `0`.

## Phase 5 prove matrix (smoke bakes)

Smoke outputs live under `_bake-smoke-*` at the factory root (gitignored). Delete or recreate each `--out` dir before re-running.

```bash
# 1. full-kit / top-rail
node scaffold/scripts/bake.mjs --config scaffold/examples/full-kit.client.json --out _bake-smoke-full-kit

# 2. analytics-first home (dashboards[0] = Analytics)
node scaffold/scripts/bake.mjs --config scaffold/configs/_prove-analytics-first.client.json --out _bake-smoke-analytics-first

# 3. auth-card prefix
node scaffold/scripts/bake.mjs --config scaffold/configs/_prove-auth-card.client.json --out _bake-smoke-auth-card

# 4. includeRegister true
node scaffold/scripts/bake.mjs --config scaffold/configs/_prove-register-on.client.json --out _bake-smoke-register-on
```

Optional: `npm install && npm run build` inside `_bake-smoke-full-kit` or `_bake-smoke-analytics-first` to verify the client compiles.

**Phase 3:** Cursor skill at [`.cursor/skills/0-day-scaffold/SKILL.md`](../.cursor/skills/0-day-scaffold/SKILL.md) runs the operator Q&A, emits validated `scaffold.config.json`, and invokes `scaffold/scripts/bake.mjs`.
