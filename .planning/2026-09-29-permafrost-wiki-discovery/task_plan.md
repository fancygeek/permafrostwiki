# Task Plan: Permafrost Wiki Discovery

## Goal
Produce a researched, implementation-ready information architecture for a community wiki about Permafrost, aligned to its announced Early Access scope and a future game-template site build.

## Current Phase
Phase 14

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Identify constraints
- [x] Document initial official-release findings in findings.md
- **Status:** complete

### Phase 2: Product & Content Research
- [x] Verify game details on first-party sources
- [x] Identify game systems and durable wiki data types
- [x] Document sources and content confidence
- **Status:** complete

### Phase 3: Wiki Information Architecture
- [x] Define launch navigation, page types, and utility tools
- [x] Separate confirmed pre-launch content from post-launch contributions
- **Status:** complete

### Phase 4: Build Handoff
- [x] Map IA to a static game-Wiki implementation because no separate template was present
- [x] Define implementation milestones and content-entry strategy in the rendered site
- **Status:** complete

### Phase 5: Delivery
- [x] Review implementation against first-party facts and pre-release confidence limits
- [x] Validate static site package and privately publish the first version
- **Status:** complete

### Phase 6: Verified Multilingual Wiki Expansion
- [x] Confirm English-first, Chinese-supplement language policy
- [x] Build multi-page navigation and 12 source-backed article routes
- [x] Add language switching with no invented gameplay data
- [x] Verify, republish, and hand off updated Site
- **Status:** complete

### Phase 7: Client-facing Content Review
- [x] Remove internal validation language from visitor-facing copy
- [x] Remove speculative map and planning UI
- [x] Retain only source-linked game information and normal Wiki navigation
- **Status:** complete

### Phase 8: Game Template Migration
- [x] Locate and inspect the supplied `gametemplate` repository
- [x] Rebuild the Wiki with the template's page structure and visual system
- [x] Map only existing Permafrost source-backed content into the template
- [x] Validate and privately republish the migrated Site
- **Status:** complete

### Phase 9: Ice Visual Refresh
- [x] Replace the game template's gold palette with a polar-night ice palette
- [x] Preserve the template's structure, controls, and existing Permafrost source-backed content
- [x] Verify dark and light visual themes locally
- [ ] Privately republish the visual refresh
- **Status:** in progress

### Phase 10: Site-wide Typography & Video Scale Audit
- [x] Inspect primary pages and article templates at desktop and mobile widths
- [x] Increase type scale and content width where the current template is too sparse
- [x] Resize and recompose guide-video modules for useful viewing size
- [ ] Verify dark/light themes, every page family, and publish the update
- **Status:** in progress

### Phase 11: Search-Engine Foundations
- [x] Add indexable, keyword-focused page titles and descriptions for `Permafrost Wiki` and `Permafrost Guide`
- [x] Add canonical URLs, social metadata, structured data, robots, and sitemap coverage
- [ ] Check every HTML route for SEO metadata and publish the update
- **Status:** in progress

### Phase 12: Recent Guide Blog Expansion
- [x] Map the October 1–8 YouTube guide topics onto existing Wiki chapters without duplicating established coverage
- [x] Add missing early-game, crafting, base-building, co-op, and playtest guide content with clearly attributed video sources
- [x] Add a Blog index and Blog item to both top-navigation systems
- [x] Extend metadata and sitemap generation for all new routes
- [x] Validate desktop/mobile rendering, bilingual navigation, links, embeds, and JavaScript syntax
- **Status:** complete

### Phase 13: GSC Keyword Landing-Page Optimization
- [x] Confirm the screenshot queries, impressions, and current target-page coverage
- [x] Strengthen homepage relevance for `permafrost game wiki` and `permafrost wiki`
- [x] Strengthen the co-op article for `permafrost coop` while keeping natural reader-facing language
- [x] Improve contextual internal links and WebSite structured-data naming
- [x] Regenerate and validate SEO metadata, static HTML, and representative rendered pages
- **Status:** complete

### Phase 14: Responsive Layout Re-audit
- [x] Review the reported Blog layout issue and identify the constraining layout family
- [x] Audit shared layout widths and responsive breakpoints across page families
- [x] Recompose Blog/list-page grid behavior for desktop, tablet, and mobile widths
- [x] Validate representative pages and controls at each target viewport
- **Status:** complete

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Treat October 9, 2026 as the Early Access date | The official Toplitz announcement shown in search results specifies PC Early Access on Steam, GOG, and EGS. |
| Keep unknown mechanics as proposed data structures, not asserted facts | The game is unreleased; durable wiki architecture must not invent launch content. |
| Make patch/version awareness foundational | Steam positions the game as Early Access for at least 12 months with material planned content additions. |
| Use a Chinese-first UI with canonical English terms beside it | Steam already supports Simplified Chinese UI/subtitles, but cross-language source matching will matter for new community research. |
| Use a dependency-free static Site for V1 | The workspace had no supplied template, while the first release needs an immediately usable single-page Wiki surface rather than persistence or sign-in. |
| Make the generated artwork atmosphere-only | The hero contains no game claims; all factual material remains sourced in text links and status-marked entries. |
| Default to English with an optional Chinese UI/content layer | User explicitly requested English as the primary language and Chinese as a multilingual supplement. |
| Restrict articles to twelve first-party-supported topics | This gives the Wiki durable launch structure without asserting unpublished mechanics, numbers, or map data. |
| Keep validation rules internal | The user’s no-invention requirement guides editing but is not content for visitors. |
| Use the supplied `gametemplate` repository for the next implementation | The original project instruction explicitly required the game template; it is available at the workspace's parent level. |

## Errors Encountered
| Error | Resolution |
|-------|------------|
| Combined multi-file patch used an invalid context | Re-read the individual planning files and apply narrowly targeted patches. |
| A stale browser tab was not available to the current session | Created a fresh local-preview tab for the required tool-capability check. |
| Existing-site workflow rejected an expired source credential | Minted a new credential for the same Site, then retried the opening workflow with approved network access. |
| Custom-domain deployment lagged behind the Site publication | The GitHub-connected Cloudflare Pages deployment needs the source branch pushed separately. |
| Initial Blog search predicate had one extra closing parenthesis | Rewrote the predicate as a block with an explicit searchable string before continuing validation. |
| Local preview server could not bind inside the restricted sandbox | Re-ran the same localhost-only preview with the approved server prefix. |
| Initial local HTTP loop used unavailable `curl` PATH resolution and zsh's read-only `status` name | Used `/usr/bin/curl`, renamed the variable to `http_code`, and ran the localhost-only check with approved access. |
| Phase 13 local preview server could not bind inside the restricted sandbox | Re-ran the localhost-only server with the already established approved `python3 -m http.server` scope. |
| Tried an unsupported `tab.getState()` method while re-reading the in-app preview | Used the documented global state inventory and then opened a dedicated hidden preview tab, which returned the page accessibility tree directly. |
| Existing local browser tab retained a stale CSS response after the stylesheet was edited | Opened the same localhost site under a fresh origin (`localhost` rather than `127.0.0.1`) for an uncached validation; deployment will receive the versioned published asset normally. |
| Attempted a line-level patch inside the minified Field Wiki stylesheet | The one-line source could not provide stable patch context, so added the targeted responsive ordering override through the existing Field Wiki runtime stylesheet instead. |
