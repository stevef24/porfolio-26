---
date: 2026-01-07T09:52:55Z
session_name: scrolly-coding
researcher: Claude
git_commit: 51779802d99c0b1fb9a186ebaec31709a965d9f1
branch: scrollyCoding
repository: porfolio-26
topic: "CanvasZone Motion Animation Fix"
tags: [implementation, canvas-zone, motion, layout-animation, intersection-observer]
status: complete
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: CanvasZone Motion Animation Fix - Replaced CSS with Motion.js

## Task(s)

| Task | Status |
|------|--------|
| Delete projected-drag demo files | Completed |
| Fix CanvasZone trigger timing (fires on refresh) | Completed |
| Replace CSS transitions with Motion layout animations | Completed |
| Fix sticky positioning for canvas column | Completed |
| Test CanvasZone works correctly | In Progress |

Working from:
- Previous handoff: `thoughts/shared/handoffs/scrolly-coding/2026-01-07_16-19-54_canvaszone-trigger-fix.md`
- Continuity ledger: `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Critical References

1. **BlogWithCanvas**: `components/blog/BlogWithCanvas.tsx` - Main layout orchestrator
2. **CanvasZone**: `components/blog/CanvasZone.tsx` - Scroll-triggered zone detection
3. **Motion Variants**: `lib/motion-variants.ts` - Spring physics presets

## Recent changes

- `components/blog/CanvasZone.tsx:107-114` - Added `isHydrated` state with 100ms delay to prevent false triggers on page load
- `components/blog/CanvasZone.tsx:179,199` - Updated entry/exit observers to check `isHydrated` before activating
- `components/blog/BlogWithCanvas.tsx:1-196` - Complete rewrite using Motion.js instead of CSS transitions
- `app/blog/[slug]/page.tsx:10-12,20-27,132-141` - Removed ProjectedDrag and FocusSplitView imports and usage

**Deleted files:**
- `content/blog/projected-drag.mdx`
- `content/blog/projected-drag.steps.tsx`
- `content/blog/scrolly-demo.mdx`
- `content/blog/scrolly-demo.steps.tsx`
- `components/demos/ProjectedDrag.tsx`
- `components/demos/index.ts`
- `components/blog/FocusSplitView.tsx`
- `components/blog/FocusSplitLayout.tsx`
- `components/blog/FocusModeToggle.tsx`

## Learnings

### Root Causes Identified

1. **Observer fires on mount**: IntersectionObserver triggers immediately if element is in viewport when observer is created. No built-in "wait for scroll" behavior.

2. **CSS translate ≠ Motion layout**: CSS `translate` with transitions doesn't handle layout shifts smoothly. Motion's `animate` prop with spring physics provides natural movement.

3. **Sticky + overflow-hidden conflict**: `position: sticky` requires a scrollable ancestor. Parent with `overflow-hidden` breaks sticky behavior entirely.

### Pattern: Hydration Delay for IntersectionObserver

```typescript
const [isHydrated, setIsHydrated] = useState(false);
useEffect(() => {
  const timer = setTimeout(() => setIsHydrated(true), 100);
  return () => clearTimeout(timer);
}, []);

// In observer effect:
if (!element || !isHydrated) return;
```

This prevents false triggers on page load/refresh by waiting for scroll position to settle.

### Pattern: Fixed Canvas Overlay

Instead of sticky positioning inside flex:
```typescript
<motion.div
  className="fixed top-0 right-0 h-screen w-1/2"
  initial={{ x: "100%" }}
  animate={{ x: "0%" }}
  exit={{ x: "100%" }}
  transition={springGentle}
/>
```

Fixed positioning keeps canvas in viewport while scrolling through zone content.

## Post-Mortem

### What Worked

- **AnimatePresence for enter/exit**: Wrapping canvas in `AnimatePresence mode="wait"` provides smooth slide in/out with proper cleanup
- **Spring physics from motion-variants**: Using `springGentle` preset (visualDuration: 0.35, bounce: 0.1) feels natural
- **marginRight animation on blog column**: Animating margin instead of width/transform avoids complex layout calculations
- **Research agents for investigation**: Running 3 parallel Explore agents surfaced all the root causes quickly

### What Failed

- **Sticky positioning in flex**: Initial implementation used `sticky top-0` inside a flex container with `overflow-hidden` - sticky needs scrollable ancestor
- **CSS translate for layout shifts**: Pure CSS `translate` property doesn't coordinate with dimension changes smoothly
- **Symmetric rootMargin**: Previous center-line approach (`-45% 0px -45% 0px`) caused entry/exit at same scroll position → jitter

### Key Decisions

- **Decision**: Use `fixed` positioning instead of `sticky` for canvas
  - Alternatives: Keep sticky with proper container, use portal/overlay
  - Reason: Fixed is simpler and guarantees canvas stays in viewport during scroll

- **Decision**: Add 100ms hydration delay before observers activate
  - Alternatives: Use `once: true`, check scroll position on mount
  - Reason: Simple, reliable, prevents all false triggers without complex scroll detection

- **Decision**: Animate `marginRight` on blog column instead of `width`
  - Alternatives: Animate width, use CSS Grid, flex-basis
  - Reason: Margin animation is GPU-accelerated and doesn't trigger content reflow

## Artifacts

- `components/blog/BlogWithCanvas.tsx` - Rewritten with Motion.js
- `components/blog/CanvasZone.tsx` - Added hydration delay
- `app/blog/[slug]/page.tsx` - Cleaned up ProjectedDrag imports
- `app/canvas-test/page.tsx` - Test page (unchanged, for validation)

## Action Items & Next Steps

1. **Manual testing**: Open http://localhost:3000/canvas-test and verify:
   - No trigger on page refresh
   - Zone 1 activates when scrolled into view (canvas slides from right)
   - Canvas stays fixed while scrolling through zone
   - Zone 2 replaces Zone 1 content smoothly
   - Canvas slides out when scrolling past all zones
   - Scrolling up re-activates zones correctly

2. **Polish animations**: Consider adjusting:
   - Entry/exit timing (currently `springGentle` - 350ms)
   - Canvas background opacity/blur
   - Blog column animation (marginRight vs other approaches)

3. **Mobile experience**: Canvas is hidden on mobile (`hidden md:flex`) - may need mobile fallback

4. **Content swap animation**: Currently canvas content switches instantly - could add fade transition between zones

## Other Notes

### Test Page
- URL: http://localhost:3000/canvas-test
- Contains two zones (red/blue themed) with gap between them
- Tests: zone activation, canvas show/hide, hysteresis at boundaries

### Key Files
```
components/blog/BlogWithCanvas.tsx   - Motion-powered layout orchestrator
components/blog/CanvasZone.tsx       - Scroll-triggered zone detection
lib/motion-variants.ts               - Spring physics presets (springGentle used)
app/canvas-test/page.tsx             - Test page for validation
```

### Animation Config
- Entry rootMargin: `-15% 0px -70% 0px` (triggers when top enters upper 15%)
- Exit rootMargin: `50% 0px 50% 0px` (50% buffer before deactivation)
- Deactivate delay: 150ms debounce
- Spring: `springGentle` (visualDuration: 0.35, bounce: 0.1)
