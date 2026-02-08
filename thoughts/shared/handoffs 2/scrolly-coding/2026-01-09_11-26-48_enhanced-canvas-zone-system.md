---
date: 2026-01-09T11:26:48+0700
session_name: scrolly-coding
researcher: Claude
git_commit: b39eee8
branch: scrollyCoding
repository: porfolio-26
topic: "Enhanced CanvasZone System Implementation Strategy"
tags: [canvas-zone, multi-step, render-mode, code-drawer, devouring-details]
status: planning_complete
last_updated: 2026-01-09
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Enhanced CanvasZone System - Multi-Step & Render Mode

## Task(s)

| Task | Status |
|------|--------|
| Analyze Devouring Details reference site | COMPLETED |
| Design enhanced CanvasZone API | COMPLETED |
| Create implementation plan | COMPLETED |
| Update canvas-tutorial documentation | COMPLETED |
| Fix Motion error (layout-bottombar-collapse-icon) | PLANNED |
| Implement multi-step context & CanvasStep | PLANNED |
| Implement RenderCanvas component | PLANNED |
| Implement CodeDrawer component | PLANNED |
| Mobile fallback | PLANNED |
| Update test page | PLANNED |

**Current Phase**: Planning complete. Ready to begin Phase 1 implementation.

**Plan Reference**: `.claude/plans/cheerful-meandering-manatee.md`

## Critical References

- `docs/phases/canvas-tutorial/README.md` - Updated phase overview with enhancement phases
- `.claude/plans/cheerful-meandering-manatee.md` - Detailed implementation plan
- Reference site: https://devouringdetails.com/prototypes/nextjs-dev-tools

## Recent Changes

- `docs/phases/canvas-tutorial/README.md` - Updated with completed phases (1-4) and planned enhancement phases (5-8)

## Learnings

1. **Devouring Details UX Patterns** (from browser analysis):
   - Multi-step within zones: Canvas content changes based on scroll position WITHIN a single zone
   - Visual hierarchy: Active paragraph at 100% opacity, others at 50%
   - Toolbar position: Top-right corner with fullscreen, refresh, link, code buttons
   - Canvas shows rendered UI, code is inline in article OR in slide-up drawer
   - Bottom bar: Floating toolbar at bottom center

2. **Current Architecture** (from codebase exploration):
   - Two separate systems exist: `CanvasZone` (single-step) and `ScrollyCoding` (multi-step)
   - `CanvasZone` uses `IntersectionObserver` via `BlogWithCanvas` provider
   - `ScrollyCoding` uses `useInView` from Motion for scroll detection
   - `CodeCanvas` is standalone and accepts `activeStep` prop - can be reused

3. **Motion Error Root Cause**:
   - `components/ui/layout-bottombar-collapse-icon.tsx:23` animates `.bottombar` selector
   - The element with that class doesn't exist when animation runs
   - Fix: Add `className="bottombar"` to the bottom bar path element

4. **User Requirements Clarified**:
   - Render mode: Pre-built demo components (imported at build time) - NOT runtime eval
   - Step control: Scroll-triggered like Devouring Details
   - Visual hierarchy: Opacity fade (100% active, 50% inactive)
   - Code drawer: Slides up from bottom when viewing rendered component

## Post-Mortem

### What Worked
- Browser automation to analyze Devouring Details reference site - captured key UX patterns
- Task agent for codebase exploration - comprehensive understanding of dual canvas systems
- Structured question flow via AskUserQuestion - clarified all ambiguous requirements

### What Failed
- Initial browser tab had connectivity issues - created new tab and retried successfully
- Plan file reference in handoff didn't exist at first path checked - plan file is in `.claude/plans/`

### Key Decisions
- **Decision**: Create new components (CanvasStep, RenderCanvas, CodeDrawer) rather than heavily modifying existing
  - Alternatives: Merge ScrollyCoding and CanvasZone into single system
  - Reason: Cleaner separation, CanvasZone layout is different from ScrollyCoding

- **Decision**: Use pre-built demo components for render mode
  - Alternatives: Runtime eval (react-live), iframe sandbox (CodeSandbox)
  - Reason: Most reliable, full TypeScript support, no security concerns

- **Decision**: Scroll-triggered step progression (like ScrollyCoding)
  - Alternatives: Button navigation, hybrid
  - Reason: Matches Devouring Details reference, more immersive experience

## Artifacts

**Plan files:**
- `.claude/plans/cheerful-meandering-manatee.md` - Full implementation plan with 7 phases

**Documentation:**
- `docs/phases/canvas-tutorial/README.md` - Updated phase overview

**Reference (existing, to build upon):**
- `components/blog/CanvasZone.tsx` - Current zone component
- `components/blog/BlogWithCanvas.tsx` - Parent orchestrator
- `components/ui/scrolly/CodeCanvas.tsx` - Existing code canvas
- `components/ui/scrolly/ScrollyStep.tsx` - Reference for scroll-triggered steps
- `components/ui/scrolly/ScrollyContext.tsx` - Reference for step context

## Action Items & Next Steps

### Phase 1: Fix Motion Error (Priority - Quick Fix)
1. Open `components/ui/layout-bottombar-collapse-icon.tsx`
2. Add `className="bottombar"` to the bottom bar path element (around line 68)
3. Test that icon hover animation works without console errors

### Phase 2: Create CanvasZoneContext & CanvasStep
1. Create `components/blog/CanvasZoneContext.tsx` - Track active step within zone
2. Create `components/blog/CanvasStep.tsx` - Scroll-triggered step wrapper using `useInView`
3. Wire up opacity animation (active: 100%, inactive: 50%)

### Phase 3: Enhance CanvasZone
1. Add `type` prop (`"code"` | `"render"`)
2. Add multi-step props (`compiledSteps`, `steps`, `renderComponent`, `renderCode`)
3. Wrap children with `CanvasZoneProvider`
4. Pass `activeStepIndex` to canvas components

### Phase 4: Create RenderCanvas
1. Create `components/blog/RenderCanvas.tsx`
2. Render pre-built component in canvas area
3. Add floating toolbar with fullscreen and code buttons

### Phase 5: Create CodeDrawer
1. Create `components/blog/CodeDrawer.tsx`
2. Implement slide-up animation (from bottom, covers ~60%)
3. Add syntax highlighting with Shiki
4. Add copy button and close functionality

### Phase 6: Mobile Fallback
1. Each `CanvasStep` shows inline canvas after content on mobile
2. Code mode: Static highlighted code (no Magic Move)
3. Render mode: Component inline with expandable code accordion

### Phase 7: Update Test Page
1. Add multi-step code zone example
2. Add render mode zone with demo component
3. Add render mode + code drawer toggle example

## Other Notes

**Test page**: http://localhost:3000/canvas-test

**New files to create:**
```
components/blog/
  CanvasZoneContext.tsx    # Step tracking context
  CanvasStep.tsx           # Individual step component
  RenderCanvas.tsx         # Component rendering canvas
  CodeDrawer.tsx           # Slide-up code panel
```

**Animation constants to add** (`lib/motion-variants.ts`):
- `slideUpDrawer` - Code drawer slide-up animation
- `stepOpacity` - Step opacity transition

**Multi-step scroll tracking algorithm:**
```
User scrolls → CanvasStep enters center zone (useInView margin: "-40% 0px -40% 0px")
             → setActiveStepIndex(index) called
             → CanvasZone reads activeStepIndex from context
             → Passes to CodeCanvas (Magic Move) or RenderCanvas
```
