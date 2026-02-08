---
date: 2026-01-09T00:02:38Z
session_name: scrolly-coding
researcher: Claude
git_commit: b39eee8
branch: scrollyCoding
repository: porfolio-26
topic: "Canvas Entry/Exit Timing and Animation Improvements"
tags: [canvas, scrolly, animation, intersection-observer, timing, devouring-details, cubic-bezier]
status: handoff
last_updated: 2026-01-09
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: Canvas Timing & Devouring Details Analysis

## Task(s)

### Completed
- **Resumed from previous handoff** (`2026-01-08_18-11-36_canvas-smooth-timing.md`)
- **Added Devouring Details cubic-bezier easing**
  - `transitionCanvasSlide`: 350ms with `cubic-bezier(0.23, 0.88, 0.26, 0.92)`
  - Replaced `springGentle` in `BlogWithCanvas.tsx`
- **Increased intersection threshold** from 10% → 65% → 75%
  - Canvas now requires 75% of zone visible to activate/deactivate

### Analyzed (Devouring Details Deep Dive)
- Used Chrome MCP to analyze https://devouringdetails.com/prototypes/nextjs-dev-tools
- Captured their CSS animation values and layout approach
- Key findings documented in Learnings section

### Pending (Next Session)
- **Switch from `marginRight` to CSS `translate`** for GPU acceleration
  - Their sidebar uses `translate: -240px` when hidden (GPU-accelerated)
  - Our `marginRight: 50vw` causes layout recalculation each frame
  - This requires layout restructure

## Critical References
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full session state
- `docs/scrolly-drawer-animation.md` - Technical architecture

## Recent changes
- `lib/motion-variants.ts:435-449` - Added `easingDevouringDetails` and `transitionCanvasSlide`
- `components/blog/BlogWithCanvas.tsx:26` - Changed import from `springGentle` to `transitionCanvasSlide`
- `components/blog/BlogWithCanvas.tsx:107-108` - Changed `minIntersectionRatio` from 0.1 to 0.75
- `components/blog/BlogWithCanvas.tsx:491-492` - Updated transition comment and usage

## Learnings

### Devouring Details Animation Architecture
Their canvas system uses fundamentally different approach:

| Property | Their Value | Our Current Value |
|----------|-------------|-------------------|
| Sidebar position | `fixed` | `fixed` (same) |
| Animation property | `translate` (CSS native) | `marginRight` (causes layout) |
| Transition | `translate 0.35s cubic-bezier(0.23, 0.88, 0.26, 0.92)` | Same easing now ✓ |
| Hidden state | `translate: -240px` | `marginRight: 0` |

### Why Their Animation Feels Smoother
1. **No layout thrashing** - CSS `translate` is GPU-accelerated, doesn't trigger layout recalc
2. **Custom easing** - `cubic-bezier(0.23, 0.88, 0.26, 0.92)` has subtle overshoot
3. **350ms duration** - Faster than typical spring animations
4. **Both sidebar AND main content** have same transition timing

### JavaScript Inspection Results
```javascript
// Sidebar (canvas)
{
  position: "fixed",
  translate: "-240px",  // Hidden state
  transition: "translate 0.35s cubic-bezier(0.23, 0.88, 0.26, 0.92)"
}

// Main content
{
  position: "relative",
  transition: "translate 0.35s cubic-bezier(0.23, 0.88, 0.26, 0.92)"  // Same!
}
```

### Canvas Exit Trigger
Their canvas stays visible until Notes section is ~70-80% in viewport. Our 75% threshold now matches this behavior.

## Post-Mortem

### What Worked
- **Chrome MCP analysis**: Invaluable for inspecting external site CSS in real-time
- **JavaScript inspection via MCP**: `window.getComputedStyle()` revealed exact animation values
- **Cubic-bezier easing**: The specific easing (0.23, 0.88, 0.26, 0.92) provides subtle overshoot that feels natural
- **Incremental threshold adjustment**: Testing 50% → 65% → 75% helped find right timing

### What Failed
- **Initial threshold too low**: 10% was way too early - canvas opened immediately
- **marginRight approach**: Still causes layout recalculation, but works for now

### Key Decisions
- **Decision**: Use 75% intersection threshold
  - Alternatives: 50%, 65%, 80%
  - Reason: Matches Devouring Details timing where canvas stays until section is mostly visible

- **Decision**: Keep `marginRight` animation for now
  - Alternatives: Switch to `translate` immediately
  - Reason: Requires layout restructure; current approach works, just not GPU-optimized

## Artifacts
- `lib/motion-variants.ts:435-449` - New easing constants
- `components/blog/BlogWithCanvas.tsx` - Updated transition and threshold
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Ledger (needs update)

## Action Items & Next Steps

### High Priority
1. **Test current implementation** at `/canvas-test`
   - Verify 75% threshold feels right
   - Check if animation is smooth enough with margin approach

2. **If animation still feels janky**, implement translate approach:
   - Change `marginRight: 50vw` to `x: "-25vw"` (translateX)
   - May need to adjust content centering logic
   - Canvas already uses `x: "100%"` for slide-in (good)

### Consider for Future
- Match their content width (800px) and padding (48px)
- Add fullscreen mode to canvas (they have expand button)
- Consider sticky sidebar vs fixed drawer trade-offs

## Other Notes

### Test Commands
```bash
pnpm dev
# Then visit: http://localhost:3000/canvas-test
```

### Cubic-Bezier Visualization
The easing `(0.23, 0.88, 0.26, 0.92)` creates:
- Fast start (x1=0.23 is low)
- Slight overshoot (y1=0.88 > x1)
- Smooth settle (x2=0.26, y2=0.92)

### Dev Server Note
Dev server is currently running in background (task b30f5e8). May need restart after `/clear`.
