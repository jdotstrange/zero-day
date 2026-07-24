# Auth kit (v1.5)

Config-driven sign-in for the 0-Day template. UI methods and the live adapter are controlled by a single file.

## Switch adapter / methods

Edit `src/auth/config.ts` — change `adapter`, `methods`, `primary`, etc. The bake script regenerates the `authConfig` object wholesale; keep types above the const.

```ts
adapter: 'mock' // default — any credentials work, OTP code 000000
```

Adapter ids: `mock` | `credentials` | `passwordless` | `oauth` | `entra`

## Adapter interface

`AuthAdapter` in `src/auth/types.ts`: `signIn`, `signOut`, `getSession`, `onSessionChange`. Registry: `getAdapter(id)` in `src/auth/adapters/index.ts`.

- **mock** — fully working, session in `localStorage` (`zeroday-auth-session`)
- **credentials / passwordless / oauth** — stubs that throw `… adapter not wired`
- **entra** — real MSAL (`@azure/msal-browser`), lazy-init on first use

## Entra ID

Set in `.env` (see `.env.example`):

- `VITE_AZURE_CLIENT_ID`
- `VITE_AZURE_TENANT_ID`
- `VITE_AZURE_REDIRECT_URI` (optional; defaults to `window.location.origin`)

Then set `adapter: 'entra'` and include `'entra'` in `methods`. Missing env throws only when the entra adapter runs — never at import time when `adapter` is `mock`.
