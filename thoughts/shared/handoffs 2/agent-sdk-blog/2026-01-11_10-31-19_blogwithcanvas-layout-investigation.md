---
date: 2026-01-11T10:31:19+0700
session_name: agent-sdk-blog
researcher: Claude
git_commit: d90cd9a
branch: scrollyCoding
repository: porfolio-26
topic: "BlogWithCanvas Layout Investigation - Content Not Shifting"
tags: [investigation, layout, blogwithcanvas, canvas-test, scrollycoding]
status: in_progress
last_updated: 2026-01-11
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: BlogWithCanvas Layout Not Shifting Content

## Task(s)

**Status: Phase 4 Complete, Layout Bug Discovered**

Resumed from handoff `2026-01-10_16-54-52_remove-scrollycoding-use-blogwithcanvas.md` to complete the ScrollyCoding removal and rebuild with BlogWithCanvas.

| Phase | Status |
|-------|--------|
| Phase 2: Delete ScrollyCoding system | ✅ Complete |
| Phase 3: Create CanvasCodeStage | ✅ Complete |
| Phase 4: Rebuild agent SDK blog | ✅ Complete (build passes) |
| Phase 5: Manual testing | ❌ **LAYOUT BUG** - content squishes instead of shifting |

**Working from plan:** `/Users/stavfernandes/.claude/plans/dapper-greeting-blanket.md`

## Critical References

1. `app/canvas-test/page.tsx` (DELETED but exists in git at commit `d90cd9a`) - **THIS IS THE REFERENCE THAT WORKED**
2. `components/blog/BlogWithCanvas.tsx:485-535` - The layout component with margin animation
3. `app/blog/[slug]/page.tsx` - Blog page that wraps MDX in SiteShell container

## Recent changes

This session made the following changes:

**Deleted:**
- `components/ui/scrolly/*` - All 13 ScrollyCoding components
- `lib/scrolly/*` - 4 utility files
- `content/blog/projected-drag.*`, `scrolly-demo.*`, `example-scrolly.*`
- `content/tutorials/react-basics.steps.tsx`

**Created:**
- `components/blog/CanvasCodeStage.tsx` - Code display for canvas sidebar
- `components/blog/AgentCodeWalkthrough.tsx` - MDX wrapper for stepped walkthrough

**Modified:**
- `lib/custom-components.tsx:24-28, 248-255` - Added BlogWithCanvas, CanvasGap, CanvasEnd, CanvasCodeStage, AgentCodeWalkthrough exports
- `content/blog/agent-sdk-deep-research.mdx` - Rewrote with BlogWithCanvas pattern
- `content/blog/agent-sdk-deep-research.steps.tsx` - Changed import from scrolly types to CanvasCodeStage
- `components/ui/blog/RulerTOC.tsx:6,41-44,191-195` - Removed scrolly drawer dependency
- `components/blog/BlogWithCanvas.tsx:504-510` - Attempted fix: added full-bleed breakout CSS (NEEDS INVESTIGATION)

## Learnings

### Root Cause of Layout Bug (CRITICAL)

The issue is **container nesting**:

1. **Working canvas-test page** (`d90cd9a:app/canvas-test/page.tsx`):
   - `BlogWithCanvas` was the TOP-LEVEL wrapper
   - No parent container constraining it
   - `marginRight: 50vw` animation worked correctly

2. **Broken blog page** (`app/blog/[slug]/page.tsx`):
   - MDX rendered inside `SiteShell` (line 132)
   - `SiteShell` has container: `max-w-[var(--content-width)]` (SiteShell.tsx:82)
   - `BlogWithCanvas` inside MDX is INSIDE this constrained container
   - `marginRight: 50vw` just squishes content within the container

**Visual symptom:** Text breaks word-by-word because container gets very narrow instead of content shifting left.

### Attempted Fix (Incomplete)

Added CSS full-bleed breakout to BlogWithCanvas.tsx:504-510:
```tsx
"w-screen -ml-[calc((100vw-100%)/2)]"
```
This was just applied but NOT TESTED yet.

### Key Architecture Insight

`BlogWithCanvas` has two parts:
1. **Blog column** - Animates `marginRight` from 0 to 50vw
2. **Canvas column** - Fixed position, slides in from right with `x: 100% -> 0%`

The canvas column (fixed position) works fine. The problem is the blog column margin animation being constrained.

## Post-Mortem (Required for Artifact Index)

### What Worked
- Deleting ScrollyCoding system cleanly (no orphaned imports)
- Creating `AgentCodeWalkthrough` wrapper to handle render function serialization in MDX
- Build passes with all changes
- Canvas panel appears and shows code correctly

### What Failed
- `BlogWithCanvas` inside MDX doesn't work because it's nested in SiteShell's container
- The margin animation squishes content instead of shifting the whole layout
- Attempted CSS breakout fix (`w-screen -ml-[calc((100vw-100%)/2)]`) - untested

### Key Decisions
- **Decision**: Delete ScrollyCoding entirely, use BlogWithCanvas
  - Reason: Two layout systems were competing, BlogWithCanvas was designed for page-level shifts
- **Decision**: Create wrapper components for MDX (AgentCodeWalkthrough)
  - Reason: MDX can't serialize render functions, needed client component wrapper

## Artifacts

- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Updated with Phase 4 completion
- `thoughts/shared/plans/dapper-greeting-blanket.md` - Original plan (superseded by layout fix need)
- `components/blog/CanvasCodeStage.tsx` - New code stage component
- `components/blog/AgentCodeWalkthrough.tsx` - MDX wrapper
- `content/blog/agent-sdk-deep-research.mdx` - Rebuilt blog post

## Action Items & Next Steps

### IMMEDIATE: Investigate canvas-test from git history

**User requested:** Look at the working canvas-test page from commit `d90cd9a` to understand exactly what made it work.

```bash
# View the working canvas-test page
git show d90cd9a:app/canvas-test/page.tsx

# Compare its structure to the current blog page
git show d90cd9a:app/blog/[slug]/page.tsx
```

### Two possible solutions to investigate:

1. **Page-level BlogWithCanvas**: Conditionally wrap at page level for posts that need canvas
   - Requires detecting which posts use canvas (frontmatter flag?)
   - Clean separation but more complex

2. **CSS breakout fix**: Make BlogWithCanvas break out of parent container
   - Just applied `w-screen -ml-[calc((100vw-100%)/2)]` - needs testing
   - May have side effects, needs viewport scroll issues checked

### After fix verified:
- Test all 8 code steps transition correctly
- Test CanvasGap closes canvas
- Test AgentArchitectureDemo in static zone
- Test mobile (canvas inline)
- Test theme switching

## Other Notes

### Key Files to Read

1. **Working reference** (from git):
   ```bash
   git show d90cd9a:app/canvas-test/page.tsx
   ```

2. **Current blog page structure**:
   - `app/blog/[slug]/page.tsx` - wraps in SiteShell
   - `components/layout/SiteShell.tsx:82` - has constraining container

3. **BlogWithCanvas animation logic**:
   - `components/blog/BlogWithCanvas.tsx:515-524` - marginRight animation
   - `components/blog/BlogWithCanvas.tsx:504-510` - new breakout CSS (untested)

### Screenshot of Bug

The user provided a screenshot showing:
- Canvas panel appears on right (correct)
- Title "Building a Deep Research Agent with..." gets cut off
- Body text breaks word-by-word (squished, not shifted)
- Step indicator shows "Step 1 of 8" (stepping works)

The canvas functionality WORKS - it's purely a layout/container issue.
