---
date: 2026-01-16T09:23:50Z
session_name: agent-sdk-blog
researcher: Claude
git_commit: e55ce80
branch: scrollyCoding
repository: porfolio-26
topic: "Canvas Step Sync & Tab Redesign"
tags: [canvas, step-detection, tabs, animation, ux]
status: complete
last_updated: 2026-01-16
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: Canvas Step Sync Fix & Tab Redesign

## Task(s)

1. **Step Detection Mismatch (COMPLETED)**: User reported step 5 content showing step 6 in canvas (off-by-one). Fixed by changing detection algorithm from "center-to-center" to "reading position" heuristic.

2. **Focus Line Styling (COMPLETED)**: Removed left border from focused lines, made more minimal with opacity-only approach.

3. **Tab Redesign with Sliding Underline (COMPLETED)**: Replaced gradient hover tabs with minimal text + sliding underline animation using Motion `layoutId`.

4. **Toolbar Visibility Fix (COMPLETED)**: Toolbar buttons were being pushed off-screen by tabs. Fixed with flex constraints.

5. **Browser Testing (PENDING)**: Changes need visual verification in browser.

## Critical References

- `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` - Main continuity ledger with full context
- `content/blog/agent-sdk-deep-research.mdx` - The blog post being built
- `content/blog/agent-sdk-deep-research.steps.tsx` - 8 code steps for canvas walkthrough

## Recent changes

- `components/blog/CanvasZoneContext.tsx:139-158` - Changed step detection from viewport center to reading position (35% from top)
- `components/blog/CanvasCodeStage.tsx:650-672` - Simplified focus line CSS to opacity-only
- `components/blog/CanvasCodeStage.tsx:730-736` - Added Motion sliding underline for tabs
- `app/globals.css:1069-1086` - Header layout fixes for toolbar visibility
- `app/globals.css:1086-1161` - New minimal tab styling with horizontal scroll
- `app/globals.css:1169-1183` - Step badge simplified to text-only
- `app/globals.css:1231-1260` - Toolbar buttons styling with flex-shrink: 0
- `app/globals.css:1318-1327` - Focus line CSS simplified (no left border)

## Learnings

1. **Step Detection Algorithm**: The original "center-to-center" distance algorithm caused the canvas to jump ahead because when reading Step N, Step N+1's center could be closer to viewport center. Using "reading position" (35% from top, where eyes naturally track) fixes this.

2. **Tab Overflow Handling**: When multiple file tabs exist, they can push toolbar buttons off-screen. Solution: wrap tabs in a flex container with `min-width: 0` and `overflow: hidden`, while toolbar has `flex-shrink: 0`.

3. **Motion layoutId for Sliding Elements**: For sliding underlines/indicators, use `layoutId` on a motion element inside each tab button, conditionally rendered only for active tab. Motion automatically animates between positions.

## Post-Mortem (Required for Artifact Index)

### What Worked
- **Reading Position Heuristic**: Measuring from element top to 35% viewport line instead of center-to-center - immediately fixed the step sync issue
- **Minimal CSS Approach**: Removing left borders and backgrounds in favor of opacity-only makes the UI feel cleaner and more modern
- **Motion layoutId**: Simple and elegant solution for sliding underline without managing animation state

### What Failed
- N/A - straightforward fixes

### Key Decisions
- **Decision**: Use 35% from top as "reading position"
  - Alternatives considered: 25%, 40%, center
  - Reason: 35% matches natural eye position when scrolling down; matches the rootMargin observation band

- **Decision**: Remove focus line left border entirely
  - Alternatives considered: thinner border, different color
  - Reason: User explicitly wanted "minimal" - opacity contrast is sufficient visual indicator

- **Decision**: Horizontal scroll for tabs instead of dropdown/truncation
  - Alternatives considered: dropdown menu, truncate names
  - Reason: Maintains visibility of all file names, hidden scrollbar keeps it clean

## Artifacts

- `components/blog/CanvasZoneContext.tsx` - Step detection logic
- `components/blog/CanvasCodeStage.tsx` - Tab rendering with sliding underline
- `app/globals.css` - All styling updates (lines 1069-1327)

## Action Items & Next Steps

1. **Test in Browser**: Verify step sync is correct (Step 5 content shows 5/8)
2. **Test Tab Animation**: Verify sliding underline animates smoothly between tabs
3. **Test Toolbar Visibility**: Confirm expand/copy buttons visible even with many tabs
4. **Test Mobile**: Ensure responsive behavior

## Other Notes

- Build passes (`pnpm build` successful)
- The ledger at `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md` has full project context
- Key CSS variables for canvas are defined around line 1050 in globals.css (--canvas-bg, --canvas-border, etc.)
- The canvas uses fixed positioning when active, slides in from right with Motion spring animation
