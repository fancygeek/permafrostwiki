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

## Resources
- First-party release announcement: https://www.toplitz-productions.com/news-2388/release-date-for-the-frozen-apocalypse-is-moved-to-october-9-2026.html?page_n167=2
- First-party Gamescom trailer announcement: https://www.toplitz-productions.com/news-2388/permafrost-unleashes-the-frozen-apocalypse-in-new-gamescom-trailer.html?page_n167=11
- Steam store: https://store.steampowered.com/app/2254990/Permafrost/

## Multilingual Wiki Scope
- The expanded static Site has six primary pages (Home, Survival, World & Story, Library, Map, Updates) plus twelve article routes.
- All twelve articles are sourced only from the Steam page, the official release-date announcement, or the official deep-dive announcement.
- English is the default document language. The language control switches the same verified entry text to Chinese and saves only the reader’s local language preference.
- The map remains explicitly schematic and coordinate-free; the expedition planner uses only high-level official systems, never unreleased item values or recipes.
