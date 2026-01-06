# Phase 7: Mobile Static Fallback and Performance

## Objective
Ensure a readable, stable mobile experience without scroll-driven behavior.

## Detailed Plan
1. Mobile layout switch
   - At `<768px`, switch to a single-column stack.
   - Render code immediately under each step body.
   - Remove sticky stage to avoid viewport jumps.
2. Motion reduction
   - Disable scroll interpolation on small screens.
   - Optionally disable Magic Move and render static code.
3. Viewport height handling
   - Use `dvh` or a `--scrolly-vh` variable to avoid 100vh jumps.
4. Performance guards
   - Avoid continuous scroll listeners in mobile mode.
   - Use a single `IntersectionObserver` instance if any active tracking remains.

## Deliverables
- Mobile layout spec with breakpoint rules.
- Performance guard checklist for low-power devices.

## Resources
- `app/globals.css`
