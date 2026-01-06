# Session: scrolly-coding
Updated: 2026-01-06T10:00:00.000Z

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

## State
- Done:
  - [ ] Phase 0: Visual direction reference (documented in plan)
- Now: [→] Phase 1: Typed steps API and data model
- Next: Phase 2: Shiki Magic Move pipeline
- Remaining:
  - [ ] Phase 3: Scrolly layout and active-step engine
  - [ ] Phase 4: Stage UI and Magic Move integration
  - [ ] Phase 5: Motion choreography
  - [ ] Phase 6: Blog integration and TOC strategy
  - [ ] Phase 7: Mobile fallback and performance
  - [ ] Phase 8: QA, accessibility, authoring docs

## Open Questions
- UNCONFIRMED: Best approach for focus line highlighting (highlight band vs line marker)

## Working Set
- Branch: `scrollyCoding`
- Key files:
  - `lib/scrolly/types.ts` - Type definitions
  - `lib/scrolly/compile-steps.ts` - Server-side token compiler
  - `components/ui/scrolly/ScrollyCoding.tsx` - Main component
  - `components/ui/scrolly/ScrollyStage.tsx` - Code stage
  - `components/ui/scrolly/ScrollyStep.tsx` - Step card
- Test: Create example in `content/blog/` with scrolly steps
- Build: `pnpm build` to verify no SSR/client issues
