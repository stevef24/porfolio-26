---
date: 2026-01-07T04:47:50Z
session_name: scrolly-coding
researcher: Claude
git_commit: d7efa1e45c7c1c1eae0872d289afa6c03956aba2
branch: scrollyCoding
repository: porfolio-26
topic: "Physical Push Drawer Animation - Trigger Timing Fix"
tags: [scrolly-coding, animation, motion, drawer, trigger-timing]
status: in_progress
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Scrolly Drawer Trigger Timing Needs Adjustment

## Task(s)

**COMPLETED:**
1. Refactored ScrollyCoding.tsx to create "physical push" animation
2. Separated trigger zone from padding zones (stepsContainerRef)
3. Added content lock wrapper (680px) to prevent text reflow
4. Added CSS variable `--scrolly-content-lock-width`
5. Build passes with no TypeScript errors

**IN PROGRESS - ISSUE DISCOVERED:**
The trigger margins are not restrictive enough. User testing revealed:
- **Entering too early**: Drawer opens while "The Core Pattern" intro is still visible
- **Exiting too late**: Drawer stays open while "What We Built" outro is visible

## Critical References
- `components/ui/scrolly/ScrollyCoding.tsx:64-69` - Current trigger margin logic
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full implementation context
- `/.claude/plans/precious-crafting-chipmunk.md` - Original implementation plan

## Recent changes

**ScrollyCoding.tsx:**
- Line 62: Added `stepsContainerRef` to track only steps (not padding)
- Line 64-69: Changed trigger from `contentRef` to `stepsContainerRef` with margin `-20% 0px -20% 0px`
- Line 117: Changed content lock from 840px to 680px
- Line 127: Added `ref={stepsContainerRef}` to steps container div
- Removed unused: `drawerWidth`, `stageConfig`, `doc` param, `SCROLLY_DEFAULTS` import, `AnimatePresence` import

**globals.css:**
- Line 123: Added `--scrolly-content-lock-width: 680px`

## Learnings

1. **`useInView` margin behavior**: Negative margins SHRINK the trigger zone. `-20%` means the element must be 20% INTO the viewport from each edge before triggering. Current `-20% 0px -20% 0px` is not aggressive enough.

2. **The issue from screenshots:**
   - Screenshot 1: "The Core Pattern" heading visible + drawer already open = entering too early
   - Screenshot 2: "What We Built" section visible + drawer still open = exiting too late

3. **The fix needed**: Increase negative margins to be MORE restrictive, e.g.:
   - Try `-40% 0px -40% 0px` (steps must be 40% into viewport)
   - Or `-45% 0px -45% 0px` to match step activation margin
   - May need asymmetric margins: larger top margin (later entry), smaller bottom margin (earlier exit)

4. **Alternative approach**: Instead of relying solely on `useInView`, could use the first/last step's `isInView` state to control drawer open/close.

## Post-Mortem (Required for Artifact Index)

### What Worked
- Separating `stepsContainerRef` from padding zones was architecturally correct
- Content lock wrapper (680px) prevents text reflow during animation
- Spring physics (`springScrollySplit`) feels smooth and cinematic
- Build/TypeScript verification caught issues early

### What Failed
- Tried: `-20% 0px -20% 0px` margin → Failed because: Not restrictive enough, triggers too early/late
- The trigger zone needs to be MORE centered for proper UX

### Key Decisions
- Decision: Track `stepsContainerRef` instead of `contentRef`
  - Alternatives considered: Track first/last step individually
  - Reason: Simpler single ref, but may need to revisit if margin tuning doesn't work

- Decision: 680px content lock width
  - Alternatives considered: 600px, 720px
  - Reason: Narrower than 840px to prevent reflow, wide enough for readability

## Artifacts
- `components/ui/scrolly/ScrollyCoding.tsx` - Main changes
- `app/globals.css:123` - CSS variable addition
- `/.claude/plans/precious-crafting-chipmunk.md` - Implementation plan
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full context

## Action Items & Next Steps

1. **IMMEDIATE FIX**: Change margin from `-20% 0px -20% 0px` to more restrictive value:
   ```tsx
   // In ScrollyCoding.tsx line 67-68
   const isStepsInView = useInView(stepsContainerRef, {
     margin: "-45% 0px -45% 0px", // Try -45% to match step activation
   });
   ```

2. **TEST VALUES**: If -45% doesn't work, try:
   - `-40% 0px -40% 0px`
   - Asymmetric: `-50% 0px -30% 0px` (enter later, exit earlier)

3. **ALTERNATIVE APPROACH** (if margin tuning fails):
   - Use first step's `isInView` to trigger open
   - Use last step's `isInView` to trigger close
   - Requires passing step refs up to parent

4. **VERIFY**: After fix, test by scrolling through `/blog/scrolly-demo`:
   - Drawer should stay closed through "The Core Pattern" intro
   - Drawer should open when "DEFINE THE STATE SHAPE" step enters center
   - Drawer should close before "What We Built" section is readable

## Other Notes

**Dev server running**: `pnpm dev` on port 3000 (background task bdb0b07)

**Devouring Details Reference**: The reference implementation at https://devouringdetails.com/prototypes/nextjs-dev-tools keeps split open for entire page. User wants split ONLY during scrolly steps, closing for intro/outro.

**Key file locations:**
- ScrollyCoding trigger logic: `components/ui/scrolly/ScrollyCoding.tsx:64-79`
- Step activation margin: Uses `-45% 0px -45% 0px` (in ScrollyStep.tsx)
- Spring config: `lib/motion-variants.ts` (`springScrollySplit`)

**Quick test command:**
```bash
# Dev server should already be running
open http://localhost:3000/blog/scrolly-demo
```
