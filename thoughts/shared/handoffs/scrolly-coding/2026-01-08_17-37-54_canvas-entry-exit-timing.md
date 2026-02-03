---
date: 2026-01-08T10:37:54Z
session_name: scrolly-coding
researcher: Claude
git_commit: 0d3ec03
branch: scrollyCoding
repository: porfolio-26
topic: "Canvas Entry/Exit Timing and Step Re-render Fixes"
tags: [canvas, scrolly, animation, intersection-observer, timing]
status: handoff
last_updated: 2026-01-08
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: Canvas Entry/Exit Timing Fixes

## Task(s)

### Completed
- **Doc cleanup**: Removed 19 completed planning/debug docs (commit `0d3ec03`)
- **Type fix**: Fixed unclosed JSDoc comment in `BlogWithCanvas.tsx:35` that broke build

### Remaining (Priority Order)

1. **Canvas entry/exit timing** - HIGH PRIORITY
   - Problem: Canvas enters too early and exits too late
   - User feedback: "doesn't seem like it's a part of the structure properly"
   - Root cause: Observer margins are too aggressive
   - Current: `activationRootMargin = "-20% 0px -20% 0px"`
   - Need: More conservative margins so canvas opens/closes at natural scroll positions

2. **Step re-render on progression** - HIGH PRIORITY
   - Problem: When scrolling to step 2, the stage should re-render with new content
   - Current: Magic Move animates between steps
   - Desired: Stage updates/re-renders when active step changes

## Critical References

- `docs/scrolly-drawer-animation.md` - Technical explanation of drawer system
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Session state with all phase notes
- `components/blog/BlogWithCanvas.tsx` - Main canvas orchestrator (555 lines)

## Recent changes

- `components/blog/BlogWithCanvas.tsx:35` - Fixed unclosed JSDoc `*/` that broke TypeScript
- Deleted 19 docs files (old phase plans, debug docs, mobile TOC deep dive)

## Learnings

### Canvas Architecture
The canvas system uses a **single IntersectionObserver** pattern in `BlogWithCanvas.tsx`:
- Zones register via `registerZone(id, element, config)`
- Sentinels (gap/end) register via `registerSentinel(id, element, kind)`
- `resolveActiveZone()` picks winner based on intersection ratio + scroll direction
- `scheduleClose()` with debounce prevents flicker

### Key Files
- `components/blog/BlogWithCanvas.tsx:250-321` - `resolveActiveZone()` logic
- `components/blog/BlogWithCanvas.tsx:102-108` - Default margins (tune these)
- `components/blog/CanvasZone.tsx` - Zone component with registration
- `app/canvas-test/page.tsx` - Test page with two zones + gap

### Observer Margin Insight
```
Current: activationRootMargin = "-20% 0px -20% 0px"
         minIntersectionRatio = 0.1

The -20% shrinks viewport 20% from top AND bottom.
This creates a 60% "active band" in the center.

Problem: Too aggressive - canvas opens before content is truly in view.
```

## Post-Mortem

### What Worked
- Single observer pattern eliminated race conditions between entry/exit
- RAF batching (`enqueueEntries`) prevents rapid state thrashing
- Scroll direction tracking helps resolve overlapping zones
- Gap/End sentinels provide explicit close triggers

### What Failed
- Initial dual-observer approach had race conditions (zone 2 entry before zone 1 exit)
- Exit margin `5% 0px 5% 0px` (expanding viewport) made zones never fully exit
- Gap sentinels registered but never actually checked in `resolveActiveZone()` - **BUG**

### Key Decisions
- Decision: Use single shared observer instead of per-zone observers
  - Alternatives: Dual observers, scroll listeners
  - Reason: Single observer eliminates timing race conditions

- Decision: Register sentinels in parent, not in CanvasGap component
  - Reason: Centralized control, no observer conflicts

## Artifacts

- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full implementation history
- `docs/scrolly-drawer-animation.md` - Technical reference
- `docs/scrolly-authoring-guide.md` - User documentation (keep)
- `app/canvas-test/page.tsx` - Test page with two zones

## Action Items & Next Steps

### Fix 1: Tune Entry/Exit Margins
Location: `components/blog/BlogWithCanvas.tsx:105`

```typescript
// Current (too aggressive)
activationRootMargin = "-20% 0px -20% 0px"

// Try more conservative
activationRootMargin = "-35% 0px -35% 0px"  // 30% active band
```

Test at `/canvas-test` - canvas should open when zone is centered, not when top enters.

### Fix 2: Gap Sentinels Not Working
Location: `components/blog/BlogWithCanvas.tsx:250-257`

Current code only checks END sentinels:
```typescript
const endSentinels = endSentinelIdsRef.current;
for (const id of endSentinels) {
  if (sentinelEntryRef.current.get(id)?.isIntersecting) {
    scheduleClose();
    return;
  }
}
```

Gap sentinels are observed but **never checked**. Need to add gap sentinel logic.

### Fix 3: Step Re-render
Location: `components/ui/scrolly/ScrollyStage.tsx`

When `activeStepIndex` changes, ensure the stage re-renders with new step content.
Check if `ShikiMagicMovePrecompiled` properly updates when `step` prop changes.

### Testing Checklist
- [ ] Canvas opens when zone center hits viewport center
- [ ] Canvas closes when scrolling into gap between zones
- [ ] Canvas closes after final zone
- [ ] No flicker during fast scroll
- [ ] Step 1 → Step 2 causes stage to update

## Other Notes

### Test Commands
```bash
pnpm dev          # Start dev server
open http://localhost:3000/canvas-test   # Test page
open http://localhost:3000/blog/scrolly-demo  # Real blog post
```

### Existing TODOs (from previous session)
The old todo list referenced these which are still relevant:
1. Gap sentinels not triggering canvas close ← **BUG**
2. Add sentinel-based close tracking
3. Implement close-when-zero-zones logic
4. Test at /canvas-test with all scenarios

### ScrollyCoding vs CanvasZone
These are **two separate systems**:
- **ScrollyCoding** (`components/ui/scrolly/`) - For code walkthroughs with Magic Move
- **CanvasZone** (`components/blog/`) - For general scroll-triggered canvas sidebar

The timing issues affect both but are primarily in the CanvasZone system.
