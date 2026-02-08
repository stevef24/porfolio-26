# Task 10: Refactor RulerTOC to Unified LayoutGroup

**Status:** Pending
**File:** `components/ui/blog/RulerTOC.tsx`
**Lines:** 233-447 (entire render)

## Objective

Replace the current dual-view AnimatePresence (ruler vs wheel) with a unified LayoutGroup where each item morphs between states.

## Current Architecture (lines 249-444)

```typescript
<AnimatePresence mode="wait">
  {!isHovered ? (
    <motion.div key="ruler">
      {/* Collapsed ruler lines */}
    </motion.div>
  ) : (
    <motion.div key="wheel">
      {/* Expanded text list */}
    </motion.div>
  )}
</AnimatePresence>
```

Problem: Items disappear and reappear, no morphing between states.

## New Architecture

```typescript
import { LayoutGroup } from "motion/react";
import { springTocMorph } from "@/lib/motion-variants";

<LayoutGroup id="ruler-toc">
  <motion.div
    ref={containerRef}
    className={cn(
      "fixed left-6 top-1/2 -translate-y-1/2 z-40",
      "hidden lg:block",
      // Add layout animation for container
      isHovered && "bg-background/90 backdrop-blur-sm border border-border/20 rounded-lg py-2 px-3 shadow-sm"
    )}
    layout
    transition={prefersReducedMotion ? { duration: 0 } : springTocMorph}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={handleMouseLeave}
  >
    <nav aria-label="Article progress">
      <div className="flex flex-col items-start gap-[6px]">
        {items.map((item, index) => (
          <TOCItem
            key={item.url}
            item={item}
            index={index}
            isActive={activeId === item.url.replace("#", "")}
            isPast={activeIndex > index}
            isHovered={isHovered}
            onClick={() => handleClick(item.url)}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      {/* Progress indicator - only visible when collapsed */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 w-8 h-px bg-border/20 relative overflow-hidden rounded-full"
          >
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary/50 rounded-full"
              animate={{ width: `${scrollProgress * 100}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  </motion.div>
</LayoutGroup>
```

## Extract TOCItem Component

```typescript
interface TOCItemProps {
  item: TOCItem;
  index: number;
  isActive: boolean;
  isPast: boolean;
  isHovered: boolean;
  onClick: () => void;
  prefersReducedMotion: boolean | null;
}

function TOCItem({
  item,
  isActive,
  isPast,
  isHovered,
  onClick,
  prefersReducedMotion,
}: TOCItemProps) {
  // Line dimensions
  const collapsedWidth = isActive ? 32 : item.depth === 2 ? 24 : item.depth === 3 ? 16 : 10;
  const collapsedHeight = 1;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative flex items-center cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-sm",
        isHovered && "text-left py-1 px-1.5 -mx-1.5 rounded",
        isHovered && isActive && "text-foreground font-medium",
        isHovered && !isActive && "text-muted-foreground hover:text-foreground/80"
      )}
      layout
      transition={prefersReducedMotion ? { duration: 0 } : springTocMorph}
    >
      {/* Triangle marker */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            className={cn(
              "absolute text-primary",
              isHovered ? "-left-2.5 text-[8px] top-1/2 -translate-y-1/2" : "-left-4 text-[10px]"
            )}
            initial={{ opacity: 0, x: -4, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -4, scale: 0.8 }}
            transition={prefersReducedMotion ? { duration: 0 } : springTocMorph}
          >
            ▶
          </motion.span>
        )}
      </AnimatePresence>

      {/* THE KEY: morphing content with layoutId */}
      <motion.div
        layoutId={`toc-item-${item.url}`}
        className="bg-foreground rounded-full overflow-hidden"
        animate={{
          width: isHovered ? "auto" : collapsedWidth,
          height: isHovered ? "auto" : collapsedHeight,
          opacity: isActive ? 1 : isPast ? 0.5 : 0.25,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : springTocMorph}
      >
        {/* Text content - fades in when expanded */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              className="text-[13px] whitespace-nowrap block px-0 text-inherit bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, delay: isHovered ? 0.1 : 0 }}
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
```

## Motion Codex Pattern

From layout animation example:
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

## Verification

1. Hover over ruler → lines morph into text (same elements)
2. Triangle marker animates smoothly
3. Container expands with background/border
4. Mouse leave → text morphs back into lines
