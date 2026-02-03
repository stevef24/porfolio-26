---
date: 2026-01-08T11:11:36Z
session_name: scrolly-coding
researcher: Claude
git_commit: b39eee8
branch: scrollyCoding
repository: porfolio-26
topic: "Canvas Entry/Exit Timing and Smooth Animation Implementation"
tags: [canvas, scrolly, animation, intersection-observer, timing, devouring-details]
status: handoff
last_updated: 2026-01-08
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: Canvas Timing Fixes + Devouring Details Analysis

## Task(s)

### Completed
- **Gap sentinel bug fix** (commit `b39eee8`)
  - Added `gapSentinelIdsRef` to track gap sentinels
  - Updated `registerSentinel` to track gap IDs
  - Added gap sentinel checking in `resolveActiveZone()` - closes canvas when gap is 20%+ visible

- **Entry/exit margin tuning**
  - Changed `activationRootMargin` from `-20% 0px -20% 0px` to `-35% 0px -35% 0px`
  - Creates 30% "active band" (down from 60%) - zones must be more centered to activate

- **Tablet layout bug fix**
  - Added `isTransitioningRef` flag with 500ms lock period
  - Prevents observer feedback loop during layout transitions
  - `resolveActiveZone()` now skips processing when `isTransitioningRef.current === true`

- **Devouring Details analysis** (for next phase)
  - Analyzed https://devouringdetails.com/prototypes/nextjs-dev-tools
  - Captured CSS transition values and layout measurements

### Remaining (Next Session)
- **Implement Option A: Smooth timing improvements**
  - Replace spring physics with their cubic-bezier easing
  - Potentially use `translate` instead of `margin` for GPU acceleration

## Critical References
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full session state
- `docs/scrolly-drawer-animation.md` - Technical architecture

## Recent changes
- `components/blog/BlogWithCanvas.tsx:127` - Added `gapSentinelIdsRef`
- `components/blog/BlogWithCanvas.tsx:135-136` - Added transition lock refs
- `components/blog/BlogWithCanvas.tsx:214-224` - `startTransitionLock()` function
- `components/blog/BlogWithCanvas.tsx:261-270` - Gap sentinel checking in `resolveActiveZone()`
- `components/blog/BlogWithCanvas.tsx:271-276` - Transition lock check
- `components/blog/BlogWithCanvas.tsx:392-394` - Gap ID tracking in `registerSentinel()`
- `components/blog/BlogWithCanvas.tsx:105` - Margin tuning `-35%`

## Learnings

### Devouring Details Architecture (KEY FOR NEXT SESSION)
Their canvas system uses fundamentally different timing:

| Property | Their Value | Our Current Value |
|----------|-------------|-------------------|
| Sidebar position | `sticky` | `fixed` (slides in/out) |
| Transition | `translate 0.35s cubic-bezier(0.23, 0.88, 0.26, 0.92)` | Spring via Motion |
| Layout animation | `translate` (GPU) | `marginRight` (causes layout) |

**Critical CSS values:**
```css
transition: width 0.35s cubic-bezier(0.23, 0.88, 0.26, 0.92),
            translate 0.35s cubic-bezier(0.23, 0.88, 0.26, 0.92);
```

**Their measurements:**
- Two-column state: 50/50 split, content text width 800px, padding 48px
- Full-width state (Notes): max-width 800px centered
- Font: 20px / 38px line-height in two-column; 16px / 24px in full-width
- Canvas DOES disappear at Notes section (confirmed by scrolling)

### Why Their Animation Feels Smoother
1. **No layout thrashing** - Uses `translate` (GPU) not `margin` (layout recalc)
2. **Custom easing** - `cubic-bezier(0.23, 0.88, 0.26, 0.92)` has subtle overshoot
3. **350ms duration** - Faster than typical spring animations
4. **Sticky sidebar** - Always present, only content changes

## Post-Mortem

### What Worked
- **Gap sentinel pattern**: Mirrored existing END sentinel implementation - clean fix
- **Transition lock**: 500ms delay prevents observer thrashing during animations
- **Chrome MCP**: Invaluable for analyzing external site CSS in real-time

### What Failed
- **Initial analysis miss**: Thought sidebar was always-present sticky, but it DOES slide out
- **Margin animation**: Causes layout recalculation every frame (why tablet has issues)

### Key Decisions
- **Decision**: Use 20% intersection ratio for gap sentinels (not 50%)
  - Alternatives: Higher threshold, scroll-direction aware
  - Reason: Gaps should close canvas quickly, 20% is responsive but not oversensitive

- **Decision**: 500ms transition lock duration
  - Alternatives: Match animation duration exactly, use animation callbacks
  - Reason: Buffer time accounts for spring overshoot, simpler than callbacks

## Artifacts
- `components/blog/BlogWithCanvas.tsx` - Main canvas orchestrator (600 lines)
- `components/blog/CanvasZone.tsx` - Zone components (178 lines)
- `app/canvas-test/page.tsx` - Test page with two zones + gap

## Action Items & Next Steps

### Option A: Improve Animation (Recommended)
1. Replace `marginRight` animation with `transform: translateX()`
2. Add their cubic-bezier easing: `cubic-bezier(0.23, 0.88, 0.26, 0.92)`
3. Set duration to 350ms
4. Test at `/canvas-test` - should feel noticeably smoother

Implementation location: `components/blog/BlogWithCanvas.tsx:488-494`

### Consider for Future
- Match their content width (800px) and padding (48px)
- Consider sticky sidebar vs fixed drawer trade-offs

## Other Notes

### Test Commands
```bash
pnpm dev
# Then visit: http://localhost:3000/canvas-test
```

### Test Checklist
- [ ] Canvas opens when zone center hits viewport center
- [ ] Canvas closes when scrolling into gap between zones
- [ ] Canvas closes after final zone
- [ ] No flicker or re-render on tablet (768px-1024px)
- [ ] Smooth animation feel (compare to devouring details)

### Cubic-Bezier Visualization
The easing `(0.23, 0.88, 0.26, 0.92)` creates:
- Fast start (x1=0.23 is low)
- Slight overshoot (y1=0.88 > x1)
- Smooth settle (x2=0.26, y2=0.92)
