# Animation Improvements - Atomic Tasks

**Parent Plan:** `thoughts/shared/plans/2026-01-15-animation-improvements.md`
**Branch:** scrollyCoding
**Created:** 2026-01-16

## Task Order

Execute tasks in numerical order. Each task is atomic and independently testable.

### Phase 1: Spring Presets (Foundation)
- [01] Add spring presets to motion-variants.ts

### Phase 2: Canvas Stretch Animation
- [02] Update BlogWithCanvas width animation structure
- [03] Add content wrapper with delayed reveal

### Phase 3: Cross-Step File Tabs
- [04] Create GlobalFile interface and state
- [05] Implement globalFiles useMemo computation
- [06] Update tab UI for global files
- [07] Add CSS for disabled/unavailable tabs
- [08] Wire up activeFileName persistence

### Phase 4: TOC Ruler-to-Text Morph
- [09] Add TOC morph spring preset (verify from Task 01)
- [10] Refactor RulerTOC to unified LayoutGroup
- [11] Implement morphing content with layoutId

### Phase 5: Verification
- [12] Test reduced motion and build verification

## Motion MCP Research Applied

**Spring Visualizations Generated:**
- Canvas stretch (0.35s, bounce 0.06): Smooth expansion, minimal overshoot
- TOC morph (0.25s, bounce 0.1): Snappy with subtle bounce

**Motion Codex Patterns Used:**
- `motion://examples/react/layout-animation` - Layout prop with spring transition
- `motion://examples/react/shared-layout-animation` - layoutId for tab underline

## Vercel Best Practices Applied

- `rerender-memo` - Memoize globalFiles computation
- `rendering-hoist-jsx` - Hoist static spring presets outside components
- `js-early-exit` - Early return for reduced motion
- `js-index-maps` - Use Map for O(1) file lookup
- `rerender-dependencies` - Use primitive dependencies in useMemo
- `js-tosorted-immutable` - Immutable array sorting

## Progress

- [x] Phase 1: Spring Presets (Tasks 01) - DONE
- [x] Phase 2: Canvas Stretch (Tasks 02-03) - DONE
- [x] Phase 3: File Tabs (Tasks 04-08) - DONE (2026-01-16)
- [x] Phase 4: TOC Morph (Tasks 09-11) - DONE (2026-01-16)
- [x] Phase 5: Verification (Task 12) - DONE (2026-01-16)
