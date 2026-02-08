---
date: 2026-01-08T17:08:12+0700
session_name: scrolly-coding
researcher: Claude
git_commit: 81e3b3a2e0941e788cd25442bba0a078b89de8d6
branch: scrollyCoding
repository: porfolio-26
topic: "CanvasZone Activation Timing Tuning"
tags: [canvas-zone, intersection-observer, animation-timing, scroll-activation]
status: partial
last_updated: 2026-01-08
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: CanvasZone Timing Tuning (Entry/Exit Too Quick)

## Task(s)

| Task | Status |
|------|--------|
| Create comprehensive problem documentation | ✓ Completed |
| Analyze user's refactored CanvasZone implementation | ✓ Completed |
| Map completed items from 16-point improvement plan | ✓ Completed |
| Tune activation timing parameters | **Planned - Ready to implement** |
| Multi-step zone support | Deferred (future session) |

**Current phase:** Planning complete, ready for implementation.

## Critical References

1. **Plan file:** `/Users/stavfernandes/.claude/plans/robust-roaming-quiche.md` - Final tuning plan
2. **16-point improvement plan:** `docs/scrolly-code-fix.md` - User's roadmap (most items already implemented)
3. **Problem documentation:** `docs/scrolly-code-problems.md` - Detailed issue analysis I created

## Recent changes

This session was primarily analysis/planning. Created:
- `docs/scrolly-code-problems.md:1-450` - Comprehensive debugging document explaining the goal, architecture, all files, packages, and root cause analysis

## Learnings

### User's Refactor Already Implemented Most Fixes
The user independently implemented most of the 16-point plan from `docs/scrolly-code-fix.md`:

| Implemented | Pattern |
|-------------|---------|
| Single shared observer | `BlogWithCanvas.tsx:396-414` - One IntersectionObserver for all zones |
| Zone registration | `registerZone()`, `registerSentinel()` callbacks |
| Gap sentinel | `CanvasGap` component in `CanvasZone.tsx:133-155` |
| End sentinel | `CanvasEnd` component + built-in sentinel in BlogWithCanvas |
| RAF batching | `enqueueEntries()` with `requestAnimationFrame` |
| Scroll direction | `scrollDirectionRef` tracking for tie-breaking |
| AnimatePresence mode="wait" | `BlogWithCanvas.tsx:491` |
| Threshold checking | `minIntersectionRatio` prop with ratio filtering |

### Current Issue: Timing Parameters
User reports entry/exit animations feel "too quick." Current defaults:
- `activationRootMargin = "-20% 0px -20% 0px"` (center 60% of viewport)
- `minIntersectionRatio = 0.1` (10% visibility)
- `deactivateDelay = 150` (150ms)

### Multi-Step Zones (Future)
For zones with multiple steps that change canvas content:
- Use `<Scrolly steps={...} />` directly for code walkthroughs (already built)
- Build `CanvasStep` component later if needed for non-code multi-step

## Post-Mortem (Required for Artifact Index)

### What Worked
- **Comprehensive documentation**: Created `docs/scrolly-code-problems.md` as a complete debugging reference
- **Parallel exploration**: Used multiple explore agents to gather context efficiently
- **Finding the right plan**: Located `docs/scrolly-code-fix.md` which showed user's roadmap

### What Failed
- **Wrong ledger reference**: Initially looked at old ScrollyCoding ledger instead of recognizing user's recent CanvasZone refactor
- **Missed user's plan**: Didn't immediately find `docs/scrolly-code-fix.md` - had to search after user pointed out discrepancy

### Key Decisions
- **Timing values**: User chose `-35% 0px -35% 0px` for narrower activation band (center 30%)
- **Multi-step deferred**: Focus on timing first, tackle multi-step later
- **Use ScrollyCoding for code walkthroughs**: Already complete system, don't wrap in CanvasZone

## Artifacts

- `/Users/stavfernandes/.claude/plans/robust-roaming-quiche.md` - Final plan file
- `docs/scrolly-code-problems.md` - Problem documentation (450+ lines)
- `docs/scrolly-code-fix.md` - User's 16-point improvement plan (reference)
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Master ledger (note: shows ScrollyCoding complete, CanvasZone is newer work)

## Action Items & Next Steps

### Immediate (Next Session)

1. **Tune activation timing** in `components/blog/BlogWithCanvas.tsx` lines 105-107:
   ```typescript
   // Change from:
   activationRootMargin = "-20% 0px -20% 0px",
   deactivateDelay = 150,

   // To:
   activationRootMargin = "-35% 0px -35% 0px",
   deactivateDelay = 250,
   ```

2. **Test at `/canvas-test`:**
   - Scroll into Zone 1 → canvas activates when centered
   - Gap between zones → canvas closes smoothly
   - Zone 2 → canvas shows blue content
   - Past all zones → canvas closes smoothly
   - Mobile → inline canvas below zone text

### Future (Separate Session)
- Multi-step zone support if needed for non-code content

## Other Notes

### Key Files for Implementation
- `components/blog/BlogWithCanvas.tsx` - Main orchestrator, change defaults on lines 105-107
- `components/blog/CanvasZone.tsx` - Zone component (already refactored, don't change)
- `app/canvas-test/page.tsx` - Test page with Zone 1 (red) and Zone 2 (blue)

### Dev Server
Dev server was started in background during this session. Kill and restart if needed:
```bash
lsof -ti:3000 | xargs kill -9; pnpm dev
```

### Two Separate Systems
Remember there are TWO systems:
1. **ScrollyCoding** - Code walkthroughs with Shiki Magic Move (COMPLETE, 9 phases)
2. **CanvasZone** - General canvas areas for blog posts (being tuned now)
