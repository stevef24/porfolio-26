# Task 11: Implement Morphing Content with layoutId

**Status:** Pending
**File:** `components/ui/blog/RulerTOC.tsx`
**Depends on:** Task 10

## Objective

Ensure each TOC item's content morphs smoothly between ruler line and text states using `layoutId`.

## The Key Pattern

```typescript
<motion.div
  layoutId={`toc-item-${item.url}`}
  animate={{
    width: isHovered ? "auto" : collapsedWidth,
    height: isHovered ? "auto" : collapsedHeight,
  }}
  transition={springTocMorph}
>
  {/* Content that appears when expanded */}
</motion.div>
```

## How layoutId Works

1. Motion tracks elements with same `layoutId` across renders
2. When dimensions change, it animates the bounding box
3. Child content can fade in/out independently

## Complete Item Structure

```typescript
{/* Morphing container */}
<motion.div
  layoutId={`toc-item-${item.url}`}
  className={cn(
    "rounded-full overflow-hidden",
    !isHovered && "bg-foreground"  // Line color when collapsed
  )}
  initial={false}
  animate={{
    width: isHovered ? "auto" : collapsedWidth,
    height: isHovered ? "auto" : collapsedHeight,
    backgroundColor: isHovered ? "transparent" : undefined,
  }}
  transition={prefersReducedMotion ? { duration: 0 } : springTocMorph}
>
  {/* Text appears after container expands */}
  <AnimatePresence>
    {isHovered && (
      <motion.span
        className="text-[13px] whitespace-nowrap block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.15,
          delay: 0.08  // Slight delay for text to appear after morph starts
        }}
      >
        {item.title}
      </motion.span>
    )}
  </AnimatePresence>
</motion.div>
```

## Animation Sequence

1. **Collapse → Expand:**
   - Container width: 10-32px → auto (spring, 0.25s)
   - Container height: 1px → auto (spring, 0.25s)
   - Text opacity: 0 → 1 (ease, 0.15s, 0.08s delay)

2. **Expand → Collapse:**
   - Text opacity: 1 → 0 (ease, 0.1s, no delay)
   - Container width: auto → 10-32px (spring, 0.25s)
   - Container height: auto → 1px (spring, 0.25s)

## Critical: LayoutGroup Scope

The `LayoutGroup` with unique `id` ensures layoutId animations are scoped:

```typescript
<LayoutGroup id="ruler-toc">
  {/* All items with layoutId inside */}
</LayoutGroup>
```

Without LayoutGroup, layoutId could conflict with other components.

## Verification

1. Hover: Lines smoothly expand into text boxes
2. Unhover: Text boxes smoothly collapse into lines
3. Active indicator triangle animates correctly
4. No layout jank or flash during transition
