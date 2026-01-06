# Phase 0: Reference Mapping and Visual Direction

## Objective
Define the visual language and interaction baseline for the scrolly system before any implementation.

## Inputs
- Devouring Details prototype for scrollytelling behavior, notch strategy, and scroll fading.
- Code Hike scrollycoding for layout mechanics and step selection.
- Existing blog typography and spacing rules in `app/globals.css`.

## Detailed Plan
1. Create a visual brief
   - Document the base palette and contrast targets using OKLCH tokens already in use.
   - Define the stage background, border, and text contrast levels.
   - Set the default code line height and font size to match blog code blocks.
2. Define the scrolly layout proportions
   - Left column width target: readable prose line length.
   - Right column width target: code lines visible without horizontal scroll for typical examples.
   - Sticky top offset: align with existing blog header height.
3. Step card styling
   - Use a single left border indicator for active state (similar to Code Hike).
   - Default state: muted background, low contrast border.
   - Active state: higher contrast border and subtle background fill.
4. Stage chrome
   - Keep the stage minimal: no toolbar, no extra UI widgets.
   - Always show filename badge; keep it small and monospace.
   - Use a clean rectangle shape in v1 (no notch).
5. Scroll fade overlays
   - Add a top fade overlay to soften sticky overlap.
   - Match fade colors to stage background and blog background.
6. Animation beats
   - Step entry: subtle opacity/translate change.
   - Active step: border color and background lift.
   - Stage change: Magic Move token transition + light crossfade.

## Deliverables
- Visual spec with spacing, sizing, and color decisions.
- Interaction beat list used by Motion choreography.
- A single source of truth for stage chrome and badge styling.

## Resources
- https://devouringdetails.com/prototypes/nextjs-dev-tools
- https://codehike.org/docs/layouts/scrollycoding
- `app/globals.css`
