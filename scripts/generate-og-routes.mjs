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
    paths: ['watering-grass-in-a-thunderstorm', 'watering-grass', 'issue-01', 'issue/01'],
    title: 'Issue #01: Watering Grass in a Thunderstorm | Observations by Moth1',
    headline: 'Watering Grass in a Thunderstorm',
    datePublished: '2026-10-28',
    description:
      'Why protests keep exploding, why geriatrics keep lecturing, and why nothing gets solved.',
    image: 'https://observations.moth1.xyz/og/og-issue-01.jpg',
    url: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm',
  },
  {
    paths: ['the-meat-grinder', 'issue-02', 'issue/02'],
    title: 'Issue #02: The Meat Grinder Needs More Meat | Observations by Moth1',
    headline: 'The Meat Grinder Needs More Meat',
    datePublished: '2026-11-02',
    description:
      'Why billionaires panic about birth rates, why the Venn diagram collapsed, and why the earth is quietly exhausted.',
    image: 'https://observations.moth1.xyz/og/og-issue-02.jpg',
    url: 'https://observations.moth1.xyz/the-meat-grinder',
  },
  {
    paths: [
      'war-on-drugs',
      'the-war-no-one-was-supposed-to-win',
      'issue-03',
      'issue/03',
    ],
    title: 'Issue #03: The War No One Was Supposed to Win | Observations by Moth1',
    headline: 'The War No One Was Supposed to Win',
    datePublished: '2026-11-05',
    description:
      'Why billionaires microdose in boardrooms while working-class kids rot in cells, and why the state’s deadliest drug sits taxed on the top shelf.',
    image: 'https://observations.moth1.xyz/og/og-issue-03.jpg',
    url: 'https://observations.moth1.xyz/war-on-drugs',
  },
  {
    paths: [
      'century-of-self-inflicted-humiliation',
      'self-inflicted-humiliation',
      'the-century-of-self-inflicted-humiliation',
    ],
    title:
      'Issue #04: The Century of Self-Inflicted Humiliation | Observations by Moth1',
    headline: 'The Century of Self-Inflicted Humiliation',
    datePublished: '2026-11-16',
    description:
      'How algorithmic feeds became the modern opium trade, hollowing out our attention spans, fracturing society, and engineering a crisis we willingly consume.',
    image: 'https://observations.moth1.xyz/og/og-issue-04.jpg',
    url: 'https://observations.moth1.xyz/century-of-self-inflicted-humiliation',
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
  const jsonLdScript = !route.noindex && route.headline
    ? `\n    <script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: route.headline,
        description: route.description,
        image: route.image,
        datePublished: route.datePublished,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': route.url,
        },
        author: {
          '@type': 'Person',
          name: 'Moth1',
          url: 'https://moth1.xyz',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Observations by Moth1',
          url: 'https://observations.moth1.xyz',
        },
      })}</script>`
    : '';

  let html = baseHtml
    .replace(
      /<title>.*?<\/title>/s,
      `<title>${route.title}</title>\n    <link rel="canonical" href="${route.url}" />${route.noindex ? '\n    <meta name="robots" content="noindex, nofollow" />' : ''}${jsonLdScript}`
    )
    .replace(
      /<meta\s+property="og:type"\s+content=".*?"\s*\/>/s,
      `<meta property="og:type" content="${route.noindex ? 'website' : 'article'}" />`
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
