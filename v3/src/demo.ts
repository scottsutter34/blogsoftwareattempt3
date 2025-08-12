import { parseSitemap } from './sitemap.js';
import { buildLinkMap } from './linkmap.js';
import { makeBrief } from './prompts/brief.js';
import { writeDraft } from './prompts/draft.js';
import { applyTemplate } from './template.js';
import { injectInternalLinks } from './inject.js';
import { log } from './utils/logger.js';
import * as fs from 'fs';
import * as path from 'path';

async function loadJson<T>(p: string): Promise<T> {
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
}

async function runOnce(brand: any, cfg: any){
  const inv = await parseSitemap(brand.sitemap_url || new URL('/sitemap.xml', brand.site).toString());
  const linkMap = buildLinkMap(inv, (brand.link_overrides || []).map((o: any) => ({ keywords: o.anchor, url: o.url })));
  const brief = makeBrief({ brand, cfg, linkMap });
  const draft = writeDraft({ brief, cfg });
  let html = applyTemplate({ draft });
  html = injectInternalLinks(html, linkMap, { cap: brand.link_policy?.max_internal ?? 6, utm: brand.link_policy?.utm ?? true });

  fs.mkdirSync('output', { recursive: true });
  const out = path.join('output', `${draft.meta.slug}.html`);
  fs.writeFileSync(out, html, 'utf-8');
  log.info('Wrote', out);
}

async function main(){
  const brand = await loadJson<any>('brand.json');
  const cfg = await loadJson<any>('article.json');

  await runOnce(brand, cfg);

  const cfg2 = { ...cfg, keyword: 'coffee catering for events' };
  await runOnce(brand, cfg2);
}

main().catch(e => { console.error(e); process.exit(1); });
