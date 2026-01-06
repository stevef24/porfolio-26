# Phase 5: Animation Polish & Motion Variants

## Overview

Consolidate and enhance the animation system by adding new motion variants specifically designed for the TOC rail, sidebar, and interactive components. This phase ensures consistent, polished animations across all components while maintaining accessibility through reduced motion support.

---

## Current Animation System

### File Location
`lib/motion-variants.ts`

### Existing Presets

#### Fade/Slide Variants
```typescript
fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 }, duration: 0.2s }
slideUp: { y: 8 → 0, opacity: 0 → 1, duration: 0.2s }
slideUpSubtle: { y: 4 → 0, opacity: 0 → 1, duration: 0.15s }
scaleIn: { scale: 0.98 → 1, opacity: 0 → 1, duration: 0.15s }
slideFromLeft: { x: -8 → 0, opacity: 0 → 1, duration: 0.2s }
slideFromRight: { x: 8 → 0, opacity: 0 → 1, duration: 0.2s }
```

#### Stagger Containers
```typescript
staggerContainer: { staggerChildren: 0.05, delayChildren: 0.02 }
staggerFast: { staggerChildren: 0.03, delayChildren: 0.01 }
staggerItem: { opacity: 0 → 1, duration: 0.15s }
```

#### Spring Presets
```typescript
springGentle: { stiffness: 300, damping: 30 }
springBouncy: { stiffness: 400, damping: 25 }
springStiff: { stiffness: 500, damping: 35 }
```

---

## New Variants to Add

### 1. TOC Indicator Variants

```typescript
/**
 * TOC vertical bar indicator animation
 * Scales from top (originY: 0) for natural reveal
 */
export const tocIndicator = {
  hidden: {
    scaleY: 0,
    opacity: 0,
  },
  visible: {
    scaleY: 1,
    opacity: 1,
  },
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
};

/**
 * TOC item entrance animation
 * Staggered fade + slide from left
 */
export const tocItem = {
  hidden: {
    opacity: 0,
    x: -8,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: "easeOut",
    },
  }),
};

/**
 * TOC container for orchestrating item animations
 */
export const tocContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};
```

### 2. Sidebar Animation Variants

```typescript
/**
 * Sidebar module group entrance
 * Each module fades in with slight delay
 */
export const sidebarModule = {
  hidden: {
    opacity: 0,
  },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.2,
    },
  }),
};

/**
 * Sidebar lesson item entrance
 * Fast stagger for list items
 */
export const sidebarItem = {
  hidden: {
    opacity: 0,
    x: -8,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

/**
 * Sidebar item container for stagger
 */
export const sidebarContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

/**
 * View toggle content transition
 * Used when switching between Fundamentals/Walkthroughs
 */
export const viewToggleContent = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};
```

### 3. Segmented Control Variants

```typescript
/**
 * Segmented control indicator (sliding background)
 * Uses layoutId for automatic position interpolation
 */
export const segmentedIndicator = {
  initial: false, // Let layoutId handle initial position
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  },
};
```

### 4. Code Playground Variants

```typescript
/**
 * Playground entrance animation
 */
export const playgroundEntrance = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * Playground fullscreen transition
 */
export const playgroundFullscreen = {
  enter: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    scale: [1, 0.98, 1],
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};
```

### 5. Interactive Element Variants

```typescript
/**
 * Button press effect
 * Subtle scale down on click
 */
export const buttonPress = {
  tap: {
    scale: 0.98,
  },
  transition: {
    duration: 0.1,
  },
};

/**
 * Icon button hover
 * Subtle scale up on hover
 */
export const iconButtonHover = {
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
  transition: {
    duration: 0.15,
  },
};

/**
 * Link hover underline
 * Width animates from 0 to 100%
 */
export const linkUnderline = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  hover: {
    scaleX: 1,
  },
  transition: {
    duration: 0.2,
    ease: "easeOut",
  },
};
```

---

## Full Updated motion-variants.ts

```typescript
// lib/motion-variants.ts
import type { Transition, Variants } from "motion/react";

// ==========================================
// SPRING PHYSICS PRESETS
// ==========================================

/** Gentle spring - natural, minimal bounce */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/** Bouncy spring - playful, noticeable bounce */
export const springBouncy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

/** Stiff spring - quick, controlled */
export const springStiff: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 35,
};

/** Snappy spring - very responsive */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 40,
};

// ==========================================
// BASIC ANIMATION VARIANTS
// ==========================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const slideUpSubtle: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// ==========================================
// STAGGER CONTAINERS
// ==========================================

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.01,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
};

// ==========================================
// TOC RAIL VARIANTS
// ==========================================

/** TOC vertical indicator bar */
export const tocIndicator: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: springGentle,
  },
};

/** TOC item entrance (use with custom prop for index) */
export const tocItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: "easeOut",
    },
  }),
};

/** TOC container for stagger orchestration */
export const tocContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// ==========================================
// SIDEBAR VARIANTS
// ==========================================

/** Sidebar module group entrance */
export const sidebarModule: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.2,
    },
  }),
};

/** Sidebar lesson item entrance */
export const sidebarItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

/** Sidebar container for stagger */
export const sidebarContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

/** View toggle content transition */
export const viewToggleContent: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

// ==========================================
// SEGMENTED CONTROL
// ==========================================

/** Segmented control indicator spring */
export const segmentedIndicatorSpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

// ==========================================
// CODE PLAYGROUND VARIANTS
// ==========================================

/** Playground entrance animation */
export const playgroundEntrance: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// ==========================================
// INTERACTIVE ELEMENTS
// ==========================================

/** Button press effect */
export const buttonPress: Variants = {
  initial: { scale: 1 },
  tap: { scale: 0.98 },
};

/** Icon button hover/tap */
export const iconButton: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

/** Link underline reveal */
export const linkUnderline: Variants = {
  initial: { scaleX: 0 },
  hover: { scaleX: 1 },
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Create a custom stagger delay based on index
 */
export const createStaggerDelay = (index: number, baseDelay = 0.05) => ({
  delay: index * baseDelay,
});

/**
 * Get reduced motion safe variants
 * Returns instant transitions when reduced motion is preferred
 */
export const getReducedMotionVariants = (
  variants: Variants,
  prefersReducedMotion: boolean
): Variants => {
  if (!prefersReducedMotion) return variants;

  // Return variants with instant transitions
  const reducedVariants: Variants = {};
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === "object" && value !== null) {
      reducedVariants[key] = {
        ...value,
        transition: { duration: 0 },
      };
    } else {
      reducedVariants[key] = value;
    }
  }
  return reducedVariants;
};
```

---

## Usage Examples

### TOC Rail
```tsx
import { tocIndicator, tocItem, tocContainer } from "@/lib/motion-variants";

<motion.ol variants={tocContainer} initial="hidden" animate="visible">
  {items.map((item, index) => (
    <motion.li key={item.url} custom={index} variants={tocItem}>
      <motion.div
        variants={tocIndicator}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        style={{ originY: 0 }}
      />
    </motion.li>
  ))}
</motion.ol>
```

### Sidebar
```tsx
import { sidebarContainer, sidebarItem, viewToggleContent } from "@/lib/motion-variants";

<AnimatePresence mode="wait">
  <motion.div
    key={activeView}
    variants={viewToggleContent}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <motion.div variants={sidebarContainer} initial="hidden" animate="visible">
      {lessons.map((lesson) => (
        <motion.div key={lesson.slug} variants={sidebarItem}>
          {/* lesson content */}
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
</AnimatePresence>
```

### Segmented Control
```tsx
import { segmentedIndicatorSpring } from "@/lib/motion-variants";

<motion.div
  layoutId="segment-indicator"
  transition={segmentedIndicatorSpring}
/>
```

### Interactive Buttons
```tsx
import { buttonPress, iconButton } from "@/lib/motion-variants";

<motion.button
  variants={buttonPress}
  initial="initial"
  whileTap="tap"
>
  Submit
</motion.button>

<motion.button
  variants={iconButton}
  initial="initial"
  whileHover="hover"
  whileTap="tap"
>
  <Icon />
</motion.button>
```

---

## Reduced Motion Handling

### Using the Utility Function
```tsx
import { useReducedMotion } from "motion/react";
import { tocItem, getReducedMotionVariants } from "@/lib/motion-variants";

function TOCItem({ index }) {
  const prefersReducedMotion = useReducedMotion();
  const variants = getReducedMotionVariants(tocItem, prefersReducedMotion ?? false);

  return (
    <motion.li custom={index} variants={variants}>
      {/* content */}
    </motion.li>
  );
}
```

### Direct Pattern
```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={prefersReducedMotion ? false : "hidden"}
  animate="visible"
  transition={{
    duration: prefersReducedMotion ? 0 : 0.2,
  }}
/>
```

---

## Animation Timing Guidelines

### Duration Reference
| Animation Type | Duration | Use Case |
|----------------|----------|----------|
| Micro-interaction | 100-150ms | Button press, icon hover |
| UI feedback | 150-200ms | State changes, toggles |
| Content reveal | 200-300ms | Page transitions, modals |
| Complex orchestration | 300-500ms | Multi-element stagger |

### Spring Parameters Reference
| Feel | Stiffness | Damping | Use Case |
|------|-----------|---------|----------|
| Gentle | 300 | 30 | General UI, indicators |
| Bouncy | 400 | 25 | Playful interactions |
| Stiff | 500 | 35 | Precise, controlled |
| Snappy | 600 | 40 | Quick responses |

---

## Testing Checklist

### Visual Tests
- [ ] TOC indicator animates smoothly
- [ ] Sidebar items stagger correctly
- [ ] View toggle content fades properly
- [ ] Segmented control slides smoothly
- [ ] Button press feedback visible

### Accessibility Tests
- [ ] All animations disabled with reduced motion
- [ ] No motion sickness triggers
- [ ] Focus states still visible

### Performance Tests
- [ ] 60fps maintained during animations
- [ ] No layout thrashing
- [ ] Memory stable (no animation leaks)

---

## Files Modified

| File | Changes |
|------|---------|
| `lib/motion-variants.ts` | Add new variants + utility functions |

## Exports Added
- `tocIndicator`, `tocItem`, `tocContainer`
- `sidebarModule`, `sidebarItem`, `sidebarContainer`, `viewToggleContent`
- `segmentedIndicatorSpring`
- `playgroundEntrance`
- `buttonPress`, `iconButton`, `linkUnderline`
- `springSnappy`
- `createStaggerDelay`, `getReducedMotionVariants`

## Breaking Changes
- None (additive changes only)
