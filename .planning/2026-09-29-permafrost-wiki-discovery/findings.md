# Findings & Decisions

## Requirements
- User wants a Permafrost wiki utility site built from an unspecified “game template”; first deliverable is a researched brainstorm of modules and content.
- The repository is empty except for Git metadata, so the referenced template is not currently available locally.
- Audience is likely Chinese-speaking players, while the game’s first-party materials are English; plan for Chinese UI plus source-linked terminology.
- User now explicitly requests English as the default reading language, with Chinese as a multi-language supplement.
- The requested template is available locally at `/Users/kaibin.li/project/gametemplate`. It is a zero-dependency, multi-page game-news/Wiki static template with home, news, guides, database, map, patch, calculator, and about pages.

## Research Findings
- Official Toplitz result: *Release Date For Permafrost Moved to October 9, 2026* says the game enters PC Early Access on Steam, GOG.com, and Epic Games Store on 2026-10-09.
- Search result and official game overview identify developer SpaceRocket Games and publisher Toplitz Productions.
- Public positioning: story-driven open-world survival sandbox; solo or online co-op for up to four players.
- Confirmed/promoted system themes to shape the encyclopedia: sub-zero weather, frostbite and storms; small outposts/shelters; scavenging, crafting, wildlife and hostile factions; a canine companion.
- All detailed values (recipes, map points, equipment stats, quest stages, hostility rules) need post-release verification rather than pre-release publication.
- Steam app ID is 2254990; its Simplified Chinese title is “永冻纪元 - Permafrost.” The store supports Simplified Chinese UI and subtitles, which supports a Chinese-first wiki.
- Steam confirms single-player, online co-op, achievements and Family Sharing. It also publishes initial PC requirements (Windows 10 x64; 16 GB RAM; 30 GB storage; DirectX 12).
- Narrative framing: the player is a rebuild-capable engineer called “Rook,” following a radio signal from a long-lost friend after disasters and a shattered moon lead to a permanent winter.
- Early Access positioning: at least 12 months; developers intend to add biomes, quests, mechanics, quality-of-life features and optimization. Early Access is advertised with various biomes, hundreds of items, building blueprints/recipes, narrative starting content and side quests, and 1–4-player co-op.
- The early-access scope makes version labels, verified-at dates, changelog links and “changed in patch” annotations core wiki features, not secondary polish.
- Further first-party deep-dive: the world begins after “The Shattering,” which destroyed the moon in orbit. It names cold zones that can kill an unprepared player in minutes, predators, and hostile factions in human enclaves. This supports dedicated pages for hazards/weather, fauna, factions, and regions/cold zones, while their exact in-game lists await release.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| V1 landing navigation: 开始生存 / 世界与剧情 / 图鉴资料库 / 互动工具 / 更新与社区 | Matches the confirmed play loop while keeping an encyclopedia and utility core rather than a generic fan-news site. |
| Every data entry owns a source, game version and last-verified date | Values will shift through Early Access; this lets community updates remain trustworthy. |
| Launch the map as an annotation layer, not a fictional complete map | Actual map layout and coordinates require verified player evidence. |
| Ship an interactive local-state prototype before game launch | Search, category filters, map layers and expedition planning are useful without inventing unreleased game values. |
| Register WebMCP interfaces defensively | The page exposes search and expedition-plan actions when supported; the current preview browser does not expose document.modelContext, so runtime contract validation is unavailable. |
| Present article facts in English first, then Chinese through the language switch | Preserves the original source language as the primary reading experience while keeping a Chinese community entry point. |
| Migrate the published Wiki to the supplied template instead of continuing the earlier custom static layout | This corrects the earlier missed template discovery and preserves the requested implementation base. |
| Use a polar-night ice palette for the template-derived Wiki | The user requested the earlier ice/snow direction rather than the template's gold visual; the refresh preserves the template layout and all existing content. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Current local preview browser does not expose WebMCP | Left feature-detected registration in place; recorded validation gap because WebMCP was not user-requested. |

## 2026-09-30 Layout Audit Findings

- The user-facing `guides#cold` page uses the game-template layout. At desktop width its reading column is much narrower than the viewport, causing three embedded videos to appear as small two-column cards.
- The narrow source of truth is the shared layout token (`--content`, currently 920px) and the Guide-video grid (`repeat(2, minmax(0, 1fr))`).
- The Guide page has a legacy and a field-Wiki route, so responsive changes must preserve both `styles.css` and `assets/wiki.css` families.
- Screenshot review shows the current 16px-ish video description and two-up 296px player cards do not meet the user's requested content scale. The next implementation will use larger single-column players for Guide sections and raise reading/heading scales across all page templates.
- Current source confirms the game-template family uses a 1120px base container, but ordinary article shells cap their actual reading width at 72ch. Guide cards inherit that cap, then split again in a two-column grid. The fix should widen normal prose moderately while exempting the Guide page from the article cap so official player embeds can use the main content column.
- The Field Wiki family has independent styling: a 16px body, 780px article cap, and injected two-column official-video component. Its video component also needs to stack title/copy above a full-width player so article pages are not left behind.
- Accessibility checks on the updated Guide page show all visible video modules as nested YouTube player frames with in-page play controls. The article-family player is now eager-loaded (there is at most one per article) so its direct-player frame is prepared without relying on a later scroll event.
- Computed-layout QA confirms the responsive template player is 597×336px at a narrow 646px viewport, while the Field Wiki article player is 817×460px at a 1280px desktop viewport. The two original small-card failure modes are therefore removed in both page families.

## 2026-09-30 SEO Findings

- The 27 static HTML routes have descriptions and titles but no canonical links, Open Graph/Twitter metadata, JSON-LD, `robots.txt`, or `sitemap.xml`.
- The durable target terms are `Permafrost Wiki` (site-wide) and `Permafrost Guide` (survival/guide routes). They will appear naturally in titles, descriptions, guide-page headings, and structured data—not through repetitive keyword copy.
- The canonical production origin is `https://permafrostwiki.com`; the private Sites URL must not be used as a canonical source.

## 2026-10-09 Recent Guide Blog Findings

- The current build is a generated static site with two compatible UI families: the template pages at the root of `dist/` and the Field Wiki routes under directories such as `guides/`, `library/`, and `articles/`.
- Existing Wiki entries already cover survival basics, essential tools, shelter networks, the dog companion, and co-op. New video-derived pages should link into those chapters rather than reproduce the same claims.
- There is no current Blog route or Blog item in the top navigation.
- The useful new keyword gaps are: first campfire and starter tools, day-one survival route, Horizon/Bone Cave/dog onboarding, crafting and blueprints, hunting/cooking/trading, practical base building, and playtest/early-access observations.
- YouTube research from 1–8 October 2026 identified recent, relevant sources from Toplitz Productions, Goldi An Drixta, KTS Gaming, TBF Gaming, Mr Meeko, Rhadamant, Vile Tactics, PhuzzyBond, and JaWoodle. Same-name results for unrelated games were excluded.
- The root template navigation is generated by `dist/main.js`; the Field Wiki/article navigation is generated independently by `dist/assets/site.js`. Blog must be added to both arrays to appear everywhere.
- A single canonical Blog URL can be served by `dist/blog.html`, while individual posts can live at `dist/blog/<slug>.html` and use the existing Field Wiki article shell and shared bilingual content data.
- The SEO generator derives routes from HTML files and already supports extensionless canonicals; it needs Blog-specific titles/descriptions and article breadcrumbs for the new post routes.
- Existing card, article, embedded-video, and responsive layout primitives are sufficient; no new visual system is required.
- Browser QA confirms the Blog index renders all eight posts, Blog is visible and active in the top navigation, filters are exposed, and both Chinese and English content switch correctly.
- English category labels need human-readable display names instead of raw slugs such as `getting-started` and `base-building`; this is a presentation-only fix before final QA.
- The category-label fix now renders `Getting started`, `Base building`, and the other English labels as reader-facing text while preserving stable slug values for filtering.
- The first-campfire post renders correctly in both English and Chinese, including its community-video attribution, embedded player, build-version caution, related Wiki chapters, and related Blog link.
- Existing Wiki entries now surface relevant recent Blog posts: the Essential Tools page shows the release-week roundup, campfire/tools guide, and crafting/hunting/trading route in its sidebar.
- The preview browser exposes a temporary viewport override, so final responsive QA can use a real narrow viewport and then reset it.
- At a 390×844 viewport the Blog index collapses to a one-column feed, exposes the mobile Menu button, keeps all filters readable, and uses the corrected English category labels.
- The release-week roundup also renders correctly at the same mobile size with three stacked embedded videos, the build warning, and all related Wiki links. The viewport override was reset after testing.
- The live Blog search works: entering `campfire` changes the visible count from eight to one and leaves only the “First campfire and starter tools” post.
- The final Blog feed is sorted newest-first: 9 October roundup, 8 October base building, 7 October dog/Bone Cave, 5 October walkthroughs, 3 October campfire/tools, and 2 October starter/co-op posts.

## 2026-10-09 GSC Keyword Optimization Findings

- The supplied Google Search Console screenshot shows three early queries: `permafrost game wiki` (7 impressions, 0 clicks), `permafrost wiki` (6 impressions, 0 clicks), and `permafrost coop` (1 impression, 0 clicks).
- Query intent maps cleanly to two existing destinations: the homepage for both Wiki queries and `/articles/co-op-survival` for the coop query. No new thin landing page is needed.
- No `.seo-cache/` directory is present, so this phase uses fresh local source and generated-output analysis.
- The homepage already targets `Permafrost Wiki`, but `Permafrost Game Wiki` is absent as a prominent exact phrase. The co-op page uses the standard spelling `co-op`; adding the unhyphenated search variant once in natural explanatory copy will cover `coop` without degrading readability.
- The working tree already contains the completed, uncommitted Blog expansion. Phase 13 must preserve those files and extend the current SEO generator rather than regenerate from an older baseline.
- The homepage exists in both the root-template renderer (`dist/main.js`) and the Field Wiki renderer (`dist/assets/site.js`), while the generator supplies crawler-visible fallback markup for `/`. All three must use aligned language so the rendered UI and raw HTML send the same intent signal.
- The co-op destination already has a clean canonical (`/articles/co-op-survival`), Article schema, and a source-backed bilingual content record in `dist/assets/content.js`. Its title and description are close to the target, but the current H1 is generic (`1-4 player co-op survival`) and the exact unhyphenated query variant does not appear in visible copy.
- The SEO generator centralizes homepage and co-op titles/descriptions plus WebSite schema, making it the durable place to add `Permafrost Game Wiki` as a site alternate name and to improve crawler-visible fallback content and anchor text.
- Browser validation shows the homepage now renders the new title, `Permafrost Game Wiki` H1, distinct `Permafrost Wiki` library link, direct `Permafrost co-op guide` CTA, and a featured co-op card in the actual JavaScript UI.
- The co-op article renders a single `Permafrost co-op guide` H1, the exact `Permafrost coop` phrase once in its lead, 1–4 player detail, the official developer Q&A embed, source attribution, and a related recent co-op Blog link.

## 2026-10-09 Responsive Re-audit Findings

- The supplied desktop screenshot shows the Blog index at a large viewport with its search/filter controls and two-column card grid constrained to roughly half the usable page width, leaving an unintentional empty right region.
- The issue is a desktop composition defect, not intentional reading-column whitespace: Blog is a discovery/list page and should use the template's wide content area, while prose articles can retain a narrower reading measure.
- The next audit must cover both UI families, but the reported screen is the root-template Blog renderer in `dist/main.js` and its shared rules in `dist/styles.css`.
- Root cause confirmed: desktop `.content-shell.no-toc` correctly expands to `var(--container)`, but its child `.article.container` remains capped at `78ch`. Only Home and Guides explicitly remove that cap, so Blog (and likely the root Library) collapses into a narrow left column even though it contains a multi-card discovery grid.
- The responsive grid itself already switches from two columns to one at 600px. The needed fix is a semantic width policy: full-width discovery pages on desktop and tablet, with prose-oriented article pages left constrained for readability.
- Live desktop measurement at 1280px confirms the mismatch: the outer Blog shell is 1180px wide, while the article/grid is only 698px wide and begins at the shell's left edge. The two cards are therefore only 341px each, leaving approximately 482px of unused shell space to the right.
- The reported page is rendered by the root template. Its heading, control bar, eight cards, navigation, and theme control render correctly; only its available horizontal layout budget is being discarded.
- After the targeted CSS override, an uncached 1280px desktop preview measures the Blog shell, article region, and grid at the same 1180px width. The two card tracks are 582px each, so the empty right column in the report is removed.
- A stale in-app localhost tab initially retained the old CSS despite reload. A fresh `localhost` origin confirmed the new rule is parsed and active; this is a local preview cache artifact, not a style conflict in the source.
- Breakpoint measurements after the width fix: at 1024px the Blog article area is 977px with two 480px cards and the desktop navigation remains visible; at 768px it is 721px with two 353px cards and the compact Menu control replaces the full navigation; at 390px it is 343px with one card column and no document-level horizontal overflow.
- The mobile card layout is sound, but its category strip exposes a visible horizontal scrollbar. The filter control can wrap safely because it has only seven compact categories; the result count can also align to the right when it moves beneath the search field.
- The fresh mobile Blog preview now has wrapped, fully visible category controls, a right-aligned result count, one 343px card column, and no document overflow. At desktop, the same CSS remains a two-column full-width grid.
- Additional page-family checks: News now uses the full 1180px list width on desktop; Guides retains its intentional 220px desktop TOC plus 985px guide area; a Field Wiki article uses its intended 871px article plus 300px sidebar on desktop and collapses to one 347px column without overflow at 390px.
- The Field Wiki article mobile audit exposes a separate ordering defect: the responsive sidebar becomes the first grid item, showing related links before the article headline. Mobile reading order should keep the article first and place contextual links after it.
- The Field Wiki shared runtime styles now explicitly reset the mobile aside order. A fresh 390px preview confirms DOM/visual order is article first then sidebar, with no document-level horizontal overflow; the default browser viewport was reset after testing.

## 2026-10-09 Library Hierarchy Findings

- The root-template Library is rendered separately from Blog in `dist/main.js`. It places `data-library-tabs` in a standalone, sticky, full-width `.database-tabs` strip directly under the masthead; visually, this competes with the actual global header as a second navigation bar.
- Library also uses `.article.container`, which retains the `78ch` article-width cap. The earlier responsive fix correctly exempted Blog and News, but omitted `body[data-page="database"]`, leaving the Library cards and controls in a narrow left column.
- Library has three statistics, but its stat strip reserves five desktop tracks. Its desktop layout should use three equal tracks, while the cards should use the established two-up desktop/tablet and one-up mobile grid.
- Browser geometry then exposed a related scaffold mismatch: unlike Blog and News, `database.html` had no `.content-shell`, so an unconstrained Library article would stretch to the scrollable viewport edge. The final composition must reuse the standard no-TOC content shell for a centered 1180px discovery area.
- Desktop QA now measures one actual header navigation, no legacy category strip, one local filter group, a centered 1180px content shell, two 582px cards, and three equal stat tracks. At 768px the inherited two-column stat breakpoint left the third statistic alone on a partial second row; preserve three stat tracks through tablet and only stack them on mobile.

## 2026-10-09 Cross-page Audit Findings

- Root-template Home, News, Blog, Guides, Library, Release, and About pages now share standard page-shell scaffolds; Blog, News, and Library correctly use content-level search/filter controls rather than a second global navigation bar.
- The Release page was the remaining root-template width regression: it used a table-of-contents sidebar for just two sections while rendering a two-card discovery grid inside the `78ch` prose cap. At 1280px this yielded a 698px grid of 341px cards and an unused right region in the main column.
- Release is a short discovery/links page, not a long article. It should use the same centered no-TOC shell and full-width discovery policy as Blog and Library; the About page retains its TOC because it remains a reference page with prose/table content.
- Field Wiki routes use a separate header/layout system. Its Library filter is content-local and its card grids are already bound to the full `.wrap` width; articles use the narrower main column only with an accompanying related-reading aside.
- Desktop browser audit at 1280px confirms one global nav and no legacy category strip on every root-template route. Home, News, Blog, Library, and corrected Release use a centered 1180px discovery width; Guides intentionally retains a 220px TOC alongside a 985px guide area; About intentionally retains the narrower 698px reference column plus its TOC.
- Mobile audit at 390px confirms every root-template page uses the Menu control with only one global nav instance, all card/grid tracks are 343px wide, search filters wrap inside their content toolbars, and none overflow horizontally. The Field Wiki Library has one content-local filter group and a 347px single card column; a Field article keeps the article above its aside.

## 2026-10-09 Homepage and Blog Visual Findings

- Home renders `assets/permafrost-hero.png` beneath a two-layer dark/light-aware ice overlay. Blog and the other root discovery pages use `.database-masthead`, a separate solid three-stop gradient with no image or equivalent overlay depth.
- The inconsistency is structural rather than a theme-token issue: the masthead palette hard-codes colors that only loosely resemble Home's hero treatment. The correction should make the generic masthead use the same image, positioning, and polar-night overlay system, while preserving its shorter reading-page height.
- Dark-theme computed styles confirm the shared image (`permafrost-hero.png`), focal point (`center 30%`), and two overlay gradients now match Home exactly. The only remaining mismatch was Blog's muted-grey masthead description; it now uses the shared snow-white text token.
- Light-theme browser verification confirms both surfaces now share the same image, overlay gradients, and `rgb(16, 39, 52)` body-copy colour. In dark theme both use `rgb(238, 250, 255)`; the 390px Blog masthead preserves its 240px short format without horizontal overflow.

## 2026-10-09 Field Blog Detail Theme Findings

- The user-referenced URL (`/blog/release-week-guide-video-roundup`) belongs to the separate Field Wiki rendering family. It loads `assets/wiki.css`, whose root variables and header/body colors are dark-only, and it has no `data-theme` state.
- Root pages store the reader's theme under `permafrost-template-theme`. The relevant user session has selected its light value, but `assets/site.js` never reads that key; the detail page therefore falls back to its hard-coded black background.
- The durable correction is to make Field Wiki set the same document theme from the shared preference and add a light variable/header/form/hero override to its own stylesheet. This fixes every Field article and Blog post, not just the screenshot route.
- Browser proof for the supplied route: after Home selects light theme, the Field Blog detail receives `data-theme="light"`, a `rgb(237, 248, 251)` body background, `rgb(16, 39, 52)` body text, and `rgba(247, 252, 254, 0.9)` header background. Its theme style is present and the page has no horizontal overflow.
- A representative Field article shares the same light body/text palette; its injected video panel now resolves to the light shared panel variable. At 390px the referenced Blog detail has a 347px article, places its aside after the article, and does not overflow.

## Resources
- First-party release announcement: https://www.toplitz-productions.com/news-2388/release-date-for-the-frozen-apocalypse-is-moved-to-october-9-2026.html?page_n167=2
- First-party Gamescom trailer announcement: https://www.toplitz-productions.com/news-2388/permafrost-unleashes-the-frozen-apocalypse-in-new-gamescom-trailer.html?page_n167=11
- Steam store: https://store.steampowered.com/app/2254990/Permafrost/

## Multilingual Wiki Scope
- The expanded static Site has six primary pages (Home, Survival, World & Story, Library, Map, Updates) plus twelve article routes.
- All twelve articles are sourced only from the Steam page, the official release-date announcement, or the official deep-dive announcement.
- English is the default document language. The language control switches the same verified entry text to Chinese and saves only the reader’s local language preference.
- The map remains explicitly schematic and coordinate-free; the expedition planner uses only high-level official systems, never unreleased item values or recipes.
