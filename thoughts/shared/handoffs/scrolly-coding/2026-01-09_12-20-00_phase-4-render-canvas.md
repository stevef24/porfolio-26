---
date: 2026-01-09T12:20:00Z
session_name: scrolly-coding
researcher: Claude
git_commit: b39eee8c8a69e5b8fb836685e576c2f952c649b0
branch: scrollyCoding
repository: porfolio-26
topic: "CanvasZone Enhancement Phase 4: RenderCanvas Component"
tags: [implementation, canvas-zone, render-canvas, animations]
status: ready_to_implement
last_updated: 2026-01-09
last_updated_by: Claude
type: implementation_strategy
root_span_id:
turn_span_id:
---

# Handoff: CanvasZone Enhancement - Phase 4 Ready

## Task(s)

**Completed:**
- [x] Enhancement Phase 3: Added `mode` prop to CanvasZone (`"static" | "stepped"`)

**Next:**
- [ ] Enhancement Phase 4: Create RenderCanvas component

**Reference:** `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md`

## Critical References

1. `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Main continuity ledger with full state tracking
2. `components/blog/CanvasZone.tsx` - Enhanced component with mode prop (Phase 3)
3. `components/blog/CanvasZoneContext.tsx` - Context provider for step tracking

## Recent changes

- `components/blog/CanvasZone.tsx:1-340` - Added mode prop, discriminated union types, render prop support, SteppedZoneContent wrapper
- `components/blog/CanvasZone.tsx:51-81` - Added `triggerSelector` prop for custom trigger elements (e.g., "h2" to trigger on heading)
- `components/blog/CanvasZone.tsx:235-284` - Updated registration logic to observe trigger element if selector provided
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md:32-44` - Updated state to mark Phase 3 complete

## Learnings

1. **Discriminated union pattern**: Using `CanvasZoneStaticProps | CanvasZoneSteppedProps` provides excellent type safety - TypeScript enforces `totalSteps` only when `mode="stepped"`

2. **Context boundary solution**: Canvas content renders in sidebar (outside CanvasZoneProvider). Solved with render prop pattern: `canvasContent: ReactNode | ((index: number) => ReactNode)`

3. **Internal wrapper component**: `SteppedZoneContent` renders inside the provider, subscribes to `activeStepIndex`, and calls `updateZoneConfig` to sync sidebar content

4. **Non-breaking change**: Kept existing `type` prop for styling, added new `mode` prop for behavior. Default `mode="static"` preserves backwards compatibility.

5. **Custom trigger elements**: Added `triggerSelector` prop to observe a child element (e.g., "h2") instead of the whole zone. Uses `querySelector` to find the element and registers it with the observer instead of the zone wrapper.

## Post-Mortem

### What Worked
- **Render prop pattern** solved the context boundary elegantly - canvas content function receives `activeStepIndex` directly
- **Discriminated union types** caught prop mismatches at compile time
- **Separating SteppedZoneContent** kept the main component clean and allowed proper context access

### What Failed
- Initial attempt had TypeScript errors because `updateZoneConfig` signature mismatch (content was optional in interface but required in actual function)

### Key Decisions
- **Decision**: Add `mode` prop instead of overloading existing `type` prop
  - Alternatives considered: Repurposing `type` for behavior
  - Reason: `type` is already used for styling (`"code" | "demo" | "visualization"`), mixing concerns would be confusing

- **Decision**: Use render prop pattern for `canvasContent`
  - Alternatives considered: Context portal, lifting provider up
  - Reason: Most explicit, no magic, TypeScript-friendly

## Artifacts

- `components/blog/CanvasZone.tsx` - Enhanced with mode prop and stepped mode support
- `thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md` - Updated ledger with Phase 3 completion notes

## Action Items & Next Steps

**Phase 4: Create RenderCanvas Component**

1. Create `components/blog/RenderCanvas.tsx`:
   - Props: `steps: ReactNode[]`, `activeStep: number`
   - Renders only the active step with opacity transition
   - Uses Motion for smooth fade between steps
   - Respects `prefers-reduced-motion`

2. Add spring animation for step transitions:
   - Import `springGentle` from `lib/motion-variants.ts`
   - Animate opacity: 0 → 1 for entering step
   - Consider AnimatePresence for exit animations

3. Integration pattern:
   ```tsx
   <CanvasZone
     mode="stepped"
     totalSteps={3}
     canvasContent={(index) => (
       <RenderCanvas
         steps={[<Demo0 />, <Demo1 />, <Demo2 />]}
         activeStep={index}
       />
     )}
   >
     <CanvasStep index={0}>...</CanvasStep>
     <CanvasStep index={1}>...</CanvasStep>
     <CanvasStep index={2}>...</CanvasStep>
   </CanvasZone>
   ```

4. Verify build passes

**Prompt for next session:**
```
Implement Phase 4 of CanvasZone Enhancement: Create RenderCanvas component.

Reference:
- components/blog/CanvasZone.tsx (mode="stepped" + triggerSelector support)
- components/blog/CanvasZoneContext.tsx (step tracking context)
- components/blog/CanvasStep.tsx (scroll-triggered step wrapper)
- lib/motion-variants.ts (spring presets)

Recent additions to CanvasZone:
- mode="stepped" wraps children in CanvasZoneProvider
- canvasContent accepts render prop: (activeStepIndex) => ReactNode
- triggerSelector="h2" observes the H2 instead of the whole zone

Create RenderCanvas component:
- Props: steps (ReactNode[]), activeStep (number)
- Renders only active step with opacity transition
- Uses springGentle for animations
- Respects prefers-reduced-motion
- AnimatePresence for smooth enter/exit

Example integration:
<CanvasZone
  mode="stepped"
  totalSteps={3}
  triggerSelector="h2"
  canvasContent={(index) => (
    <RenderCanvas
      steps={[<Demo0 />, <Demo1 />, <Demo2 />]}
      activeStep={index}
    />
  )}
>
  <h2>Demo Title</h2>
  <CanvasStep index={0}>Step 1</CanvasStep>
  <CanvasStep index={1}>Step 2</CanvasStep>
  <CanvasStep index={2}>Step 3</CanvasStep>
</CanvasZone>

Ledger: thoughts/ledgers/CONTINUITY_CLAUDE-scrolly-coding.md
```

## Other Notes

**Remaining phases after Phase 4:**
- Phase 5: Create CodeDrawer (slide-up panel for mobile code viewing)
- Phase 6: Mobile fallback enhancements
- Phase 7: Update test page with stepped mode demo

**Key file locations:**
- Motion variants: `lib/motion-variants.ts`
- ScrollyCoding reference: `components/ui/scrolly/` (similar patterns)
- Blog components: `components/blog/`

**Build verification:**
- `pnpm tsc --noEmit` - TypeScript check
- `pnpm build` - Full production build
