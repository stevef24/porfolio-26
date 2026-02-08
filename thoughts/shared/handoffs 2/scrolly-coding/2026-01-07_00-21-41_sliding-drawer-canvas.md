---
date: 2026-01-07T00:21:41+07:00
session_name: scrolly-coding
researcher: Claude
git_commit: d7efa1e45c7c1c1eae0872d289afa6c03956aba2
branch: scrollyCoding
repository: porfolio-26
topic: "ScrollyCoding Sliding Drawer Animation"
tags: [implementation, scrolly, animation, drawer, motion, toc]
status: complete
last_updated: 2026-01-07
last_updated_by: Claude
type: implementation_strategy
root_span_id: ""
turn_span_id: ""
---

# Handoff: ScrollyCoding Sliding Drawer Canvas Animation

## Task(s)

**Completed:**
1. ✅ Implemented sliding drawer animation for ScrollyCoding canvas (Devouring Details inspired)
2. ✅ Canvas slides in from right edge when entering scrolly section
3. ✅ Blog content compresses to left (50vw) when drawer opens
4. ✅ Canvas slides out when exiting section
5. ✅ RulerTOC slides out to prevent overlap when drawer active
6. ✅ Added magnetic hover effect to TOC (nearby items react to cursor proximity)
7. ✅ Main sections appear bolder, subsections lighter in TOC
8. ✅ Build passes with all changes

## Critical References

- `docs/scrolly-drawer-animation.md` - Technical explanation of the animation approach
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Full implementation ledger
- `.claude/plans/sharded-launching-teapot.md` - Original implementation plan

## Recent Changes

| File | Change |
|------|--------|
| `components/ui/scrolly/ScrollyDrawerContext.tsx` | NEW - Drawer state context (isDrawerOpen, openDrawer, closeDrawer) |
| `components/ui/scrolly/ScrollyCoding.tsx:1-218` | Major refactor - dual sentinel pattern, AnimatePresence drawer, content compression |
| `components/ui/scrolly/ScrollyStage.tsx:156` | Minor - clarified h-full comment |
| `components/ui/scrolly/index.ts:37-42` | Added drawer context exports |
| `components/ui/blog/RulerTOC.tsx:1-391` | Added drawer coordination + magnetic hover effect |
| `lib/motion-variants.ts:386-426` | Added springDrawer, springContentCompress, drawerSlideIn, tocSlideOut |
| `app/globals.css:120-122` | Added --scrolly-drawer-width, --scrolly-content-compressed CSS vars |
| `docs/scrolly-drawer-animation.md` | NEW - Technical documentation |

## Learnings

### Dual Sentinel Pattern
Using two invisible sentinel elements with `useInView` provides precise scroll boundary detection:
- Top sentinel (`margin: "0px 0px -80% 0px"`) triggers drawer open
- Bottom sentinel (`margin: "-80% 0px 0px 0px"`) helps detect exit
- Combining both states gives accurate entrance/exit without continuous scroll listeners

### Fixed vs Sticky Positioning
`position: fixed` is required for true drawer behavior:
- `sticky` keeps element within parent flow - can't slide from viewport edge
- `fixed` anchors to viewport - enables slide from actual screen edge

### Magnetic Hover Implementation
Track mouse Y position on container, calculate distance-based transform for each item:
```
proximity = 1 - (distance / maxDistance)
y = -proximity * 4      // Raise up to 4px
scale = 1 + proximity * 0.15  // Scale up to 1.15x
```

### Context Optional Hook Pattern
`useScrollyDrawerOptional()` returns `null` if no provider exists - safe for pages without scrolly sections.

## Post-Mortem

### What Worked
- **Dual sentinel pattern**: Clean separation of entrance/exit detection without scroll listeners
- **AnimatePresence**: Smooth exit animations for the drawer
- **Spring physics**: Motion's 2026 time-based API (`visualDuration`, `bounce`) for natural feel
- **Context separation**: ScrollyDrawerContext allows RulerTOC to coordinate without tight coupling

### What Failed
- **Initial grid-based approach**: Tried animating grid columns first, but grid doesn't support true viewport-edge sliding
- **Single sentinel**: One `useInView` on section didn't give precise enough control

### Key Decisions
- **Decision**: Use `position: fixed` for canvas instead of `sticky`
  - Alternatives: CSS grid animation, sticky with transforms
  - Reason: True drawer behavior requires viewport anchoring

- **Decision**: Dual sentinel pattern for scroll detection
  - Alternatives: `useScroll` with progress thresholds, single IntersectionObserver
  - Reason: Precise threshold triggers without continuous listeners

- **Decision**: Content compression via `maxWidth` + `margin`
  - Alternatives: Transform-based width, grid column animation
  - Reason: Natural text reflow with spring physics

## Artifacts

- `components/ui/scrolly/ScrollyDrawerContext.tsx` - NEW
- `components/ui/scrolly/ScrollyCoding.tsx` - REFACTORED
- `components/ui/scrolly/ScrollyStage.tsx` - MODIFIED
- `components/ui/scrolly/index.ts` - MODIFIED
- `components/ui/blog/RulerTOC.tsx` - MODIFIED
- `lib/motion-variants.ts` - MODIFIED
- `app/globals.css` - MODIFIED
- `docs/scrolly-drawer-animation.md` - NEW (technical docs)
- `.claude/plans/sharded-launching-teapot.md` - Plan file

## Action Items & Next Steps

1. **Manual Testing Required**: Test the drawer animation in browser at `/blog/scrolly-demo`
   - Verify drawer slides in smoothly when entering scrolly section
   - Verify drawer slides out when scrolling past
   - Test TOC slide-out coordination
   - Test magnetic hover effect on TOC
   - Test reduced motion behavior

2. **Mobile Testing**: Verify mobile fallback still works (inline code stages)

3. **Edge Cases**:
   - Multiple scrolly sections on same page
   - Very short scrolly sections
   - Rapid scroll past section

4. **Polish (Optional)**:
   - Adjust spring timing if needed
   - Fine-tune magnetic hover distances
   - Consider adding visual indicator during drawer transition

## Other Notes

### Key Files to Understand

- `components/ui/scrolly/ScrollyDrawerContext.tsx` - Simple state context, 80 lines
- `components/ui/scrolly/ScrollyCoding.tsx:48-80` - Drawer state management logic
- `components/ui/blog/RulerTOC.tsx:119-147` - Magnetic hover transform calculation

### Testing Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Verify build passes
```

### Demo URL
`http://localhost:3000/blog/scrolly-demo` - Test the scrolly drawer animation

### Reference Site
https://devouringdetails.com/prototypes/nextjs-dev-tools - Original inspiration
