# Phase 6: Custom Components

## Overview

This phase updates the custom portfolio components (MidCard, VideoCard, AnimatedBlockquote) with Oatmeal styling.

**Status**: Pending
**Dependencies**: Phases 1, 4 (Foundation and Core Components)
**Estimated Effort**: Low-Medium
**Risk Level**: Low

---

## Files to Modify

| File | Priority | Key Changes |
|------|----------|-------------|
| `components/ui/MidCard.tsx` | High | Hover states, link colors |
| `components/ui/VideoCard.tsx` | High | Same as MidCard |
| `components/ui/blog/AnimatedBlockquote.tsx` | Medium | Border color, background |

---

## Task 6.1: Update MidCard Component

### File: `components/ui/MidCard.tsx`

**Current Behavior:**
- Hover background changes
- Arrow icon animates on hover
- Link color changes on hover

**Oatmeal Updates:**

```typescript
"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface MidCardProps {
  href: string;
  title: string;
  description?: string;
  className?: string;
  external?: boolean;
}

export function MidCard({
  href,
  title,
  description,
  className,
  external = false,
}: MidCardProps) {
  const Component = external ? "a" : Link;
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Component
      href={href}
      {...externalProps}
      className={cn(
        "group flex items-start gap-4 p-4",
        // Oatmeal styling
        "rounded-lg", // 8px
        "border border-transparent",
        // Hover state - warm muted background
        "hover:bg-muted/50",
        "hover:border-border",
        "transition-all duration-200",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-base font-medium",
          "text-foreground",
          // Hover: transition to primary (olive)
          "group-hover:text-primary",
          "transition-colors duration-200",
          "line-clamp-1"
        )}>
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Arrow icon */}
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        className={cn(
          "size-5 shrink-0",
          "text-muted-foreground",
          // Hover: olive color + subtle movement
          "group-hover:text-primary",
          "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          "transition-all duration-200"
        )}
      />
    </Component>
  );
}
```

---

## Task 6.2: Update VideoCard Component

### File: `components/ui/VideoCard.tsx`

**Similar updates to MidCard:**

```typescript
// Update className for the card container:
cn(
  "group flex items-start gap-4 p-4",
  "rounded-lg",
  "hover:bg-muted/50",
  "hover:border-border border border-transparent",
  "transition-all duration-200"
)

// Update title hover:
"group-hover:text-primary"

// Update icon hover:
"group-hover:text-primary"
```

---

## Task 6.3: Update AnimatedBlockquote Component

### File: `components/ui/blog/AnimatedBlockquote.tsx`

**Oatmeal Updates:**

```typescript
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBlockquoteProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedBlockquote({ children, className }: AnimatedBlockquoteProps) {
  const ref = useRef<HTMLQuoteElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <blockquote
      ref={ref}
      className={cn(
        "relative my-8 py-6 pl-6",
        // Oatmeal styling - olive border
        "border-l-4 border-primary",
        className
      )}
    >
      {/* Background gradient - warm muted */}
      <motion.div
        className="absolute inset-0 -z-10 bg-muted/30 rounded-r-lg"
        initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
        style={{ transformOrigin: "left" }}
      />

      {/* Quote mark */}
      <motion.span
        className="absolute left-4 top-2 text-6xl text-primary/20 font-display leading-none select-none"
        initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        "
      </motion.span>

      {/* Quote text */}
      <motion.div
        className="relative text-lg italic text-foreground"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </blockquote>
  );
}
```

**Key Changes:**
- Border color: `border-primary` (olive green)
- Background: `bg-muted/30` (warm cream/dark gray)
- Quote mark: `text-primary/20` (subtle olive)
- Animation easing remains the same

---

## Color Reference

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Hover background | `#e8e5da` (muted) at 50% | `#1e1e1b` at 50% |
| Hover border | `#e3e0d5` (border) | `#2a2a26` |
| Link/icon hover | `#566240` (primary) | `#6f7c5a` |
| Blockquote border | `#566240` | `#6f7c5a` |
| Blockquote bg | `#e8e5da` at 30% | `#1e1e1b` at 30% |

---

## Verification Steps

### 1. MidCard Checks
- [ ] Hover shows warm muted background
- [ ] Title color changes to olive on hover
- [ ] Arrow icon changes to olive on hover
- [ ] Arrow has subtle movement animation
- [ ] Border appears on hover

### 2. VideoCard Checks
- [ ] Same behavior as MidCard
- [ ] Preview popup still works (if applicable)

### 3. AnimatedBlockquote Checks
- [ ] Left border is olive green
- [ ] Background is warm muted at 30% opacity
- [ ] Quote mark is subtle olive
- [ ] Animation triggers on scroll into view
- [ ] Reduced motion is respected

### 4. Dark Mode
- [ ] All colors invert correctly
- [ ] Olive tones are visible on dark backgrounds
- [ ] Contrast is sufficient

---

## Commit Strategy

```bash
git add components/ui/MidCard.tsx components/ui/VideoCard.tsx components/ui/blog/AnimatedBlockquote.tsx
git commit -m "style(custom): update custom components with Oatmeal styling

MidCard/VideoCard:
- Hover background: muted/50 (warm)
- Title hover: primary color (olive)
- Icon hover: primary color + subtle movement
- Added border on hover

AnimatedBlockquote:
- Border: primary (olive green)
- Background: muted/30 (warm cream)
- Quote mark: primary/20 (subtle olive)
- Preserved animation behavior"
```

---

## Next Steps

After Phase 6 completes:
- Phase 7 (Blog Components) can proceed
- Phase 9 (Landing/Layout) can begin if ready
