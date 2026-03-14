# Task Plan: Rebuild Editable Project From `reference/` Artifact

## Goal
From the generated Next.js artifact under `reference/`, reconstruct a clean, editable Next.js codebase (TypeScript + Tailwind) that reproduces the site structure and key effects (hero, scroll-snap sections, project cards, group nav, circular text, split text, background).

## Phases
- [x] Phase 1: Inventory & extraction (data/assets/effects)
- [x] Phase 2: Scaffold editable Next.js app (deps/config/scripts)
- [x] Phase 3: Implement UI + interactions (components + data-driven rendering)
- [x] Phase 4: Validate locally (dev server) + document how to edit
- [ ] Phase 5: Fidelity polish (layout/animations/snap behavior)
- [x] Phase 6: Project structure normalization (folders/imports/docs)
- [x] Phase 7: Make common content configurable (site config + better README)

## Key Questions
1. Where is the canonical data source for projects/months in the artifact, and how do we export it into editable form?
2. Which effects are actually used (vs. dead CSS), and what minimal subset do we re-implement first?
3. What is the smallest clean component architecture that matches the artifact behavior without over-engineering?

## Decisions Made
- Build as Next.js App Router + TS + Tailwind (close to the original artifact stack).
- Prefer re-implementing behavior with clean code over copying minified bundle code.
- Keep `reference/` untouched; only add new editable source under repo root.

## Errors Encountered
- Tailwind v4 PostCSS plugin moved: installed `@tailwindcss/postcss` and updated `postcss.config.mjs`.
- `three` has no bundled TypeScript types: installed `@types/three`.
- `next build` failed with `ENOTEMPTY` due to Finder-created `.DS_Store` inside `.next/` (fixed by deleting those `.DS_Store` files).
- `next lint` subcommand is not present in Next.js 16.1.4 CLI; switched to `eslint` with `eslint-config-next` flat config.
- Tailwind v4 was missing theme/responsive output (no `sm:` / `lg:` variants, missing keyframes) because `app/globals.css` used the legacy `@tailwind base/components/utilities` directives. Fixed by switching to `@import "tailwindcss";` + explicit `@config` and adding `tailwind.config.js`.

## Status
**Currently in Phase 5** - Align remaining UI/details vs `reference/`（已补：`data/siteConfig.ts` 站点级配置 + Ending/Loading/Hero/Contact 文案可配置 + README 更详细；待继续：Hero 细节、项目描述位置、滚动磁吸细节与整体像素级对齐）.
