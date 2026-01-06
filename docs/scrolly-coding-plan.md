# Scrolly Coding Plan (Index)

## Purpose
- Single source of truth for the scrollycoding system in the blog.
- Split into phase docs for deep planning without implementation.

## Decisions Locked In
- Scope: blog-only.
- Authoring: typed steps array (no inline step children).
- Code animation: Shiki Magic Move with precompiled tokens (server-side compile).
- Theme pair: `vitesse-light` and `vitesse-dark`.
- Filename badge: shown by default.
- Debug shortcuts: excluded.
- Mobile: static, single-column fallback (no sticky stage).
- Notch: default v1 is a clean rectangle; notch can be added later as an optional variant.

## Document Map
- `docs/scrolly-coding-plan/phase-0-reference-and-visual.md`
- `docs/scrolly-coding-plan/phase-1-typed-steps-api.md`
- `docs/scrolly-coding-plan/phase-2-shiki-magic-move-pipeline.md`
- `docs/scrolly-coding-plan/phase-3-scrolly-layout-engine.md`
- `docs/scrolly-coding-plan/phase-4-stage-ui-magic-move.md`
- `docs/scrolly-coding-plan/phase-5-motion-choreography.md`
- `docs/scrolly-coding-plan/phase-6-blog-integration-toc.md`
- `docs/scrolly-coding-plan/phase-7-mobile-fallback-performance.md`
- `docs/scrolly-coding-plan/phase-8-qa-accessibility-authoring.md`
- `docs/scrolly-coding-plan/llm-authoring-guide.md`

## Phase Snapshot
- Phase 0: Visual language and interaction mapping from references.
- Phase 1: Typed steps API, file layout, and authoring rules.
- Phase 2: Shiki Magic Move precompile pipeline and theming.
- Phase 3: Scrolly layout, sticky stage, and activation logic.
- Phase 4: Stage UI, filename badge, and code focus treatment.
- Phase 5: Motion choreography and scroll interpolation rules.
- Phase 6: Blog integration, frontmatter flag, and TOC strategy.
- Phase 7: Mobile static fallback and performance guards.
- Phase 8: QA checklist, accessibility, and authoring documentation.

## Shared Conventions
- Steps are authored in `content/blog/<slug>.scrolly.tsx`.
- Steps are passed to a server-side compiler, then to a client renderer.
- Default theme pair is `vitesse-light` and `vitesse-dark`.
- Filename badge is always visible. If `file` is missing, derive `snippet.<ext>` from `lang`.
- No client-side Shiki highlighter instantiation.
- Reduced motion disables scroll interpolation and Magic Move animation.

## Resource List

### External
- https://devouringdetails.com/prototypes/nextjs-dev-tools
  - Scrollytelling flow, notch strategy, scroll fading, and focus ring behavior.
- https://codehike.org/docs/layouts/scrollycoding
  - Two-column scrolly layout and sticky code stage model.
- https://shiki-magic-move.netlify.app/
  - Magic Move behavior and animation controls.
- https://github.com/shikijs/shiki-magic-move
  - React API and precompiled token workflow.

### Internal
- `CLAUDE.md`
  - Project stack, animation conventions, and server/client separation.
- `package.json`
  - Confirms Motion and existing dependencies.
- `source.config.ts`
  - Current code theme pair for Shiki (`vitesse-light`, `vitesse-dark`).
- `lib/custom-components.tsx`
  - MDX component registry for blog rendering.
- `app/blog/[slug]/page.tsx`
  - Blog layout and current TOC injection points.
- `components/ui/blog/RulerTOC.tsx`
  - Existing desktop TOC to disable for scrolly posts.
- `components/ui/blog/MobileFloatingTOC.tsx`
  - Existing mobile TOC to disable for scrolly posts.
- `lib/motion-variants.ts`
  - Existing motion presets and reduced-motion utilities.
