# MobileFloatingTOC Animation Deep Dive

A technical breakdown of building a Dynamic Island-style morphing animation with Motion (Framer Motion), the challenges encountered, and why the final solution works.

## The Goal

Create a floating Table of Contents pill that morphs smoothly between two states:
- **Collapsed**: A small pill showing the current section name and progress
- **Expanded**: A full panel displaying all TOC items

The animation should feel like Apple's Dynamic Island - a seamless shape morph where the container smoothly transforms from a pill to a rounded rectangle without any jarring transitions.

## The Initial Implementation

The first approach used Motion's `layout` prop combined with `AnimatePresence`:

```tsx
<motion.div
  layout
  className="rounded-full"  // CSS class for border radius
  transition={containerSpring}
>
  <AnimatePresence mode="wait">
    {!isExpanded ? (
      <motion.div key="pill">...</motion.div>
    ) : (
      <motion.div key="panel">...</motion.div>
    )}
  </AnimatePresence>
</motion.div>
```

### What Went Wrong

**Problem 1: The Oval Shape**

When clicking the pill to expand, the animation would:
1. First stretch horizontally into an oval
2. Then snap to the final rectangle shape

This happened because the container's width and border-radius were fighting each other during the transition.

**Problem 2: The "Bloat" Effect**

When closing the panel, it would:
1. First expand/bloat slightly
2. Then shrink down to the pill

This was the reverse of the oval problem - the animation was playing out of sequence.

**Problem 3: Content Crossfade Timing**

The `AnimatePresence mode="wait"` caused the content to fully exit before the new content entered, creating a jarring gap during the morph.

## Root Cause Analysis

### Understanding Motion's Layout Animation (FLIP)

Motion's `layout` prop uses the FLIP technique:
- **F**irst: Record the element's initial position/size
- **L**ast: Let the DOM update to the final state
- **I**nvert: Apply a transform to make it look like it's still in the first position
- **P**lay: Animate the transform back to identity (the final position)

The problem is that FLIP animates using `transform: scale()` under the hood. This creates distortion for certain properties.

### The Border Radius Problem

When you have:
```tsx
<motion.div layout className="rounded-full">
```

Here's what happens:
1. In collapsed state: `border-radius: 9999px` (from `rounded-full`)
2. In expanded state: still `border-radius: 9999px` (same class)
3. The `layout` prop scales the element, but border-radius doesn't scale proportionally
4. Result: The border radius looks wrong during the transition

**Why CSS Classes Fail:**
- CSS border-radius is applied **after** the transform
- The element is scaled, but the border-radius value stays the same
- A 9999px radius on a scaled element looks completely different

**Why `animate` Prop Fails:**
```tsx
<motion.div
  layout
  animate={{ borderRadius: isExpanded ? 20 : 9999 }}
>
```

This still fails because:
1. The `layout` animation and `animate` animation run on different timelines
2. The layout FLIP happens first, then the borderRadius animation follows
3. Result: You see the oval shape during the gap between animations

### The Width Animation Problem

Similarly, animating width with Motion's `animate` prop:

```tsx
<motion.div
  animate={{
    width: isExpanded ? "calc(100vw - 48px)" : "auto"
  }}
>
```

This fails because:
1. `width: auto` cannot be interpolated - Motion doesn't know the pixel value
2. The animation jumps from `auto` to the calculated value
3. Combined with border-radius issues, you get the oval shape

## The Solution

### Key Insight from Frontend.fyi

The solution comes from understanding how Motion handles the `style` prop differently:

> "Instead of using CSS classes or the `animate` prop for border-radius, set it in the `style` attribute. This gives Motion control over its animation during layout transitions."

### The Working Implementation

```tsx
<motion.div
  ref={panelRef}
  layout
  className="pointer-events-auto bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-2xl shadow-black/50 overflow-hidden"
  style={{
    // Put dimensions AND borderRadius in style
    // Motion handles smooth interpolation
    width: isExpanded ? "calc(100vw - 48px)" : "auto",
    maxWidth: isExpanded ? "24rem" : "none",
    borderRadius: isExpanded ? 20 : 9999,
  }}
  transition={{
    layout: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  }}
>
```

### Why This Works

1. **Style Prop Integration**: When values are in the `style` prop, Motion can:
   - Detect when they change
   - Measure the actual computed values (even for `auto`)
   - Interpolate them smoothly as part of the layout animation

2. **Unified Animation Timeline**: The width, maxWidth, and borderRadius all animate together as part of the same layout transition, not as separate animations.

3. **Proper FLIP Calculation**: Motion can factor in the borderRadius change when calculating the FLIP transform, preventing distortion.

### Child Element Counter-Transform

Another critical piece is adding `layout` to child elements:

```tsx
<motion.div
  key="pill-content"
  layout  // This is crucial
  className="flex items-center gap-3 pl-2 pr-3 py-2"
>
```

**Why this matters:**
- When the parent scales via FLIP, children would normally scale too
- This causes text and icons to appear stretched/squished during animation
- Adding `layout` to children applies a **counter-transform**
- The counter-transform cancels out the parent's scale, keeping children at their natural size

```
Without layout on children:
┌─────────────────────────────┐
│  S T R E T C H E D  T E X T │  <- Distorted during animation
└─────────────────────────────┘

With layout on children:
┌─────────────────────────────┐
│  Normal Text                │  <- Counter-transform keeps it natural
└─────────────────────────────┘
```

### Content Crossfade with popLayout

Changed from `mode="wait"` to `mode="popLayout"`:

```tsx
<AnimatePresence mode="popLayout" initial={false}>
```

**Difference:**
- `mode="wait"`: Old content fully exits before new content enters (gap in animation)
- `mode="popLayout"`: Contents can overlap, and Motion coordinates the layout animation

With `popLayout`, the pill content and panel content can crossfade while the container morphs, creating a seamless transition.

## Animation Configuration

### Spring Physics

```tsx
transition={{
  layout: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  },
}}
```

- **Stiffness: 400** - Fast, responsive feel (higher = faster)
- **Damping: 30** - Minimal overshoot (higher = less bounce)

This creates a snappy animation similar to iOS system animations.

### Content Morphing

```tsx
const morphVariants = {
  initial: {
    opacity: 0,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.2,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.15,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};
```

**No scale transforms**: Earlier versions used `scale: 0.9` which caused the "bloating" effect. Pure opacity and blur creates a cleaner crossfade.

### Progress Ring Animation

```tsx
<motion.circle
  initial={{ pathLength: 0 }}
  animate={{ pathLength: scrollProgress }}
  transition={{
    type: "spring",
    stiffness: 100,
    damping: 20,
  }}
/>
```

Using `pathLength` instead of `strokeDashoffset`:
- More intuitive: 0 = empty, 1 = full
- Motion handles the math internally
- Spring physics for smooth updates while scrolling

## Summary of Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| Oval shape during expand | CSS class border-radius + layout FLIP conflict | Move borderRadius to `style` prop |
| "Bloat" during collapse | Scale transforms in morph variants | Remove scale, use only opacity/blur |
| Width animation jumps | `animate` prop can't interpolate `auto` | Move width to `style` prop |
| Content distortion | Children scale with parent FLIP | Add `layout` prop to children |
| Jarring content switch | `AnimatePresence mode="wait"` | Use `mode="popLayout"` |
| Progress ring not updating | Using strokeDashoffset manually | Use `pathLength` with Motion |

## Key Takeaways

1. **Layout animations are powerful but tricky** - The FLIP technique has edge cases that require understanding.

2. **Border radius must be in `style` for layout animations** - This is the single most important rule for morphing containers.

3. **Child elements need `layout` for counter-transform** - Prevents text/icon distortion during parent scale.

4. **Avoid scale in content transitions** - Scale transforms during layout animations cause the "bloat" effect.

5. **Use `popLayout` for content crossfades** - Allows overlapping animations for smoother transitions.

6. **Spring physics > duration-based** - Springs feel more natural and handle interruptions better.

## References

- [Frontend.fyi - Challenges in Layout Animations](https://www.frontend.fyi/course/motion/07-layout-animations/04-challenges-in-layout-animations)
- [Motion Documentation - Layout Animations](https://motion.dev/docs/react-layout-animations)
- [Apple Human Interface Guidelines - Dynamic Island](https://developer.apple.com/design/human-interface-guidelines/live-activities)
