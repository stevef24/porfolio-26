---
date: 2026-01-10T16:54:52-08:00
session_name: agent-sdk-blog
researcher: Claude
git_commit: d90cd9a
branch: scrollyCoding
repository: porfolio-26
topic: "Remove ScrollyCoding, Use BlogWithCanvas Exclusively"
tags: [implementation, refactor, scrollycoding, blogwithcanvas, layout]
status: in_progress
last_updated: 2026-01-10
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Remove ScrollyCoding, Use BlogWithCanvas Exclusively

## Task(s)

**Status: Phase 1 Complete, Phases 2-5 Pending**

The user discovered that the agent SDK blog layout was broken - only the scrolly section was shifting left when the canvas appeared, not the entire page content. After deep investigation, we found:

1. **Root Cause**: Two separate layout systems exist in the codebase
   - `ScrollyCoding` - Only shifts content INSIDE its section (drawer-based, `useInView` on steps container)
   - `BlogWithCanvas` - Shifts ALL content when any zone is active (margin-based, IntersectionObserver)

2. **Decision**: Delete ScrollyCoding entirely and use BlogWithCanvas exclusively going forward

**Working from plan:** `thoughts/shared/plans/2026-01-10-agent-sdk-blog-tutorial.md` (superseded by new plan)
**Active plan:** `/Users/stavfernandes/.claude/plans/dapper-greeting-blanket.md`

| Phase | Status |
|-------|--------|
| Phase 1: Commit current work | ✅ Complete (d90cd9a) |
| Phase 2: Delete ScrollyCoding system | ⏳ Pending |
| Phase 2b: Delete projected-drag blog | ⏳ Pending |
| Phase 2c: Update custom-components.tsx | ⏳ Pending |
| Phase 3: Create CanvasCodeStage with ScrollyStage styling | ⏳ Pending |
| Phase 4: Rebuild agent SDK blog with BlogWithCanvas | ⏳ Pending |
| Phase 5: Verify build and test | ⏳ Pending |

## Critical References

1. `/Users/stavfernandes/.claude/plans/dapper-greeting-blanket.md` - Active implementation plan
2. `components/blog/BlogWithCanvas.tsx` - The correct layout system to use
3. `components/ui/scrolly/ScrollyStage.tsx` - Styling to port before deletion

## Recent changes

- `d90cd9a` - Checkpoint commit: "feat: add canvas zone stepped mode and scrolly drawer system"
  - This preserves all current work before the refactor begins

## Learnings

### Layout System Architecture (Critical)

**ScrollyCoding** (`components/ui/scrolly/ScrollyCoding.tsx:38-40`):
```typescript
const isStepsInView = useInView(stepsContainerRef, {
  margin: "-45% 0px -45% 0px",
});
```
- Only the `stepsContainerRef` triggers drawer open/close
- Content OUTSIDE the scrolly section stays full-width
- Uses width animation: `100vw → 50vw`

**BlogWithCanvas** (`components/blog/BlogWithCanvas.tsx`):
- Wraps ENTIRE page content
- ANY registered zone triggers layout shift
- Uses margin animation: `marginRight: 0vw → 50vw`
- Has sentinel system (CanvasGap, CanvasEnd) for proper close behavior
- Has hysteresis (asymmetric scroll behavior) for smooth UX

### Key Insight
The canvas-test page worked correctly because it used BlogWithCanvas as the wrapper. The agent SDK blog used ScrollyCoding which only affects its own section.

## Post-Mortem (Required for Artifact Index)

### What Worked
- Deep git history research (last 15-20 commits) identified when the divergence happened
- Three parallel Explore agents efficiently gathered context on both systems
- The canvas-test implementation served as a reference for correct behavior

### What Failed
- Initial assumption was that ScrollyCoding should work - it was designed for a different use case
- Tried to use ScrollyCoding for blog layout when BlogWithCanvas was the correct pattern

### Key Decisions
- **Decision**: Delete ScrollyCoding entirely, use BlogWithCanvas exclusively
  - Alternatives considered: Wrap ScrollyCoding in CanvasZone, modify ScrollyCoding to affect page layout
  - Reason: BlogWithCanvas is already designed for this exact use case. Simpler to use the right tool than to force-fit the wrong one.

- **Decision**: Port visual styling from ScrollyStage to new CanvasCodeStage
  - Reason: User liked the polished look of ScrollyCoding's code panel

## Artifacts

- `/Users/stavfernandes/.claude/plans/dapper-greeting-blanket.md` - Implementation plan
- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Session ledger
- Commit `d90cd9a` - Checkpoint before refactor

## Action Items & Next Steps

1. **Phase 2: Delete ScrollyCoding system**
   ```
   components/ui/scrolly/
   ├── ScrollyCoding.tsx
   ├── ScrollyStep.tsx
   ├── ScrollyStage.tsx
   ├── ScrollyStageMobile.tsx
   ├── ScrollyContext.tsx
   ├── ScrollyDrawerContext.tsx
   ├── ScrollyLiveRegion.tsx
   ├── StageControls.tsx
   ├── StageFullscreen.tsx
   └── index.ts

   lib/scrolly/
   ├── types.ts
   └── utils.ts
   ```

2. **Phase 2b: Delete projected-drag blog**
   - `content/blog/projected-drag.mdx`
   - `content/blog/projected-drag.steps.tsx`

3. **Phase 2c: Update custom-components.tsx**
   - Remove `Scrolly` import and export

4. **Phase 3: Create CanvasCodeStage**
   - Port styling from `ScrollyStage.tsx` before deleting it
   - Dark background, rounded corners, file tabs, line numbers, focus lines

5. **Phase 4: Rebuild agent SDK blog**
   - Use `CanvasZone mode="stepped"` + `CanvasStep` pattern
   - Add `CanvasGap` between sections
   - Add `CanvasEnd` at end of article

6. **Phase 5: Verify**
   - `pnpm build` must pass
   - Manual testing: all content shifts, mobile works, theme switching works

## Other Notes

### Files to Read Before Resuming
- `components/blog/BlogWithCanvas.tsx` - Understand the correct layout system
- `components/blog/CanvasZone.tsx` - Zone registration and modes
- `components/blog/CanvasStep.tsx` - Step pattern for multi-step zones
- `components/ui/scrolly/ScrollyStage.tsx` - Copy styling before deletion

### Component Relationship (BlogWithCanvas)
```
BlogWithCanvas (page wrapper)
├── [Any content - shifts with marginRight]
├── CanvasZone mode="stepped"
│   ├── CanvasStep (registers with CanvasZoneContext)
│   └── Canvas shows step-specific content
├── CanvasGap (closes canvas)
├── CanvasZone mode="static"
│   └── Canvas shows static content
└── CanvasEnd (terminal sentinel)
```

### Branch State
- Branch: `scrollyCoding` (continue on this branch)
- Last commit: `d90cd9a` - checkpoint before refactor
