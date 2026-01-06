# Session: scrolly-coding
Updated: 2026-01-06T05:56:04.367Z

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
  - [x] Phase 2: Shiki Magic Move pipeline
- Now: [→] Phase 3: Scrolly layout and active-step engine
- Next: Phase 4: Stage UI and Magic Move integration
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
  - `components/ui/scrolly/ScrollyCoding.tsx` - Main component (NEXT)
  - `components/ui/scrolly/ScrollyStep.tsx` - Step card (NEXT)
  - `components/ui/scrolly/ScrollyContext.tsx` - State context (NEXT)
  - `components/ui/scrolly/ScrollyStage.tsx` - Code stage (Phase 4)
- Test: Create example in `content/blog/` with scrolly steps
- Build: `pnpm build` to verify no SSR/client issues

---

## Phase 3 Handoff: Scrolly Layout and Active-Step Engine

### What to Build
Create the scrolly layout components:
1. `ScrollyCoding.tsx` - Main two-column layout container
2. `ScrollyStep.tsx` - Individual step card with useInView detection
3. `ScrollyContext.tsx` - React context for active step state

### Layout Structure
```
┌─────────────────────────────────────────────┐
│  [Steps Column - 50%] │ [Stage Column - 50%] │
│                       │                      │
│  ┌─────────────────┐  │  ┌────────────────┐ │
│  │ Step 1 (active) │  │  │                │ │
│  │ ─────────────── │  │  │  Code Stage    │ │
│  │ Body prose...   │  │  │  (sticky)      │ │
│  └─────────────────┘  │  │                │ │
│                       │  │  filename.ts   │ │
│  ┌─────────────────┐  │  │                │ │
│  │ Step 2          │  │  └────────────────┘ │
│  └─────────────────┘  │                      │
└─────────────────────────────────────────────┘
```

### Active Step Detection
Use `useInView` from Motion with:
```ts
const inViewMargin = "-45% 0px -45% 0px" // SCROLLY_DEFAULTS.inViewMargin
```

When a step enters the center 10% of viewport, it becomes active.

### Context API
```tsx
const ScrollyContext = createContext<{
  activeIndex: number
  setActiveIndex: (i: number) => void
  totalSteps: number
}>()
```

### Files to Create
```
components/ui/scrolly/
  ScrollyCoding.tsx     ← Main container
  ScrollyStep.tsx       ← Step card with useInView
  ScrollyContext.tsx    ← State management
  index.ts              ← Exports
```

### Key Props
- `steps: ScrollyCodeStep[]` - Step definitions
- `compiledSteps: CompilationResult` - From compile-steps.ts
- `className?: string` - Additional styling

### Reference
- Phase 2 complete: `lib/scrolly/compile-steps.ts` (server-only compiler)
- Types: `lib/scrolly/types.ts`
- Motion docs: https://motion.dev/docs/react-use-in-view
