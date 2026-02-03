---
date: 2026-01-16T05:55:07Z
session_name: agent-sdk-blog
researcher: Claude
git_commit: e55ce80
branch: scrollyCoding
repository: porfolio-26
topic: "RulerTOC Compact Layout & Blur Exit Transitions"
tags: [implementation, animation, toc, motion, blur-transition, compact-layout]
status: complete
last_updated: 2026-01-16
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: RulerTOC Compact & Smooth Exit Animations

## Task(s)

Resumed from: `thoughts/shared/handoffs/agent-sdk-blog/2026-01-16_12-30-17_toc-morph-visual-testing.md`

**Status:**
- [x] Fix section click accuracy (off by one issue)
- [x] Speed up hover animation (reduce delay)
- [x] Add blur transition on morph in/out
- [x] Make hover state compact and scrollable
- [ ] **Visual testing needed** - Changes complete but user reports still seeing old behavior

## Critical References

1. **Continuity ledger**: `thoughts/ledgers/CONTINUITY_CLAUDE-agent-sdk-blog.md`
2. **Previous handoff**: `thoughts/shared/handoffs/agent-sdk-blog/2026-01-16_12-30-17_toc-morph-visual-testing.md`

## Recent changes

### components/ui/blog/RulerTOC.tsx

- **Lines 7-19**: Added two spring presets:
  - `springTocIn`: Fast spring for hover-in (0.15s, bounce 0.05)
  - `springTocOut`: Slower spring for hover-out (0.25s, bounce 0)

- **Line 67**: Changed hover padding from `py-1` to `py-0.5` for compact layout

- **Lines 75, 111, 249**: Updated transitions to use conditional spring:
  - `isHovered ? springTocIn : springTocOut`

- **Lines 100-104**: Changed morphing content to use inline backgroundColor style instead of cn() class toggle

- **Lines 116-124**: Updated text animation:
  - Font size: `text-[13px]` → `text-[11px]`
  - Max width: `max-w-[180px]` → `max-w-[160px]`
  - Added `leading-tight`
  - Faster transition: duration 0.12s → 0.1s, delay 0.08s → 0.02s

- **Lines 239**: Reduced container padding: `py-2 px-3` → `py-1.5 px-2.5`

- **Lines 256-261**: Updated scrollable container:
  - Gap now conditional: `gap-[6px]` when collapsed, `gap-0` when hovered
  - Max height: `max-h-[45vh]` → `max-h-[40vh]`

### app/globals.css

- **Lines 1634-1670**: Added `.scrollbar-thin` utility class with:
  - 4px scrollbar width
  - Translucent thumb styling
  - Dark mode variants

## Learnings

1. **Click accuracy fix**: Using `window.scrollTo()` with an 80px offset instead of `scrollIntoView({ block: "start" })` positions headings within the IntersectionObserver detection zone (rootMargin: "-20% 0% -60% 0%")

2. **Exit animation smoothness**: Using different springs for enter vs exit transitions creates perceived polish:
   - Fast enter (0.15s, bounce 0.05) feels responsive
   - Slow exit (0.25s, no bounce) feels gentle, reduces harshness

3. **Conditional transitions in Motion**: Can use ternary in `transition` prop:
   ```tsx
   transition={prefersReducedMotion ? { duration: 0 } : isHovered ? springTocIn : springTocOut}
   ```

4. **User reports discrepancy**: User screenshot still shows large spacing between items after changes were made. This could indicate:
   - Browser cache not cleared
   - Dev server needs hard refresh
   - CSS not being applied correctly

## Post-Mortem (Required for Artifact Index)

### What Worked
- Motion MCP's `visualise-spring` tool helped select appropriate spring parameters
- Separating enter/exit springs provides fine-grained animation control
- Inline styles for backgroundColor avoid class flicker during state transitions

### What Failed
- User still seeing old (non-compact) layout after changes
- Need to verify changes are being applied in browser (possible cache issue)

### Key Decisions
- Decision: Use `gap-0` when hovered instead of small gap
  - Alternatives considered: `gap-0.5` (2px), `gap-1` (4px)
  - Reason: Maximally compact for scrollable list with many items

- Decision: Two separate spring presets instead of one
  - Alternatives considered: Single spring, CSS transitions
  - Reason: Different feel for enter (snappy) vs exit (smooth)

## Artifacts

- `components/ui/blog/RulerTOC.tsx` - Main component with all animation/layout changes
- `app/globals.css:1634-1670` - Scrollbar utility class

## Action Items & Next Steps

1. **Verify changes in browser**:
   - Hard refresh (Cmd+Shift+R) on `http://localhost:3000/blog/agent-sdk-deep-research`
   - Or restart dev server: `pnpm dev`
   - Check if TOC is now compact when hovered

2. **If still seeing old behavior**:
   - Clear `.next` cache: `rm -rf .next && pnpm dev`
   - Check browser DevTools to verify CSS classes are applied

3. **Test exit animation**:
   - Hover over TOC, then hover away
   - Verify smooth blur transition (text should blur out, lines should fade in gently)

4. **Optional: Further refinement**:
   - If exit still feels harsh, increase `springTocOut.visualDuration` to 0.3s
   - Consider adding `filter: blur()` animation to the line element itself

## Other Notes

- Dev server running in background (task ID: b531806)
- TOC is positioned at `fixed left-6 top-1/2` (approx 24px from left edge)
- Max height of 40vh should allow ~12-15 items before scrolling kicks in
- Scrollbar appears thin (4px) with subtle styling when content overflows
