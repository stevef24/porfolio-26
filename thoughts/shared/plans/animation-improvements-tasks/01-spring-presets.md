# Task 01: Add Spring Presets to motion-variants.ts

**Status:** Pending
**File:** `lib/motion-variants.ts`
**Lines:** Append after line 432

## Objective

Add three new spring presets for the animation improvements using Motion's time-based spring syntax (2026 best practice).

## Motion MCP Spring Visualizations

Generated CSS springs for reference:
- Canvas stretch (0.35s, bounce 0.06): `150ms linear(0, 1.0325, 1.0081, 0.998, 1)`
- TOC morph (0.25s, bounce 0.1): `250ms linear(0, 0.6559, 1.005, 1.0216, 1.0032, 0.9992, 0.9997, 1)`

## Code to Add

```typescript
// ==========================================
// CANVAS STRETCH ANIMATIONS (2026-01-16)
// ==========================================

/** Canvas width stretch - smooth expansion without bounce overshoot */
export const springCanvasStretch: Transition = {
  type: "spring",
  visualDuration: 0.35,
  bounce: 0.06,
};

/** Canvas content reveal - delayed fade after container expands */
export const canvasContentReveal: Transition = {
  duration: 0.2,
  ease: [0.25, 0.46, 0.45, 0.94],
  delay: 0.15,
};

/** TOC ruler-to-text morph - snappy line expansion */
export const springTocMorph: Transition = {
  type: "spring",
  visualDuration: 0.25,
  bounce: 0.1,
};
```

## Vercel Best Practices Applied

- `rendering-hoist-jsx`: Spring presets are hoisted to module level (not recreated per render)
- `rerender-memo`: Constants don't trigger re-renders

## Verification

1. Run `pnpm build` - no TypeScript errors
2. Import presets in BlogWithCanvas.tsx and RulerTOC.tsx - verify autocomplete works
