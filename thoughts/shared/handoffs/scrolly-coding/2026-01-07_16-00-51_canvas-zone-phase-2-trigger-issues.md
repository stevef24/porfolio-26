---
date: 2026-01-07T09:00:51Z
session_name: scrolly-coding
researcher: Claude
git_commit: 51779802d99c0b1fb9a186ebaec31709a965d9f1
branch: scrollyCoding
repository: porfolio-26
topic: "CanvasZone Phase 2 - Trigger Timing Issues"
tags: [implementation, canvas-zone, intersection-observer, scrollytelling, needs-research]
status: partial
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: CanvasZone Phase 2 - Trigger Timing Issues Need Deep Investigation

## Task(s)

| Task | Status |
|------|--------|
| Create CanvasZone component with IntersectionObserver | Completed |
| Update canvas-test page with two test zones | Completed |
| Fix early trigger issue (zone activating before centered) | Partially Fixed |
| Fix jerky scroll-up behavior | NOT Fixed - Needs Investigation |
| Study Devouring Details trigger behavior deeply | **Required Next** |

Working from:
- Previous handoff: `thoughts/shared/handoffs/scrolly-coding/2026-01-07_15-08-42_canvas-zone-phase-1-complete.md`
- Continuity ledger: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Critical References

1. **Devouring Details Reference**: https://devouringdetails.com/prototypes/nextjs-dev-tools
   - **MUST STUDY**: How they handle trigger timing
   - **MUST STUDY**: How they handle scroll direction (up vs down)
   - **MUST STUDY**: Their exact IntersectionObserver configuration

2. **Current Implementation**: `components/blog/CanvasZone.tsx`

## Recent changes

- `components/blog/CanvasZone.tsx:1-157` - Created CanvasZone component with IntersectionObserver
- `components/blog/CanvasZone.tsx:62-63` - Changed defaults: `threshold: 0`, `rootMargin: "-45% 0px -45% 0px"`
- `components/blog/CanvasZone.tsx:79-127` - Refactored to use refs to prevent observer recreation (attempted fix for jerkiness)
- `app/canvas-test/page.tsx:1-180` - Updated test page with two zones (red/blue themed)

## Learnings

### Current Implementation Approach

The CanvasZone component uses IntersectionObserver with:
- `threshold: 0` - triggers as soon as any part crosses the detection zone
- `rootMargin: "-45% 0px -45% 0px"` - shrinks the observable area to center 10% of viewport

**Theory:** Zone activates when it crosses the vertical center line of the viewport.

### Issues Observed

1. **Jerky scroll-up behavior**: Despite using refs to avoid observer recreation, there's still jerkiness when scrolling up. The issue may be deeper than just useEffect dependencies.

2. **Timing still feels off**: Even with the center-line approach, the trigger doesn't feel as precise as Devouring Details.

### What We Don't Yet Understand About Devouring Details

1. **Do they use IntersectionObserver at all?** Or scroll event listeners?
2. **What exact rootMargin/threshold values?** Need to inspect their JavaScript
3. **Do they handle scroll direction differently?** (e.g., different thresholds for up vs down)
4. **Is there debouncing or throttling?** That might explain smoother transitions
5. **How do they handle the gap between zones?** Do they delay exit?

## Post-Mortem

### What Worked
- **Sibling layout (Phase 1)**: CSS translate animation is smooth and GPU-accelerated
- **Context-based state**: BlogWithCanvas context cleanly shares state between zones
- **Basic zone detection**: Zones do activate/deactivate on scroll
- **Ref pattern for stability**: Using refs for activeZoneId prevents observer recreation

### What Failed
- **Initial rootMargin too sensitive**: `-20% 0px -20% 0px` triggered way too early
- **Jerky scroll-up persists**: Even with ref pattern, scroll-up still has jank
- **Didn't deeply study reference first**: Should have extracted exact Devouring Details implementation before building

### Key Decisions
- **Decision**: Changed from threshold 0.1 to threshold 0
  - Reason: With threshold 0.1, needed 10% of zone visible in detection area - too variable based on zone height

- **Decision**: Changed rootMargin from `-20%` to `-45%`
  - Reason: Creates a center-line detection (only triggers when zone crosses middle of viewport)

- **Decision**: Use refs instead of state in useEffect dependencies
  - Alternatives: useMemo, useCallback with different patterns
  - Reason: Avoid recreating IntersectionObserver on every activeZoneId change

## Artifacts

### Components Created
- `components/blog/CanvasZone.tsx` - IntersectionObserver-based zone trigger
- `app/canvas-test/page.tsx` - Test page with two zones

### From Previous Session (Phase 1)
- `components/blog/BlogWithCanvas.tsx` - Sibling layout with CSS translate
- `app/globals.css:142-145` - Canvas animation CSS variables
- `lib/motion-variants.ts:439-443` - `springCanvasSlide` preset

### Handoffs
- `thoughts/shared/handoffs/scrolly-coding/2026-01-07_15-08-42_canvas-zone-phase-1-complete.md` - Phase 1 completion
- `thoughts/shared/handoffs/scrolly-coding/2026-01-07_14-53-23_canvas-zone-phase-1-layout.md` - Phase 1 research

## Action Items & Next Steps

### REQUIRED: Deep Study of Devouring Details

Before continuing implementation, must investigate:

1. **Extract their IntersectionObserver config**
   - Use Chrome DevTools to find their JavaScript
   - Look for IntersectionObserver instantiation
   - Note exact threshold, rootMargin values
   - Check if they use multiple observers

2. **Understand scroll direction handling**
   - Do they detect scroll direction?
   - Different behavior for scrolling up vs down?
   - Is there a "sticky" period before deactivation?

3. **Study their timing/debouncing**
   - Do they debounce state changes?
   - Is there a delay before canvas hides?
   - RequestAnimationFrame usage?

4. **Inspect their data attributes**
   - `data-expand`, `data-collapse` - how are these toggled?
   - Are there intermediate states?

### Implementation Changes After Research

Based on findings, may need to:
- [ ] Add scroll direction detection
- [ ] Add debouncing/throttling to state changes
- [ ] Use different thresholds for enter vs exit
- [ ] Add "sticky" behavior (delay before deactivation)
- [ ] Consider scroll event listener instead of/alongside IntersectionObserver

## Other Notes

### Test Page URL
- http://localhost:3000/canvas-test (dev server must be running on port 3000)

### Chrome Automation Tab
- Tab ID may have changed - run `tabs_context_mcp` to get fresh IDs
- Devouring Details already open in tab group for reference

### Files to Study in Next Session
```
components/blog/CanvasZone.tsx     - Current implementation (needs improvement)
components/blog/BlogWithCanvas.tsx - Layout component (working well)
```

### Key Questions for Next Session
1. What EXACTLY does Devouring Details do differently?
2. Is IntersectionObserver the right tool, or should we use scroll events?
3. Should scroll direction affect trigger behavior?
4. Is the jerkiness from React re-renders or from the observer itself?

### Debugging Approach
- Add console.log in handleIntersection to see exact trigger timing
- Compare with Devouring Details behavior frame-by-frame
- Consider using Performance DevTools to identify jank source
