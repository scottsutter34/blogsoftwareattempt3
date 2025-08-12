import { log } from '../utils/logger.js';

export async function publishShopify(html: string, meta: { title: string }, env = process.env) {
  const store = env.SHOPIFY_STORE;
  const token = env.SHOPIFY_TOKEN;
  const blogId = env.SHOPIFY_BLOG_ID;

  if (!store || !token || !blogId) {
    log.warn('Shopify env not set — skipping publish. (Set SHOPIFY_STORE, SHOPIFY_TOKEN, SHOPIFY_BLOG_ID)');
    return;
  }

  const url = `https://${store}.myshopify.com/admin/api/2024-07/graphql.json`;
  const query = `
    mutation($blogId: ID!, $title: String!, $bodyHtml: String!, $author: String) {
      blogArticleCreate(blogId: $blogId, article: { title: $title, bodyHtml: $bodyHtml, author: $author }) {
        article { id handle onlineStoreUrl }
        userErrors { field message }
      }
    }`;

  const body = { query, variables: { blogId, title: meta.title, bodyHtml: html, author: 'SEO Engine' } };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(()=> ({}));
  if (data?.data?.blogArticleCreate?.article) {
    log.info('Published draft to Shopify:', data.data.blogArticleCreate.article.onlineStoreUrl || data.data.blogArticleCreate.article.id);
  } else {
    log.warn('Shopify response:', JSON.stringify(data));
  }
}
