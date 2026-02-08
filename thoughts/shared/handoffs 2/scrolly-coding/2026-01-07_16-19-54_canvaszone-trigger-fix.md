---
date: 2026-01-07T16:19:54Z
session_name: scrolly-coding
researcher: Claude
git_commit: 51779802d99c0b1fb9a186ebaec31709a965d9f1
branch: scrollyCoding
repository: porfolio-26
topic: "CanvasZone Trigger Fix - Asymmetric Hysteresis"
tags: [implementation, canvas-zone, intersection-observer, scrollytelling, hysteresis]
status: complete
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: CanvasZone Trigger Timing Fixed with Asymmetric Hysteresis

## Task(s)

| Task | Status |
|------|--------|
| Study Devouring Details trigger behavior | Completed |
| Extract IntersectionObserver configuration | Completed |
| Understand scroll direction handling | Completed |
| Implement asymmetric hysteresis fix | Completed |
| Test scroll-up jerkiness resolution | Completed |

Working from:
- Previous handoff: `thoughts/shared/handoffs/scrolly-coding/2026-01-07_16-00-51_canvas-zone-phase-2-trigger-issues.md`
- Continuity ledger: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Critical References

1. **Devouring Details Reference**: https://devouringdetails.com/prototypes/nextjs-dev-tools
   - Used to understand trigger timing patterns
2. **CanvasZone Component**: `components/blog/CanvasZone.tsx`

## Recent changes

- `components/blog/CanvasZone.tsx:1-50` - Added docstring explaining asymmetric entry/exit approach
- `components/blog/CanvasZone.tsx:30-49` - Added `useScrollDirection()` hook for scroll direction tracking
- `components/blog/CanvasZone.tsx:68-85` - New props: `entryRootMargin`, `exitRootMargin`, `deactivateDelay`
- `components/blog/CanvasZone.tsx:135-211` - Refactored to use two separate IntersectionObservers (entry + exit) with debounced deactivation

## Learnings

### Key Insight from Devouring Details

**Entry and exit should NOT happen at the same scroll position.** Devouring Details uses:
1. Slides activate when their TOP crosses into the upper viewport region
2. Slides stay active with significant hysteresis (50%+ of viewport buffer)
3. This asymmetry prevents jittery state changes at boundaries

### Implementation Pattern

```
Entry Observer:  rootMargin: "-15% 0px -70% 0px"
  → Triggers when element top enters upper 15% of viewport

Exit Observer:   rootMargin: "50% 0px 50% 0px"
  → Only triggers when element is 50% beyond viewport edges

Deactivate Delay: 150ms
  → Prevents rapid on/off during scroll direction changes
```

## Post-Mortem

### What Worked
- **Two-observer pattern**: Separating entry and exit detection into distinct observers with different rootMargins was the key
- **Browser automation for investigation**: Using Chrome MCP tools to inspect Devouring Details behavior in real-time
- **Behavioral analysis**: Monitoring `data-active` attributes during scroll revealed the hysteresis pattern
- **Debounced deactivation**: 150ms delay prevents micro-jitters

### What Failed
- **Initial center-line approach**: Using symmetric `rootMargin: "-45% 0px -45% 0px"` caused entry/exit at same point → jitter
- **Programmatic scroll for testing**: `window.scrollBy()` didn't reliably trigger their observers (user scroll events work differently)
- **JavaScript extraction blocked**: Couldn't directly extract their IntersectionObserver config from minified bundles (content blocked)

### Key Decisions
- **Decision**: Use two separate IntersectionObservers instead of one
  - Alternatives: Single observer with direction-aware logic, scroll event listeners
  - Reason: Two observers with different rootMargins cleanly separates entry/exit thresholds

- **Decision**: Default entryRootMargin of "-15% 0px -70% 0px"
  - Alternatives: Center-line (-45%), top-of-viewport (0%)
  - Reason: "Top enters upper region" feels most natural for scrollytelling

- **Decision**: Default 150ms deactivate delay
  - Alternatives: 0ms (immediate), 300ms (noticeable lag)
  - Reason: Fast enough to feel responsive, slow enough to prevent micro-jitters

## Artifacts

- `components/blog/CanvasZone.tsx` - Updated component with hysteresis fix
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Updated with Phase completion
- `app/canvas-test/page.tsx` - Test page for validation (unchanged)

## Action Items & Next Steps

1. **Manual testing**: User should test on actual device with trackpad/mouse
2. **Commit the changes**: Run `/commit` to commit the CanvasZone fix
3. **Optional tuning**: The `entryRootMargin`, `exitRootMargin`, and `deactivateDelay` props can be adjusted per-zone if needed
4. **Consider removing unused code**: `scrollDirection` state is tracked but not currently used in logic (could enable direction-aware behavior later)

## Other Notes

### Test Page
- URL: http://localhost:3000/canvas-test
- Contains two zones (red/blue themed) with gap between them
- Tests: zone activation, canvas show/hide, hysteresis at boundaries

### Key Files
```
components/blog/CanvasZone.tsx     - Updated with hysteresis fix
components/blog/BlogWithCanvas.tsx - Layout orchestrator (unchanged)
app/canvas-test/page.tsx           - Test page (unchanged)
```

### Browser Testing Performed
- Scroll down through Zone 1 → Gap → Zone 2: Smooth transitions
- Scroll up through Zone 2 → Gap → Zone 1: No jitter, hysteresis working
- Rapid scroll at boundary: Only 1 state change recorded (stable)
