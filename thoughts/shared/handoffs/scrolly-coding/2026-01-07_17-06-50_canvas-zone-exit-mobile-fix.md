---
date: 2026-01-07T17:06:50+0700
session_name: scrolly-coding
researcher: Claude
git_commit: 81e3b3a2e0941e788cd25442bba0a078b89de8d6
branch: scrollyCoding
repository: porfolio-26
topic: "CanvasZone Exit Behavior & Mobile Fallback Fix"
tags: [canvas-zone, intersection-observer, mobile-fallback, motion]
status: complete
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: CanvasZone Exit Behavior & Mobile Fallback Fix

## Task(s)

**Completed all 5 phases:**

1. [x] **Phase 1**: Fix exit observer margin (`50%` → `5%`)
2. [x] **Phase 2**: Add mobile inline canvas fallback
3. [x] **Phase 3**: Remove unused `useScrollDirection` hook
4. [x] **Phase 4**: Prevent margin animation on mobile in BlogWithCanvas
5. [x] **Phase 5**: Build verification (20 static pages generated successfully)

## Critical References

- Plan document: `/Users/stavfernandes/.claude/plans/valiant-pondering-matsumoto.md`
- Continuity ledger: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Recent changes

- `components/blog/CanvasZone.tsx:74` - Changed exit margin from `50%` to `5%`
- `components/blog/CanvasZone.tsx:248-252` - Added mobile inline canvas fallback
- `components/blog/CanvasZone.tsx:26-49` - Removed unused `useScrollDirection` hook
- `components/blog/BlogWithCanvas.tsx:81` - Added `isDesktop` state
- `components/blog/BlogWithCanvas.tsx:84-93` - Added media query effect for desktop detection
- `components/blog/BlogWithCanvas.tsx:133` - Conditional margin: only applies on desktop

## Learnings

### Root Cause of Exit Issue
The exit observer margin `50% 0px 50% 0px` was expanding the detection region to 150% of viewport height. This meant zones had to be COMPLETELY outside this massive region before exit fired - requiring users to scroll far past the zones.

### Solution Pattern
Changed to `5% 0px 5% 0px` which creates ~20% hysteresis gap between entry (`-15% 0px -70% 0px`) and exit. This prevents jitter while being responsive.

### Mobile Pattern (from ScrollyStageMobile)
On mobile, show canvas content inline below zone text rather than hiding entirely. Uses `md:hidden` class to only show on mobile.

### Motion + Media Query Pattern
Motion.js doesn't support responsive values directly. Used `window.matchMedia` with `useEffect` to track `isDesktop` state, then conditionally apply margin in animation.

## Post-Mortem (Required for Artifact Index)

### What Worked
- **Asymmetric margin analysis**: Identified that 50% exit margin was the root cause by understanding IntersectionObserver's rootMargin behavior
- **ScrollyStageMobile pattern**: Reused the mobile inline approach from the existing ScrollyCoding component
- **Media query hook pattern**: Clean separation of desktop/mobile behavior without CSS hacks

### What Failed
- Initially removed `useScrollDirection` but left references to it, causing TypeScript errors. Had to do cleanup in multiple passes.

### Key Decisions
- **Exit margin 5%**: Chose 5% over 0% to maintain some hysteresis and prevent flicker at exact boundary
- **Inline below zone for mobile**: User confirmed this approach over "no canvas" or "collapsible accordion"
- **Remove scroll direction hook entirely**: It was dead code - opted for simpler removal over trying to use it

## Artifacts

- `components/blog/CanvasZone.tsx` - Main fixes
- `components/blog/BlogWithCanvas.tsx` - Mobile margin handling
- `/Users/stavfernandes/.claude/plans/valiant-pondering-matsumoto.md` - Implementation plan

## Action Items & Next Steps

1. **Manual testing on `/canvas-test`**:
   - Desktop: Scroll into Zone 1 → canvas appears
   - Desktop: Scroll into Zone 2 → canvas swaps content
   - Desktop: Scroll past Zone 2 → canvas hides promptly
   - Desktop: Scroll above Zone 1 → canvas hides promptly
   - Mobile: Zones show inline canvas below text
   - Mobile: No horizontal layout shift

2. **Optional**: Tune exit margin if 5% feels too aggressive (could try 10%)

3. **Optional**: Add entrance animation to mobile inline canvas (currently appears instantly)

## Other Notes

- Test page: `/canvas-test` has Zone 1 (red) and Zone 2 (blue) for testing
- The `deactivateDelay` of 150ms still applies for debouncing
- Build passes with 20 static pages including `/canvas-test`
