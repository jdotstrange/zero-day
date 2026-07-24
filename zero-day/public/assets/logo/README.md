# Logo assets (drop-in)

## Default (shipped)

The UI uses **`logomark.svg`** (icon) plus the live product name from i18n `brand.name` (e.g. “0-Day”, or the client name after bake). There is no SVG wordmark with baked-in copy.

| File | Use |
|------|-----|
| `logomark.svg` | Icon mark — sidebar (full + mini), header, auth, favicon via `index.html` |

Replace `logomark.svg` in place to change the icon. Keep a similar square-ish aspect ratio.

## Optional wordmark files

`logo.svg` / `logo-dark.svg` may still exist as legacy placeholders. The `Logo` component does **not** use them anymore. You can delete them or keep them for design reference.

To brand a client: drop in a new `logomark.svg` and ensure bake/scaffold set `brand.name` (and related strings) to the product name.
