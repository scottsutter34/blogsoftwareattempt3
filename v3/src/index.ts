import { parseSitemap } from './sitemap.js';
import { buildLinkMap } from './linkmap.js';
import { makeBrief } from './prompts/brief.js';
import { writeDraft } from './prompts/draft.js';
import { applyTemplate } from './template.js';
import { injectInternalLinks } from './inject.js';
import { publishShopify } from './publish/shopify.js';
import { publishWordPress } from './publish/wordpress.js';
import { log } from './utils/logger.js';
import * as fs from 'fs';
import * as path from 'path';

async function loadJson<T>(p: string): Promise<T> {
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
}

async function main(){
  const brand = await loadJson<any>('brand.json');
  const cfg = await loadJson<any>('article.json');

  const inv = await parseSitemap(brand.sitemap_url || new URL('/sitemap.xml', brand.site).toString());
  const linkMap = buildLinkMap(inv, (brand.link_overrides || []).map((o: any) => ({ keywords: o.anchor, url: o.url })));

  const brief = makeBrief({ brand, cfg, linkMap });
  const draft = writeDraft({ brief, cfg });

  // Page
  let html = applyTemplate({ draft });
  html = injectInternalLinks(html, linkMap, { cap: brand.link_policy?.max_internal ?? 6, utm: brand.link_policy?.utm ?? true });

  // Write output
  fs.mkdirSync('output', { recursive: true });
  const out = path.join('output', `${draft.meta.slug}.html`);
  fs.writeFileSync(out, html, 'utf-8');
  log.info('Wrote', out);

  // Publish
  if ((cfg.cms || '').toLowerCase() === 'shopify') await publishShopify(html, draft.meta);
  if ((cfg.cms || '').toLowerCase() === 'wordpress') await publishWordPress(html, draft.meta);
}

main().catch(e => { console.error(e); process.exit(1); });
