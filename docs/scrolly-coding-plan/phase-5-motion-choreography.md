# Phase 5: Motion Choreography and Scroll Interpolation

## Objective
Define how Motion ties scroll position to step and stage transitions.

## Detailed Plan
1. Step card motion
   - Use `useScroll` per step to derive progress values.
   - Map progress to opacity and translateY for a tethered scroll feel.
   - Keep deltas small to avoid motion sickness.
2. Active step transition
   - Active border color and background change should be instant or lightly eased.
   - Avoid heavy scaling to keep layout stable.
3. Stage motion
   - Wrap stage in `motion.div` with `layout` to smooth size changes.
   - Use subtle crossfade between steps to complement Magic Move.
4. Scroll fade
   - Implement a top fade overlay for sticky stage or header clipping.
   - Use a static gradient and avoid per-frame updates.
5. Reduced motion
   - If `prefers-reduced-motion`, disable scroll interpolation and Magic Move animation.

## Deliverables
- Motion timing spec (durations, easing, and thresholds).
- Reduced motion behavior rules for every animated element.

## Resources
- https://devouringdetails.com/prototypes/nextjs-dev-tools
- `lib/motion-variants.ts`
- `components/shared/BlurFade.tsx`
