(() => {
  const wiki = window.PERMAFROST_WIKI;
  if (!wiki) return;

  window.PERMAFROST_TEMPLATE = {
    sources: wiki.sources,
    articles: wiki.articles,
    blogPosts: wiki.blogPosts,
    news: [
      {
        date: '2026-07-24', type: 'world', source: 'deepDive',
        title: 'The frozen-world deep dive', titleZh: '冰封世界深度介绍',
        summary: 'A closer look at The Shattering, cold zones, predators, and hostile factions.',
        summaryZh: '深入了解 The Shattering、冷区、掠食动物和敌对势力。',
        tags: ['World', 'Story'], tagsZh: ['世界', '剧情']
      },
      {
        date: '2026-07-17', type: 'release', source: 'release',
        title: 'Early Access arrives 9 October 2026', titleZh: '抢先体验将于 2026 年 10 月 9 日开启',
        summary: 'Permafrost is scheduled to enter PC Early Access on Steam, GOG.com, and the Epic Games Store.',
        summaryZh: '《永冻纪元 - Permafrost》计划在 Steam、GOG.com 和 Epic Games Store 开启 PC 抢先体验。',
        tags: ['Release', 'Early Access'], tagsZh: ['发售', '抢先体验']
      }
    ]
  };
})();
