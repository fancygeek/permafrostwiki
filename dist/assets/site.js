(() => {
  const wiki = window.PERMAFROST_WIKI;
  if (!wiki) return;

  let locale = (() => {
    try { return localStorage.getItem('permafrost-locale') === 'zh' ? 'zh' : 'en'; }
    catch (_) { return 'en'; }
  })();

  const page = document.body.dataset.page || 'home';
  const articleSlug = document.body.dataset.article;
  const isZh = () => locale === 'zh';
  const t = (en, zh) => isZh() ? zh : en;
  const read = (item, key) => isZh() ? item[`${key}Zh`] : item[key];
  const route = (slug) => `/articles/${slug}.html`;
  const source = (article) => wiki.sources[article.source];
  const sourceLabel = (article) => t(source(article).label, source(article).zh);

  const navigation = [
    ['home', '/', 'Home', '首页'],
    ['guides', '/guides/', 'Survival', '生存'],
    ['world', '/world/', 'World & Story', '世界与剧情'],
    ['library', '/library/', 'Library', '资料库'],
    ['map', '/map/', 'Atlas', '地图集'],
    ['updates', '/updates/', 'News', '公告']
  ];

  function articleCard(article) {
    return `<a class="card-link" href="${route(article.slug)}"><article class="card">
      <div class="card-top"><span class="category">${read(article, 'category')}</span></div>
      <h3>${read(article, 'title')}</h3><p>${read(article, 'lead')}</p>
      <div class="card-footer"><span>${sourceLabel(article)}</span><span>${t('Read entry', '阅读条目')}</span></div>
    </article></a>`;
  }

  function sectionHead(eyebrow, title, copy) {
    return `<div class="section-head"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div><p>${copy}</p></div>`;
  }

  function ensureVideoStyles() {
    if (document.querySelector('#official-video-styles')) return;
    const style = document.createElement('style');
    style.id = 'official-video-styles';
    style.textContent = `.official-video{display:grid;grid-template-columns:1fr;gap:22px;margin:44px 0 36px;padding:26px;border:1px solid var(--line);border-radius:17px;background:linear-gradient(135deg,rgba(94,209,231,.1),rgba(14,32,44,.76))}.official-video h2{margin:7px 0 10px;font-size:clamp(1.45rem,2.4vw,1.8rem);line-height:1.2}.official-video p{margin:0;color:var(--muted);font-size:1.04rem;line-height:1.65}.official-video a{display:inline-block;margin-top:15px;font-size:.92rem;font-weight:750}.official-video-frame{overflow:hidden;border:1px solid rgba(184,241,255,.25);border-radius:12px;background:#050d13;aspect-ratio:16/9}.official-video iframe{display:block;width:100%;height:100%;border:0}@media(max-width:700px){.official-video{padding:18px;gap:18px;margin:32px 0}.official-video p{font-size:1rem}}`;
    document.head.append(style);
  }

  function ensureFieldScaleStyles() {
    if (document.querySelector('#field-scale-styles')) return;
    const style = document.createElement('style');
    style.id = 'field-scale-styles';
    style.textContent = `:root{--max:1240px}body{font-size:17px;line-height:1.65}.section{margin-top:72px}.section-head{gap:32px;margin-bottom:26px}.section-head p{max-width:540px;font-size:1rem}.page-title{margin:6px 0 12px;font-size:clamp(2.25rem,5vw,4rem);line-height:1;letter-spacing:-.055em}.card{padding:24px}.card h3{margin:13px 0 9px;font-size:1.26rem;line-height:1.28}.card p{font-size:1rem;line-height:1.62}.card-footer{margin-top:22px;font-size:.78rem}.article-layout{grid-template-columns:minmax(0,880px) 300px;gap:54px}.article{max-width:880px}.article .lead{font-size:1.2rem;line-height:1.65}.article h2{margin:42px 0 14px;font-size:1.6rem}.fact-list{gap:12px;margin:18px 0}.fact-list li{padding:10px 0 10px 15px;font-size:1.03rem;line-height:1.62}.aside{width:300px}.side-list li{padding:12px 0;font-size:.94rem}@media(max-width:850px){.article-layout{grid-template-columns:1fr}.aside{width:auto}}@media(max-width:520px){body{font-size:16px}.section{margin-top:48px}.page-title{font-size:2.45rem}.card{padding:19px}.card h3{font-size:1.16rem}.section-head p,.card p{font-size:.98rem}.article .lead{font-size:1.1rem}.article h2{font-size:1.42rem}}`;
    document.head.append(style);
  }

  function videoSection(video) {
    const title = read(video, 'title');
    const description = read(video, 'description');
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    return `<section class="official-video"><div><p class="eyebrow">${t('Official video', '官方视频')}</p><h2>${title}</h2><p>${description}</p><a href="${url}" target="_blank" rel="noreferrer">${t('Watch on YouTube', '在 YouTube 上观看')}</a></div><div class="official-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${video.id}?rel=0" title="${title}" loading="eager" referrerpolicy="origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></section>`;
  }

  function renderHeader() {
    document.querySelector('#site-header').innerHTML = `<header class="site-header"><div class="wrap header-inner">
      <a class="brand" href="/"><span class="brand-mark">✦</span><span>PERMAFROST<small>FIELD WIKI</small></span></a>
      <nav class="nav" aria-label="${t('Primary navigation', '主导航')}">${navigation.map(([key, href, en, zh]) => `<a href="${href}" class="${page === key ? 'active' : ''}">${t(en, zh)}</a>`).join('')}</nav>
      <button type="button" class="locale" id="locale-toggle" aria-label="${t('Switch to Chinese', '切换到英文')}">${isZh() ? 'EN' : '中文'}</button>
    </div></header>`;
    document.querySelector('#locale-toggle').addEventListener('click', () => {
      locale = isZh() ? 'en' : 'zh';
      try { localStorage.setItem('permafrost-locale', locale); } catch (_) {}
      render();
    });
  }

  function renderFooter() {
    document.querySelector('#site-footer').innerHTML = `<footer class="site-footer"><div class="wrap footer-inner">
      <span>${t('Unofficial community field guide for Permafrost.', '《永冻纪元 - Permafrost》非官方社区野外手册。')}</span>
      <span>${t('English · 中文', 'English · 中文')}</span>
    </div></footer>`;
  }

  function renderHome() {
    const featured = wiki.articles.filter((article) => ['early-access-release', 'cold-and-weather', 'shelter-network', 'canine-companion', 'rook-and-signal', 'early-access-scope'].includes(article.slug));
    return `<section class="hero"><div class="wrap">
      <p class="eyebrow">PERMAFROST FIELD WIKI</p>
      <h1>PERMAFROST<br><span>WIKI</span></h1>
      <p class="hero-copy">${t('Explore the Permafrost Wiki for game information, story, survival systems, and official announcements. Start with the Permafrost Guide for cold, shelter, tools, and co-op.', '浏览《永冻纪元 - Permafrost》游戏 Wiki，查看游戏资料、剧情、生存系统与官方公告；生存指南涵盖严寒、避难所、工具与合作玩法。')}</p>
      <div class="meta-strip"><span class="meta-chip safe">${t('PC Early Access · 9 October 2026', 'PC 抢先体验 · 2026 年 10 月 9 日')}</span><span class="meta-chip">${t('1–4 player co-op', '1–4 人合作')}</span><span class="meta-chip">Steam</span></div>
    </div></section>
    <main class="wrap">
      <section class="section">${sectionHead(t('Browse the Permafrost Wiki', '浏览 Permafrost Wiki'), t('Permafrost Wiki sections', 'Permafrost Wiki 分区'), t('Browse survival systems, world and story, and the full Permafrost Wiki article library.', '浏览生存系统、世界与剧情，以及完整的 Permafrost Wiki 条目库。'))}
        <div class="grid three">
          <a class="card-link" href="/guides/"><article class="card"><span class="category">${t('Survival', '生存')}</span><h3>${t('Permafrost Guide: Survival', 'Permafrost 生存指南')}</h3><p>${t('Use the Permafrost Guide for cold, shelter networks, exploration, companions, and co-op.', '使用 Permafrost 生存指南查看严寒、避难所网络、探索、伙伴和合作。')}</p></article></a>
          <a class="card-link" href="/world/"><article class="card"><span class="category">${t('World', '世界')}</span><h3>${t('World & story', '世界与剧情')}</h3><p>${t('Rook, the signal, The Shattering, predators, and factions.', 'Rook、信号、The Shattering、掠食动物和势力。')}</p></article></a>
          <a class="card-link" href="/library/"><article class="card"><span class="category">${t('Library', '资料库')}</span><h3>${t('Browse the library', '浏览资料库')}</h3><p>${t('Explore current articles and official dispatches.', '浏览当前资料条目和官方动态。')}</p></article></a>
        </div>
      </section>
      <section class="section">${sectionHead(t('Featured articles', '精选条目'), t('Featured articles', '精选条目'), t('A selection of current Permafrost reference articles.', '当前《永冻纪元 - Permafrost》资料条目精选。'))}<div class="grid three">${featured.map(articleCard).join('')}</div></section>
    </main>`;
  }

  function renderGuides() {
    const groups = [
      ['Getting started', '起步', 'First steps', '入门指南', 'Start with tools and supplies before moving beyond shelter.', '从工具和补给开始，再离开避难所。', ['essential-tools', 'preparing-for-expedition', 'survival-basics']],
      ['Weather, shelter & safety', '天气、避难所与安全', 'Surviving the wilderness', '荒野生存', 'Prepare for cold weather, manage hazards, and plan longer journeys.', '为严寒做准备、应对威胁，并规划更长的行程。', ['cold-and-weather', 'survival-hazards', 'shelter-network', 'exploration-progression']],
      ['Companions & co-op', '伙伴与合作', 'Travel together', '结伴同行', 'Travel with the dog companion or survive with a group.', '与狗狗伙伴同行，或与队友一起生存。', ['canine-companion', 'co-op-survival']]
    ];
    return `<main class="wrap"><section class="section"><p class="eyebrow">PERMAFROST GUIDE</p><h1 class="page-title">${t('Permafrost Guide', '《永冻纪元 - Permafrost》生存指南')}</h1><p class="lead">${t('This Permafrost Guide covers cold weather, shelters, exploration, companions, and co-op. Browse the Permafrost Wiki for story and release information.', '这份 Permafrost 生存指南涵盖严寒、避难所、探索、伙伴与合作玩法；剧情和发售信息请浏览 Permafrost Wiki。')}</p></section>${groups.map(([eyebrowEn, eyebrowZh, titleEn, titleZh, copyEn, copyZh, slugs]) => { const entries = wiki.articles.filter((article) => slugs.includes(article.slug)); return `<section class="section">${sectionHead(t(eyebrowEn, eyebrowZh), t(titleEn, titleZh), t(copyEn, copyZh))}<div class="grid three">${entries.map(articleCard).join('')}</div></section>`; }).join('')}</main>`;
  }

  function renderWorld() {
    const articles = wiki.articles.filter((article) => ['rook-and-signal', 'the-shattering', 'predators', 'hostile-factions'].includes(article.slug));
    return `<main class="wrap"><section class="section">${sectionHead(t('World & story', '世界与剧情'), t('World & story', '世界与剧情'), t('Rook, The Shattering, predators, and hostile factions.', 'Rook、The Shattering、掠食动物和敌对势力。'))}<div class="grid two">${articles.map(articleCard).join('')}</div></section></main>`;
  }

  function renderLibrary() {
    return `<main class="wrap"><section class="section">${sectionHead(t('Library', '资料库'), t('All articles', '全部条目'), t('Browse the current Permafrost article library.', '浏览当前《永冻纪元 - Permafrost》资料库。'))}
      <div class="search-row"><label class="sr-only" for="library-search">${t('Search the library', '搜索资料库')}</label><input id="library-search" type="search" placeholder="${t('Search cold, Rook, co-op, Early Access…', '搜索严寒、Rook、合作、抢先体验…')}" autocomplete="off"></div>
      <div class="filter-row" id="category-filters"></div><div class="grid three" id="article-grid"></div><p class="empty" id="empty-state">${t('No matching entry.', '没有匹配的条目。')}</p>
    </section></main>`;
  }

  function renderMap() {
    const articles = wiki.articles.filter((article) => ['shelter-network', 'exploration-progression', 'cold-and-weather'].includes(article.slug));
    return `<main class="wrap"><section class="section">${sectionHead(t('Atlas', '地图集'), t('World reference', '世界资料'), t('Articles on shelters, exploration, and weather.', '关于避难所、探索与天气的条目。'))}<div class="grid three">${articles.map(articleCard).join('')}</div></section></main>`;
  }

  function renderUpdates() {
    const entries = [
      ['2026.07.24', 'deepDive', 'The frozen-world deep dive', '冰封世界深度介绍', 'A look into The Shattering, cold zones, predators, and hostile factions.', '深入了解 The Shattering、冷区、掠食动物和敌对势力。'],
      ['2026.07.17', 'release', 'Early Access arrives 9 October 2026', '抢先体验将于 2026 年 10 月 9 日开启', 'Permafrost is scheduled to enter PC Early Access on 9 October 2026.', '《永冻纪元 - Permafrost》计划于 2026 年 10 月 9 日开启 PC 抢先体验。'],
      ['EARLY ACCESS', 'steam', 'Early Access plans', '抢先体验计划', 'The Steam page lists biomes, quests, mechanics, quality-of-life features, and technical optimisation as planned additions.', 'Steam 商店页将生物群系、任务、机制、体验优化和技术优化列为计划加入的内容。']
    ];
    return `<main class="wrap"><section class="section">${sectionHead(t('Announcements', '公告'), t('Official announcements', '官方公告'), t('Recent news and release information for Permafrost.', '《永冻纪元 - Permafrost》的近期新闻与发售信息。'))}<div class="grid three">${entries.map(([date, key, enTitle, zhTitle, enText, zhText]) => `<article class="card update"><time>${date}</time><h3>${t(enTitle, zhTitle)}</h3><p>${t(enText, zhText)}</p><a href="${wiki.sources[key].url}" target="_blank" rel="noreferrer">${t('Read announcement', '阅读公告')}</a></article>`).join('')}</div></section></main>`;
  }

  function renderArticle() {
    const article = wiki.articles.find((item) => item.slug === articleSlug);
    if (!article) return `<main class="wrap"><section class="section"><h1>${t('Article not found', '未找到条目')}</h1></section></main>`;
    ensureVideoStyles();
    const articleSource = source(article);
    const related = wiki.articles.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 4);
    return `<main class="wrap"><div class="article-layout"><article class="article">
      <p class="eyebrow">${read(article, 'category')}</p><h1>${read(article, 'title')}</h1><p class="lead">${read(article, 'lead')}</p>
      <h2>${t('Overview', '概览')}</h2><ul class="fact-list">${(isZh() ? article.factsZh : article.facts).map((fact) => `<li>${fact}</li>`).join('')}</ul>
      ${(article.videos || []).map(videoSection).join('')}
      <div class="source-box"><p class="eyebrow">${t('Source', '来源')}</p><p><a href="${articleSource.url}" target="_blank" rel="noreferrer">${t(articleSource.label, articleSource.zh)}</a></p></div>
    </article><aside class="aside"><h3>${t('Related reading', '相关阅读')}</h3><ul class="side-list">${related.map((item) => `<li><a href="${route(item.slug)}">${read(item, 'title')}</a></li>`).join('')}</ul><a href="/library/">${t('Browse library', '浏览资料库')}</a></aside></div></main>`;
  }

  function wireLibrary() {
    const grid = document.querySelector('#article-grid');
    if (!grid) return;
    const search = document.querySelector('#library-search');
    const filters = document.querySelector('#category-filters');
    const empty = document.querySelector('#empty-state');
    let active = 'all';
    const categories = ['all', ...new Set(wiki.articles.map((article) => article.category))];
    filters.innerHTML = categories.map((category) => `<button class="filter ${category === 'all' ? 'active' : ''}" data-category="${category}">${category === 'all' ? t('All topics', '全部主题') : t(category[0].toUpperCase() + category.slice(1), wiki.articles.find((article) => article.category === category).categoryZh)}</button>`).join('');
    const update = () => {
      const query = search.value.trim().toLowerCase();
      const matches = wiki.articles.filter((article) => (active === 'all' || article.category === active) && `${article.title} ${article.titleZh} ${article.lead} ${article.leadZh}`.toLowerCase().includes(query));
      grid.innerHTML = matches.map(articleCard).join('');
      empty.classList.toggle('show', matches.length === 0);
    };
    filters.addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      active = button.dataset.category;
      filters.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      update();
    });
    search.addEventListener('input', update);
    update();
    const context = document.modelContext;
    if (context?.registerTool) {
      try {
        void Promise.resolve(context.registerTool({
          name: 'search_permafrost_wiki', title: 'Search Permafrost Wiki',
          description: 'Filters the visible Permafrost article library by a topic keyword.',
          inputSchema: { type: 'object', properties: { query: { type: 'string', minLength: 1 } }, required: ['query'], additionalProperties: false },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          execute(input) {
            if (!input || typeof input.query !== 'string' || !input.query.trim()) throw new Error('query must be non-empty');
            active = 'all'; search.value = input.query.trim();
            filters.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item.dataset.category === 'all'));
            update();
            return { query: search.value, result_count: grid.querySelectorAll('.card').length };
          }
        })).catch(() => {});
      } catch (_) {}
    }
  }

  function render() {
    document.documentElement.lang = locale;
    ensureFieldScaleStyles();
    renderHeader(); renderFooter();
    const app = document.querySelector('#app');
    app.innerHTML = page === 'home' ? renderHome() : page === 'guides' ? renderGuides() : page === 'world' ? renderWorld() : page === 'library' ? renderLibrary() : page === 'map' ? renderMap() : page === 'updates' ? renderUpdates() : page === 'article' ? renderArticle() : renderHome();
    wireLibrary();
  }

  render();
})();
