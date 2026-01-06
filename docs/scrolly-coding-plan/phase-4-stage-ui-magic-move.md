# Phase 4: Stage UI and Magic Move Integration

## Objective
Define the code stage UI and integrate Magic Move rendering for step changes.

## Detailed Plan
1. Stage container
   - Minimal frame: subtle border, soft background, low-radius corners.
   - Consistent padding that matches blog code blocks.
2. Filename badge
   - Always visible at the top-right of the stage.
   - If `file` is missing, derive `snippet.<ext>` from `lang`.
   - Use a small monospace label with muted contrast.
3. Magic Move rendering
   - Render `ShikiMagicMovePrecompiled` with `steps` and `activeIndex`.
   - Animate only when reduced motion is off.
4. Code focus treatment
   - If `focusLines` exist, add a soft highlight band or line marker.
   - Keep highlights subtle to preserve readability.
5. Overflow and scrolling
   - Internal `overflow-auto` for long code.
   - Hide aggressive scrollbars; keep default for accessibility.
6. Optional notch variant (future)
   - Keep stage rectangle in v1.
   - If needed later, add a notch variant via SVG tail attachment.

## Deliverables
- Stage UI spec with padding, border, and badge rules.
- Magic Move integration contract for the stage component.

## Resources
- https://devouringdetails.com/prototypes/nextjs-dev-tools
- https://github.com/shikijs/shiki-magic-move
- `app/globals.css`
