# Session: scrolly-coding
Updated: 2026-01-06T07:30:00.000Z

## Goal
Implement ScrollyCoding component system for interactive code walkthroughs. Done when:
- Typed steps API works with MDX authoring
- Shiki Magic Move animates code transitions
- Two-column sticky layout with scroll-based activation
- Motion choreography with spring physics
- Blog integration without breaking existing TOC
- Mobile fallback for smaller screens
- Accessible with reduced motion support

## Constraints
- Use Motion (Framer Motion v12) with spring physics from `lib/motion-variants.ts`
- Respect `prefers-reduced-motion`
- Server-only compilation for Shiki Magic Move tokens
- Swiss minimalism styling (OKLCH colors, minimal borders)
- No horizontal scroll for typical code examples
- Compatible with Fumadocs MDX system

## Key Decisions
- **Theme pair**: vitesse-light and vitesse-dark (Shiki)
- **Active step detection**: useInView with rootMargin "-45% 0px -45% 0px"
- **Mobile breakpoint**: 768px switches to single-column stack
- **Step cards**: Left border indicator for active state (Code Hike style)
- **Stage**: Minimal frame, no toolbar, filename badge top-right
- **Focus line highlighting**: CSS-based with highlight band + left border (CONFIRMED)

## State
- Done:
  - [x] Phase 0: Visual direction reference (documented in plan)
  - [x] Phase 1: Typed steps API and data model (commit: dcf4c3e)
  - [x] Phase 2: Shiki Magic Move pipeline (commit: 9b44dcf)
  - [x] Phase 3: Scrolly layout and active-step engine (commit: 338a1ce)
  - [x] Phase 4: Stage UI and Magic Move integration
- Now: [→] Phase 5: Motion choreography
- Remaining:
  - [ ] Phase 6: Blog integration and TOC strategy
  - [ ] Phase 7: Mobile fallback and performance
  - [ ] Phase 8: QA, accessibility, authoring docs

## Open Questions
- None currently open

## Working Set
- Branch: `scrollyCoding`
- Key files:
  - `lib/scrolly/types.ts` - Type definitions (DONE)
  - `lib/scrolly/index.ts` - Module exports (DONE)
  - `lib/scrolly/compile-steps.ts` - Server-side token compiler (DONE)
  - `content/blog/example-scrolly.steps.tsx` - Example steps (DONE)
  - `components/ui/scrolly/ScrollyCoding.tsx` - Main component (DONE)
  - `components/ui/scrolly/ScrollyStep.tsx` - Step card (DONE)
  - `components/ui/scrolly/ScrollyContext.tsx` - State context (DONE)
  - `components/ui/scrolly/ScrollyStage.tsx` - Code stage with Magic Move (DONE)
  - `components/ui/scrolly/index.ts` - Exports (DONE)
- Test: Create example in `content/blog/` with scrolly steps
- Build: `pnpm build` to verify no SSR/client issues (deferred to Phase 8)

---

## Phase 4 Completion Notes

### What Was Built
Created `ScrollyStage.tsx` with full Shiki Magic Move integration:

1. **ShikiMagicMovePrecompiled** integration
   - Props: `steps` (KeyedTokensInfo[]), `step` (activeIndex), `animate`, `options`
   - Animation callbacks: `onStart`, `onEnd` for tracking animation state

2. **Theme-aware rendering**
   - Uses `useTheme()` from next-themes
   - Selects `stepsLight` or `stepsDark` based on `resolvedTheme`
   - Theme changes trigger re-render with correct tokens

3. **Filename badge**
   - Positioned top-right with `absolute` positioning
   - Uses `deriveFilename()` helper to generate from step or lang
   - Fades slightly during animations

4. **Focus line highlighting**
   - CSS-based approach using dynamic `<style>` injection
   - Highlights focused lines with `bg-muted` + left border
   - Dims non-focused lines to 50% opacity
   - Respects animation state (full opacity during transitions)

### Key Files Modified
- `components/ui/scrolly/ScrollyStage.tsx` - NEW: Full stage implementation
- `components/ui/scrolly/ScrollyCoding.tsx` - Replaced StagePlaceholder with ScrollyStage
- `components/ui/scrolly/index.ts` - Added ScrollyStage export
- `app/globals.css` - Added shiki-magic-move CSS import and scrolly stage styling

### ShikiMagicMovePrecompiled API (Confirmed)
```tsx
<ShikiMagicMovePrecompiled
  steps={KeyedTokensInfo[]}  // Array of precompiled tokens
  step={number}              // Current step index
  animate={boolean}          // Enable/disable animations
  options={{
    duration: number,        // Animation duration in ms
    stagger: number,         // Token stagger delay in ms
  }}
  onStart={() => void}       // Animation start callback
  onEnd={() => void}         // Animation end callback
/>
```

---

## Phase 5 Handoff: Motion Choreography

### What to Build
Add spring physics and choreographed animations for step transitions:

1. **Stage entrance animation**
   - Initial fade + scale from `lib/motion-variants.ts`
   - Spring physics for natural feel

2. **Step transition choreography**
   - Coordinate step card fade with code stage update
   - Potential: Stagger step content changes

3. **Focus line animation**
   - Smooth transition for highlight band movement
   - Consider spring-based highlight position

### Key Integration Points
- Import spring presets from `lib/motion-variants.ts`
- Use `useReducedMotion()` to disable all motion when needed
- Coordinate with Magic Move's built-in animation timing

### Files to Modify
```
components/ui/scrolly/
  ScrollyStage.tsx     - Add entrance animation
  ScrollyStep.tsx      - Refine step transition timing
  ScrollyCoding.tsx    - Orchestrate overall choreography
```

### Reference
- `lib/motion-variants.ts` - Spring presets: `springGentle`, `springBouncy`, `springSnappy`
- Motion library: `motion/react` for animations
