# Task 02: Update BlogWithCanvas Width Animation Structure

**Status:** Pending
**File:** `components/blog/BlogWithCanvas.tsx`
**Lines:** 538-572

## Objective

Replace the current `x: "100%"` slide animation with `width: 0 → width: "50vw"` stretch animation.

## Current Implementation (lines 554-560)

```typescript
initial={{ x: "100%" }}
animate={{ x: 0 }}
exit={{ x: "100%" }}
transition={transition}
style={{ willChange: "transform" }}
```

## New Implementation

```typescript
import { springCanvasStretch } from "@/lib/motion-variants";

// In the motion.div (line 541-570):
<motion.div
  className={cn(
    "fixed top-0 right-0 h-screen",
    "hidden md:flex",
    "p-4 items-center justify-center",
    "z-40",
    "overflow-hidden"  // NEW: clip content during expansion
  )}
  data-canvas-column
  // Width stretch instead of x slide
  initial={{ width: 0 }}
  animate={{ width: "50vw" }}
  exit={{ width: 0 }}
  transition={springCanvasStretch}
  style={{ willChange: "width" }}
>
```

## Motion Codex Pattern (Layout Animation)

From `motion://examples/react/layout-animation`:
```typescript
<motion.div
  layout
  transition={{
    type: "spring",
    visualDuration: 0.2,
    bounce: 0.2,
  }}
/>
```

We adapt this for width animation (not layout prop since we're animating a specific property).

## Key Changes

1. Remove `w-[50vw]` from className (now animated)
2. Add `overflow-hidden` to clip content during expansion
3. Change `willChange: "transform"` to `willChange: "width"`
4. Import and use `springCanvasStretch` transition

## Vercel Best Practices

- `js-early-exit`: Check `hasActiveZone` before rendering
- `rerender-memo`: Spring preset is module-level constant

## Verification

1. Dev server: Navigate to blog post with canvas zone
2. Scroll to activate canvas - verify width expands smoothly from 0
3. Scroll past canvas - verify width collapses smoothly to 0
4. No content visible during width: 0 state
