# Cloudflare CDN in front of GitHub Pages

GitHub Pages serves your `dist/` output with a fixed ~10-minute CDN cache and no custom headers. Putting **Cloudflare** (orange-cloud proxy) in front of GitHub Pages lets you:

- Cache fingerprinted `/assets/*` for a long time at the edge
- Bypass or shorten cache for HTML and feeds
- **Purge only changed URLs** after each deploy (see CI below)

Repo config:

| File | Purpose |
|------|---------|
| `cloudflare/_headers` | Used when you host on **Cloudflare Pages** (copied into `dist/` at build) |
| `cloudflare/cache-rules.md` | Dashboard Cache Rules equivalent while origin is GitHub Pages |
| `scripts/generate-dist-manifest.ts` | SHA-256 manifest of deployable files |
| `scripts/cloudflare-purge-changed.ts` | Purge URLs whose content hash changed |

---

## One-time setup

### 1. Cloudflare zone

1. Add site **andreysidorov.com** to Cloudflare (Free plan is enough).
2. Note **Zone ID** (Overview → API sidebar).
3. Create an **API token** (My Profile → API Tokens → Create Token):
   - For **CI purge only:** **Zone** → **Cache Purge** → Purge, **Zone** → **Zone** → Read
   - To **apply cache rules** locally (`apply-cache-rules.sh`), also add:
     - **Zone** → **Cache Rules** → Edit
     - **Account** → **Account Rulesets** → Edit (required by the Rulesets API)
   - Zone Resources: Include → Specific zone → `andreysidorov.com`

### 2. GitHub repository secrets

In the repo: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | API token from step 1 |
| `CLOUDFLARE_ZONE_ID` | Zone ID |

If secrets are missing, deploy still runs; purge is skipped.

### 3. GitHub Pages custom domain

1. Repo **Settings → Pages** → Custom domain: `andreysidorov.com` (and `www` if used).
2. Wait until DNS check passes (may show “DNS check unsuccessful” until Cloudflare is configured).

### 4. DNS (proxied through Cloudflare)

In **Cloudflare → DNS → Records** for `andreysidorov.com`:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| `CNAME` | `www` | `<github-username>.github.io` | Proxied (orange cloud) |
| `A` | `@` | `185.199.108.153` | Proxied |
| `A` | `@` | `185.199.109.153` | Proxied |
| `A` | `@` | `185.199.110.153` | Proxied |
| `A` | `@` | `185.199.111.153` | Proxied |

GitHub’s recommended IPs for apex are the four above. Alternatively use a `CNAME` flattening record to `<user>.github.io` if your plan supports it.

Remove conflicting A/CNAME records at your old DNS host. Nameservers must point to Cloudflare.

### 5. SSL/TLS

**SSL/TLS → Overview:** set encryption mode to **Full** (not Full Strict unless you upload an origin cert to GitHub — Full is enough for `*.github.io` behind the scenes).

### 6. Cache Rules

Apply rules from [`cloudflare/cache-rules.md`](../cloudflare/cache-rules.md):

```bash
# flarectl + curl + jq required; token needs Zone → Cache Rules → Edit
export CF_API_TOKEN=...   # or CLOUDFLARE_API_TOKEN

./cloudflare/apply-cache-rules.sh andreysidorov.com
```

`flarectl` alone cannot create Cache Rules (only list legacy Page Rules). The script uses **flarectl** for zone ID and post-apply `zone purge --everything`, and the **Rulesets API** to deploy [`cloudflare/cache-rules.rules.json`](../cloudflare/cache-rules.rules.json).

Without these rules, Cloudflare may cache HTML with GitHub’s 10-minute TTL.

### 7. First purge

After DNS and Cache Rules are live, either:

1. **Caching → Configuration → Purge Everything** once in the dashboard, **or**
2. Set repository variable `CLOUDFLARE_PURGE_EVERYTHING` = `true` for the first CI run (then remove it).

Subsequent deploys only purge HTML, feeds, and unversioned files whose hash changed (new `/assets/*` filenames are skipped automatically).

---

## CI behaviour

Workflow [`.github/workflows/deploy-github-pages.yml`](../.github/workflows/deploy-github-pages.yml):

1. Restores the previous deploy manifest from Actions cache (if any).
2. Builds the site and writes `cloudflare/dist-manifest.json` (SHA-256 per file under `dist/`, excluding `dist/server/`).
3. Deploys to GitHub Pages.
4. **Purge job:** compares previous vs current manifest, calls Cloudflare [Purge Cache by URL](https://developers.cloudflare.com/api/resources/cache/methods/purge/) for changed, added, or removed paths (batched, 30 URLs per request).

Fingerprinted files under `/assets/` get **new URLs** when content changes, so they usually do not appear in the purge list. HTML, feeds, and unversioned files in `public/` do.

### Optional: purge everything

Set repository variable `CLOUDFLARE_PURGE_EVERYTHING` to `true` to purge the whole zone instead of per-URL (useful for first CI run or debugging).

### Local commands

```bash
# After npm run build
npm run cache:manifest

# Dry-run purge (no API token needed for diff output)
npm run cache:purge -- --dry-run

# Purge changed URLs
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... SITE_URL=https://andreysidorov.com \
  npm run cache:purge -- \
  --previous cloudflare/dist-manifest.previous.json \
  --current cloudflare/dist-manifest.json
```

---

## Migrating origin to Cloudflare Pages later

1. Create a Pages project; build command `npm run build`; output `dist`.
2. Add a build step to copy headers: `cp cloudflare/_headers dist/_headers` (or use `npm run build` once wired in `package.json`).
3. Point DNS to Pages instead of GitHub.
4. Disable GitHub Pages on the repo.
5. Cache Rules can be simplified — `_headers` applies automatically.

---

## Verify

```bash
# Asset — expect long cache at Cloudflare
curl -sI "https://andreysidorov.com/assets/<hash>.js" | grep -i cache

# HTML — expect bypass or short edge TTL; ETag present
curl -sI "https://andreysidorov.com/" | grep -iE 'cache|etag|cf-cache-status'
```

`cf-cache-status: HIT` on `/assets/*` after a second request indicates edge caching is working.
