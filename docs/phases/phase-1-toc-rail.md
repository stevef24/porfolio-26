# Phase 1: TOC Rail Redesign

## Overview

Transform the Table of Contents sidebar from a basic dot-indicator design to a polished vertical bar indicator system inspired by animations.dev. This is the highest visual impact change and sets the tone for the premium documentation experience.

---

## Current Implementation Analysis

### File Location
`components/ui/blog/StickyTOCSidebar.tsx`

### Current Design
- **Indicator Style**: Circular dots positioned on a left border
- **Border**: `border-l border-border` creating a vertical line
- **Active State**: Dot fills with primary color
- **Animations**: None (instant state changes)
- **Header**: Simple text "On this page" with `text-swiss-subheading`

### Current Code Structure
```tsx
<nav aria-label="On this page">
  <div className="text-swiss-subheading text-muted-foreground mb-4">
    On this page
  </div>
  <ol className="relative border-l border-border pl-4 space-y-2">
    {items.map((item) => (
      <li className="relative">
        {/* Dot indicator */}
        <span className="absolute -left-[9px] top-2.5 size-2 rounded-full border" />
        <button>...</button>
      </li>
    ))}
  </ol>
</nav>
```

### Issues with Current Design
1. Dots feel dated and less sophisticated
2. No entrance animations on page load
3. No smooth transitions between active states
4. Header lacks visual hierarchy (no icon)
5. Typography could be more refined

---

## Target Design (animations.dev Style)

### Visual Reference
Based on animations.dev analysis:
- Clean header with list icon + "On this page" text
- No border line on the list itself
- Vertical bar indicator on the LEFT side of the active item
- Bar animates in/out with spring physics
- Items fade in with stagger on page load
- Muted text for inactive items, foreground for active

### Key Visual Elements
1. **Header**: Icon (list/menu style) + text in muted color
2. **Indicator**: 2px wide vertical bar, primary color, full height of item
3. **Typography**: text-sm, proper line height, no truncation issues
4. **Spacing**: Consistent padding, breathing room between items
5. **Active State**: Bar appears + text becomes foreground color + medium weight

---

## Implementation Specification

### Dependencies
```tsx
import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
```

### Component Interface
```tsx
interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

interface StickyTOCSidebarProps {
  items: TOCItem[];
  className?: string;
}
```

### Full Implementation

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

interface TOCItem {
  title: string;
  url: string;
  depth: number;
}

interface StickyTOCSidebarProps {
  items: TOCItem[];
  className?: string;
}

export function StickyTOCSidebar({ items, className }: StickyTOCSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [hasMounted, setHasMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Track mount state for entrance animations
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Intersection Observer to track active heading
  useEffect(() => {
    if (!items?.length) return;

    const headingIds = items.map((item) => item.url.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((entry) => entry.isIntersecting);
        if (intersecting) {
          setActiveId(intersecting.target.id);
        }
      },
      {
        rootMargin: "-20% 0% -60% 0%",
        threshold: 0,
      }
    );

    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  // Handle smooth scroll to heading
  const handleClick = useCallback(
    (url: string) => {
      const id = url.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [prefersReducedMotion]
  );

  if (!items?.length) return null;

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : i * 0.05,
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeOut",
      },
    }),
  };

  const indicatorSpring = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  };

  return (
    <nav
      className={cn(
        "hidden lg:block sticky top-[calc(var(--navbar-height)+1.5rem)]",
        "self-start",
        className
      )}
      aria-label="On this page"
    >
      {/* Header with icon */}
      <motion.header
        className="flex items-center gap-2 text-muted-foreground mb-4"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <HugeiconsIcon icon={Menu01Icon} size={14} strokeWidth={2} />
        <span className="text-sm font-medium">On this page</span>
      </motion.header>

      {/* TOC list */}
      <ol className="relative space-y-1">
        {items.map((item, index) => {
          const isActive = activeId === item.url.replace("#", "");
          const isNested = item.depth > 2;

          return (
            <motion.li
              key={item.url}
              className={cn("relative", isNested && "pl-3")}
              custom={index}
              initial={hasMounted || prefersReducedMotion ? false : "hidden"}
              animate="visible"
              variants={itemVariants}
            >
              {/* Vertical indicator bar */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-primary"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isActive ? 1 : 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : indicatorSpring}
                style={{ originY: 0 }}
              />

              {/* TOC item button */}
              <button
                onClick={() => handleClick(item.url)}
                className={cn(
                  "w-full text-left pl-3 py-1 text-sm leading-relaxed transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={item.title}
                aria-label={`Jump to ${item.title}`}
                aria-current={isActive ? "location" : undefined}
              >
                {item.title}
              </button>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

export default StickyTOCSidebar;
```

---

## Animation Details

### Entrance Animation (Page Load)
- **Type**: Staggered fade + slide from left
- **Delay per item**: 50ms (0.05s)
- **Duration**: 200ms
- **Easing**: easeOut
- **Initial state**: `opacity: 0, x: -8`
- **Final state**: `opacity: 1, x: 0`

### Active Indicator Animation
- **Type**: Spring physics (scaleY)
- **Stiffness**: 300
- **Damping**: 30
- **Origin**: Top (originY: 0)
- **Initial**: `scaleY: 0`
- **Active**: `scaleY: 1`

### Reduced Motion Handling
- All animations disabled when `prefers-reduced-motion` is set
- Instant state changes instead of animated transitions
- Entrance animations skipped entirely

---

## Styling Specifications

### CSS Variables Used
```css
--navbar-height: 4rem;     /* Sticky offset */
--primary: oklch(...);     /* Indicator color */
--foreground: oklch(...);  /* Active text */
--muted-foreground: oklch(...); /* Inactive text */
```

### Typography
- **Header**: `text-sm font-medium` (14px, 500 weight)
- **Items**: `text-sm leading-relaxed` (14px, 1.625 line-height)
- **Active item**: `font-medium` (500 weight)

### Spacing
- **Header margin bottom**: `mb-4` (16px)
- **Items spacing**: `space-y-1` (4px between items)
- **Item padding**: `pl-3 py-1` (12px left, 4px vertical)

### Indicator Bar
- **Width**: `w-0.5` (2px)
- **Shape**: `rounded-full` (pill shape)
- **Color**: `bg-primary`
- **Position**: `absolute left-0 top-0 bottom-0`

---

## Accessibility

### ARIA Attributes
- `aria-label="On this page"` on nav element
- `aria-current="location"` on active item
- `aria-label="Jump to {title}"` on each button

### Keyboard Navigation
- All items focusable via Tab
- Focus ring: `ring-2 ring-primary/40 ring-offset-2`
- Enter/Space triggers scroll

### Reduced Motion
- Respects `prefers-reduced-motion` system setting
- Falls back to instant transitions
- Uses `useReducedMotion()` hook from Motion

---

## Testing Checklist

### Functional Tests
- [ ] Correct heading is highlighted on scroll
- [ ] Clicking item scrolls to correct section
- [ ] Nested items (depth > 2) have additional indentation
- [ ] Empty items array renders nothing

### Visual Tests
- [ ] Indicator bar animates smoothly
- [ ] Entrance animation staggers correctly
- [ ] Active state typography change visible
- [ ] Works in both light and dark themes

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader announces current location
- [ ] Reduced motion preference respected
- [ ] Focus states visible

### Performance Tests
- [ ] No layout shift on mount
- [ ] Smooth 60fps animations
- [ ] Intersection Observer cleanup on unmount

---

## Files Modified

| File | Changes |
|------|---------|
| `components/ui/blog/StickyTOCSidebar.tsx` | Complete redesign |

## Dependencies Added
- None (uses existing Motion library)

## Breaking Changes
- None (same props interface)
