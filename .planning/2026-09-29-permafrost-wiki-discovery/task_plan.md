# Task Plan: Permafrost Wiki Discovery

## Goal
Produce a researched, implementation-ready information architecture for a community wiki about Permafrost, aligned to its announced Early Access scope and a future game-template site build.

## Current Phase
Phase 8

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
- [ ] Validate and privately republish the migrated Site
- **Status:** in_progress

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
