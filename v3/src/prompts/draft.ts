import type { Brief } from './brief.js';

function paragraph(text: string){ return `<p>${text}</p>`; }

export type Draft = {
  meta: { title: string; description: string; slug: string };
  articleHtml: string;
  jsonld: string[];
};

export function writeDraft(params: { brief: Brief; cfg: any }): Draft {
  const { brief, cfg } = params;
  const kw = cfg.keyword;
  const title = `${kw.charAt(0).toUpperCase()+kw.slice(1)}: The Complete Guide`;
  const description = `Everything you need to know about ${kw} — selection, pricing, and best practices.`;
  const slug = kw.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  const sections = brief.outline.map(sec => {
    let html = `<h2>${sec.h2}</h2>`;
    if (sec.h3 && sec.h3.length) {
      html += sec.h3.map(h3 => `<h3>${h3}</h3>${paragraph('Lorem ipsum content seeded for MVP. Replace with provider output.')}`).join('');
    } else if (/faq/i.test(sec.h2) && brief.faqs?.length) {
      html += brief.faqs.map(f => `<h3>${f.q}</h3>${paragraph(f.a)}`).join('');
    } else {
      html += paragraph('Lorem ipsum content seeded for MVP. Replace with provider output.');
    }
    return html;
  }).join('\n');

  const articleHtml = `
<h1>${title}</h1>
${paragraph('Intro paragraph that frames the topic, intent, and outcome for the reader.')}
${sections}
`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": brief.faqs.map(f => ({
      "@type":"Question", "name": f.q, "acceptedAnswer": {"@type":"Answer","text": f.a}
    }))
  };

  const jsonld = [JSON.stringify(articleLd)];
  if (brief.faqs?.length) jsonld.push(JSON.stringify(faqLd));

  return { meta: { title, description, slug }, articleHtml, jsonld };
}
