# Documentation stamp tokens (for the baker)

When `Documentation/` is copied into a baked client repo, the baker applies one transform:

| Token | Replace with | Scope |
|---|---|---|
| `0-Day` (exact, case-sensitive) | config `productName` | **All** occurrences in `Documentation/index.html` |

The baker HTML-escapes `productName` (`escapeHtml`) before inserting it into `index.html`.

Rules:

- Every literal `0-Day` in `index.html` is a product display-name slot: `<title>`, the sidebar brand (`<span data-stamp="product-name">`), body prose, and the footer. Prose that means the factory/template says "the factory template" or "the scaffold" and never uses the token, so a global replace is safe.
- The factory-canonical copy keeps saying `0-Day`. Stamp only the client copy — never this repo.
- `favicon.ico` is a generic mark; swap it manually if the client wants a branded docs favicon. No other files in `Documentation/` need stamping.
