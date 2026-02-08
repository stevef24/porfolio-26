# Task 03: Add Content Wrapper with Delayed Reveal

**Status:** Pending
**File:** `components/blog/BlogWithCanvas.tsx`
**Lines:** 562-569

## Objective

Wrap canvas content in a motion.div that fades in with a 0.15s delay after the container expands.

## Current Implementation (lines 562-569)

```typescript
<div className="w-full h-full">
  {canvasContent || (
    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm bg-muted rounded-2xl">
      Canvas Active
    </div>
  )}
</div>
```

## New Implementation

```typescript
import { canvasContentReveal } from "@/lib/motion-variants";

// Inside the canvas column motion.div:
<motion.div
  className="w-full h-full"
  initial={{ opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.98 }}
  transition={canvasContentReveal}
>
  {canvasContent || (
    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm bg-muted rounded-2xl">
      Canvas Active
    </div>
  )}
</motion.div>
```

## Animation Sequence

1. Container width: 0 → 50vw (0.35s spring)
2. Content opacity: 0 → 1, scale: 0.98 → 1 (0.2s ease, 0.15s delay)

The delay ensures content appears after container has mostly expanded, preventing content flash during width animation.

## Motion Codex Pattern (Shared Layout)

From `motion://examples/react/shared-layout-animation`:
```typescript
<motion.div
  initial={{ y: 10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -10, opacity: 0 }}
  transition={{ duration: 0.2 }}
/>
```

We use a similar enter/exit pattern with scale instead of y.

## Reduced Motion Support

Add reduced motion check:

```typescript
const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
  transition={prefersReducedMotion ? { duration: 0 } : canvasContentReveal}
>
```

## Verification

1. Canvas activates → content fades in smoothly after container expands
2. Canvas deactivates → content fades out before container collapses
3. Reduced motion enabled → instant content appearance
