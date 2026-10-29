import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const baseHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

const routes = [
  {
    paths: ['watering-grass-in-a-thunderstorm', 'issue-01', 'issue/01'],
    title: 'Issue #01: Watering Grass in a Thunderstorm | Observations by Moth1',
    description:
      'Why protests keep exploding, why geriatrics keep lecturing, and why nothing gets solved.',
    image: 'https://observations.moth1.xyz/og/og-issue-01.jpg',
    url: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm',
  },
  {
    paths: ['the-meat-grinder', 'issue-02', 'issue/02'],
    title: 'Issue #02: The Meat Grinder Needs More Meat | Observations by Moth1',
    description:
      'Why billionaires panic about birth rates, why the Venn diagram collapsed, and why the earth is quietly exhausted.',
    image: 'https://observations.moth1.xyz/og/og-issue-02.jpg',
    url: 'https://observations.moth1.xyz/the-meat-grinder',
  },
  {
    paths: ['analytics'],
    title: 'Analytics & Telemetry Command | Observations by Moth1',
    description: 'Private telemetry command.',
    image: 'https://observations.moth1.xyz/og/og-home.jpg',
    url: 'https://observations.moth1.xyz/analytics',
    noindex: true,
  },
];

for (const route of routes) {
  let html = baseHtml
    .replace(
      /<title>.*?<\/title>/s,
      `<title>${route.title}</title>${route.noindex ? '\n    <meta name="robots" content="noindex, nofollow" />' : ''}`
    )
    .replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/>/s,
      `<meta name="description" content="${route.description}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/>/s,
      `<meta property="og:url" content="${route.url}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/>/s,
      `<meta property="og:title" content="${route.title}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/>/s,
      `<meta property="og:description" content="${route.description}" />`
    )
    .replace(
      /<meta\s+property="og:image"\s+content=".*?"\s*\/>/s,
      `<meta property="og:image" content="${route.image}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/>/s,
      `<meta name="twitter:title" content="${route.title}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/s,
      `<meta name="twitter:description" content="${route.description}" />`
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content=".*?"\s*\/>/s,
      `<meta name="twitter:image" content="${route.image}" />`
    );

  for (const subPath of route.paths) {
    const outDir = path.join(distDir, subPath);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
    // Also write <subPath>.html so Vercel cleanUrls / static matching hits it immediately
    const parentDir = path.dirname(path.join(distDir, `${subPath}.html`));
    fs.mkdirSync(parentDir, { recursive: true });
    fs.writeFileSync(path.join(distDir, `${subPath}.html`), html, 'utf-8');
  }
}

console.log('Generated route-specific Open Graph HTML files for WhatsApp & social previews.');
