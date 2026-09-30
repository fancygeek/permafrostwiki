import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://permafrostwiki.com';
const socialImage = `${origin}/assets/permafrost-hero.png`;

const pages = {
  '/': {
    title: 'Permafrost Wiki & Guide | Survival, News and Game Information',
    description: 'Permafrost Wiki and Permafrost guide for survival systems, world and story, official videos, and release news.'
  },
  '/guides': {
    title: 'Permafrost Guide | Survival, Cold and Co-op | Permafrost Wiki',
    description: 'Use this Permafrost guide to explore survival systems, cold weather, shelters, companions, and co-op in the Permafrost Wiki.'
  },
  '/database': {
    title: 'Permafrost Wiki Database | Guides, Story and Sources',
    description: 'Browse the Permafrost Wiki database for source-linked guides, world and story entries, and current game information.'
  },
  '/library': {
    title: 'Permafrost Wiki Library | Guides and Game Information',
    description: 'Browse the Permafrost Wiki library for source-linked Permafrost guides, world entries, and game information.'
  },
  '/world': {
    title: 'Permafrost Wiki: World and Story | The Shattering and Rook',
    description: 'Explore the Permafrost Wiki world and story entries, including The Shattering, Rook, factions, and predators.'
  },
  '/map': {
    title: 'Permafrost Guide to Exploration | Shelters, Weather and World Reference',
    description: 'Use this Permafrost guide for source-linked exploration, shelter, and weather reference articles.'
  },
  '/news': {
    title: 'Permafrost News and Release Updates | Permafrost Wiki',
    description: 'Read Permafrost news, release information, and official announcements in the Permafrost Wiki.'
  },
  '/updates': {
    title: 'Permafrost News and Release Updates | Permafrost Wiki',
    description: 'Read Permafrost news, release information, and official announcements in the Permafrost Wiki.'
  },
  '/patch': {
    title: 'Permafrost Release Guide | Early Access Information | Permafrost Wiki',
    description: 'Read the Permafrost Wiki release guide for PC Early Access information and official release sources.'
  },
  '/about': {
    title: 'About Permafrost Wiki | Sources and Community Guide',
    description: 'Learn about Permafrost Wiki, its source-linked Permafrost guide entries, and its community reference scope.'
  }
};

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  })[character]);
}

function titleFromDocument(document) {
  const title = document.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? 'Permafrost';
  return title
    .replace(/\s*\|\s*Permafrost(?: Field)? Wiki\s*$/i, '')
    .replace(/\s*\|\s*Permafrost Wiki\s*$/i, '')
    .replace(/^(?:Permafrost Guide:\s*)+/i, '')
    .trim();
}

function routeFor(relativePath) {
  const normalized = relativePath.split(sep).join('/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return `/${normalized.slice(0, -'/index.html'.length)}`;
  return `/${normalized.replace(/\.html$/, '')}`;
}

function pageMetadata(route, document) {
  if (pages[route]) return pages[route];
  const label = titleFromDocument(document);
  return {
    title: `Permafrost Guide: ${label} | Permafrost Wiki`,
    description: `Read the Permafrost guide to ${label} in the Permafrost Wiki.`
  };
}

function seoMarkup({ route, title, description }) {
  const canonical = `${origin}${route === '/' ? '/' : route}`;
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonical,
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Permafrost Wiki',
      url: `${origin}/`,
      description: 'A community Permafrost Wiki and guide with source-linked game information.',
      inLanguage: ['en', 'zh-CN']
    }
  };

  return `\n    <link data-seo="permafrost" rel="canonical" href="${canonical}" />
    <meta data-seo="permafrost" name="description" content="${escapeHtml(description)}" />
    <meta data-seo="permafrost" name="robots" content="index,follow,max-image-preview:large" />
    <meta data-seo="permafrost" name="keywords" content="Permafrost Wiki, Permafrost guide, Permafrost game guide, survival game wiki" />
    <meta data-seo="permafrost" property="og:type" content="website" />
    <meta data-seo="permafrost" property="og:site_name" content="Permafrost Wiki" />
    <meta data-seo="permafrost" property="og:title" content="${escapeHtml(title)}" />
    <meta data-seo="permafrost" property="og:description" content="${escapeHtml(description)}" />
    <meta data-seo="permafrost" property="og:url" content="${canonical}" />
    <meta data-seo="permafrost" property="og:image" content="${socialImage}" />
    <meta data-seo="permafrost" name="twitter:card" content="summary_large_image" />
    <meta data-seo="permafrost" name="twitter:title" content="${escapeHtml(title)}" />
    <meta data-seo="permafrost" name="twitter:description" content="${escapeHtml(description)}" />
    <meta data-seo="permafrost" name="twitter:image" content="${socialImage}" />
    <script data-seo="permafrost" type="application/ld+json">${JSON.stringify(pageSchema)}</script>`;
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(target);
    return entry.isFile() && entry.name.endsWith('.html') ? [target] : [];
  }));
  return nested.flat();
}

const files = await htmlFiles(outputDirectory);
const canonicalRoutes = new Set();

for (const file of files) {
  const document = await readFile(file, 'utf8');
  const route = routeFor(relative(outputDirectory, file));
  const { title, description } = pageMetadata(route, document);
  const metadata = seoMarkup({ route, title, description });
  canonicalRoutes.add(route);

  const withoutPreviousSeo = document
    .replace(/\s*<link\b[^>]*data-seo="permafrost"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\b[^>]*data-seo="permafrost"[^>]*>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*data-seo="permafrost"[^>]*>[\s\S]*?<\/script>\s*/gi, '\n')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/\s*<meta\b(?=[^>]*\bname=["']description["'])[^>]*>\s*/gi, '\n');

  await writeFile(file, withoutPreviousSeo.replace(/\s*<\/head>/i, `${metadata}\n  </head>`));
}

const sitemapRoutes = [...canonicalRoutes].filter((route) => route !== '/guides' || true);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url><loc>${origin}${route === '/' ? '/' : route}</loc></url>`).join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;

await writeFile(new URL('../dist/sitemap.xml', import.meta.url), sitemap);
await writeFile(new URL('../dist/robots.txt', import.meta.url), robots);
console.log(`SEO metadata generated for ${files.length} pages and ${sitemapRoutes.length} canonical URLs.`);
