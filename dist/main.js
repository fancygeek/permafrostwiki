(() => {
  'use strict';

  const D = window.PERMAFROST_TEMPLATE;
  if (!D) return;

  const LOCALE_KEY = 'permafrost-template-locale';
  const THEME_KEY = 'permafrost-template-theme';
  const page = document.body.dataset.page || 'home';
  let locale = (() => {
    try { return localStorage.getItem(LOCALE_KEY) === 'zh' ? 'zh' : 'en'; }
    catch (_) { return 'en'; }
  })();

  const isZh = () => locale === 'zh';
  const t = (en, zh) => isZh() ? zh : en;
  const read = (item, key) => isZh() ? item[`${key}Zh`] : item[key];
  const sourceFor = (key) => D.sources[key];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
  }

  function html(selector, markup) {
    const node = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (node) node.innerHTML = markup;
  }

  function articleCard(article) {
    const source = sourceFor(article.source);
    const facts = isZh() ? article.factsZh : article.facts;
    return `<article class="database-entity" data-category="${esc(article.category)}">
      <div class="database-entity-head"><div class="database-entity-portrait" aria-hidden="true">${esc(read(article, 'title').slice(0, 1))}</div>
        <div><h3><a href="articles/${esc(article.slug)}.html">${esc(read(article, 'title'))}</a></h3><div class="database-badges"><span class="database-rarity">${esc(read(article, 'category'))}</span></div></div>
      </div>
      <p>${esc(read(article, 'lead'))}</p>
      <ul class="signal-list">${facts.map((fact) => `<li>${esc(fact)}</li>`).join('')}</ul>
      <p class="database-source"><a href="articles/${esc(article.slug)}.html">${esc(t('Read guide', '阅读指南'))}</a><span aria-hidden="true"> · </span><a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(t(source.label, source.zh))}</a></p>
    </article>`;
  }

  function guideVideo(video) {
    const title = read(video, 'title');
    const description = read(video, 'description');
    return `<section class="guide-video"><div class="guide-video-copy"><p class="eyebrow">${esc(t('Official video', '官方视频'))}</p><h3>${esc(title)}</h3><p>${esc(description)}</p></div><div class="guide-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${esc(video.id)}?rel=0" title="${esc(title)}" loading="lazy" referrerpolicy="origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></section>`;
  }

  function sourceList() {
    return Object.values(D.sources).map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(t(source.label, source.zh))}</a></li>`).join('');
  }

  function sectionHead(eyebrow, title, copy) {
    return `<div class="section-heading"><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2><p>${esc(copy)}</p></div>`;
  }

  function pageHead(eyebrow, title, copy) {
    return `<div class="database-masthead-shade"></div><div class="container database-masthead-copy"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p>${esc(copy)}</p></div>`;
  }

  function initTheme() {
    let theme = 'dark';
    try { theme = localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch (_) {}
    const apply = () => {
      document.documentElement.dataset.theme = theme;
      document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.textContent = theme === 'dark' ? '◑' : '◐';
        button.setAttribute('aria-label', t(theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'));
      });
    };
    apply();
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => button.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
      apply();
    }));
  }

  function initChrome() {
    document.documentElement.lang = isZh() ? 'zh-CN' : 'en';
    const nav = [
      ['home', 'index.html', 'Home', '首页'],
      ['news', 'news.html', 'News', '公告'],
      ['guides', 'guides.html', 'Survival', '生存'],
      ['database', 'database.html', 'Library', '资料库'],
      ['patch', 'patch.html', 'Release', '发售'],
      ['about', 'about.html', 'About', '关于'],
      ['steam', 'https://store.steampowered.com/app/2254990/Permafrost/', 'Steam Store', 'Steam 商店', true]
    ];
    html('[data-brand]', `<span class="brand-mark" aria-hidden="true">P</span><span><strong>PERMAFROST</strong><small>${t('GAME WIKI', '游戏 Wiki')}</small></span>`);
    html('[data-nav]', nav.map(([id, href, en, zh, external]) => `<a href="${href}"${external ? ' target="_blank" rel="noreferrer"' : ''}${id === page ? ' data-active="true" aria-current="page"' : ''}>${t(en, zh)}</a>`).join(''));
    html('[data-lang]', `<option value="en"${isZh() ? '' : ' selected'}>English</option><option value="zh"${isZh() ? ' selected' : ''}>中文</option>`);
    const language = document.querySelector('[data-lang]');
    if (language) language.addEventListener('change', () => {
      locale = language.value === 'zh' ? 'zh' : 'en';
      try { localStorage.setItem(LOCALE_KEY, locale); } catch (_) {}
      window.location.reload();
    });
    html('[data-footer]', `<div><strong>PERMAFROST WIKI</strong><p>${t('Unofficial community reference for Permafrost.', '《永冻纪元 - Permafrost》非官方社区资料站。')}</p></div><nav aria-label="${t('Footer navigation', '页脚导航')}"><a href="https://store.steampowered.com/app/2254990/Permafrost/" target="_blank" rel="noreferrer">${t('Steam Store', 'Steam 商店')}</a><a href="about.html#sources">${t('Sources', '来源')}</a><a href="about.html#disclaimer">${t('Disclaimer', '免责声明')}</a></nav>`);

    const toggle = document.querySelector('[data-nav-toggle]');
    if (toggle) toggle.textContent = t('Menu', '菜单');
    const navHost = document.querySelector('[data-nav]');
    if (toggle && navHost) toggle.addEventListener('click', () => {
      const open = navHost.dataset.open === 'true';
      navHost.dataset.open = open ? 'false' : 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    const top = document.querySelector('[data-back-to-top]');
    if (top) {
      top.textContent = t('↑ Top', '↑ 顶部');
      top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      const onScroll = () => { top.dataset.visible = window.scrollY > 600 ? 'true' : 'false'; };
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }

  function initToc() {
    const toc = document.querySelector('[data-toc]');
    const sections = [...document.querySelectorAll('.content-section[id]')];
    if (!toc || !sections.length) return;
    const panel = toc.querySelector('.toc-panel');
    html(panel, `<strong>${t('On this page', '本页目录')}</strong>${sections.map((section) => `<a href="#${esc(section.id)}">${esc(section.querySelector('h2')?.textContent || section.id)}</a>`).join('')}`);
    const toggle = toc.querySelector('.toc-toggle');
    if (toggle) {
      toggle.textContent = t('Contents', '目录');
      toggle.addEventListener('click', () => {
        const open = toc.dataset.open === 'true'; toc.dataset.open = open ? 'false' : 'true';
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    }
  }

  function renderHome() {
    html('[data-hero]', `<p class="eyebrow">PERMAFROST WIKI</p><h1>${t('Permafrost Wiki', '《永冻纪元 - Permafrost》游戏 Wiki')}</h1><p class="hero-intro">${t('Explore the Permafrost Wiki for game information, story, survival systems, and official announcements. Start with the Permafrost Guide for cold, shelter, tools, and co-op.', '浏览《永冻纪元 - Permafrost》游戏 Wiki，查看游戏资料、剧情、生存系统与官方公告；生存指南涵盖严寒、避难所、工具与合作玩法。')}</p><div class="hero-actions"><a class="button primary" href="database.html">${t('Browse the Permafrost Wiki', '浏览 Wiki 资料库')}</a><a class="button secondary" href="news.html">${t('Official news', '官方公告')}</a></div><div class="hero-facts"><span>${t('PC Early Access · 9 October 2026', 'PC 抢先体验 · 2026 年 10 月 9 日')}</span><span>${t('1–4 player co-op', '1–4 人合作')}</span><span>Steam</span></div>`);
    html('[data-status]', `<div class="status-copy"><p class="eyebrow">${t('Release', '发售')}</p><h2>${t('PC Early Access · 9 October 2026', 'PC 抢先体验 · 2026 年 10 月 9 日')}</h2><p>${t('Steam, GOG.com, and the Epic Games Store are named as PC storefronts.', 'Steam、GOG.com 和 Epic Games Store 被列为 PC 平台。')}</p></div><div class="status-pills"><a class="pill link" href="patch.html">${t('Release details', '发售信息')}</a></div>`);
    const facts = [
      [t('Game', '游戏'), 'Permafrost', t('Story-driven survival sandbox', '剧情驱动的生存沙盒')],
      [t('Release', '发售'), '9 Oct 2026', t('PC Early Access', 'PC 抢先体验')],
      [t('Mode', '模式'), '1–4', t('Solo or online co-op', '单人或在线合作')],
      [t('World', '世界'), t('The Shattering', 'The Shattering'), t('A frozen post-apocalyptic world', '冰封末日世界')]
    ];
    const routes = [
      ['Survival', '生存', 'Permafrost Guide: Survival', 'Permafrost 生存指南', 'Use the Permafrost Guide for cold, shelters, exploration, companions, and co-op.', '使用 Permafrost 生存指南查看严寒、避难所、探索、伙伴与合作玩法。', 'guides.html'],
      ['World', '世界', 'Article library', '资料库', 'Browse all current Permafrost articles.', '浏览当前《永冻纪元 - Permafrost》资料条目。', 'database.html'],
      ['Release', '发售', 'Release information', '发售信息', 'Early Access timing and planned scope.', '抢先体验时间与计划内容。', 'patch.html']
    ];
    const featured = D.articles.filter((article) => ['early-access-release', 'rook-and-signal', 'cold-and-weather', 'shelter-network'].includes(article.slug));
    html('[data-home-content]', `<section class="content-section" id="glance">${sectionHead(t('About this Wiki', 'Wiki 概览'), t('Permafrost Wiki at a glance', '《永冻纪元 - Permafrost》Wiki 概览'), t('The Permafrost Wiki is a community reference for game systems, story, survival, and official updates.', '《永冻纪元 - Permafrost》Wiki 是涵盖游戏系统、剧情、生存内容与官方动态的社区资料库。'))}<div class="fact-grid">${facts.map(([label, value, note]) => `<div class="fact-card"><span>${esc(label)}</span><strong>${esc(value)}</strong><p>${esc(note)}</p></div>`).join('')}</div></section><section class="content-section" id="routes">${sectionHead(t('Sections', '分区'), t('Browse the Permafrost Wiki', '浏览 Permafrost Wiki'), t('Choose a Permafrost Wiki topic or start with the Permafrost Guide.', '选择 Permafrost Wiki 主题，或从生存指南开始浏览。'))}<div class="guide-link-grid">${routes.map(([eyebrowEn, eyebrowZh, titleEn, titleZh, bodyEn, bodyZh, href]) => `<a href="${href}"><span>${esc(t(eyebrowEn, eyebrowZh))}</span><strong>${esc(t(titleEn, titleZh))}</strong><p>${esc(t(bodyEn, bodyZh))}</p></a>`).join('')}</div></section><section class="content-section" id="latest">${sectionHead(t('Featured', '精选'), t('Featured Permafrost Guides', '精选 Permafrost 指南'), t('A selection of current Permafrost Wiki entries.', '当前 Permafrost Wiki 条目精选。'))}<div class="database-grid">${featured.map(articleCard).join('')}</div></section><section class="content-section" id="news">${sectionHead(t('News', '公告'), t('Official announcements', '官方公告'), t('Recent Permafrost release and world updates.', '近期《永冻纪元 - Permafrost》发售与世界动态。'))}<div class="news-stack">${D.news.map(newsCard).join('')}</div></section>`);
  }

  function newsCard(item) {
    const source = sourceFor(item.source);
    return `<article class="news-card" data-news-type="${esc(item.type)}" data-search="${esc(`${item.title} ${item.titleZh} ${item.summary} ${item.summaryZh}`.toLowerCase())}"><p class="news-date">${esc(item.date.slice(5))}<small>${esc(item.date.slice(0, 4))}</small></p><div class="news-body"><h3><a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(read(item, 'title'))}</a></h3><p>${esc(read(item, 'summary'))}</p><div class="news-tags">${(isZh() ? item.tagsZh : item.tags).map((tag) => `<span>${esc(tag)}</span>`).join('')}</div></div></article>`;
  }

  function renderNews() {
    html('[data-page-heading]', pageHead(t('News', '公告'), t('Official announcements', '官方公告'), t('Release information and official Permafrost updates.', '《永冻纪元 - Permafrost》的发售信息与官方动态。')));
    html('[data-news-page]', `<section class="content-section" id="feed">${sectionHead(t('Announcements', '公告'), t('All announcements', '全部公告'), t('Filter the current announcement list or search by keyword.', '筛选当前公告列表，或按关键词搜索。'))}<div class="list-toolbar"><div class="database-controls"><label><span>${t('Search', '搜索')}</span><input type="search" data-news-search placeholder="${t('Title or tag', '标题或标签')}" /></label><output data-news-count aria-live="polite"></output></div><div class="filter-tabs" data-news-tabs role="group" aria-label="${t('News filter', '公告筛选')}"></div></div><div class="news-stack" data-news-list></div><p class="database-empty" data-news-empty hidden>${t('No matching announcement.', '没有匹配的公告。')}</p></section>`);
    const categories = [['all', t('All', '全部')], ['release', t('Release', '发售')], ['world', t('World', '世界')]];
    html('[data-news-tabs]', categories.map(([id, label], index) => `<button type="button" data-news-category="${id}"${index === 0 ? ' data-active="true"' : ''}>${label}</button>`).join(''));
    html('[data-news-list]', D.news.map(newsCard).join(''));
    const list = document.querySelector('[data-news-list]');
    const count = document.querySelector('[data-news-count]');
    const input = document.querySelector('[data-news-search]');
    let category = 'all';
    const apply = () => {
      const query = input?.value.trim().toLowerCase() || ''; let visible = 0;
      [...list.querySelectorAll('.news-card')].forEach((card) => {
        const match = (category === 'all' || card.dataset.newsType === category) && (!query || card.dataset.search.includes(query));
        card.hidden = !match; if (match) visible += 1;
      });
      if (count) count.textContent = `${visible}`;
      const empty = document.querySelector('[data-news-empty]'); if (empty) empty.hidden = visible !== 0;
    };
    document.querySelector('[data-news-tabs]')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-news-category]'); if (!button) return;
      category = button.dataset.newsCategory;
      document.querySelectorAll('[data-news-category]').forEach((item) => item.dataset.active = item === button ? 'true' : 'false'); apply();
    });
    input?.addEventListener('input', apply); apply();
  }

  function renderGuides() {
    html('[data-page-heading]', pageHead(t('Survival', '生存'), t('Permafrost Guide: Survival systems', '《永冻纪元 - Permafrost》生存指南'), t('Cold, shelters, exploration, companions, and co-op.', '严寒、避难所、探索、伙伴与合作。')));
    const groups = [
      ['getting-started', 'Survival', '生存', 'First steps', '入门指南', ['essential-tools', 'preparing-for-expedition', 'survival-basics']],
      ['cold', 'Survival', '生存', 'Cold and weather', '严寒与天气', ['cold-and-weather', 'survival-hazards']],
      ['shelters', 'Survival', '生存', 'Shelters and exploration', '避难所与探索', ['shelter-network', 'exploration-progression']],
      ['companions', 'Companions', '伙伴', 'Companions and co-op', '伙伴与合作', ['canine-companion', 'co-op-survival']]
    ];
    html('[data-guides]', groups.map(([id, eyebrowEn, eyebrowZh, titleEn, titleZh, slugs]) => {
      const entries = D.articles.filter((article) => slugs.includes(article.slug));
      const videos = entries.flatMap((article) => article.videos || []);
      return `<section class="content-section" id="${id}">${sectionHead(t(eyebrowEn, eyebrowZh), t(titleEn, titleZh), t('Watch the official videos and read the supporting Wiki entries.', '观看官方视频并阅读相应的 Wiki 条目。'))}${videos.length ? `<div class="guide-video-grid">${videos.map(guideVideo).join('')}</div>` : ''}<div class="database-grid">${entries.map(articleCard).join('')}</div></section>`;
    }).join(''));
  }

  function renderLibrary() {
    html('[data-page-heading]', pageHead(t('Library', '资料库'), t('Permafrost Wiki Library', '《永冻纪元 - Permafrost》资料库'), t('Search the current article collection by category or keyword.', '按分类或关键词搜索当前条目。')));
    const categories = [...new Set(D.articles.map((article) => article.category))];
    html('[data-library]', `<div class="database-tabs"><div class="container" data-library-tabs role="group" aria-label="${t('Category filter', '分类筛选')}"></div></div><article class="article container"><div class="database-stat-strip" data-library-stats></div><section class="content-section" id="entries"><div class="database-controls"><label><span>${t('Search', '搜索')}</span><input type="search" data-library-search placeholder="${t('Title, description, or topic', '标题、描述或主题')}" /></label><output data-library-count aria-live="polite"></output></div><div class="database-grid" data-library-grid></div><p class="database-empty" data-library-empty hidden>${t('No matching article.', '没有匹配的条目。')}</p></section></article>`);
    const labels = new Map(D.articles.map((article) => [article.category, read(article, 'category')]));
    html('[data-library-tabs]', [['all', t('All', '全部')], ...categories.map((category) => [category, labels.get(category)])].map(([id, label], index) => `<button type="button" data-library-category="${esc(id)}"${index === 0 ? ' data-active="true"' : ''}>${esc(label)}</button>`).join(''));
    const stats = [
      [String(D.articles.length), t('Articles', '条目')],
      [String(categories.length), t('Topics', '主题')],
      ['3', t('Official sources', '官方来源')]
    ];
    html('[data-library-stats]', stats.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join(''));
    const grid = document.querySelector('[data-library-grid]');
    const input = document.querySelector('[data-library-search]');
    const count = document.querySelector('[data-library-count]');
    let category = 'all';
    const render = () => {
      const query = input?.value.trim().toLowerCase() || '';
      const entries = D.articles.filter((article) => (category === 'all' || article.category === category) && (!query || `${article.title} ${article.titleZh} ${article.lead} ${article.leadZh}`.toLowerCase().includes(query)));
      html(grid, entries.map(articleCard).join(''));
      if (count) count.textContent = `${entries.length}`;
      const empty = document.querySelector('[data-library-empty]'); if (empty) empty.hidden = entries.length !== 0;
    };
    document.querySelector('[data-library-tabs]')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-library-category]'); if (!button) return;
      category = button.dataset.libraryCategory;
      document.querySelectorAll('[data-library-category]').forEach((item) => item.dataset.active = item === button ? 'true' : 'false'); render();
    });
    input?.addEventListener('input', render); render();
  }

  function renderRelease() {
    html('[data-page-heading]', pageHead(t('Release', '发售'), t('Early Access release', '抢先体验发售'), t('Release timing and published Early Access information.', '发售时间与已公布的抢先体验信息。')));
    const releaseArticles = D.articles.filter((article) => ['early-access-release', 'early-access-scope'].includes(article.slug));
    html('[data-release]', `<section class="content-section" id="release">${sectionHead(t('Release', '发售'), t('PC Early Access · 9 October 2026', 'PC 抢先体验 · 2026 年 10 月 9 日'), t('Permafrost is scheduled to enter PC Early Access on this date.', '《永冻纪元 - Permafrost》计划在这一日期开启 PC 抢先体验。'))}<div class="database-grid">${releaseArticles.map(articleCard).join('')}</div></section><section class="content-section" id="sources">${sectionHead(t('Links', '链接'), t('Official links', '官方链接'), t('Open the original announcements and Steam page.', '打开原始公告与 Steam 商店页。'))}<ul class="signal-list">${sourceList()}</ul></section>`);
  }

  function renderAbout() {
    html('[data-page-heading]', pageHead(t('About', '关于'), t('About this Wiki', '关于本站'), t('A community reference for Permafrost.', '《永冻纪元 - Permafrost》的社区资料站。')));
    html('[data-about]', `<section class="content-section" id="about">${sectionHead(t('About', '关于'), t('What this site contains', '本站内容'), t('Game information, story, survival systems, and official announcements.', '游戏资料、剧情、生存系统与官方公告。'))}<div class="table-wrap"><table><thead><tr><th>${t('Item', '项目')}</th><th>${t('Details', '内容')}</th></tr></thead><tbody><tr><td>${t('Game', '游戏')}</td><td>Permafrost</td></tr><tr><td>${t('Developer', '开发商')}</td><td>SpaceRocket Games</td></tr><tr><td>${t('Publisher', '发行商')}</td><td>Toplitz Productions</td></tr><tr><td>${t('Languages', '语言')}</td><td>English · 中文</td></tr></tbody></table></div></section><section class="content-section" id="sources">${sectionHead(t('Sources', '来源'), t('Official sources', '官方来源'), t('Every entry links to a Steam or Toplitz Productions source.', '每篇条目都链接至 Steam 或 Toplitz Productions 来源。'))}<ul class="signal-list">${sourceList()}</ul></section><section class="content-section" id="disclaimer">${sectionHead(t('Disclaimer', '免责声明'), t('Unofficial community site', '非官方社区站点'), t('Permafrost and related trademarks belong to their respective owners.', '《永冻纪元 - Permafrost》及相关商标归各自权利人所有。'))}</section>`);
  }

  function boot() {
    initChrome(); initTheme();
    if (page === 'home') renderHome();
    if (page === 'news') renderNews();
    if (page === 'guides') renderGuides();
    if (page === 'database') renderLibrary();
    if (page === 'patch') renderRelease();
    if (page === 'about') renderAbout();
    initToc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
