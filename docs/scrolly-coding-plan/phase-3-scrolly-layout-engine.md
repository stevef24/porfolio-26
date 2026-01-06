# Phase 3: Scrolly Layout and Active-Step Engine

## Objective
Build the two-column sticky layout with reliable step activation and selection.

## Detailed Plan
1. Layout skeleton
   - Use a responsive grid: left for steps, right for stage.
   - Desktop: `md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`.
   - Right column: sticky container with top offset aligned to header height.
2. Viewport height handling
   - Avoid `100vh` on mobile.
   - Use a CSS variable `--scrolly-vh` derived from `window.innerHeight`.
3. Active step detection
   - Use `useInView` with `rootMargin: "-45% 0px -45% 0px"`.
   - Update `activeIndex` when a step enters the center band.
   - Prevent rapid toggling by ignoring repeat activations within a short threshold.
4. Step selection by click
   - Steps are clickable to set `activeIndex`.
   - Scroll the clicked step into view when needed.
5. State and context
   - `ScrollyContext` stores `activeIndex`, `steps`, and optional `progress`.
   - Child components read from context to stay in sync.
6. Accessibility and semantics
   - Steps list should be an ordered list or sectioned article structure.
   - Active state should be exposed via `data-active` attributes.

## Deliverables
- A stable activation model with predictable behavior.
- Configurable `stickyTop`, `stageHeight`, and `inViewMargin` defaults.

## Resources
- https://codehike.org/docs/layouts/scrollycoding
- `components/shared/BlurFade.tsx`
- `components/ui/blog/StickyTOCSidebar.tsx`
- `app/globals.css`
