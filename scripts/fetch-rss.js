// Fetch the Discourse RSS feed and write a static JSON file
// so the browser never has to deal with CORS issues.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FEED_URL = 'https://forum.theeastpacific.com/latest.rss';
const OUTPUT = path.join(__dirname, '..', 'public', 'data', 'latest-topics.json');
const MAX_ITEMS = 10;

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : null;
}

function stripCdata(s) {
  if (!s) return '';
  return s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
}

function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&');
}

function parseRss(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null && items.length < MAX_ITEMS) {
    const block = m[1];
    const title   = decodeEntities(stripCdata(extractTag(block, 'title')));
    const link    = decodeEntities(stripCdata(extractTag(block, 'link')));
    const creator = decodeEntities(stripCdata(extractTag(block, 'dc:creator')));
    const pubDate = stripCdata(extractTag(block, 'pubDate'));
    if (!title || !link) continue;

    let dateStr = '';
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d)) dateStr = d.toISOString().split('T')[0];
    }
    items.push({ title, url: link, author: creator || 'Unknown', date: dateStr });
  }
  return items;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https_get(url, resolve, reject);
  });
}

function https_get(url, resolve, reject) {
  import('node:https').then(https => {
    const get = (u) => https.default.get(u, {
      headers: { 'User-Agent': 'TepWorlds-RSS-Bot/1.0' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return https_get(res.headers.location, resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
    get(url);
  }).catch(reject);
}

(async () => {
  try {
    console.log('Fetching ' + FEED_URL);
    const xml = await fetchUrl(FEED_URL);
    const items = parseRss(xml);
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(OUTPUT, JSON.stringify({
      updated: new Date().toISOString(),
      source: FEED_URL,
      items
    }, null, 2));
    console.log('Wrote ' + items.length + ' items to ' + OUTPUT);
  } catch (err) {
    console.error('Failed to fetch RSS:', err.message);
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(OUTPUT, JSON.stringify({
      updated: new Date().toISOString(),
      source: FEED_URL,
      items: [],
      error: err.message
    }, null, 2));
    process.exit(1);
  }
})();
