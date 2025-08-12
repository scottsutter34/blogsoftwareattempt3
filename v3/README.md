# SEO Blog Engine — Starter Repo

This is a minimal, production-friendly starter to generate **publish-ready SEO blog articles**
(HTML + meta + JSON-LD) and inject **internal links** from a site's sitemap. It targets
**Shopify** and **WordPress** but is CMS-agnostic.

## Quickstart

1. **Prereqs:** Node 20+, npm
2. **Install:** `npm i`
3. **Configure:**
   - Edit `brand.json` (site, sitemap, link policy, keyword→URL overrides)
   - Edit `article.json` (keyword, audience, tone, CMS)
4. **Run demo:** `npm run demo`
   - Outputs HTML files under `./output/` with internal links injected
5. **Build:** `npm run build`

> Note: LLM integration is **stubbed** in this starter (returns deterministic text).
> Swap in your provider in `src/providers/llm.ts`.

## Structure

```
src/
  index.ts            # Orchestrator
  demo.ts             # Demonstration runner for two example keywords
  sitemap.ts          # Fetch & parse sitemap
  linkmap.ts          # Build keyword→URL internal link map (with overrides)
  prompts/
    brief.ts          # Brief generator (stubbed)
    draft.ts          # Draft generator (stubbed → HTML <article>)
  inject.ts           # Internal-link injector using per-H2 section de-dup
  template.ts         # Page wrapper (typography, margins)
  publish/
    shopify.ts        # Draft publisher (no-op by default; instructions included)
    wordpress.ts      # Draft publisher (no-op by default)
  utils/
    logger.ts         # Pretty logger helper
examples/
  auto-internal-links.liquid  # Shopify snippet version
brand.json           # Brand/site config
article.json         # Article config (single)
```

## Shopify Publishing (optional)

Set environment variables (or edit `publish/shopify.ts`):

- `SHOPIFY_STORE` — e.g., `yourstore`
- `SHOPIFY_TOKEN` — Admin API access token
- `SHOPIFY_BLOG_ID` — Blog GID (e.g., `gid://shopify/Blog/123456789`)

Then call `publishShopify()` in `src/index.ts` (already wired; runs only if env vars present).

## WordPress Publishing (optional)

Set `WP_BASE_URL`, `WP_USER`, `WP_APP_PASSWORD` and call `publishWordPress()`.

## License

MIT
