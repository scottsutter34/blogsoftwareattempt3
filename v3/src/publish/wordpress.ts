import { log } from '../utils/logger.js';

export async function publishWordPress(html: string, meta: { title: string }, env = process.env) {
  const base = env.WP_BASE_URL;
  const user = env.WP_USER;
  const pass = env.WP_APP_PASSWORD;

  if (!base || !user || !pass) {
    log.warn('WordPress env not set — skipping publish. (Set WP_BASE_URL, WP_USER, WP_APP_PASSWORD)');
    return;
  }

  const url = `${base.replace(/\/$/,'')}/wp-json/wp/v2/posts`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: meta.title, content: html, status: 'draft' })
  });

  const data = await res.json().catch(()=> ({}));
  if (data?.id) log.info('Published draft to WordPress with id:', data.id);
  else log.warn('WordPress response:', JSON.stringify(data));
}
