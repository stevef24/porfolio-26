# Session: scrolly-coding
Updated: 2026-01-06T06:45:00.000Z

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
  - [x] Phase 0: Visual direction reference (documented in plan)
  - [x] Phase 1: Typed steps API and data model (commit: dcf4c3e)
  - [x] Phase 2: Shiki Magic Move pipeline (commit: 9b44dcf)
  - [x] Phase 3: Scrolly layout and active-step engine
- Now: [->] Phase 4: Stage UI and Magic Move integration
- Remaining:
  - [ ] Phase 5: Motion choreography
  - [ ] Phase 6: Blog integration and TOC strategy
  - [ ] Phase 7: Mobile fallback and performance
  - [ ] Phase 8: QA, accessibility, authoring docs

## Open Questions
- UNCONFIRMED: Best approach for focus line highlighting (highlight band vs line marker)

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
  - `components/ui/scrolly/index.ts` - Exports (DONE)
  - `components/ui/scrolly/ScrollyStage.tsx` - Code stage (NEXT)
- Test: Create example in `content/blog/` with scrolly steps
- Build: `pnpm build` to verify no SSR/client issues (deferred to Phase 8)

---

## Phase 4 Handoff: Stage UI and Magic Move Integration

### What to Build
Create the code stage component that renders Shiki Magic Move with animated transitions:
1. `ScrollyStage.tsx` - Code stage with Magic Move rendering
2. Theme-aware token rendering (light/dark mode support)
3. Filename badge display
4. Focus line highlighting

### Stage Structure
```
┌────────────────────────────────────────┐
│                            filename.ts │  ← Filename badge (top-right)
│                                        │
│  1 │ const state = {                   │
│  2 │   count: 0,         ← focus line  │  ← Highlighted background
│  3 │ }                                 │
│                                        │
└────────────────────────────────────────┘
```

### Key Integration Points
- Use `ShikiMagicMovePrecompiled` from `shiki-magic-move/react`
- Get current theme from `next-themes` useTheme()
- Select tokens: `theme === 'dark' ? compiledSteps.stepsDark : compiledSteps.stepsLight`
- Use `extractTokensForPrecompiled()` helper from compile-steps.ts

### Magic Move Props
```tsx
<ShikiMagicMovePrecompiled
  tokens={tokens}        // KeyedTokensInfo[]
  stepIndex={activeIndex}
  animate={!prefersReducedMotion}
  lineNumbers={true}
  onStart={() => {}}     // Animation start callback
  onEnd={() => {}}       // Animation end callback
/>
```

### Focus Line Highlighting
Options (needs decision):
1. **Highlight band**: Full-width background color on focused lines
2. **Line marker**: Left gutter indicator only
3. **Both**: Combined approach

Current leaning: Highlight band with subtle `bg-muted/50` for Swiss minimalism.

### Styling Requirements
- Minimal frame: No toolbar, no decorations
- Corner radius: `rounded-md` (consistent with codebase)
- Border: `border border-border`
- Background: `bg-card`
- Font: Monospace (from globals.css `--font-mono`)

### Files
```
components/ui/scrolly/
  ScrollyStage.tsx      ← New: Code stage with Magic Move
```

### Reference
- shiki-magic-move React component: https://github.com/shikijs/shiki-magic-move
- Theme switching: Use `useTheme()` from `next-themes`
- Compiled tokens: `CompilationResult.stepsLight` / `stepsDark`
