---
date: 2026-01-06T16:08:50Z
session_name: scrolly-coding
researcher: Claude
git_commit: d7efa1e
branch: scrollyCoding
repository: porfolio-26
topic: "ScrollyCoding Entrance Animation"
tags: [scrolly-coding, animation, motion, entrance-animation]
status: complete
last_updated: 2026-01-06
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: ScrollyCoding Entrance Animation

## Task(s)
- **COMPLETED**: Implement scroll-triggered entrance animation for ScrollyCoding
  - User wanted the scrolly section to "slide in like a sliding navbar" when scrolled into view
  - Inspired by devouringdetails.com/prototypes/nextjs-dev-tools layout
  - Initially explored full layout animation (prose shifting left) but simplified to entrance-only animation

- **COMPLETED**: Clean up unused exploration code
  - Removed unused layout context files created during exploration
  - Removed unused import from blog page

## Critical References
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Main continuity ledger with all phase history
- `components/ui/scrolly/ScrollyCoding.tsx` - Main component with entrance animation

## Recent changes
- `components/ui/scrolly/ScrollyCoding.tsx:56-82` - Added entrance animation with Motion useInView
- `components/ui/scrolly/ScrollyCoding.tsx:87-106` - Changed `<section>` to `<motion.section>` with animation props
- Removed: `components/ui/scrolly/ScrollyLayoutContext.tsx` (unused)
- Removed: `components/ui/scrolly/ScrollyLayoutWrapper.tsx` (unused)
- Removed: `components/blog/BlogScrollyLayout.tsx` (unused)

## Learnings
1. **Full-bleed layout + transform animations conflict**: Using `mx-auto` with CSS transforms doesn't work as expected. The centered content doesn't shift visually with `translateX()`.

2. **Nested full-bleed components complicate wrapper animations**: ScrollyCoding uses negative margin full-bleed pattern (`left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]`). Animating a wrapper also moves the scrolly section, defeating the purpose.

3. **Simpler approach won**: Instead of animating surrounding content, animate the ScrollyCoding section itself sliding in when scrolled to. Less complex, more reliable.

4. **Motion useInView pattern**:
   ```tsx
   const isInView = useInView(sectionRef, {
     once: true,
     margin: "0px 0px -20% 0px", // Trigger when 20% from bottom
   });
   ```

## Post-Mortem (Required for Artifact Index)

### What Worked
- **Motion useInView hook**: Clean API for scroll-triggered animations, `once: true` prevents re-triggering
- **Spring physics (`springSmooth`)**: Natural feel for entrance animation
- **Slide-up with fade + scale**: Subtle but effective entrance (`y: 100, opacity: 0, scale: 0.98` → visible)
- **Reduced motion support**: Using `useReducedMotion()` to disable animation when preferred

### What Failed
- **Full layout animation approach**: Tried creating ScrollyLayoutContext and ScrollyLayoutWrapper to animate prose content shifting left. Failed because:
  - `mx-auto` + transforms don't work together for centering
  - Full-bleed nested components moved with the wrapper
  - Too complex for the visual effect desired
- **Slide-from-right (`x: "100%"`)**: Initially tried horizontal slide but conflicted with full-bleed layout causing overflow issues

### Key Decisions
- **Decision**: Animate ScrollyCoding entrance only, not surrounding content
  - Alternatives: Full layout animation (prose shifts left), CSS scroll-driven animation
  - Reason: Simpler, more reliable, still achieves the "sliding navbar" effect user wanted

- **Decision**: Slide-up animation (`y: 100`) instead of slide-from-side
  - Alternatives: `x: "100%"` (slide from right)
  - Reason: Horizontal slide caused overflow issues with full-bleed layout

## Artifacts
- `components/ui/scrolly/ScrollyCoding.tsx` - Main component with entrance animation
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Updated ledger

## Action Items & Next Steps
1. **Manual testing**: Test the entrance animation on `/blog/scrolly-demo` across:
   - Desktop Chrome/Firefox/Safari
   - Mobile viewport
   - With `prefers-reduced-motion` enabled

2. **Optional enhancements**:
   - Adjust animation trigger point (currently 20% from bottom)
   - Fine-tune spring physics if feel isn't right
   - Consider adding exit animation for when scrolling away (currently only entrance)

3. **Push to remote**: Changes committed locally, ready to push when satisfied

## Other Notes
- All 9 phases of ScrollyCoding implementation are complete
- The entrance animation is an enhancement on top of the completed system
- Build verified passing with all 20 static pages generated
- Commit: `d7efa1e feat(scrolly): add scroll-triggered entrance animation`
