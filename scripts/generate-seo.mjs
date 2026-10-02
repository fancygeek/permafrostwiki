import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://permafrostwiki.com';
const siteName = 'Permafrost Wiki';
const socialImage = `${origin}/assets/permafrost-hero.png`;
const siteId = `${origin}/#website`;

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

const articles = {
  permafrost: {
    headline: 'What Is Permafrost?',
    section: 'Game Overview',
    title: 'What Is Permafrost? | Game Overview | Permafrost Wiki',
    description: 'Learn what Permafrost is: a story-driven survival sandbox set in a frozen post-apocalyptic world with solo and four-player co-op.'
  },
  'early-access-release': {
    headline: 'Permafrost Early Access release',
    section: 'Release Information',
    title: 'Permafrost Early Access Release Date | PC Guide',
    description: 'Permafrost is scheduled for PC Early Access on 9 October 2026, with Steam, GOG.com, and the Epic Games Store named as storefronts.'
  },
  'rook-and-signal': {
    headline: 'Rook and the radio signal',
    section: 'World and Story',
    title: 'Rook and the Radio Signal | Permafrost Story Guide',
    description: 'Meet Rook, the engineer drawn into Permafrost\'s frozen world by a radio signal from a long-lost friend.'
  },
  'the-shattering': {
    headline: 'The Shattering',
    section: 'World and Story',
    title: 'The Shattering Explained | Permafrost World Guide',
    description: 'Learn about The Shattering, the catastrophe that destroyed the Moon and left Permafrost under ice, snow, and sub-zero temperatures.'
  },
  'cold-and-weather': {
    headline: 'Cold, frostbite, and storms',
    section: 'Survival Guide',
    title: 'Permafrost Cold, Frostbite and Storms Guide',
    description: 'Learn how cold, frostbite, snowstorms, visibility, and deadly cold zones affect exploration and survival in Permafrost.'
  },
  'essential-tools': {
    headline: 'Essential tools',
    section: 'Survival Guide',
    title: 'Permafrost Essential Tools Guide | Gathering, Building and Hunting',
    description: 'See the essential Permafrost tools for gathering, building, hunting, trapping, repairing shelters, and breaking through stone.'
  },
  'preparing-for-expedition': {
    headline: 'Preparing for an expedition',
    section: 'Survival Guide',
    title: 'Permafrost Expedition Preparation Guide | Gear and Warmth',
    description: 'Prepare for a Permafrost expedition with warm clothing, food, a tent, ammunition, heaters, and help from the dog companion.'
  },
  'survival-basics': {
    headline: 'Permafrost survival basics',
    section: 'Survival Guide',
    title: 'Permafrost Survival Basics Guide | Warmth, Tools and Co-op',
    description: 'Master Permafrost survival basics: warmth, shelter, dog companions, tools, weapons, and co-op in the frozen wilderness.'
  },
  'survival-hazards': {
    headline: 'Permafrost survival hazards',
    section: 'Survival Guide',
    title: 'Permafrost Survival Hazards Guide | Cold, Falls and Hostiles',
    description: 'Understand Permafrost survival hazards including dangerous animals, hostile people, falls, cold, freezing, and friendly fire in co-op.'
  },
  'shelter-network': {
    headline: 'Shelter networks',
    section: 'Survival Guide',
    title: 'Permafrost Shelter Networks Guide | Restore and Travel Farther',
    description: 'Learn how Permafrost shelter networks, abandoned shelters, repairs, and recovered technology support longer journeys into the frozen world.'
  },
  'canine-companion': {
    headline: 'Dog companion',
    section: 'Companions and Co-op',
    title: 'Permafrost Dog Companion Guide | Carry, Recall and Scout',
    description: 'Learn how the Permafrost dog companion carries loot, hauls resources, warns of threats, finds useful items, and responds to a whistle.'
  },
  'co-op-survival': {
    headline: '1-4 player co-op survival',
    section: 'Companions and Co-op',
    title: 'Permafrost Co-op Survival Guide | 1-4 Player Online Play',
    description: 'Learn about Permafrost online co-op: survive solo or with up to three friends, progress together, and choose story or survival goals.'
  },
  'exploration-progression': {
    headline: 'Exploration-gated progression',
    section: 'Survival Guide',
    title: 'Permafrost Exploration Progression Guide | Repair and Recovery',
    description: 'Learn how exploration, repair, recovery, restored shelters, and reclaimed technology drive progression in Permafrost.'
  },
  predators: {
    headline: 'Predators',
    section: 'World and Story',
    title: 'Permafrost Predators Guide | Wildlife in the Frozen World',
    description: 'Learn about predators and wildlife threats in the frozen Permafrost wilderness, where nature is one of the central dangers.'
  },
  'hostile-factions': {
    headline: 'Hostile factions',
    section: 'World and Story',
    title: 'Permafrost Hostile Factions Guide | Human Enclaves',
    description: 'Learn about Permafrost hostile factions competing for supremacy in human enclaves while fighting to endure the frozen world.'
  },
  'early-access-scope': {
    headline: 'Early Access scope',
    section: 'Release Information',
    title: 'Permafrost Early Access Scope | Content and Roadmap',
    description: 'See the announced Permafrost Early Access scope, including planned biomes, quests, mechanics, quality-of-life updates, and four-player co-op.'
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

function articleSlug(document) {
  return document.match(/\bdata-article=["']([^"']+)["']/i)?.[1];
}

function pageMetadata(route, document) {
  const slug = articleSlug(document);
  if (slug && articles[slug]) return { ...articles[slug], kind: 'article', slug };
  if (pages[route]) return pages[route];
  const label = titleFromDocument(document);
  return {
    kind: 'page',
    title: `Permafrost Guide: ${label} | Permafrost Wiki`,
    description: `Read the Permafrost guide to ${label} in the Permafrost Wiki.`
  };
}

function fallbackMarkup(route, metadata) {
  const articleLinks = (slugs) => slugs.map((slug) => {
    const article = articles[slug];
    return `<li><a href="/articles/${slug}.html">${escapeHtml(article.headline)}</a></li>`;
  }).join('');

  if (metadata.kind === 'article') {
    return `<main class="wrap"><div class="article-layout"><article class="article"><p class="eyebrow">${escapeHtml(metadata.section)}</p><h1>${escapeHtml(metadata.headline)}</h1><p class="lead">${escapeHtml(metadata.description)}</p><p><a href="/guides/">Browse the Permafrost guide</a> or <a href="/library/">view all Wiki entries</a>.</p></article></div></main>`;
  }

  if (route === '/') {
    return `<h1>Permafrost Wiki &amp; Guide</h1><p>Source-linked game information, survival guides, world and story entries, and official release news for Permafrost.</p><h2>Featured guides</h2><ul>${articleLinks(['survival-basics', 'cold-and-weather', 'shelter-network', 'early-access-release'])}</ul>`;
  }

  if (route === '/guides') {
    return `<main class="wrap"><section class="section"><p class="eyebrow">PERMAFROST GUIDE</p><h1>Permafrost Guide</h1><p>Source-linked survival guides for cold weather, shelters, exploration, companions, and co-op.</p><h2>Survival guides</h2><ul>${articleLinks(['survival-basics', 'cold-and-weather', 'essential-tools', 'preparing-for-expedition', 'survival-hazards', 'shelter-network', 'exploration-progression', 'canine-companion', 'co-op-survival'])}</ul></section></main>`;
  }

  if (route === '/world') {
    return `<main class="wrap"><section class="section"><p class="eyebrow">WORLD AND STORY</p><h1>Permafrost World and Story</h1><p>Explore Rook, the radio signal, The Shattering, predators, and hostile factions.</p><ul>${articleLinks(['rook-and-signal', 'the-shattering', 'predators', 'hostile-factions'])}</ul></section></main>`;
  }

  if (route === '/library') {
    return `<main class="wrap"><section class="section"><p class="eyebrow">PERMAFROST WIKI</p><h1>Permafrost Wiki Library</h1><p>Browse all current source-linked Permafrost guides, world entries, and release information.</p><ul>${articleLinks(Object.keys(articles))}</ul></section></main>`;
  }

  if (route === '/map') {
    return `<main class="wrap"><section class="section"><p class="eyebrow">WORLD REFERENCE</p><h1>Permafrost Exploration Guide</h1><p>Reference guides for shelters, exploration progression, and severe weather.</p><ul>${articleLinks(['shelter-network', 'exploration-progression', 'cold-and-weather'])}</ul></section></main>`;
  }

  if (route === '/updates') {
    return `<main class="wrap"><section class="section"><p class="eyebrow">OFFICIAL ANNOUNCEMENTS</p><h1>Permafrost Release News and Updates</h1><p>Read current release information and official Permafrost announcements.</p><ul>${articleLinks(['early-access-release', 'early-access-scope'])}</ul></section></main>`;
  }

  return '';
}

function injectStaticContent(document, route, metadata) {
  const fallback = fallbackMarkup(route, metadata);
  if (!fallback) return document;

  if (route === '/') {
    return document.replace(/(<article\b[^>]*\bdata-home-content\b[^>]*>)[\s\S]*?(<\/article>)/i, `$1<!-- seo-prerender:permafrost:start -->${fallback}<!-- seo-prerender:permafrost:end -->$2`);
  }

  const prerendered = `<!-- seo-prerender:permafrost:start -->${fallback}<!-- seo-prerender:permafrost:end -->`;
  if (/<!-- seo-prerender:permafrost:start -->/i.test(document)) {
    return document.replace(/<!-- seo-prerender:permafrost:start -->[\s\S]*?<!-- seo-prerender:permafrost:end -->/i, prerendered);
  }

  return document.replace(/<div\s+id=["']app["']\s*><\/div>/i, `<div id="app">${prerendered}</div>`);
}

function breadcrumbFor(route, metadata) {
  if (route === '/') return null;
  const items = [{ name: siteName, item: `${origin}/` }];

  if (metadata.kind === 'article') {
    const section = metadata.section === 'World and Story'
      ? { name: 'World and Story', item: `${origin}/world` }
      : metadata.section === 'Release Information'
        ? { name: 'Release Updates', item: `${origin}/updates` }
        : { name: 'Permafrost Guide', item: `${origin}/guides` };
    items.push(section, { name: metadata.headline, item: `${origin}${route}` });
  } else {
    items.push({ name: metadata.title, item: `${origin}${route}` });
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}

function seoMarkup({ route, metadata }) {
  const canonical = `${origin}${route === '/' ? '/' : route}`;
  const pageId = `${canonical}#webpage`;
  const isArticle = metadata.kind === 'article';
  const graph = [];

  graph.push({
    '@type': 'WebSite',
    '@id': siteId,
    name: siteName,
    alternateName: 'Permafrost Wiki & Guide',
    url: `${origin}/`,
    description: 'A community Permafrost Wiki and guide with source-linked game information.',
    inLanguage: ['en', 'zh-CN']
  });

  graph.push({
    '@type': 'WebPage',
    '@id': pageId,
    name: metadata.title,
    description: metadata.description,
    url: canonical,
    inLanguage: 'en',
    isPartOf: { '@id': siteId }
  });

  const breadcrumb = breadcrumbFor(route, metadata);
  if (breadcrumb) graph.push(breadcrumb);

  if (isArticle) {
    graph.push({
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: metadata.headline,
      description: metadata.description,
      url: canonical,
      image: socialImage,
      articleSection: metadata.section,
      inLanguage: 'en',
      mainEntityOfPage: { '@id': pageId },
      author: { '@type': 'Organization', name: siteName },
      publisher: { '@type': 'Organization', name: siteName },
      about: { '@type': 'VideoGame', name: 'Permafrost' }
    });
  }

  const schema = { '@context': 'https://schema.org', '@graph': graph };
  const articleProperties = isArticle
    ? `\n    <meta data-seo="permafrost" property="article:section" content="${escapeHtml(metadata.section)}" />`
    : '';

  return `\n    <link data-seo="permafrost" rel="canonical" href="${canonical}" />
    <meta data-seo="permafrost" name="description" content="${escapeHtml(metadata.description)}" />
    <meta data-seo="permafrost" name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta data-seo="permafrost" name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta data-seo="permafrost" name="bingbot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta data-seo="permafrost" name="author" content="${siteName}" />
    <meta data-seo="permafrost" name="keywords" content="Permafrost Wiki, Permafrost guide, Permafrost game guide, survival game wiki" />
    <meta data-seo="permafrost" property="og:type" content="${isArticle ? 'article' : 'website'}" />
    <meta data-seo="permafrost" property="og:locale" content="en_US" />
    <meta data-seo="permafrost" property="og:site_name" content="${siteName}" />
    <meta data-seo="permafrost" property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta data-seo="permafrost" property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta data-seo="permafrost" property="og:url" content="${canonical}" />
    <meta data-seo="permafrost" property="og:image" content="${socialImage}" />
    <meta data-seo="permafrost" property="og:image:alt" content="Permafrost Wiki and Guide" />${articleProperties}
    <meta data-seo="permafrost" name="twitter:card" content="summary_large_image" />
    <meta data-seo="permafrost" name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta data-seo="permafrost" name="twitter:description" content="${escapeHtml(metadata.description)}" />
    <meta data-seo="permafrost" name="twitter:image" content="${socialImage}" />
    <script data-seo="permafrost" type="application/ld+json">${JSON.stringify(schema)}</script>`;
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
const canonicalRoutes = new Map();
let changedPages = 0;

for (const file of files) {
  const document = await readFile(file, 'utf8');
  const route = routeFor(relative(outputDirectory, file));
  const metadata = pageMetadata(route, document);
  const seo = seoMarkup({ route, metadata });
  const withStaticContent = injectStaticContent(document, route, metadata);

  const withoutPreviousSeo = withStaticContent
    .replace(/\s*<link\b[^>]*data-seo="permafrost"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\b[^>]*data-seo="permafrost"[^>]*>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*data-seo="permafrost"[^>]*>[\s\S]*?<\/script>\s*/gi, '\n')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/\s*<meta\b(?=[^>]*\bname=["']description["'])[^>]*>\s*/gi, '\n');
  const finalDocument = withoutPreviousSeo.replace(/\s*<\/head>/i, `${seo}\n  </head>`);

  if (document !== finalDocument) {
    await writeFile(file, finalDocument);
    changedPages += 1;
  }

  const modified = await stat(file);
  const current = canonicalRoutes.get(route);
  if (!current || modified.mtimeMs > current.mtimeMs) {
    canonicalRoutes.set(route, { route, mtimeMs: modified.mtimeMs });
  }
}

function sitemapSettings(route) {
  if (route === '/') return { changefreq: 'weekly', priority: '1.0' };
  if (['/guides', '/library', '/world', '/database'].includes(route)) return { changefreq: 'weekly', priority: '0.9' };
  if (route.startsWith('/articles/')) return { changefreq: 'monthly', priority: '0.8' };
  if (['/news', '/updates', '/patch'].includes(route)) return { changefreq: 'weekly', priority: '0.7' };
  return { changefreq: 'monthly', priority: '0.6' };
}

const sitemapRoutes = [...canonicalRoutes.values()].sort((left, right) => left.route.localeCompare(right.route));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map(({ route, mtimeMs }) => {
  const { changefreq, priority } = sitemapSettings(route);
  const lastmod = new Date(mtimeMs).toISOString().slice(0, 10);
  const url = `${origin}${route === '/' ? '/' : route}`;
  return `  <url>\n    <loc>${escapeHtml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;

await writeFile(new URL('../dist/sitemap.xml', import.meta.url), sitemap);
await writeFile(new URL('../dist/robots.txt', import.meta.url), robots);
console.log(`SEO metadata generated for ${files.length} pages (${changedPages} changed) and ${sitemapRoutes.length} canonical URLs.`);
