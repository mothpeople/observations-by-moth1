import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://observations.moth1.xyz';
const dispatchesPath = path.resolve(process.cwd(), 'src/data/dispatches.js');
const outputPath = path.resolve(process.cwd(), 'public/sitemap.xml');

const source = fs.readFileSync(dispatchesPath, 'utf-8');

// Extract slug and optional datePublished from each dispatch object in src/data/dispatches.js
const entries = [];
const slugRegex = /slug:\s*['"`]([^'"`]+)['"`]([\s\S]*?)(?=\n\s*\},\s*\n|\n\];)/g;
let match;
while ((match = slugRegex.exec(source)) !== null) {
  const slug = match[1].trim();
  const block = match[2] || '';
  const dateMatch = block.match(/datePublished:\s*['"`]([^'"`]+)['"`]/);
  const lastmod = dateMatch ? dateMatch[1].trim() : new Date().toISOString().slice(0, 10);
  entries.push({ slug, lastmod });
}

if (entries.length === 0) {
  console.error('No issue slugs found in src/data/dispatches.js.');
  process.exit(1);
}

const latestDate = entries[entries.length - 1].lastmod;

const urls = [
  {
    loc: `${SITE_URL}/`,
    lastmod: latestDate,
    changefreq: 'weekly',
    priority: '1.0',
  },
  ...entries.map((entry) => ({
    loc: `${SITE_URL}/${entry.slug}`,
    lastmod: entry.lastmod,
    changefreq: 'monthly',
    priority: '0.9',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, xml, 'utf-8');
console.log(`Generated public/sitemap.xml with ${urls.length} URLs.`);
