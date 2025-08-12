import type { LinkRule } from '../linkmap.js';

export type Brief = {
  outline: { h2: string; h3?: string[] }[];
  entities: string[];
  faqs: { q: string; a: string }[];
  internalLinks: { anchor: string[]; url: string }[];
  wordcount: number;
  cta: 'none'|'inline'|'card';
};

export function makeBrief(params: {
  brand: any; cfg: any; linkMap: LinkRule[];
}): Brief {
  const { cfg, linkMap } = params;
  const kw = (cfg.keyword || '').trim();

  // Simple heuristic brief; swap with LLM later.
  const outline = [
    { h2: `Understanding ${kw}` , h3: ['What it means', 'Why it matters'] },
    { h2: `Key Factors that Impact ${kw}`, h3: ['Quality', 'Origin', 'Seasonality'] },
    { h2: `How to Choose a Provider`, h3: ['Criteria', 'Red flags'] },
    { h2: `Pricing & Contracts`, h3: ['Typical ranges', 'Negotiation tips'] },
    { h2: `FAQs` }
  ];

  const entities = [kw, 'sourcing', 'roaster', 'sustainability', 'cupping'];

  const faqs = [
    { q: `What is ${kw}?`, a: `${kw} refers to...` },
    { q: `How do I evaluate quality for ${kw}?`, a: `Look for...` }
  ];

  const internalLinks = linkMap.map(m => ({ anchor: m.keywords, url: m.url }));

  return { outline, entities, faqs, internalLinks, wordcount: cfg.wordcount || 1400, cta: cfg.cta || 'none' };
}
