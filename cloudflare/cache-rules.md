# Cloudflare Cache Rules (GitHub Pages origin)

When GitHub Pages is the origin behind an orange-cloud proxied zone, `cloudflare/_headers` is **not** applied. Use **Cache Rules** at the edge instead.

## Apply via CLI

`flarectl` cannot create Cache Rules (only `flarectl pagerules list` for legacy Page Rules). Use the repo script — it calls **flarectl** for zone lookup / purge and the **Rulesets API** for rules:

```bash
# Token needs Zone → Cache Rules → Edit (+ Zone → Read for name lookup)
export CF_API_TOKEN=...   # or CLOUDFLARE_API_TOKEN

./cloudflare/apply-cache-rules.sh andreysidorov.com          # apply + purge everything
./cloudflare/apply-cache-rules.sh andreysidorov.com --dry-run
./cloudflare/apply-cache-rules.sh andreysidorov.com --no-purge

# If flarectl returns [] (narrow token), pass zone ID or env:
CLOUDFLARE_ZONE_ID=dcf623372205d760b2ef0b861ee33e09 ./cloudflare/apply-cache-rules.sh
./cloudflare/apply-cache-rules.sh dcf623372205d760b2ef0b861ee33e09
```

Rules live in [`cache-rules.rules.json`](cache-rules.rules.json). **Last matching rule wins** — in the JSON file, put the **broad** rule (`true` / default) **first** and **specific** rules **last** (e.g. `/assets/` at the bottom). Putting default last makes it override everything and leaves GitHub’s `max-age=600` on all responses.

On a zone that has never had Cache Rules, the API returns error `10003` (no entrypoint yet). `apply-cache-rules.sh` handles that by **POST**ing a new zone ruleset; later runs use **PUT** on the entrypoint.

Manual dashboard setup (if you prefer UI) — in the dashboard list, rules are evaluated top-to-bottom with **last match winning**; put the catch-all rule at the **top**, `/assets/` and other specifics at the **bottom**.

## 1. Immutable hashed assets

- **Name:** `Immutable — /assets`
- **When:** URI Path starts with `/assets/`
- **Then:**
  - Cache eligibility: Eligible for cache
  - Edge TTL: Ignore cache-control header and use this TTL → **1 year**
  - Browser TTL: Override origin and use this TTL → **1 year**
  - (Optional) Cache key: include host only

Repeat for `/tags/` paths that include copied bundles:

- **When:** URI Path matches `*/assets/*` (or Expression: `starts_with(http.request.uri.path, "/tags/") and http.request.uri.path contains "/assets/"`)

## 2. Static binaries in site root

- **When:** URI Path starts with `/fonts/` OR extension is in `{woff2,ico,png,svg}` OR path equals `/site.webmanifest`
- **Then:** Edge TTL **1 year**, Browser TTL **1 year**, cache eligible

## 3. HTML and feeds — always revalidate

- **When:** URI Path ends with `.html` OR path is `/` OR path ends with `/` OR path is `/rss.xml` OR `/sitemap.xml` OR `/robots.txt`
- **Then:**
  - **Bypass cache** (recommended for HTML behind GitHub’s fixed 10-minute origin cache), **or**
  - Edge TTL **0** (revalidate every request at origin)

`Cache-Control: no-cache` on the response (set via Transform Rules if you need to override GitHub’s `max-age=600` for HTML) tells browsers to revalidate with `ETag` while still allowing a local copy.

## 4. Default

- **When:** All incoming requests (lowest priority)
- **Then:** Respect origin cache headers (GitHub’s 600s) **or** Bypass cache for anything not matched above

After changing rules, run a one-time **Purge Everything** in Caching → Configuration, then rely on CI purges (see `docs/cloudflare-cdn.md`).
