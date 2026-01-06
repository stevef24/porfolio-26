# Session: mobile-toc-animation
Updated: 2026-01-04T05:37:10.258Z

## Goal
Fix MobileFloatingTOC Dynamic Island-style morph animation. Done when:
- Smooth expand/collapse without oval distortion
- No "bloat" effect on close
- Scroll progress indicator works
- Click outside to close works
- Theme-aware colors (no purple gradient)

## Constraints
- Use Motion (Framer Motion v12) with spring physics
- Respect `prefers-reduced-motion`
- Mobile only (`lg:hidden`)
- Must work with `AnimatePresence` for content crossfade

## Key Decisions
- **borderRadius in `style` prop**: CSS classes and `animate` prop cause oval distortion during FLIP layout animations
- **Width in `style` prop**: Motion can't interpolate `width: auto` in `animate` prop
- **`layout` on children**: Counter-transform prevents text/icon distortion
- **`mode="popLayout"`**: Allows content overlap during morph (vs `mode="wait"` which creates gaps)
- **`pathLength` for progress ring**: Cleaner than manual `strokeDashoffset` calculation
- **No scale in morphVariants**: Scale transforms caused "bloat" effect on close

## State
- Done:
  - [x] Fixed oval distortion (borderRadius → style prop)
  - [x] Fixed bloat effect (removed scale from morphVariants)
  - [x] Fixed scroll progress indicator (pathLength animation)
  - [x] Fixed click outside to close
  - [x] Fixed theme colors (neutral instead of purple)
  - [x] Created deep-dive documentation
- Now: [x] Session complete - awaiting user testing
- Next: User manual testing in Chrome DevTools responsive mode

## Open Questions
- UNCONFIRMED: Animation tested only via code review, not visually verified (browser automation couldn't simulate mobile viewport on Retina display)

## Working Set
- Branch: `main`
- Key files:
  - `components/ui/blog/MobileFloatingTOC.tsx` - Main component
  - `docs/mobile-toc-animation-deep-dive.md` - Technical documentation
- Test: Open `/blog/Rag-101` in Chrome DevTools responsive mode (iPhone preset)
- Key insight: Frontend.fyi course on layout animations - "put borderRadius in style prop for smooth animation"
