---
date: 2026-01-09
session_name: scrolly-coding
phase: 2
title: "CanvasZoneContext & CanvasStep Implementation"
status: ready_to_implement
---

# Phase 2: CanvasZoneContext & CanvasStep

## Summary

Phase 1 (Motion error fix) is complete. Now implement the multi-step context system for CanvasZone.

## What to Build

### 1. CanvasZoneContext (`components/blog/CanvasZoneContext.tsx`)

A React context to track active step within a single CanvasZone:

```tsx
interface CanvasZoneContextValue {
  activeStepIndex: number;
  setActiveStepIndex: (index: number) => void;
  totalSteps: number;
  zoneId: string;
}
```

### 2. CanvasStep (`components/blog/CanvasStep.tsx`)

Scroll-triggered step wrapper using `useInView` from Motion:

```tsx
interface CanvasStepProps {
  index: number;
  children: React.ReactNode;
}
```

**Behavior:**
- Uses `useInView` with rootMargin `-40% 0px -40% 0px` (center zone detection)
- When step enters view, calls `setActiveStepIndex(index)`
- Animates opacity: active = 100%, inactive = 50%
- Matches `ScrollyStep` pattern from existing codebase

## Reference Files

- `components/ui/scrolly/ScrollyContext.tsx` - Pattern for step context
- `components/ui/scrolly/ScrollyStep.tsx` - Pattern for scroll-triggered steps
- `lib/motion-variants.ts` - Spring physics constants

## Visual Behavior

```
Active step:   opacity 1.0, subtle rightward shift (4px)
Inactive step: opacity 0.5, no shift
Transition:    springGentle from motion-variants.ts
```

## Integration Point

After these components exist, Phase 3 will wire them into CanvasZone.

## Acceptance Criteria

1. `CanvasZoneProvider` wraps children and provides context
2. `CanvasStep` triggers active state when scrolled into center zone
3. Only one step active at a time per zone
4. Opacity animation respects `prefers-reduced-motion`
5. Build passes with no TypeScript errors

## Prompt for Next Session

```
Implement Phase 2 of CanvasZone Enhancement: Create CanvasZoneContext and CanvasStep components.

Reference files:
- components/ui/scrolly/ScrollyContext.tsx (context pattern)
- components/ui/scrolly/ScrollyStep.tsx (scroll detection pattern)

Create:
1. components/blog/CanvasZoneContext.tsx - Step tracking context
2. components/blog/CanvasStep.tsx - Scroll-triggered step wrapper

Use useInView with rootMargin "-40% 0px -40% 0px" for center detection.
Active step: opacity 1, x: 4px shift. Inactive: opacity 0.5.
Use springGentle from lib/motion-variants.ts.
```
